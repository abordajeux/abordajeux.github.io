import { defineStore } from 'pinia'
import type { NavButton } from '~/types/navigation'
import type { NavigationMenuItem } from '@nuxt/ui'

export const usePirateStore = defineStore('application', () => {
    type ProjectsName = 'ndj' | 'niff'

    const standardNavigation = [{
            "label":'Accueil',
            "to": '/',
            "icon": 'i-lucide-house'},
        {
            "label":'Événements',
            "to": '/events',
            "icon": 'i-lucide-calendar-days'},
        {
            "label":'Nos Projets',
            "to": '/projects',
            "icon": 'i-lucide-sailboat'},
        {
            "label":'Nos jeux',
            "to": '/games',
            "icon": 'i-lucide-chess-queen'},
        {
            "label":'Informations et Contact',
            "to": '/info',
            "icon": 'i-lucide-info'}
        ]

    const projectNavigation: Record<ProjectsName, NavigationMenuItem[] > = {
            'ndj': [{
            "label":'Accueil',
            "to": '/',
            "icon": 'i-lucide-house'},
        {
            "label":'L\'Événement en Bref',
            "to": '/projects/ndj/',
            "icon": 'i-lucide-calendar-days'},
        {
            "label":'Le Programme',
            "to": '/projects/ndj/events',
            "icon": 'i-lucide-sailboat'},
        {
            "label":'Nos jeux',
            "to": '/projects/ndj/games',
            "icon": 'i-lucide-chess-queen'},
        {
            "label":'Informations et Contact',
            "to": '/projects/ndj/info',
            "icon": 'i-lucide-info'},
        ],
            'niff': [],
        }

    const isMobile: Ref<boolean> = ref(false)
    const navigationButtons: Ref<NavButton[]> = ref(standardNavigation)
    const currentProject: Ref<null | ProjectsName> = ref(null)

    function changeProject(newProject?: string){
        if (newProject && Object.keys(projectNavigation).includes(newProject)){
            currentProject.value = newProject as ProjectsName
            navigationButtons.value = projectNavigation[newProject as ProjectsName]
        }
        else {
            currentProject.value = null
            navigationButtons.value = standardNavigation
        }
    }

        return {
            isMobile,
            navigationButtons,
            currentProject,
            changeProject,
        }
})

export const isMobile = false
