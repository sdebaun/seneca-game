import {curry, pick, identity} from 'ramda'

export default function({pattern, props}) {
	this.add(pattern, curry(echo)(pattern, props ? pick(props) : identity))
	return 'echo'
}

async function echo(pattern, lens, msg) {
	console.log('ECHO/SERVER', pattern, lens(msg))
	return {response: 'ECHO/CLIENT', pattern, msg: lens(msg)}
}

