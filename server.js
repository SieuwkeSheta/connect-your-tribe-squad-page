// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')



// Zorg dat werken met request data (volgende week) makkelijker wordt
app.use(express.urlencoded({extended: true}))

// Je kunt de volgende URLs uit onze API gebruiken:
// - https://fdnd.directus.app/items/tribe
// - https://fdnd.directus.app/items/squad
// - https://fdnd.directus.app/items/person
// En combineren met verschillende query parameters als filter, sort, search, etc.
// Gebruik hiervoor de documentatie van https://directus.io/docs/guides/connect/query-parameters
// En de oefeningen uit https://github.com/fdnd-task/connect-your-tribe-squad-page/blob/main/docs/squad-page-ontwerpen.md

// Haal bijvoorbeeld alle eerstejaars squads van dit jaar uit de WHOIS API op (2025–2026)
const params = {
  'filter[cohort]': '2526',
  'filter[tribe][name]': 'FDND Jaar 1'
}

const squadResponse = await fetch('https://fdnd.directus.app/items/squad?' + new URLSearchParams(params))

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
const squadResponseJSON = await squadResponse.json()

// Controleer eventueel de data in je console
// (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(squadResponseJSON)



// Om Views weer te geven, heb je Routes nodig
// Maak een GET route voor de index
app.get('/', async function (request, response) {

  // Voor het ophalen van de hele lijst met namen uit de squad
  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op naam
    'sort': 'name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526'
  }

  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Toon eventueel alle data in de console
  // console.log(personResponseJSON)

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele: persons
  // Geef ook de eerder opgehaalde squad data mee aan de view: squads
  response.render('index.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
})

// Maak een GET route voor de index voor het sorteren van de alfabetische volgorde
app.get('/aflopend-alfabetische-volgorde', async function (request, response) {

  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op aflopende naam
    'sort': '-name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526',
  }
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Toon eventueel alle data in de console
  // console.log(personResponseJSON)

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render('index.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data, reverseName: true})
})

// Maak een GET route voor de season.liquid voor het filteren van seizoenen (lente) 
app.get('/lente', async function (request, response) {

  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op naam
    'sort': 'name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526',

    // Seizoens filter
    'filter[fav_season]' : 'Lente'
  }
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Toon eventueel alle data in de console
  // console.log(personResponseJSON)

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render('season.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data, spring: true})
})

// Maak een GET route voor de season.liquid voor het filteren van seizoenen (zomer)
app.get('/zomer', async function (request, response) {

  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op naam
    'sort': 'name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526',

    // Seizoens filter
    'filter[fav_season]' : 'Zomer'
  }
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Toon eventueel alle data in de console
  // console.log(personResponseJSON)

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render('season.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data, summer: true})
})

// Maak een GET route voor de season.liquid voor het filteren van seizoenen (herfst)
app.get('/herfst', async function (request, response) {

  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op naam
    'sort': 'name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526',

    // Seizoens filter
    'filter[fav_season]' : 'Herfst'
  }
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Toon eventueel alle data in de console
  // console.log(personResponseJSON)

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render('season.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data, autumn: true})
})

// Maak een GET route voor de season.liquid voor het filteren van seizoenen (winter)
app.get('/winter', async function (request, response) {

  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op naam
    'sort': 'name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526',

    // Seizoens filter
    'filter[fav_season]' : 'Winter'
  }
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Toon eventueel alle data in de console
  // console.log(personResponseJSON)

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render('season.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data, winter: true})
})

// Vul hier jullie team naam in
const teamName = 'Sunny';

// Maak een GET route voor een detailpagina met een route parameter, id
// Zie de documentatie van Express voor meer info: https://expressjs.com/en/guide/routing.html#route-parameters
app.get('/student/:id', async function (request, response) {
  
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  const personDetailResponse = await fetch('https://fdnd.directus.app/items/person/' + request.params.id)
  // En haal daarvan de JSON op
  const personDetailResponseJSON = await personDetailResponse.json()



  // Voor het ophalen van de hele lijst met namen uit de squad
  // Haal alle personen uit de WHOIS API op, van dit jaar, gesorteerd op naam
  const params = {
    // Sorteer op naam
    'sort': 'name',

    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': '*,squads.*',

    // Combineer meerdere filters
    'filter[squads][squad_id][tribe][name]': 'FDND Jaar 1',
    // Filter eventueel alleen op een bepaalde squad
    // 'filter[squads][squad_id][name]': '1I',
    'filter[squads][squad_id][name]': '1J',
    'filter[squads][squad_id][cohort]': '2526'
  }
  
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?' + new URLSearchParams(params))

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()



  // Voor het gebruiken van formulier elementen
  // Filter eerst de berichten die je wilt zien, net als bij personen
  // Deze tabel wordt gedeeld door iedereen, dus verzin zelf een handig filter,
  // bijvoorbeeld je teamnaam, je projectnaam, je person ID, de datum van vandaag, etc..
  const paramsStudentForm = {
    // (Let op: gebruik 'template literals' voor het gebruik van variabelen)
    // Zie de documentatie voor meer info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    'filter[for]': `sieuwke-id-${request.params.id}`,
  }

  // Maak hiermee de URL aan, zoals we dat ook in de browser deden
  const apiURL = 'https://fdnd.directus.app/items/messages?' + new URLSearchParams(paramsStudentForm)

  // Laat eventueel zien wat de filter URL is
  // (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
  // console.log('API URL voor messages:', apiURL)

  // Haal daarna de messages data op
  const messagesResponse = await fetch(apiURL)

  // Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
  const messagesResponseJSON = await messagesResponse.json()

  // Controleer eventueel de data in je console
  // console.log(messagesResponseJSON)

  // Render student.liquid uit de views map en geef de opgehaalde data mee als variable: personDetail, persons, teamName en messages
  // Geef ook de eerder opgehaalde squad data mee aan de view: squads
  response.render('student.liquid', {
    personDetail: personDetailResponseJSON.data,  
    persons: personResponseJSON.data,
    teamName: teamName,
    messages: messagesResponseJSON.data,
    squads: squadResponseJSON.data
  })
})

