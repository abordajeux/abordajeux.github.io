# Conventions de structure des JSON pour les évènements

## Structure générale pour les évènements

Dans le fichier `recurring_events.json`, un évènement est un objet dont la clé est son nom d'évènement.

#### Paramètres

|Paramètre|type|valeurs acceptées|description| optionnel |
|-|-|-|-|-|
|event Name| String| Any | Le nom de l'événement.| non |
|hours| String[]| Tableau de deux strings représentant des heures | L'heure de début et l'heure de fin.| non |
|frequency| FREQUENCY| voir plus loin | donne la fréquence de répétition de l'événement. Obligatoire pour les évènements récurrents | oui / non |
|description| String[]| Any | Une liste de strings, chacune représentant un paragraphe| non |
|location| String| Any | L'adresse où se situe l'événement| non |
|coordinates| String| Deux coordonnées LV95 séparées par une virgule | Afin de centrer la carte au bon endroit| non |
|image_path| String| Any |Le chemin vers l'image, depuis les assets internes.| oui |
|external_link| String[]| [URL, text] | Lien vers une ressource externe et le texte à mettre sur le lien.| oui |
|jeux|GAME[]|une liste d'objets de type "jeux"|Liste des jeux joués, avec une description rapide et peut être un lien vers les règles| oui|
|schedule|SUBEVENT[]|liste des activités|une liste d'activité au cours de la journée, avec les heures qui correspondent|oui|
|organizer| String | Any | L'organisateur / Le responsable de l'évènement | oui|
|membership_requirement| String | Any | un Enum entre "public", "internal" décrivant à qui s'adresse l'évènement|non|
|price|PRICE[]|any| les prix d'entrées à l'évènement | oui |

#### Exemple:

```JSON
{
    "Event Name": {
        "frequency": "CRON-LIKE-STRING",
        "hours": ["19:00", "23:00"],
        "description": ["An array", "of various", "paragraphs"],
        "location": "The full address",
        "coordinates": "LV95 coordinates, to show on the map",
        "image_path": "path/to/image/in/assets",
        "external_link": null

    },
    ...
}
```


## Structure générale pour les évènements ponctuels

Le fichier doit être nommé de la façon suivante : `YYYY_MM_DD.json`

Chaque évènement qui a lieu à cette date est un objet dont la clé est le nom de l'évènement

Si un évènement a le même nom qu'un évènement récurrent, chaque champ de l'évènement ponctuel est prioritaire par rapport à celui de l'évènement récurrent, mais prendra les valeurs de base pour tout le reste.

### Exemple d'un remplacement possible

```JSON
{
    "event_name_1": {
        "hours": ["15:00", "19:25"]
        "external_link": ["https://example.org","s'inscrire"],
        "organizer": "Jean Charles Exemple"
    }
}
```

## Structure d'un objet FREQUENCY

Un objet de `fréquence` est un objet contenant les paramètres suivant :

### Paramètres

|Paramètre | type | valeurs acceptées | description |
|-|-|-|-|-|
|days| int[] | [0 - 6] | 6 = Vendredi, 0 = dimanche. Représente les jours concernés|
|monthly_repetitions| int[] | [1 - 5] | quelles itérations durant le mois|

### Exemple

```JSON
    {
        "recurring_event": {
            "frequency": {
                "days": [3],
                "monthly_repetitions": [1,2,3,4,5]
            }
        }
    }
```

this would be the frequency for an event happening every wednesday


## Structure d'un objet GAME

Quand l'évènement propose une liste de jeux spécifiques, (par exemple, les mercredi jeux), un objet est nécessaire pour représenter chaque jeu.

### paramètres

|Paramètre|type|description| optionnel |
|-|-|-|-|
|game_name|string|le nom du jeu| non|
|description|string| une description rapide du jeu| non|
|mechanics|string[]|une liste de "tags" qui représentent les mécaniques du jeu| oui|
|duration|string|une durée sour le format `h:mm`|oui|
|nb_players|int[]|une liste de deux chiffres entiers représentant le nombre de joueurs min / max| oui|
|rules|string[]|une liste contenant un lien vers les règles et le format des règles (vidéo, pdf, etc)| oui|
|level|string|Le niveau de jeu attendu pour jouer au jeu (débutant, famillial, initié, expert, chiant), ...|oui|


### exemple

```JSON
{
    "some_event": {
        "games": [
            {
                "game_name": "La valse des Sycophantes",
                "description": "Son excellence veut une capitale, devenez indispensables à ses yeux en étant presque le plus compétent",
                "mechanics": ["pose d'ouvrier", "planification", "coups de putes"],
                "duration": "2:30",
                "nb_players": [3, 4],
                "rules": ["https://règlesdujeu.org/rules.pdf", "PDF"],
                "level": "prototype"
            }
        ],
        ...
    }
}
```

## Structure d'un objet SUBEVENT

Les `SUBEVENT` ont pour objectif de diviser une journée en plusieurs activités avec des plages horaires. Ils n'ont qu'une vocation orgasinationelle.

### paramètres

|paramètre|type|description|optionnel|
|-|-|-|-|
|name|string|nom de l'activité|non|
|description|string|courte description du sous-événement|non|
|hours|string []|heure de début et durée de l'activité|non|

### exemple

```JSON
    {
        "some_event": {
            "schedule": [
                {
                    "name": "accueil",
                    "description":"Apprendre à se connaître",
                    "hours": ["13:00", "0:15"]
                },
                {
                    "name": "Un gros bloc d'exposition chiant et inutile",
                    "description": "Mise en place d'une synergie de groupe",
                    "hours": ["13:20", "6:30"]
                }
            ]
        }
    }
```

## Structure d'un objet PRICE

un objet `PRICE` est un objet dont la clé est la catégorie, et la valeur est un nombre représentant le prix.

### Paramètres

|parameter|type|description|
|-|-|-|
|category|key|qui doit payer ce prix|
|price|number|combien ça coûte|

### Exemple

```JSON
{
    "some_event": {
        "prices": {
                "non membres, première visite": 5,
                "non membres, visites ultérieures": 20,
                "membres": 0
            }
    }
}
```
