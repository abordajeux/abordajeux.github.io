import { formatPresqueSchedule, sortByStart, type PresqueActivity } from './presqueProgram'
import { getCapacityBadge, type ActivityCapacity, type CapacityBadge } from './subscriptionLogic'

export interface AvailabilityCounters {
  confirmed: string
  pending: string
  waitlisted: string
}

export interface AvailabilityRow {
  id: string
  title: string
  link: string
  schedule: string
  badge: CapacityBadge
  counters: AvailabilityCounters
}

export function buildAvailabilityRows(
  activities: PresqueActivity[],
  capacities: Record<string, ActivityCapacity>,
  now: Date,
): AvailabilityRow[] {
  const upcoming = activities.filter(activity => new Date(activity.start).getTime() > now.getTime())
  return sortByStart(upcoming).map((activity) => {
    const capacity = capacities[activity.id]
    return {
      id: activity.id,
      title: activity.title,
      link: `/presque/programme?id=${activity.id}`,
      schedule: formatPresqueSchedule(activity.start, activity.end),
      badge: getCapacityBadge(capacity),
      counters: buildCounters(capacity),
    }
  })
}

function buildCounters(capacity: ActivityCapacity | undefined): AvailabilityCounters {
  if (!capacity || capacity.max === 0) {
    return { confirmed: '—', pending: '—', waitlisted: '—' }
  }
  return {
    confirmed: String(capacity.confirmed),
    pending: String(capacity.pending),
    waitlisted: String(capacity.waitlisted),
  }
}