// Maak een POST route voor de student detailpagina; hiermee kun je bijvoorbeeld formulieren afvangen
app.post('/student/:id', async function (request, response) {

  // Stuur een POST request naar de messages tabel
  // Een POST request bevat ook extra parameters, naast een URL
  await fetch('https://fdnd.directus.app/items/messages', {

    // Overschrijf de standaard GET method, want ook hier gaan we iets veranderen op de server
    method: 'POST',

    // Geef de body mee als JSON string
    body: JSON.stringify({
      // Dit is zodat we ons bericht straks weer terug kunnen vinden met ons filter
      for: `sieuwke-id-${request.params.id}`,
      // En dit zijn onze formuliervelden
      from: request.body.from,
      text: request.body.text
    }),

    // En vergeet deze HTTP headers niet: hiermee vertellen we de server dat we JSON doorsturen
    // (In realistischere projecten zou je hier ook authentication headers of een sleutel meegeven)
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  // Stuur de browser daarna weer naar de student detailpagina
  // (Let op: gebruik weer 'template literals' voor het gebruik van variabelen)
  // Zie de documentatie voor meer info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  response.redirect(303, `/student/${request.params.id}`)
})


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})




// Oefenen met 'Post'
// 1. Maak een lege array aan
let messagesArray = []

// 2. Luister naar GET requests op /berichten
app.get('/berichten', async function (request, response){
  // Render meteen de messages view, en geef de messages array mee
  response.render('messages.liquid', {messages: messagesArray})
})

// 3. Luister naar POST requests, ook op /berichten
app.post('/berichten', async function (request,response) {
  // Voeg de inhoud van het tekstveld toe aan de array
  messagesArray.push(request.body.message)
  // En stuur de browser terug naar /berichten, waar die een GET request uitvoert
  // De browser komt hierdoor dus weer “terug” bij 2, waardoor de view opnieuw gerenderd wordt
  response.redirect(303, '/berichten')
})

app.get('/berichten', async function (request, response) {

  // Filter eerst de berichten die je wilt zien, net als bij personen
  // Deze database wordt gedeeld door iedereen, dus verzin zelf een handig filter,
  // bijvoorbeeld je teamnaam, je projectnaam, je person ID, de datum van vandaag, etc..
  const params = {
    'filter[for]': 'demo-16-februari',
  }
  
  // Maak hiermee de URL aan, zoals we dat ook in de browser deden
  const apiURL = 'https://fdnd.directus.app/items/messages?' + new URLSearchParams(params)
  
  // En haal de data op, via een GET request naar Directus
  const messagesResponse = await fetch(apiURL)
  
  // Zet de JSON daarvan om naar een object
  const messagesResponseJSON = await messagesResponse.json()
  
  // Die we vervolgens doorgeven aan onze view
  response.render('messages.liquid', {
    messages: messagesResponseJSON.data
  })

})

app.post('/berichten', async function (request, response) {

  // Stuur een POST request naar de messages database
  // Een POST request bevat ook extra parameters, naast een URL
  await fetch('https://fdnd.directus.app/items/messages', {

    // Overschrijf de standaard GET method, want ook hier gaan we iets veranderen op de server
    method: 'POST',

    // Geef de body mee als JSON string
    body: JSON.stringify({
      // Dit is zodat we ons bericht straks weer terug kunnen vinden met ons filter
      for: 'demo-16-februari',
      // En dit is ons eerdere formulierveld
      text: request.body.message
    }),

    // En vergeet deze HTTP headers niet: hiermee vertellen we de server dat we JSON doorsturen
    // (In realistischere projecten zou je hier ook authentication headers of een sleutel meegeven)
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })

})