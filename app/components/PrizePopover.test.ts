import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { UPopover } from '#components'
import PrizePopover from './PrizePopover.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('PrizePopover', () => {
  it('shows the single phrase in a popup when prizes is a string', async () => {
    const wrapper = mount(PrizePopover, {
      props: { prizes: 'Des prix pour les trois premiers·ières.' },
      attachTo: document.body,
    })
    const trigger = document.body.querySelector('button[aria-label="Voir les lots"]') as HTMLButtonElement
    trigger.click()
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('Des prix pour les trois premiers·ières.')
  })

  it('displays the prize wall rank by rank when prizes is a map', async () => {
    const wrapper = mount(PrizePopover, {
      props: {
        prizes: { '1re place': 'Un jeu offert', '2e place': 'Une extension', '3e-4e places': 'Une boîte de dés' },
      },
      attachTo: document.body,
    })
    const trigger = document.body.querySelector('button[aria-label="Voir les lots"]') as HTMLButtonElement
    trigger.click()
    await wrapper.vm.$nextTick()
    const body = document.body.textContent ?? ''
    expect(body).toContain('1re place')
    expect(body).toContain('Un jeu offert')
    expect(body).toContain('3e-4e places')
    expect(body).toContain('Une boîte de dés')
  })

  it('hides the visible label by default and shows it on demand', () => {
    const iconOnly = mount(PrizePopover, {
      props: { prizes: 'Des prix pour les trois premiers·ières.' },
    })
    expect(iconOnly.text()).not.toContain('Voir les lots')

    const labeled = mount(PrizePopover, {
      props: { prizes: 'Des prix pour les trois premiers·ières.', showLabel: true },
    })
    expect(labeled.text()).toContain('Voir les lots')
  })

  it('gives the popup content the opaque site background for readability', () => {
    const wrapper = mount(PrizePopover, {
      props: { prizes: 'Des lots.' },
    })
    const popover = wrapper.findComponent(UPopover) as unknown as { props: (name: string) => unknown }
    expect(popover.props('ui')).toEqual({ content: 'presque-prize-popover' })
  })

  it('makes long prize walls scrollable and keyboard-scrollable after a click', async () => {
    const wrapper = mount(PrizePopover, {
      props: {
        prizes: { '1re place': 'Un jeu', '2e place': 'Une extension', '3e place': 'Des dés' },
      },
      attachTo: document.body,
    })
    const trigger = document.body.querySelector('button[aria-label="Voir les lots"]') as HTMLButtonElement
    trigger.click()
    await wrapper.vm.$nextTick()
    const scrollable = document.body.querySelector('div.overflow-y-auto') as HTMLElement | null
    expect(scrollable).not.toBeNull()
    expect(scrollable?.textContent).toContain('1re place')
    expect(scrollable?.classList.contains('max-h-[50vh]')).toBe(true)
    expect(scrollable?.getAttribute('tabindex')).toBe('-1')
  })
})
