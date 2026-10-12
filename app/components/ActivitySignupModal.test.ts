import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { UApp, UTooltip } from '#components'
import type { ApiFetch, ApiFetchOptions } from '~/composables/useApiFetch'
import type { PresqueActivity } from '~/utils/presqueProgram'
import type { ActivityCapacity } from '~/utils/subscriptionLogic'
import ActivitySignupModal from './ActivitySignupModal.vue'

const activity: PresqueActivity = {
  id: 'a1',
  title: 'Donjons & Dragons',
  category: 'jdr',
  start: '2026-11-14T10:00:00+01:00',
  end: '2026-11-14T14:00:00+01:00',
  max_participants: 3,
  pre_img_description: ['Campagne pour débutant·e·s.'],
  organizer: ['Association Duchamp', 'https://duchamp.example.org'],
  prizes: { '1re place': 'Un jeu offert' },
}

const openCapacity: ActivityCapacity = { max: 3, confirmed: 0, pending: 0, waitlisted: 0 }
const singleSeatCapacity: ActivityCapacity = { max: 3, confirmed: 2, pending: 0, waitlisted: 0 }
const fullCapacity: ActivityCapacity = { max: 3, confirmed: 3, pending: 0, waitlisted: 0 }

function createFetcher(handler: (path: string, options?: ApiFetchOptions) => unknown): ApiFetch {
  return <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
    const result = handler(path, options)
    if (result instanceof Error) {
      return Promise.reject(result)
    }
    return Promise.resolve(result as T)
  }
}

function mountModal(props: {
  activity: PresqueActivity
  capacity?: ActivityCapacity
  fetcher?: ApiFetch
}) {
  return mount(
    {
      components: { UApp, ActivitySignupModal },
      data() {
        return { open: true, modalProps: props }
      },
      template: '<UApp><ActivitySignupModal v-model:open="open" v-bind="modalProps" /></UApp>',
    },
    { attachTo: document.body },
  )
}

function findButton(label: string): HTMLButtonElement | null {
  const buttons = Array.from(document.body.querySelectorAll('button'))
  return buttons.find(button => button.textContent?.includes(label)) ?? null
}

function setInput(selector: string, value: string) {
  const input = document.body.querySelector(selector) as HTMLInputElement
  input.value = value
  input.dispatchEvent(new Event('input'))
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('ActivitySignupModal — detail step', () => {
  it('shows title, schedule, organizer link and the S\'inscrire CTA when seats remain', async () => {
    const wrapper = mountModal({ activity, capacity: openCapacity })
    await wrapper.vm.$nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.textContent).toContain('Donjons & Dragons')
    expect(dialog?.textContent).toContain('de 10:00 à 14:00')
    expect(dialog?.querySelector('a[href="https://duchamp.example.org"]')).not.toBeNull()
    expect(findButton('S\'inscrire')).not.toBeNull()
    expect(document.body.querySelector('button[aria-label="Voir les lots"]')).not.toBeNull()
    expect(dialog?.classList.contains('presque-tint-jdr')).toBe(true)
    expect(dialog?.textContent).toContain('3 places sur 3')
    expect(dialog?.querySelector('span[style*="--presque"]')).toBeNull()
  })

  it('credits JonGriffon for the placeholder image when no image is provided', async () => {
    const wrapper = mountModal({ activity, capacity: openCapacity })
    await wrapper.vm.$nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    const img = dialog?.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).not.toBe('')
    expect(img?.classList.contains('max-h-[50vh]')).toBe(true)
    const copyrightLink = Array.from(dialog?.querySelectorAll('a') ?? [])
      .find(anchor => anchor.textContent?.includes('JonGriffon'))
    expect(copyrightLink?.getAttribute('href')).toBe('https://jongriffon.carrd.co/#tosfr')
  })

  it('shows no subscription CTA at all for a non-subscribable activity', async () => {
    const wrapper = mountModal({
      activity,
      capacity: { max: 0, confirmed: 0, pending: 0, waitlisted: 0 },
    })
    await wrapper.vm.$nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(findButton('S\'inscrire')).toBeNull()
    expect(findButton('liste d\'attente')).toBeNull()
    expect(dialog?.textContent).toContain('Sans inscription')
    expect(dialog?.textContent).not.toContain('places disponibles')
    expect(dialog?.textContent).not.toContain('information momentanément indisponible')
  })

  it('shows the waiting-list CTA and a disabled signup when capacity is unknown', async () => {
    const wrapper = mountModal({ activity, capacity: fullCapacity })
    await wrapper.vm.$nextTick()
    expect(findButton('Être mis sur liste d\'attente')).not.toBeNull()

    document.body.innerHTML = ''
    const unknown = mountModal({ activity })
    await unknown.vm.$nextTick()
    const disabled = findButton('Inscription indisponible')
    expect(disabled).not.toBeNull()
    expect(disabled?.disabled).toBe(true)
  })
})

