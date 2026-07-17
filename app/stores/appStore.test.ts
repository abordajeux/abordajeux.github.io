import { describe, expect, it } from 'vitest'

describe('usePirateStore.changeProject (project.global.ts delegates to this)', () => {
  it.each([
    ['', 5],
    ['nifff', 4],
    ['presque', 3],
    ['info', 5],
    ['programme', 5],
    ['events', 5],
  ])('first path segment %r -> %i nav items', (segment, count) => {
    const store = usePirateStore()
    store.changeProject(segment)
    expect(store.navigationButtons).toHaveLength(count)
  })

  it('resets to standard nav when leaving a project', () => {
    const store = usePirateStore()
    store.changeProject('nifff')
    expect(store.currentProject).toBe('nifff')
    store.changeProject('info')
    expect(store.currentProject).toBeNull()
    expect(store.navigationButtons).toHaveLength(5)
  })
})
