import type { RRule } from "rrule"
export interface NavButton {
  label: string
  to: string
  icon: string
}

export type NifffRoom = 'JDR 1' | 'JDR 2' | 'JDS'

export type PresqueRoom = 'JDR Cheminée 1' | 'JDR Cheminée 2' | 'JDR Cheminée Caché 1' | 'JDR Cheminée Caché 2' | 'JDR Cheminée Couloi 1' | 'JDR Cheminée Couloir 2' | 'Salle principale' | 'Scène'

export type baseEvent = {
    id: string,
    title: string,
    repetitionRule: RRule,
    hours: string[],
    pre_img_description?: string[],
    post_img_description?: string[]
    location?: string,
    coordinates?:string,
    image_path?: string,
    games?: [],
    external_link?: string[]
    organizer?:string,
    isPublic: boolean,
    prices: Record<string, number>
    room ? : NifffRoom | PresqueRoom
}

export type datedEvent = baseEvent & {
    date: Date
}
