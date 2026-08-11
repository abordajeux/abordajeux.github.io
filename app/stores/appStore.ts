import { defineStore } from 'pinia'
import type { NavigationMenuItem } from '@nuxt/ui'
import { loadNifffEditions, loadNifffLatest } from '~/utils/nifffLoader'

export const usePirateStore = defineStore('application', () => {
    type ProjectsName = 'presque' | 'nifff'

    const standardNavigation = [
        { label: 'Accueil', to: '/', icon: 'i-lucide-house' },
        { label: 'Événements', to: '/events', icon: 'i-lucide-calendar-days' },
        { label: 'Nos Projets', to: '/projects', icon: 'i-lucide-sailboat' },
        { label: 'Nos jeux', to: '/games', icon: 'i-lucide-chess-queen' },
        { label: 'Informations et Contact', to: '/info', icon: 'i-lucide-info' },
    ]

    const presqueNavigation = [
        { label: 'Accueil', to: '/', icon: 'i-lucide-house' },
        { label: 'L\'Événement en Bref', to: '/presque', icon: 'i-lucide-presentation' },
        { label: 'Nous contacter', to: '/info', icon: 'i-lucide-info' },
    ]

    function buildNifffNav() {
        const items = [
            { label: 'Accueil', to: '/', icon: 'i-lucide-house' },
            { label: 'Le Projet', to: '/nifff', icon: 'i-lucide-presentation' },
        ]
        if (loadNifffLatest().length > 0) {
            items.push({ label: 'Le Programme', to: '/nifff/programme', icon: 'i-lucide-calendar-check-2' })
        }
        if (loadNifffEditions().length > 0) {
            items.push({ label: 'Galerie', to: '/nifff/galerie', icon: 'i-lucide-images' })
        }
        items.push({ label: 'Nous contacter', to: '/info', icon: 'i-lucide-info' })
        return items
    }

    const isMobile: Ref<boolean> = ref(false)
    const hidePrices: Ref<boolean> = ref(false)
    const navigationButtons: Ref<NavigationMenuItem[]> = ref(standardNavigation)
    const currentProject: Ref<null | ProjectsName> = ref(null)

    function setUIChanges(width: number) {
        isMobile.value = width < 771
        hidePrices.value = width < 600
    }

    function changeProject(newProject?: string) {
        if (newProject === 'nifff') {
            currentProject.value = 'nifff'
            navigationButtons.value = buildNifffNav()
            return
        }
        if (newProject === 'presque') {
            currentProject.value = 'presque'
            navigationButtons.value = presqueNavigation
            return
        }
        currentProject.value = null
        navigationButtons.value = standardNavigation
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
