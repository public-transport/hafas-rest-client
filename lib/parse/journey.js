'use strict'

const parseJourney = (ctx, j) => { // j = journey
	const { profile, opt } = ctx

	const res = {
		type: 'journey',
		legs: j.legs.map(leg => profile.parseJourneyLeg(ctx, leg)),
		refreshToken: j.ctxRecon || null,
		// todo: cycle
	}

	// todo!
	// if (opt.scheduledDays && j.serviceDays) {
	// 	// todo: year
	// 	res.scheduledDays = profile.parseScheduledDays(ctx, j.serviceDays.sDaysB, year)
	// }

	if (opt.remarks && Array.isArray(j.notes)) {
		res.remarks = j.notes.map(h => profile.parseHint(ctx, h)).filter(Boolean)
	}

	return res
}

module.exports = parseJourney
