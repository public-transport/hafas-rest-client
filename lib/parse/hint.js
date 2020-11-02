'use strict'

const omit = require('lodash/omit')
// todo: get the original parseHint differently
const _parseHint = require('hafas-client/parse/hint')

const parseHint = (ctx, hint) => {
	return _parseHint(ctx, {
		...omit(hint, ['value']),
		code: hint.key,
		// todo: what is the difference between value and textN? there seem to be "empty"
		// hints which have a value but no textN, where value will just be something
		// like "Information" without any further information
		// txtN: hint.value,
		// todo: map hint.routeIdxFrom & hint.routeIdxTo
	})
}

module.exports = parseHint
