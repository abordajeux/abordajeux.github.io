import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { UApp } from '#components'
import type { ApiFetch, ApiFetchOptions } from '~/composables/useApiFetch'
import { parseDateKey, type CalendarEvent } from '~/utils/eventsLoader'
import EventSignupModal from './EventSignupModal.vue'

const event: CalendarEvent = {
  id: 'mercredi-soir',
  title: 'Soirée jeux du Mercredi',
  hours: ['19:00', '23:00'],
  isPublic: true,
  prices: {},
  date: parseDateKey('2026-11-11'),
  signup_form: true,
}

const subject = 'Soirée jeux du Mercredi du 11 novembre 2026'

function createFetcher(handler: (path: string, options?: ApiFetchOptions) => unknown): ApiFetch {
  return <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
    const result = handler(path, options)
    if (result instanceof Error) {
      return Promise.reject(result)
    }
    return Promise.resolve(result as T)
  }
}

function mountModal(fetcher?: ApiFetch) {
  return mount(
    {
      components: { UApp, EventSignupModal },
      data() {
        return { open: true, event }
      },
      template: '<UApp><EventSignupModal v-model:open="open" :event="event" :fetcher="fetcher" /></UApp>',
      setup() {
        return { fetcher }
      },
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

describe('EventSignupModal', () => {
  it('shows the event title, its date and the auto-computed subject', async () => {
    const wrapper = mountModal()
    await wrapper.vm.$nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.textContent).toContain('Soirée jeux du Mercredi')
    expect(dialog?.textContent).toContain('11 novembre 2026')
    expect((dialog?.querySelector('input[disabled]') as HTMLInputElement)?.value).toBe(subject)
    expect(dialog?.querySelector('input[type="email"]')).not.toBeNull()
    expect(dialog?.querySelector('textarea')).not.toBeNull()
  })

  it('submits subject, email and message to the contact endpoint and confirms', async () => {
    const calls: { path: string, options?: ApiFetchOptions }[] = []
    const fetcher = createFetcher((path, options) => {
      calls.push({ path, options })
      return {}
    })
    const wrapper = mountModal(fetcher)
    await wrapper.vm.$nextTick()
    setInput('input[type="email"]', 'a@example.ch')
    setInput('textarea', 'Je voudrais réserver une place.')
    await wrapper.vm.$nextTick()
    ;(findButton('Envoyer') as HTMLButtonElement).click()
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(calls).toHaveLength(1)
    expect(calls[0]!.path).toBe('/forms/contact')
    expect(calls[0]!.options?.body).toEqual({
      subject,
      sender_email: 'a@example.ch',
      message: 'Je voudrais réserver une place.',
    })
    expect(document.body.textContent).toContain('Merci de votre message')
  })

  it('blocks submission and reports field errors when inputs are invalid', async () => {
    const calls: { path: string }[] = []
    const wrapper = mountModal(createFetcher((path) => {
      calls.push({ path })
      return {}
    }))
    await wrapper.vm.$nextTick()
    setInput('textarea', 'Un message valide.')
    await wrapper.vm.$nextTick()
    ;(findButton('Envoyer') as HTMLButtonElement).click()
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(calls).toHaveLength(0)
    expect(document.body.textContent).toContain('Adresse email invalide')

    setInput('input[type="email"]', 'a@example.ch')
    setInput('textarea', '')
    await wrapper.vm.$nextTick()
    ;(findButton('Envoyer') as HTMLButtonElement).click()
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(calls).toHaveLength(0)
    expect(document.body.textContent).toContain('Message requis')
  })

  it('shows the mapped API error and lets the user retry', async () => {
    let attempts = 0
    const fetcher = createFetcher(() => {
      attempts += 1
      if (attempts === 1) {
        return Object.assign(new Error('boom'), { data: { message: 'Service indisponible' } })
      }
      return {}
    })
    const wrapper = mountModal(fetcher)
    await wrapper.vm.$nextTick()
    setInput('input[type="email"]', 'a@example.ch')
    setInput('textarea', 'Je voudrais réserver une place.')
    await wrapper.vm.$nextTick()
    ;(findButton('Envoyer') as HTMLButtonElement).click()
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('Service indisponible')
    expect(document.body.querySelector('input[type="email"]')).not.toBeNull()
    ;(findButton('Envoyer') as HTMLButtonElement).click()
    await flushPromises()
    expect(attempts).toBe(2)
    expect(document.body.textContent).toContain('Merci de votre message')
  })

  it('resets the form when the modal is reopened after a success', async () => {
    const wrapper = mountModal(createFetcher(() => ({})))
    await wrapper.vm.$nextTick()
    setInput('input[type="email"]', 'a@example.ch')
    setInput('textarea', 'Je voudrais réserver une place.')
    await wrapper.vm.$nextTick()
    ;(findButton('Envoyer') as HTMLButtonElement).click()
    await flushPromises()
    expect(document.body.querySelector('input[type="email"]')).toBeNull()

    const vm = wrapper.vm as unknown as { open: boolean }
    vm.open = false
    await wrapper.vm.$nextTick()
    vm.open = true
    await wrapper.vm.$nextTick()
    const email = document.body.querySelector('input[type="email"]') as HTMLInputElement
    expect(email).not.toBeNull()
    expect(email.value).toBe('')
    expect((document.body.querySelector('textarea') as HTMLTextAreaElement).value).toBe('')
  })
})
