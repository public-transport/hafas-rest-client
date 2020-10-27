'use strict'

const request = require('./request')
const errors = require('./errors')

const parsePlatform = require('hafas-client/parse/platform')

const parseWhen = require('./parse/when')
const parseLine = require('./parse/line')
const parsePolyline = require('./parse/polyline')
const parseHint = require('./parse/hint')
const parseJourney = require('./parse/journey')
const parseJourneyLeg = require('./parse/journey-leg')
const parseStopover = require('./parse/stopover')
const parseLocation = require('./parse/location')
const parseArrivalOrDeparture = require('./parse/arrival-or-departure')
const parseTrip = require('./parse/trip')

const formatLocation = require('hafas-client/format/location')
const formatStation = require('hafas-client/format/station')
const formatPoi = require('hafas-client/format/poi')
const formatAddress = require('hafas-client/format/address')
const formatProductsFilter = require('hafas-client/format/products-filter')

const formatDate = require('./format/date')
const formatTime = require('./format/time')

const id = (ctx, x) => x

const defaultProfile = {
	request,
	errors,
	transformReq: id,

	parsePlatform,
	parseWhen,
	parseTrip,
	parseJourneyLeg,
	parseJourney,
	parseLine,
	parseStationName: id,
	parseLocation,
	parsePolyline,
	parseHint,
	parseStopover,
	parseArrivalOrDeparture,

	formatDate,
	formatTime,
	formatLocation,
	formatStation,
	formatPoi,
	formatAddress,
	formatProductsFilter,
}

module.exports = defaultProfile
