import * as v from 'valibot'
import partnersRaw from '~/data/presque-partners.json'

export interface PresqueSponsor {
  name: string
  logo: string
}

export interface PresquePartner {
  name: string
  logo: string
  description: string
  website: string
  whatsapp?: string
}

export interface PresquePartners {
  sponsors: PresqueSponsor[]
  partners: PresquePartner[]
}

const sponsorSchema = v.object({
  name: v.string(),
  logo: v.string(),
})

const partnerSchema = v.object({
  name: v.string(),
  logo: v.string(),
  description: v.string(),
  website: v.pipe(v.string(), v.url()),
  whatsapp: v.optional(v.pipe(v.string(), v.url())),
})

const partnersFileSchema = v.object({
  sponsors: v.array(sponsorSchema),
  partners: v.array(partnerSchema),
})

export function parsePresquePartners(raw: unknown): PresquePartners {
  return v.parse(partnersFileSchema, raw) as PresquePartners
}

export function loadPresquePartners(): PresquePartners {
  return parsePresquePartners(partnersRaw)
}
