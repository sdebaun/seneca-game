import {stub} from 'sinon'

export function mockSnapshot(result) {
	return {
		val: stub().returns(result)
	}
}

export function mockQuery(result) {
	return {
		once: stub().returns(mockSnapshot(result)),
		orderByChild: stub().returnsThis(),
		equalTo: stub().returnsThis(),
	}
}

export function mockFirebase(result) {
	return {
		child: stub().returnsThis(),
		once: stub().returns(mockSnapshot(result)),
		push: stub().returnsThis(),
		update: stub().returnsThis(),
		key: 'AUTOGEN_KEY',
		orderByChild: stub().returns(mockQuery(result)),
		equalTo: stub().returns(mockQuery(result)),
	}
}
