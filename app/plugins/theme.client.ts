import { storeToRefs } from 'pinia'
import { projectThemes, themeToCssVars } from '~/themes'

export default defineNuxtPlugin(() => {
  const { currentProject } = storeToRefs(usePirateStore())

  let appliedVars: string[] = []

  function applyTheme(project: string | null) {
    const root = document.documentElement
    for (const name of appliedVars) {
      root.style.removeProperty(name)
    }
    const vars = themeToCssVars(project ? projectThemes[project] : undefined)
    appliedVars = Object.keys(vars)
    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value)
    }
  }

  watch(currentProject, project => applyTheme(project), { immediate: true })
})
