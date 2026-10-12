import { describe, expect, it } from 'vitest'
import {
  PRESQUE_DEFAULT_IMAGE_COPYRIGHT,
  PRESQUE_EVENT_COLOR_VARS,
  PRESQUE_PLACEHOLDER_IMAGE_COPYRIGHT,
  type PresqueActivity,
  activityColorVar,
  activityTintClass,
  formatPresqueSchedule,
  getActivityImage,
  getDeepLinkId,
  groupByDay,
  parsePresqueProgram,
  sortByStart,
  splitByCategory,
} from './presqueProgram'
import { resolveImage } from './assetLinksResolver'

function buildActivity(overrides: Partial<PresqueActivity> = {}): PresqueActivity {
  return {
    id: 'presque-dnd-001',
    title: 'Donjons & Dragons',
    category: 'jdr',
    start: '2026-11-14T10:00:00+01:00',
    end: '2026-11-14T14:00:00+01:00',
    max_participants: 5,
    ...overrides,
  }
}

describe('parsePresqueProgram', () => {
  it('parses a full programme and keeps every field', () => {
    const activities = parsePresqueProgram({
      activities: [{
        id: 'presque-dnd-001',
        title: 'Donjons & Dragons — La Mine de Phandelver',
        category: 'jdr',
        color: '--presque-jdr',
        start: '2026-11-14T10:00:00+01:00',
        end: '2026-11-14T14:00:00+01:00',
        max_participants: 5,
        pre_img_description: ['Une campagne D&D 5e.', 'Personnages pré-tirés fournis.'],
        post_img_description: ['Merci aux participant·e·s.'],
        organizer: ['Association Duchamp', 'https://duchamp.example.org'],
        image_path: 'presque/foo.jpg',
        image_copyright: ['© Jane', 'https://jane.example'],
        prizes: { '1re place': 'Un jeu offert', '3e-4e places': 'Une boîte de dés' },
        short_description: 'Une campagne D&D pour débutant·e·s.',
        game: 'D&D 5e',
      }],
    })
    expect(activities).toHaveLength(1)
    expect(activities[0]!.category).toBe('jdr')
    expect(activities[0]!.color).toBe('--presque-jdr')
    expect(activities[0]!.organizer).toEqual(['Association Duchamp', 'https://duchamp.example.org'])
    expect(activities[0]!.pre_img_description).toHaveLength(2)
    expect(activities[0]!.prizes).toEqual({ '1re place': 'Un jeu offert', '3e-4e places': 'Une boîte de dés' })
    expect(activities[0]!.short_description).toBe('Une campagne D&D pour débutant·e·s.')
    expect(activities[0]!.game).toBe('D&D 5e')
  })

  it('accepts prizes as a single phrase', () => {
    const activities = parsePresqueProgram({
      activities: [{ id: 'a', title: 'T', category: 'jds', start: 's', end: 'e', max_participants: 3, prizes: 'Des prix pour les trois premiers·ières.' }],
    })
    expect(activities[0]!.prizes).toBe('Des prix pour les trois premiers·ières.')
  })

  it('rejects entries whose prizes are neither a phrase nor a rank map', () => {
    const warnings: string[] = []
    const entries: unknown[] = [
      { ...buildActivity({ id: 'bad-prizes' }), prizes: 3 },
      { ...buildActivity({ id: 'bad-prizes-list' }), prizes: ['un lot'] },
    ]
    const activities = parsePresqueProgram({ activities: entries }, message => warnings.push(message))
    expect(activities).toEqual([])
    expect(warnings).toHaveLength(2)
  })

  it('keeps unknown extra keys (non-strict object) and tolerates omitted optionals', () => {
    const activities = parsePresqueProgram({
      activities: [{ id: 'a', title: 'T', category: 'jds', start: 's', end: 'e', max_participants: 3, future_field: true }],
    })
    expect(activities).toHaveLength(1)
    expect(activities[0]!.organizer).toBeUndefined()
    expect(activities[0]!.pre_img_description).toBeUndefined()
  })

  it('skips invalid entries with a warning naming the activity, keeps valid ones', () => {
    const warnings: string[] = []
    const entries: unknown[] = [
      buildActivity(),
      { ...buildActivity({ id: 'bad-color' }), color: '--presque-unknown' },
      { ...buildActivity({ id: 'bad-category' }), category: 'tournoi' },
      'not an object',
    ]
    const activities = parsePresqueProgram(
      { activities: entries },
      message => warnings.push(message),
    )
    expect(activities.map(activity => activity.id)).toEqual(['presque-dnd-001'])
    expect(warnings).toHaveLength(3)
    expect(warnings[0]).toContain('bad-color')
    expect(warnings[2]).toContain('entrée inconnue')
  })

  it('returns an empty list with a warning for an unreadable root', () => {
    const warnings: string[] = []
    expect(parsePresqueProgram(null, message => warnings.push(message))).toEqual([])
    expect(parsePresqueProgram({}, message => warnings.push(message))).toEqual([])
    expect(warnings).toHaveLength(2)
  })
})