describe('ActivitySignupModal — form step', () => {
  it('shows email + one participant field + enabled add button for an open activity', async () => {
    const wrapper = mountModal({ activity, capacity: openCapacity, fetcher: createFetcher(() => ({})) })
    await wrapper.vm.$nextTick()
    ;(findButton('S\'inscrire') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('input[type="email"]')).not.toBeNull()
    expect(document.body.querySelectorAll('input[placeholder="Prénom et nom"]')).toHaveLength(1)
    expect(findButton('Ajouter une personne')?.disabled).toBe(false)
  })

  it('hides the add button and keeps a single field in waiting-list mode', async () => {
    const wrapper = mountModal({ activity, capacity: fullCapacity, fetcher: createFetcher(() => ({})) })
    await wrapper.vm.$nextTick()
    ;(findButton('liste d\'attente') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelectorAll('input[placeholder="Prénom et nom"]')).toHaveLength(1)
    expect(findButton('Ajouter une personne')).toBeNull()
    expect(document.body.textContent).toContain('Cette activité est complète')
  })

  it('disables the add button at the group cap with the explanatory tooltip', async () => {
    const wrapper = mountModal({ activity, capacity: singleSeatCapacity, fetcher: createFetcher(() => ({})) })
    await wrapper.vm.$nextTick()
    ;(findButton('S\'inscrire') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    expect(findButton('Ajouter une personne')?.disabled).toBe(true)
    const tooltip = wrapper.findComponent(UTooltip)
    expect(tooltip.exists()).toBe(true)
    expect(tooltip.props('text')).toBe(
      'Impossible d\'ajouter davantage de personnes : la capacité de cette activité est atteinte.',
    )
    expect(tooltip.props('delayDuration')).toBe(0)
  })
})

describe('ActivitySignupModal — submission', () => {
  it('submits email + participants and shows the API success message', async () => {
    const calls: { path: string, options?: ApiFetchOptions }[] = []
    const fetcher: ApiFetch = <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
      calls.push({ path, options })
      return Promise.resolve({
        status: 'ok',
        verification_required: true,
        waitlisted: false,
        message: 'Un email de confirmation a été envoyé à a@example.ch.',
      } as T)
    }
    const wrapper = mountModal({ activity, capacity: openCapacity, fetcher })
    await wrapper.vm.$nextTick()
    ;(findButton('S\'inscrire') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    setInput('input[type="email"]', 'a@example.ch')
    setInput('input[placeholder="Prénom et nom"]', 'Alice')
    await wrapper.vm.$nextTick()
    ;(findButton('S\'inscrire') as HTMLButtonElement).click()
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(calls).toHaveLength(1)
    expect(calls[0]!.path).toBe('/activities/a1/signup')
    expect(calls[0]!.options?.body).toEqual({
      contact_email: 'a@example.ch',
      participants: [{ name: 'Alice' }],
    })
    expect(document.body.textContent).toContain('Un email de confirmation a été envoyé à a@example.ch.')
  })

  it('blocks submission and reports field errors when inputs are invalid', async () => {
    const calls: { path: string }[] = []
    const fetcher: ApiFetch = <T,>(path: string): Promise<T> => {
      calls.push({ path })
      return Promise.resolve({} as T)
    }
    const wrapper = mountModal({ activity, capacity: openCapacity, fetcher })
    await wrapper.vm.$nextTick()
    ;(findButton('S\'inscrire') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    setInput('input[placeholder="Prénom et nom"]', 'Alice')
    await wrapper.vm.$nextTick()
    ;(findButton('S\'inscrire') as HTMLButtonElement).click()
    await flushPromises()
    expect(calls).toHaveLength(0)
    expect(document.body.textContent).toContain('Adresse email invalide')
  })
})
