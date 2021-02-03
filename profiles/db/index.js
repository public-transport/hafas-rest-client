'use strict'

const products = require('./products')

const dbProfile = {
	locale: 'de-DE',
	timezone: 'Europe/Berlin',
	endpoint: 'https://db-streckenagent.hafas.de/restproxy/',
	products: products,
}

module.exports = dbProfile
