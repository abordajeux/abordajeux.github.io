import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { PresqueActivity } from '~/utils/presqueProgram'
import type { ActivityCapacity } from '~/utils/subscriptionLogic'
import ActivityCard from './ActivityCard.vue'

function buildActivity(overrides: Partial<PresqueActivity> = {}): PresqueActivity {
  return {
    id: 'a1',
    title: 'Tournoi de Carcassonne',
    category: 'jds',
    color: '--presque-tournois',
    start: '2026-11-15T14:00:00+01:00',
    end: '2026-11-15T18:00:00+01:00',
    max_participants: 8,
    organizer: ['Association Duchamp', 'https://duchamp.example.org'],
    ...overrides,
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('ActivityCard', () => {
  it('renders title, schedule line and the capacity badge from live counts', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: buildActivity({
          short_description: 'Tournoi amical ouvert à tou·te·s.',
          game: 'Carcassonne',
        }),
        capacity: { max: 8, confirmed: 1, pending: 0, waitlisted: 0 } as ActivityCapacity,
      },
    })
    expect(wrapper.text()).toContain('Tournoi de Carcassonne')
    expect(wrapper.text()).toContain('Tournoi amical ouvert à tou·te·s.')
    expect(wrapper.text()).toContain('Carcassonne')
    expect(wrapper.text()).toContain('de 14:00 à 18:00')
    expect(wrapper.text()).toContain('7 places sur 8')
    expect(wrapper.text()).toContain('S\'inscrire')
    expect(wrapper.text()).toContain('Association Duchamp')
    expect(wrapper.classes()).toContain('presque-tint-tournois')
  })

  it('omits the description text and game line when absent', () => {
    const wrapper = mount(ActivityCard, {
      props: { activity: buildActivity() },
    })
    expect(wrapper.find('[data-slot="description"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('D&D 5e')
  })

  it('shows the neutral question badge when capacity is unknown', () => {
    const wrapper = mount(ActivityCard, {
      props: { activity: buildActivity(), capacity: undefined },
    })
    expect(wrapper.text()).toContain('Places : ?')
    expect(wrapper.text()).not.toContain('S\'inscrire')
  })

  it('shows the Sans inscription badge for a non-subscribable activity', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: buildActivity(),
        capacity: { max: 0, confirmed: 0, pending: 0, waitlisted: 0 } as ActivityCapacity,
      },
    })
    expect(wrapper.text()).toContain('Sans inscription')
    expect(wrapper.text()).not.toContain('S\'inscrire')
  })

  it('shows the trophy button only when the activity has prizes', () => {
    const withPrizes = mount(ActivityCard, {
      props: { activity: buildActivity({ prizes: 'Des prix pour les trois premiers·ières.' }) },
      attachTo: document.body,
    })
    expect(withPrizes.find('button[aria-label="Voir les lots"]').exists()).toBe(true)

    document.body.innerHTML = ''
    const withoutPrizes = mount(ActivityCard, {
      props: { activity: buildActivity() },
      attachTo: document.body,
    })
    expect(withoutPrizes.find('button[aria-label="Voir les lots"]').exists()).toBe(false)
  })

  it('emits select with the activity when the card is clicked', async () => {
    const activity = buildActivity()
    const wrapper = mount(ActivityCard, {
      props: { activity, capacity: { max: 8, confirmed: 0, pending: 0, waitlisted: 0 } },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toEqual([[activity]])
  })

  it('emits select once when the signup button is clicked', async () => {
    const activity = buildActivity()
    const wrapper = mount(ActivityCard, {
      props: { activity, capacity: { max: 8, confirmed: 0, pending: 0, waitlisted: 0 } },
    })
    const button = wrapper.findAll('button').find(b => b.text().includes('S\'inscrire'))
    expect(button).toBeDefined()
    await button!.trigger('click')
    expect(wrapper.emitted('select')).toEqual([[activity]])
  })
})
