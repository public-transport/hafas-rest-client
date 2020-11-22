'use strict'

const createClient = require('../..')
const profile = require('.')

const TOKEN = process.env.TOKEN
if (!TOKEN) throw new Error('missing TOKEN env var')

/* eslint-disable no-unused-vars */

const {
	journeys, refreshJourney, trip, dataInfo,
} = createClient(profile, TOKEN, 'hafas-rest-client example')

const berlinOstkreuz = '8011162'
const berlinSchönefeld = '8010109'
const berlinWestkreuz = '8089047'
const berlinMesseSüd = '8089328'
const berlinYorckstrS1 = '8089051'
const frankfurtHbf = '8000105'
const somewhereInBerlin = { type: 'location', address: 'foo', latitude: 52.51072, longitude: 13.37793 }

journeys(frankfurtHbf, somewhereInBerlin, {
	results: 1,
	// products: {
	// 	nationalExpress: false,
	// 	national: false,
	// 	regionalExpress: false,
	// 	regional: false,
	// 	suburban: false,
	// 	bus: false,
	// },
	// transfers: 0,
	stopovers: false,
	language: 'de',
})
// .then(journeys => journeys.flatMap(j => [...j.legs, '---']))
// .then(({ journeys }) => refreshJourney(journeys[0].refreshToken, { language: 'de', stopovers: false }))
	.then(({ journeys }) => trip(journeys[0].legs.find(l => Boolean(l.tripId)).tripId, { language: 'de' }))

// dataInfo()
	.then(data => console.log(require('util').inspect(data, { depth: null, colors: true })))
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
