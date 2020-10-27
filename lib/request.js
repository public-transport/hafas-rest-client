const DEBUG = process.env.DEBUG === 'hafas-rest-client'

const Promise = require('pinkie-promise')
const { fetch } = require('fetch-ponyfill')({ Promise })
const { stringify } = require('qs')
const { parse: parseContentType } = require('content-type')
const findInTree = require('./find-in-tree')
const randomizeUserAgent = require('./randomize-user-agent')
const errorsByCode = require('./errors')

const request = async (ctx, token, userAgent, method, query = {}) => {
	const { profile, opt } = ctx
	query = {
		lang: opt.language || 'en',
		...query,
		format: 'json',
	}
	if (DEBUG) console.error(JSON.stringify(query))

	const url = profile.endpoint + method + '?' + stringify({ ...query, accessId: token })
	const fetchCfg = profile.transformReq(ctx, {
		headers: {
			'accept-encoding': 'gzip, br, deflate',
			accept: 'application/json',
			'user-agent': randomizeUserAgent(userAgent),
		},
		redirect: 'follow',
	})
	const res = await fetch(url, fetchCfg)

	const cTypeHeader = res.headers.get('content-type')
	const { type: cType } = cTypeHeader ? parseContentType(cTypeHeader) : {}
	const asJSON = cType === 'application/json'
	const body = asJSON ? await res.json() : await res.text()
	if (DEBUG) console.error(asJSON ? JSON.stringify(body) : body)

	if (!res.ok) {
		// todo: parse HTML error messages
		let err = new Error(res.statusText)
		if (asJSON) {
			const { errorCode, errorText } = body
			if (errorCode && errorsByCode[errorCode]) {
				Object.assign(err, errorsByCode[errorCode])
				err.hafasErrorCode = errorCode
				if (errorText) err.hafasErrorMessage = errorText
			} else {
				err = new Error(errorText)
				err.code = errorCode
			}
		} else if (body) err = new Error(body)

		err.statusCode = res.status
		err.endpoint = profile.endpoint
		err.url = url
		err.query = query
		err.fetchCfg = fetchCfg
		throw err
	}

	// todo: sometimes it returns a body without any data
	// e.g. `location.nearbystops` with an invalid `type`

	const mapping = {
		'**.Stops.Stop': 'stops',
		'**.Names.Name': 'products',
		'**.Directions.Direction': 'directions',
		'**.JourneyDetailRef.ref': 'ref',
		'**.Notes.Note': 'notes',
		'**.LegList.Leg': 'legs',
		'**.ServiceDays[0]': 'serviceDays',
		'**.Product[0]': 'product',
	}

	const allMatches = findInTree(Object.keys(mapping))(body)
	for (const [needle, matches] of Object.entries(allMatches)) {
		const newKey = mapping[needle]

		for (const [item, parents] of matches) {
			const grandParent = parents[1]
			grandParent[newKey] = item
		}
	}

	return { profile, opt, res: body }
}

module.exports = request
