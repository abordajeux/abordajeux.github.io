import { defineStore } from 'pinia'
import type { NavigationMenuItem } from '@nuxt/ui'

export const usePirateStore = defineStore('application', () => {
    type ProjectsName = 'presque' | 'nifff'

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
            'presque': [{
            "label":'Accueil',
            "to": '/',
            "icon": 'i-lucide-house'},
        {
            "label":'L\'Événement en Bref',
            "to": '/presque',
            "icon": 'i-lucide-presentation'},
        {
            "label":'Nous contacter',
            "to": '/info',
            "icon": 'i-lucide-info'},
        ],
            'nifff': [{
                "label":'Accueil',
                "to": '/',
                "icon": 'i-lucide-house'
            },{
                "label":'Le Projet',
                "to": '/nifff',
                "icon": 'i-lucide-presentation'
            },{
                "label":'Le Programme',
                "to": '/nifff/programme',
                "icon": 'i-lucide-calendar-check-2'
            },{
                "label":'Nous contacter',
                "to": '/info',
                "icon": 'i-lucide-info'
            }],
        }

    const isMobile: Ref<boolean> = ref(false)
    const hidePrices: Ref<boolean> = ref(false)
    const navigationButtons: Ref<NavigationMenuItem[]> = ref(standardNavigation)
    const currentProject: Ref<null | ProjectsName> = ref(null)

    function setUIChanges(width: number) {
        isMobile.value = width < 771
        hidePrices.value = width < 600
    }

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
            hidePrices,
            navigationButtons,
            currentProject,
            changeProject,
            setUIChanges,
        }
})

export const isMobile = false
