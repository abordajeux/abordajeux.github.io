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

  it('renders the static presque nav unchanged', () => {
    const store = usePirateStore()
    store.changeProject('presque')
    expect(store.navigationButtons.map(item => item.label)).toEqual([
      'Accueil',
      'L\'Événement en Bref',
      'Nous contacter',
    ])
    expect(store.currentProject).toBe('presque')
  })

  it.each([
    ['', 6],
    ['info', 6],
    ['programme', 6],
    ['events', 6],
    ['galerie', 6],
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
    expect(store.navigationButtons).toHaveLength(6)
  })
})
