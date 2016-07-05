import {curry, pipe, toPairs, map, reduce} from 'ramda'

export default function({firebase}) {
	this.add({role: 'firebase', cmd: 'fetch'}, curry(fetch)(firebase))
	this.add({role: 'firebase', cmd: 'create'}, curry(create)(firebase))
	this.add({role: 'firebase', cmd: 'query'}, curry(list)(firebase))
	this.add({role: 'firebase', cmd: 'update'}, curry(update)(firebase))
	this.add({role: 'firebase', cmd: 'nuke'}, curry(nuke)(firebase))
	// this.add({init: 'firebase'}, init)
	return 'firebase'
}

export function init({firebase, token}, respond) {
	console.log('Authenticating Firebase...')
	firebase.authWithCustomToken(token.trim(), err => {
		console.log('...authenticated Firebase!')
		respond(err, {})
	})
}

export async function nuke(firebase, msg) {
	firebase.remove()
	return {nuked: true}
}

export async function fetch(firebase, {model, key}) {
	const snap = await firebase.child(model).child(key).once('value')
	return {key, ...snap.val()}
}

export async function create(firebase, {model, values}) {
	const ref = firebase.child(model).push(values)
	return {key: ref.key, ...values}
}

export const defluentPair = (ref, [key, val]) => ref[key](val)

export const query = (ref, queryParams) => reduce(defluentPair, ref, toPairs(queryParams))

export const toRows = pipe(toPairs, map(([key,vals]) => {return {key, ...vals}}))

export async function list(firebase, {model, queryParams}) {
	const snap = await query(firebase.child(model), queryParams).once('value')
	return {rows: toRows(snap.val())}
}

export async function update(firebase, {model, key, values}) {
	await firebase.child(model).child(key).update(values)
	return {key, ...values}
}