describe('sortByStart', () => {
  it('orders activities by start time and does not mutate the input', () => {
    const late = buildActivity({ id: 'late', start: '2026-11-15T14:00:00+01:00' })
    const early = buildActivity({ id: 'early', start: '2026-11-14T10:00:00+01:00' })
    const middle = buildActivity({ id: 'middle', start: '2026-11-14T18:30:00+01:00' })
    const input = [late, early, middle]
    expect(sortByStart(input).map(activity => activity.id)).toEqual(['early', 'middle', 'late'])
    expect(input.map(activity => activity.id)).toEqual(['late', 'early', 'middle'])
  })
})

describe('splitByCategory', () => {
  it('splits into sorted jdr and jds lists', () => {
    const jdrLate = buildActivity({ id: 'jdr-late', category: 'jdr', start: '2026-11-15T10:00:00+01:00' })
    const jdrEarly = buildActivity({ id: 'jdr-early', category: 'jdr', start: '2026-11-14T10:00:00+01:00' })
    const jdsLate = buildActivity({ id: 'jds-late', category: 'jds', start: '2026-11-15T14:00:00+01:00' })
    const jdsEarly = buildActivity({ id: 'jds-early', category: 'jds', start: '2026-11-14T18:00:00+01:00' })
    const tabs = splitByCategory([jdrLate, jdsLate, jdrEarly, jdsEarly])
    expect(tabs.jdr.map(activity => activity.id)).toEqual(['jdr-early', 'jdr-late'])
    expect(tabs.jds.map(activity => activity.id)).toEqual(['jds-early', 'jds-late'])
  })
})

describe('official palette', () => {
  it('contains exactly the operator-defined category colors', () => {
    expect([...PRESQUE_EVENT_COLOR_VARS]).toEqual([
      '--presque-gros-jeux',
      '--presque-jdr',
      '--presque-partenaires',
      '--presque-tournois',
      '--presque-activites-association',
    ])
  })

  it('falls back per category when no explicit color is set', () => {
    expect(activityColorVar(buildActivity({ category: 'jdr' }))).toBe('--presque-jdr')
    expect(activityColorVar(buildActivity({ category: 'jds' }))).toBe('--presque-gros-jeux')
    expect(activityColorVar(buildActivity({ category: 'jds', color: '--presque-tournois' }))).toBe('--presque-tournois')
  })

  it('maps every palette color to its card tint class', () => {
    expect(activityTintClass(buildActivity({ category: 'jds', color: '--presque-tournois' }))).toBe('presque-tint-tournois')
    expect(activityTintClass(buildActivity({ category: 'jds' }))).toBe('presque-tint-gros-jeux')
    expect(activityTintClass(buildActivity({ category: 'jdr' }))).toBe('presque-tint-jdr')
    for (const colorVar of PRESQUE_EVENT_COLOR_VARS) {
      const mapped = activityTintClass(buildActivity({ color: colorVar }))
      expect(mapped).toBe(`presque-tint-${colorVar.replace('--presque-', '')}`)
    }
  })
})

