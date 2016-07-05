import seneca from 'seneca'
import test from 'tape'

const client = seneca().client()

test("can wipe the db", t => {
	client.act({
		role: 'firebase',
		cmd: 'nuke',
	}, (err,result) => {
		t.end()
	})
})

test("can push a new record", t => {
	client.act({
		role: 'firebase',
		cmd: 'create',
		model: 'Foo',
		values: {
			name: 'Bob',
			color: 'blue',
		}
	}, (err,result) => {
		console.log('result', result)
		t.equal(result.name, 'Bob')
		t.end()
	})
})

test("can push another", t => {
	client.act({
		role: 'firebase',
		cmd: 'create',
		model: 'Foo',
		values: {
			name: 'Angus',
			color: 'green',
		}
	}, (err,result) => {
		console.log('result', result)
		t.equal(result.name, 'Angus')
		t.end()
	})
})

test("and another", t => {
	client.act({
		role: 'firebase',
		cmd: 'create',
		model: 'Foo',
		values: {
			name: 'Fred',
			color: 'blue',
		}
	}, (err,result) => {
		console.log('result', result)
		t.equal(result.name, 'Fred')
		t.end()
	})
})

test("gets a list", t => {
	client.act({
		role: 'firebase',
		cmd: 'query',
		model: 'Foo',
		queryParams: {
			orderByChild: 'color',
			equalTo: 'blue',
		}
	}, (err,result) => {
		console.log('result', result)
		t.equal(result.rows.length, 2, 'should have 2 rows')
		t.end()
	})
})