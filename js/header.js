'use strict';

function makeReadOnlyProperty(obj, prop, value) {
	Object.defineProperty(obj, prop, {
		value: value,
		writable: false
	});
}

function keyItemsByProp(prop, items) {
	return items.reduce((reduction, item) => {
		reduction[item[prop]] = item;
		return reduction;
	}, {});
}