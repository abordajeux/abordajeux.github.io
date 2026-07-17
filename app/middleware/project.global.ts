export default defineNuxtRouteMiddleware((to) => {
  usePirateStore().changeProject(to.path.split('/')[1])
})
