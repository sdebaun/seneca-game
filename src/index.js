import echo from './echo-async'
import firebase from './seneca-firebase'
// import Firebase from 'firebase'
const Firebase = require('firebase')
Firebase.initializeApp({
    databaseURL: "https://seneca-game.firebaseio.com",
    serviceAccount: "seneca-game-dfecdf9d6da7.json",
})

const seneca = require('seneca-await')()

seneca
.use(echo, {pattern: {role: 'foo', cmd: 'baz'}, props: ['model', 'key']})
.use(firebase, {
	firebase: Firebase.database().ref(),
})
.listen()
.ready(() => {
	console.log(seneca.list())
})

