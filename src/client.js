const client = require('seneca')().client()

client.act({
	role: 'foo',
	cmd: 'baz',
	model: 'Foo',
	key: '1234bar',
}, console.log)
