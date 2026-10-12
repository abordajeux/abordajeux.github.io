export interface ActivityCapacity {
  max: number
  confirmed: number
  pending: number
  waitlisted: number
}

export type SignupMode = 'subscription' | 'waiting_list' | 'none'

export type CapacityBadgeColor = 'success' | 'warning' | 'error' | 'neutral'

export interface CapacityBadge {
  label: string
  color: CapacityBadgeColor
}

const MAX_PARTICIPANTS_PER_REQUEST = 10

export function getAvailable(capacity: ActivityCapacity): number {
  return capacity.max - capacity.confirmed - capacity.pending
}

export function isAtCapacity(capacity: ActivityCapacity): boolean {
  return getAvailable(capacity) <= 0 || capacity.waitlisted > 0
}

export function getSignupMode(capacity: ActivityCapacity): SignupMode {
  if (capacity.max === 0) {
    return 'none'
  }
  return isAtCapacity(capacity) ? 'waiting_list' : 'subscription'
}

export function getAllowedPeople(capacity: ActivityCapacity): number {
  if (capacity.max === 0) {
    return 0
  }
  if (isAtCapacity(capacity)) {
    return 1
  }
  return Math.min(getAvailable(capacity), MAX_PARTICIPANTS_PER_REQUEST)
}

export function canAddPerson(count: number, capacity: ActivityCapacity): boolean {
  return count < getAllowedPeople(capacity)
}

function placesLabel(count: number): string {
  return `${count} place${count > 1 ? 's' : ''}`
}

export function getCapacityBadge(capacity: ActivityCapacity | undefined): CapacityBadge {
  if (!capacity) {
    return { label: 'Places : ?', color: 'neutral' }
  }
  if (capacity.max === 0) {
    return { label: 'Sans inscription', color: 'neutral' }
  }
  const available = getAvailable(capacity)
  if (isAtCapacity(capacity)) {
    return { label: 'Complet — liste d\'attente', color: 'error' }
  }
  if (available <= Math.ceil(capacity.max / 4)) {
    return { label: `Presque complet — ${placesLabel(available)}`, color: 'warning' }
  }
  return { label: `${placesLabel(available)} sur ${capacity.max}`, color: 'success' }
}
