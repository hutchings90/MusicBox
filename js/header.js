'use strict';

function makeReadOnlyProperty(obj, prop, value) {
	Object.defineProperty(obj, prop, {
		value: value,
		writable: false
	});
}