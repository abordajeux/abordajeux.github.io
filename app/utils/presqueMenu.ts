import * as v from 'valibot'
import menuRaw from '~/data/presque-menu.json'

export interface PresqueMenuItem {
  name: string
  price?: number
  description?: string
}

export interface PresqueMenuSection {
  title: string
  icon?: string
  items: PresqueMenuItem[]
}

const menuItemSchema = v.object({
  name: v.string(),
  price: v.optional(v.number()),
  description: v.optional(v.string()),
})

const menuSectionSchema = v.object({
  title: v.string(),
  icon: v.optional(v.string()),
  items: v.array(menuItemSchema),
})

export function parsePresqueMenu(raw: unknown): PresqueMenuSection[] {
  return v.parse(v.array(menuSectionSchema), raw) as PresqueMenuSection[]
}

export function loadPresqueMenu(): PresqueMenuSection[] {
  return parsePresqueMenu(menuRaw)
}

export function formatMenuItemPrice(price: number): string {
  if (price === 0) {
    return 'gratuit'
  }
  else if (price <0) {
    return 'prix libre'
  }
  return `${price} CHF`
}
