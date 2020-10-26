'use strict'

// todo: get the original parseWhen differently
const _parseWhen = require('hafas-client/parse/when')
const parseDateTime = require('hafas-client/parse/date-time')

const parseWhen = (ctx, date, rtDate, time, rtTime, tzOffset, cncl = false) => {
	// todo: compute `rtTime` offset using `rtDate`
	date = rtDate || date
	if (date) date = date.replace(/-/g, '')
	if (time) time = time.replace(/:/g, '')
	if (rtTime) rtTime = rtTime.replace(/:/g, '')
	return _parseWhen({ ...ctx, profile: { ...ctx.profile, parseDateTime } }, date, time, rtTime, tzOffset, cncl)
}

module.exports = parseWhen
