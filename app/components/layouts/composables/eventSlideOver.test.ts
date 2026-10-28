import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { UApp, USlideover } from '#components'
import { parseDateKey, type CalendarEvent } from '~/utils/eventsLoader'
import EventSlideOver from './eventSlideOver.vue'

function buildEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: 'e1',
    title: 'Soirée jeux du Mercredi',
    hours: ['19:00', '23:00'],
    isPublic: true,
    prices: {},
    date: parseDateKey('2026-11-11'),
    ...overrides,
  }
}

function mountSlideOver(activities: CalendarEvent[]) {
  return mount(
    {
      components: { UApp, EventSlideOver },
      data() {
        return { activities }
      },
      template: '<UApp><EventSlideOver :activities="activities" :open="true" /></UApp>',
    },
    { attachTo: document.body },
  )
}

function findButton(label: string): HTMLElement | null {
  const candidates = Array.from(document.body.querySelectorAll<HTMLElement>('button, a'))
  return candidates.find(element => element.textContent?.includes(label)) ?? null
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('eventSlideOver', () => {
  it('inherits the overlay open attribute on its single root so the slideover renders', async () => {
    const wrapper = mountSlideOver([buildEvent()])
    await flushPromises()
    const slideover = wrapper.findComponent(USlideover)
    expect(slideover.exists()).toBe(true)
    expect(slideover.props('open')).toBe(true)
    expect(document.body.textContent).toContain('Soirée jeux du Mercredi')
    expect(document.body.textContent).toContain('11 novembre 2026')
  })

  it('shows no signup button for events without signup_form', async () => {
    mountSlideOver([buildEvent()])
    await flushPromises()
    expect(findButton('S\'inscrire')).toBeNull()
  })

  it('opens the EventSignupModal from the S\'inscrire button for signup_form events', async () => {
    const wrapper = mountSlideOver([buildEvent({ signup_form: true })])
    await flushPromises()
    const button = findButton('S\'inscrire')
    expect(button).not.toBeNull()
    button!.click()
    await flushPromises()
    await wrapper.vm.$nextTick()
    const emailInput = document.body.querySelector('input[type="email"]')
    expect(emailInput).not.toBeNull()
    expect(emailInput?.closest('[role="dialog"]')?.textContent).toContain('Soirée jeux du Mercredi')
  })

  it('keeps the external_link button for events that use one', async () => {
    mountSlideOver([buildEvent({ external_link: ['https://example.org', 'S\'inscrire sur le site du NIFFF', 'i-lucide-external-link', '_blank'] })])
    await flushPromises()
    expect(findButton('S\'inscrire sur le site du NIFFF')).not.toBeNull()
    expect(findButton('S\'inscrire')?.textContent).toContain('NIFFF')
  })
})