describe('groupByDay', () => {
  it('splits activities into per-day groups with capitalized fr labels, keeping start order', () => {
    const satLate = buildActivity({ id: 'sat-late', start: '2026-11-14T22:00:00+01:00', end: '2026-11-15T02:00:00+01:00' })
    const satEarly = buildActivity({ id: 'sat-early', start: '2026-11-14T10:00:00+01:00', end: '2026-11-14T12:00:00+01:00' })
    const sun = buildActivity({ id: 'sun', start: '2026-11-15T14:00:00+01:00', end: '2026-11-15T18:00:00+01:00' })
    const groups = groupByDay([satLate, sun, satEarly])
    expect(groups).toHaveLength(2)
    expect(groups[0]!.label).toBe('Samedi 14 novembre 2026')
    expect(groups[0]!.activities.map(activity => activity.id)).toEqual(['sat-early', 'sat-late'])
    expect(groups[1]!.label).toBe('Dimanche 15 novembre 2026')
    expect(groups[1]!.activities.map(activity => activity.id)).toEqual(['sun'])
  })

  it('returns a single group when everything happens the same day', () => {
    const groups = groupByDay([
      buildActivity({ id: 'a', start: '2026-11-14T10:00:00+01:00' }),
      buildActivity({ id: 'b', start: '2026-11-14T20:00:00+01:00' }),
    ])
    expect(groups).toHaveLength(1)
    expect(groups[0]!.activities).toHaveLength(2)
  })
})

describe('getActivityImage', () => {
  it('keeps the activity image and its own copyright when both are present', () => {
    const image = getActivityImage(buildActivity({
      image_path: 'presque/affiche_presque_no_sponsor.jpeg',
      image_copyright: ['© Jane', 'https://jane.example'],
    }))
    expect(image.src).not.toBe('')
    expect(image.src).not.toBe(resolveImage('placeholder.png'))
    expect(image.copyright).toEqual(['© Jane', 'https://jane.example'])
  })

  it('falls back to the placeholder image when image_path is missing or unresolvable', () => {
    expect(getActivityImage(buildActivity()).src).toBe(resolveImage('placeholder.png'))
    expect(getActivityImage(buildActivity({ image_path: 'presque/inexistant.jpeg' })).src)
      .toBe(resolveImage('placeholder.png'))
  })

  it('credits JonGriffon for the placeholder even when a copyright is declared', () => {
    const image = getActivityImage(buildActivity({
      image_copyright: ['© Jane', 'https://jane.example'],
    }))
    expect(image.src).toBe(resolveImage('placeholder.png'))
    expect(image.copyright).toEqual(PRESQUE_PLACEHOLDER_IMAGE_COPYRIGHT)
    expect(image.copyright).toEqual(['© placeholder par JonGriffon', 'https://jongriffon.carrd.co/#tosfr'])
  })

  it('falls back to the default copyright when none is provided', () => {
    const image = getActivityImage(buildActivity({
      image_path: 'presque/affiche_presque_no_sponsor.jpeg',
    }))
    expect(image.copyright).toEqual(PRESQUE_DEFAULT_IMAGE_COPYRIGHT)
    expect(image.copyright[1]).toBe('/credits')
  })
})

describe('getDeepLinkId', () => {
  it('extracts a single string id', () => {
    expect(getDeepLinkId('presque-dnd-001')).toBe('presque-dnd-001')
  })

  it('takes the first non-empty string of an array query param', () => {
    expect(getDeepLinkId(['a', 'b'])).toBe('a')
    expect(getDeepLinkId([null, 'b'])).toBe('b')
  })

  it('returns empty for missing, empty or non-string values', () => {
    expect(getDeepLinkId(undefined)).toBe('')
    expect(getDeepLinkId(null)).toBe('')
    expect(getDeepLinkId('')).toBe('')
    expect(getDeepLinkId(42)).toBe('')
  })
})

describe('formatPresqueSchedule', () => {
  it('formats a same-day activity as "weekday de X à Y" without the date', () => {
    const text = formatPresqueSchedule('2026-11-14T10:00:00+01:00', '2026-11-14T14:00:00+01:00')
    expect(text).toBe('samedi de 10:00 à 14:00')
  })

  it('formats an activity riding both days as "De samedi X à dimanche Y"', () => {
    const text = formatPresqueSchedule('2026-11-14T22:00:00+01:00', '2026-11-15T02:00:00+01:00')
    expect(text).toBe('De samedi 22:00 à dimanche 02:00')
  })
})
