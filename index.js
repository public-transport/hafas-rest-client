'use strict'

const defaultProfile = require('./lib/default-profile')
const request = require('./lib/request')

const isNonEmptyString = str => typeof str === 'string' && str.length > 0

const createRestClient = (profile, token, userAgent) => {
	profile = Object.assign({}, defaultProfile, profile)

	profile = {
		...defaultProfile,
		...profile,
	}
	if (!isNonEmptyString(profile.endpoint)) throw new Error('missing profile.endpoint')
	if (!isNonEmptyString(token)) throw new Error('missing token')
	if (!isNonEmptyString(userAgent)) throw new Error('missing userAgent')

	const journeys = async (origin, destination, opt = {}) => {
		if (('earlierThan' in opt) && ('laterThan' in opt)) {
			throw new TypeError('opt.earlierThan and opt.laterThan are mutually exclusive.')
		}
		if (('departure' in opt) && ('arrival' in opt)) {
			throw new TypeError('opt.departure and opt.arrival are mutually exclusive.')
		}
		let journeysRef = null
		if ('earlierThan' in opt) {
			if (!isNonEmptyString(opt.earlierThan)) {
				throw new TypeError('opt.earlierThan must be a non-empty string.')
			}
			if (('departure' in opt) || ('arrival' in opt)) {
				throw new TypeError('opt.earlierThan and opt.departure/opt.arrival are mutually exclusive.')
			}
			journeysRef = opt.earlierThan
		}
		if ('laterThan' in opt) {
			if (!isNonEmptyString(opt.laterThan)) {
				throw new TypeError('opt.laterThan must be a non-empty string.')
			}
			if (('departure' in opt) || ('arrival' in opt)) {
				throw new TypeError('opt.laterThan and opt.departure/opt.arrival are mutually exclusive.')
			}
			journeysRef = opt.laterThan
		}

		opt = {
			results: null, // number of journeys – `null` means "whatever HAFAS returns"
			stopovers: false, // return stations on the way?
			transfers: -1, // maximum of 5 transfers
			transferTime: null, // minimum time for a single transfer in minutes
			polylines: false, // return leg shapes?
			remarks: true, // parse & expose hints & warnings?
			// Consider walking to nearby stations at the beginning of a journey?
			startWithWalking: true,
			// scheduledDays: false
			...opt,
		}

		const query = {
			// todo: via, viaWaitTime, avoid, changeTimePercent, addChangeTime,
			// products (!), context (!), originWalk, -Bike, bikeCarriage, sleepingCar,
			// couchetteCoach, includeEarlier (!)
			originId: profile.formatLocation(profile, origin, 'origin').lid,
			destId: profile.formatLocation(profile, destination, 'destination').lid,
			poly: opt.polylines ? 1 : 0,
			passlist: opt.stopovers ? 1 : 0,
			showPassingPoints: 0, // return pass-by stopovers
			products: profile.formatProductsFilter({ profile }, opt.products || {}).value,
			eco: 0,
			originWalk: opt.startWithWalking ? 1 : 0,
			destWalk: 1,
			rtMode: 'FULL', // todo: make customisable?, see https://pastebin.com/qZ9WS3Cx
			// "take additional stations nearby the given start and destination station into account"
			unsharp: 1,
		}
		if (opt.transferTime !== null) query.minChangeTime = opt.transferTime
		if (opt.transfers >= 0) query.maxChange = opt.transfers
		if (opt.results !== null) query.numF = opt.results // todo: what about numB?

		let when
		if (opt.departure !== undefined && opt.departure !== null) {
			when = new Date(opt.departure)
			if (Number.isNaN(+when)) throw new TypeError('opt.departure is invalid')
		} else if (opt.arrival !== undefined && opt.arrival !== null) {
			when = new Date(opt.arrival)
			if (Number.isNaN(+when)) throw new TypeError('opt.arrival is invalid')
			query.searchForArrival = 1
		}
		if (when) {
			query.date = profile.formatDate({ profile, opt }, when)
			query.time = profile.formatTime({ profile, opt }, when)
		}
		if (journeysRef) {
			query.context = journeysRef
		}

		const ctx = await request({ profile, opt }, token, userAgent, 'trip', query)
		// todo: ctx.res.planRtTs
		return {
			journeys: ctx.res.Trip.map(t => profile.parseJourney(ctx, t)),
			earlierRef: ctx.res.scrB,
			laterRef: ctx.res.scrF,
		}
	}

	const refreshJourney = async (refreshToken, opt = {}) => {
		if (typeof refreshToken !== 'string' || !refreshToken) {
			throw new TypeError('refreshToken must be a non-empty string.')
		}

		opt = {
			stopovers: false, // return stations on the way?
			polylines: false, // return leg shapes?
			remarks: true, // parse & expose hints & warnings?
			...opt,
		}

		const query = {
			ctx: refreshToken,
			poly: opt.polylines ? 1 : 0,
			passlist: opt.stopovers ? 1 : 0,
			showPassingPoints: 0, // return pass-by stopovers
			eco: 0,
			rtMode: 'FULL', // todo: is this required here?
		}

		const ctx = await request({ profile, opt }, token, userAgent, 'recon', query)
		// todo: ctx.res.planRtTs
		return ctx.res.Trip[0] ? profile.parseJourney(ctx, ctx.res.Trip[0]) : null
	}

	const dataInfo = async () => {
		const ctx = await request({ profile, opt: {} }, token, userAgent, 'datainfo')
		return ctx.res
	}

	const client = {
		journeys,
		refreshJourney,
		dataInfo,
	}
	Object.defineProperty(client, 'profile', { value: profile })
	return client
}

module.exports = createRestClient
