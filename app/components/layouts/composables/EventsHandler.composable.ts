import { CalendarDate } from '@internationalized/date'
import {Frequency, RRule} from 'rrule'
import type { baseEvent, datedEvent } from '~/types/navigation'
/**
 *  Behavior:
 *
 *  on startup, we call the init events function
 *      --> add locally stored events to the state
 *      --> fetch online for all events
 *      --> load them into the state once it's finished
 *  --> extra work : google script GET
 *  those events should be stored in the state
 *
 */


const mercrediJeu: baseEvent = {
        "id": "mercredi-soir",
        "title": "Soirée jeux du Mercredi",
        "repetitionRule": new RRule({freq: RRule.WEEKLY, byweekday: [RRule.WE]}),
        "hours": ["19:00", "23:00"],
        "pre_img_description": ["Chaque mercredi, l'abordajeux vous embarque dans plusieurs tables de jeux. Nos membres peuvent s'inscrire à n'importe quelle table, et nos visiteurs peuvent découvrir tout ça à travers nos tables libres."],
        "location": "Hôtel des associations, rue Louis Favre 1, Neuchâtel, Salle des Solidarités",
        "coordinates": "2561513.27, 1205019.77",
        "image_path": "",
        "games": [],
        "external_link": ["/info#contact", "S'inscrire", "i-lucide-notebook-pen", ""],
        "isPublic":true,
        "prices": {
                "non membres, première visite": 5,
                "non membres, visites ultérieures": 20,
                "membres": 0
            }
}

const gameOClock = {
        "id": "beer",
        "title": "Games O'Clock",
        "repetitionRule": new RRule({freq: RRule.MONTHLY, byweekday: [RRule.TU.nth(2)]}),
        "hours": ["20:00", "23:30"],
        "pre_img_description":
        [
            "Grand connaisseur/se de jeux, amateur/trice ou curieux/se de découvrir cet univers ?",
            "Viens découvrir nos jeux d’ambiance sélectionnés avec soin pour passer une soiree ludique dans un cadre chaleureux !",
            "Nos bénévoles seront la pour te guider dans le choix du jeu et l’explication des règles (et peut-être bien s’inviter à jouer avec toi !)",
            "Entrée libre et consommations de qualité!",
            "Amis fournis séparément*"],

        "post_img_description": ["Étape 1 : aller au bar", "Étape 2 : aller dire bonjour aux gens qui présentent des jeux", "Étape 3 : ? ? ? ", "Étape 4: profit"],
        "location": "Bar le Beer O' Clock, rue de la Promenade-Noire 3, Neuchâtel",
        "coordinates": "2561132.82, 1204493.31",
        "isPublic": true,
        "prices": {}

    }

    const recurringEvents: baseEvent[] = [
        mercrediJeu, gameOClock
    ]

    // TODO : google script call
const overrideFiles = import.meta.glob('@/assets/events/single/*.json', {
  eager: true,
})

const overrides = Object.entries(overrideFiles).reduce(
  (acc, [path, mod]: any) => {
    const fileName = path.split('/').pop().replace('.json', '')
    acc[fileName] = mod.default
    return acc
  },
  {} as Record<string, any>
)



export function buildInitialCalendarIndex(start: Date, end: Date) {
  const index: Record<string, datedEvent[]> = {}

  recurringEvents.forEach((recurringEvent) => {
    const dates = recurringEvent.repetitionRule.between(start, end)
    if(dates.length > 0) {
        index[recurringEvent.id] = []
    }
    dates.forEach((date) => {
        const datedEvent: datedEvent = {
            date,
            ...recurringEvent
        }
        index[recurringEvent.id]!.push(datedEvent)
    })

    })
    Object.keys(index).forEach((key) => {
        index[key]!.sort((a, b) => a.date.getTime() - b.date.getTime())

    })

  return index
}

export async function grabSingleEvents(): Promise<Record<string, string> | undefined> {

return

}
