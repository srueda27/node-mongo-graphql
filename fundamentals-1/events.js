const EventEmitter = require('events');

const celebrity = new EventEmitter();

//Subscribe to celebrity for Observer 1
celebrity.on('race win', function callbackFunction() {
  console.log('Congratulations! You are the best');
})

//Subscribe to celebrity for Observer 2
celebrity.on('race win', function callbackFunction2() {
  console.log('Boooo');
})

celebrity.emit('race win')

console.log('--------')

//Subscribe to celebrity for Observer 1
celebrity.on('race', function callbackFunction(result) {
  if (result == 'win') {
    console.log('Congratulations! You are the best');
  }
})

//Subscribe to celebrity for Observer 2
celebrity.on('race', function callbackFunction2(result) {
  if (result == 'win' ) {
    console.log('Boooo');
  }
})

//Will act on race event but process only the win result
celebrity.emit('race', 'win')
