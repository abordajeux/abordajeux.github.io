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
        "image_path": "event_mercredi.jpeg",
        "games": [],
        "external_link": ["/info#contact", "S'inscrire", "i-lucide-notebook-pen", ""],
        "isPublic":true,
        "prices": {
                "Non-membres, première visite": 5,
                "Non-membres, visites ultérieures": 20,
                "Membres": 0
            }
}

const gameOClock = {
        "id": "beer",
        "title": "Games O'Clock",
        "repetitionRule": new RRule({freq: RRule.MONTHLY, byweekday: [RRule.TU.nth(2)]}),
        "hours": ["19:00", "23:30"],
        "pre_img_description":
        [
            "Grand connaisseur/se de jeux, amateur/trice ou curieux/se de découvrir cet univers ?",
            "Viens découvrir nos jeux d’ambiance sélectionnés avec soin pour passer une soirée ludique dans un cadre chaleureux !",
            "Nos bénévoles seront là pour te guider dans le choix du jeu et l’explication des règles (et peut-être bien s’inviter à jouer avec toi !)",
            "Entrée libre et consommations de qualité!",
            "Ami/es fourni/es séparément*"],

        "post_img_description": ["Étape 1 : Aller au bar", "Étape 2 : Aller dire bonjour aux gens qui présentent des jeux", "Étape 3 : ? ? ? ", "Étape 4: Profit"],
        "location": "Bar le Beer O' Clock, rue de la Promenade-Noire 3, Neuchâtel",
        "coordinates": "2561132.82, 1204493.31",
                "image_path": "event_game_o_clock.jpeg",

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
