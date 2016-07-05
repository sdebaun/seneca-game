import test from 'tape'
import {mockFirebase} from './mocks'

import {fetch, create, list, toRows, query, update} from './index.js'

const FIXTURE_SINGLE = {
	test: 'data'
}

const FIXTURE_QUERY = {
	'1234': {
		name: 'foo',
	},
	'5678': {
		name: 'bar',
	}
}

test("can fetch a single record", t => {
	const firebase = mockFirebase(FIXTURE_SINGLE)
	fetch(firebase, {model: 'Foo', key: '1234'}).then(result => {
		t.equal(firebase.child.callCount, 2, 'makes two calls to firebase child');
		t.equal(firebase.child.getCall(0).args[0], 'Foo', 'gets the Foo child')
		t.equal(firebase.child.getCall(1).args[0], '1234', 'gets the key child')
		t.equal(result.key, '1234', 'gets the proper key')
		t.equal(result.test, FIXTURE_SINGLE.test, 'gets expected object data')
		t.end();
	})
});

test("can create a single record", t => {
	const firebase = mockFirebase(FIXTURE_SINGLE)
	create(firebase, {model: 'Foo', values: {test: 'data'}}).then(result => {
		t.equal(firebase.child.callCount, 1, 'makes one calls to firebase child');
		t.equal(firebase.child.getCall(0).args[0], 'Foo', 'gets the Foo child')
		t.equal(result.key, 'AUTOGEN_KEY', 'gets the proper key')
		t.equal(result.test, FIXTURE_SINGLE.test, 'gets expected object data')
		t.end();
	})
})

test("can update at a specific key", t => {
	const firebase = mockFirebase(FIXTURE_SINGLE)
	update(firebase, {model: 'Foo', key: '1234', values: FIXTURE_SINGLE}).then(result => {
		t.equal(firebase.child.callCount, 2, 'makes two calls to firebase child');
		t.equal(firebase.child.getCall(0).args[0], 'Foo', 'gets the Foo child')
		t.equal(firebase.child.getCall(1).args[0], '1234', 'gets the key child')
		t.equal(firebase.update.getCall(0).args[0].test, FIXTURE_SINGLE.test, 'sets test data correctly')
		t.equal(result.key, '1234', 'gets the proper key')
		t.equal(result.test, FIXTURE_SINGLE.test, 'gets expected object data')
		t.end();
	})
	.catch(err => console.log(err))
})

test("can get a list filtered by orderByChild and equalTo", t => {
	const firebase = mockFirebase(FIXTURE_QUERY)
	list(firebase, {model: 'Foo', queryParams: {orderByChild: 'color', equalTo: 'blue'}}).then(result => {
		t.equal(firebase.child.callCount, 1, 'makes one calls to firebase child');
			t.equal(firebase.child.getCall(0).args[0], 'Foo', 'gets the Foo child')
		t.equal(result.rows.length, 2, 'should have two rows')
		t.end();
	})
})

test("make orderByChild query", t => {
	const firebase = mockFirebase()
	const result = query(firebase, {orderByChild: 'color', equalTo: 'blue'})
	t.equal(firebase.orderByChild.callCount, 1, 'called orderByChild')
	t.equal(firebase.orderByChild.getCall(0).args[0], 'color', 'with color')
	t.equal(firebase.orderByChild().equalTo.callCount, 1, 'called equalTo')
	t.equal(firebase.orderByChild().equalTo.getCall(0).args[0], 'blue', 'with blue')
	t.end()
})

test("toRows", t => {
	const result = toRows(FIXTURE_QUERY)
	t.equal(result[0].key, '1234', 'first record has expected key')
	t.equal(result[0].name, 'foo', 'has expected name')
	t.equal(result[1].key, '5678', 'second has expected key')
	t.equal(result[1].name, 'bar', 'has expected name')
	t.end()
})
