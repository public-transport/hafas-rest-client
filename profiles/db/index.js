'use strict'

const products = require('./products')

const dbProfile = {
	locale: 'de-DE',
	timezone: 'Europe/Berlin',
	endpoint: 'https://dbahn.demo.hafas.de/streckenagent/restproxy/latest/',
	products: products,
}

module.exports = dbProfile
