import { describe, expect, it } from 'vitest'

describe('usePirateStore.changeProject (project.global.ts delegates to this)', () => {
  it('renders the data-aware nifff nav: Galerie present, Le Programme absent (latest empty)', () => {
    const store = usePirateStore()
    store.changeProject('nifff')
    const labels = store.navigationButtons.map(item => item.label)
    expect(labels).toEqual(['Accueil', 'Le Projet', 'Galerie', 'Nous contacter'])
    expect(labels).not.toContain('Le Programme')
    expect(store.currentProject).toBe('nifff')
  })

  it('renders the static presque nav with the Programme and Nous aider entries', () => {
    const store = usePirateStore()
    store.changeProject('presque')
    expect(store.navigationButtons.map(item => item.label)).toEqual([
      'Accueil',
      'L\'Événement en Bref',
      'Le Programme',
      'Nous aider',
      'Nous contacter',
    ])
    expect(store.currentProject).toBe('presque')
  })

  it('renders the standard nav with the Presques 24h du Jeu entry', () => {
    const store = usePirateStore()
    store.changeProject('')
    expect(store.navigationButtons.map(item => item.label)).toContain('Presques 24h du Jeu')
    expect(store.navigationButtons.find(item => item.label === 'Presques 24h du Jeu')?.to).toBe('/presque')
  })

  it.each([
    ['', 7],
    ['info', 7],
    ['programme', 7],
    ['events', 7],
    ['galerie', 7],
  ])('falls back to standard nav for first path segment %r (%i items)', (segment, count) => {
    const store = usePirateStore()
    store.changeProject(segment)
    expect(store.currentProject).toBeNull()
    expect(store.navigationButtons).toHaveLength(count)
  })

  it('resets to standard nav when leaving a project', () => {
    const store = usePirateStore()
    store.changeProject('nifff')
    expect(store.currentProject).toBe('nifff')
    store.changeProject('info')
    expect(store.currentProject).toBeNull()
    expect(store.navigationButtons).toHaveLength(7)
  })
})
