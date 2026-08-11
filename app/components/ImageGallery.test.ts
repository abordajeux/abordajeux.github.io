import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageGallery from './ImageGallery.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('ImageGallery', () => {
  it('renders one image card per item, in order', () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [
          { image: 'a.jpg' },
          { image: 'b.jpg' },
          { image: 'c.jpg' },
        ],
      },
    })
    const imgs = wrapper.findAll('img')
    expect(imgs).toHaveLength(3)
  })

  it('omits the copyright button entirely when no item has a copyright', () => {
    const wrapper = mount(ImageGallery, {
      props: { items: [{ image: 'a.jpg' }, { image: 'b.jpg' }] },
    })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders the brush-icon button with link + label when an item has a copyright', () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [{ image: 'a.jpg', copyright: ['© Jane Doe', 'https://jane.example'] }],
      },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://jane.example')
    expect(link.text()).toContain('© Jane Doe')
  })

  it('renders mixed items (some with copyright, some without) without cross-contamination', () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [
          { image: 'a.jpg' },
          { image: 'b.jpg', copyright: ['© X', 'https://x.example'] },
          { image: 'c.jpg' },
        ],
      },
    })
    expect(wrapper.findAll('img')).toHaveLength(3)
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('applies the columns override as an inline grid-template-columns style', () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [{ image: 'a.jpg' }],
        columns: 4,
      },
    })
    const grid = wrapper.find('.grid')
    expect(grid.attributes('style')).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))')
  })

  it('falls back to the responsive Tailwind classes when columns is not set', () => {
    const wrapper = mount(ImageGallery, {
      props: { items: [{ image: 'a.jpg' }] },
    })
    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('grid')
    expect(grid.classes()).toContain('grid-cols-2')
    expect(grid.classes()).toContain('md:grid-cols-3')
  })
})

describe('ImageGallery — lightbox modal', () => {
  it('does not render the modal dialog initially', () => {
    mount(ImageGallery, {
      props: { items: [{ image: 'event_mercredi.jpeg' }] },
    })
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })

  it('opens the modal dialog when a card trigger is clicked', async () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [
          { image: 'event_mercredi.jpeg' },
          { image: 'event_game_o_clock.jpeg' },
        ],
      },
    })
    await wrapper.findAll('button[aria-label="Agrandir l\'image"]')[1]!.trigger('click')
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    const dialogImg = dialog?.querySelector('img') ?? null
    expect(dialogImg).not.toBeNull()
    expect(dialogImg?.getAttribute('src')).toContain('event_game_o_clock')
  })

  it('hides the prev button on the first image and the next button on the last image', async () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [
          { image: 'event_mercredi.jpeg' },
          { image: 'event_game_o_clock.jpeg' },
          { image: 'banner_abordajeux.png' },
        ],
      },
    })

    await wrapper.findAll('button[aria-label="Agrandir l\'image"]')[0]!.trigger('click')
    let prev = document.body.querySelector('button[aria-label="Image précédente"]')
    let next = document.body.querySelector('button[aria-label="Image suivante"]')
    expect(prev).toBeNull()
    expect(next).not.toBeNull()

    ;(next as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    prev = document.body.querySelector('button[aria-label="Image précédente"]')
    next = document.body.querySelector('button[aria-label="Image suivante"]')
    expect(prev).not.toBeNull()
    expect(next).not.toBeNull()

    ;(next as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    prev = document.body.querySelector('button[aria-label="Image précédente"]')
    next = document.body.querySelector('button[aria-label="Image suivante"]')
    expect(prev).not.toBeNull()
    expect(next).toBeNull()
  })

  it('navigates between images via the prev/next arrows', async () => {
    const wrapper = mount(ImageGallery, {
      props: {
        items: [
          { image: 'event_mercredi.jpeg' },
          { image: 'event_game_o_clock.jpeg' },
          { image: 'banner_abordajeux.png' },
        ],
      },
    })

    await wrapper.findAll('button[aria-label="Agrandir l\'image"]')[0]!.trigger('click')

    const nextButton = document.body.querySelector('button[aria-label="Image suivante"]') as HTMLButtonElement
    nextButton.click()
    await wrapper.vm.$nextTick()
    let dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.querySelector('img')?.getAttribute('src')).toContain('event_game_o_clock')

    const prevButton = document.body.querySelector('button[aria-label="Image précédente"]') as HTMLButtonElement
    prevButton.click()
    await wrapper.vm.$nextTick()
    dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.querySelector('img')?.getAttribute('src')).toContain('event_mercredi')
  })
})
