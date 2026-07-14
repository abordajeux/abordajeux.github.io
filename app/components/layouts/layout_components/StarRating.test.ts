import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from './StarRating.vue'

describe('StarRating', () => {
  it('renders the expected number of stars', () => {
    const wrapper = mount(StarRating)
    expect(wrapper.findAll('button')).toHaveLength(5)
  })

  it('updates the model when a star is clicked', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: 0 } })
    await wrapper.findAll('button')[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
  })
})
