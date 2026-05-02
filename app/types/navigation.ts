import type { RRule } from "rrule"
export interface NavButton {
  label: string
  to: string
  icon: string
}


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
}

export type datedEvent = baseEvent & {
    date: Date
}
