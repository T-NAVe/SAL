var MESSAGES = Object.freeze({
  turnOnSAL: 'TURN_ON_SAL',
  gain: 'GAIN',
  threshold: 'THRESHOLD',
  knee: 'KNEE',
  ratio: 'RATIO',
  attack: 'ATTACK',
  release: 'RELEASE',
  get: 'GET'
})


var INITIAL_COMP_PROPS = Object.freeze({
  threshold: -50,
  knee: 40,
  ratio: 12,
  attack: 0,
  release: 0.25
})
var INITIAL_GAIN_PROPS = Object.freeze({
  gain: 1.3
})