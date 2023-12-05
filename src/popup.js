const $ = document.querySelector.bind(document)
const turnOnSAL = $('#turnOnSAL') 
const gain = $('#gain')
const threshold = $('#threshold')
const knee = $('#knee')
const ratio = $('#ratio')
const attack = $('#attack')
const release = $('#release')

function sendMessage(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
    const tab = tabs[0]
    chrome.tabs.sendMessage(tab.id, message, callback)
  });
};

turnOnSAL.addEventListener("change", async (event) => {
  sendMessage({name: MESSAGES.turnOnSAL, enabled: turnOnSAL.checked})
})

gain.addEventListener('input', function(event){
  showVal(event, event.target.value)
  sendMessage({name: MESSAGES.gain, value: event.target.value})
})

gain.addEventListener('dblclick', function(event){
  handleDoubleClick(event, MESSAGES.gain)
})

threshold.addEventListener('input', function(event){
  showVal(event, event.target.value)
  sendMessage({name: MESSAGES.threshold, value: event.target.value})
})

threshold.addEventListener('dblclick', function(event){
  handleDoubleClick(event, MESSAGES.threshold)
})

knee.addEventListener('input', function(event){
  showVal(event, event.target.value)
  sendMessage({name: MESSAGES.knee, value: event.target.value})
})

knee.addEventListener('dblclick', function(event){
  handleDoubleClick(event, MESSAGES.knee)
})

ratio.addEventListener('input', function(event){
  showVal(event, event.target.value)
  sendMessage({name: MESSAGES.ratio, value: event.target.value})
})

ratio.addEventListener('dblclick', function(event){
  handleDoubleClick(event, MESSAGES.ratio)
})

attack.addEventListener('input', function(event){
  showVal(event, event.target.value)
  sendMessage({name: MESSAGES.attack, value: event.target.value})
})

attack.addEventListener('dblclick', function(event){
  handleDoubleClick(event, MESSAGES.attack)
})

release.addEventListener('input', function(event){
  showVal(event, event.target.value)
  sendMessage({name: MESSAGES.release, value: event.target.value})
})

release.addEventListener('dblclick', function(event){
  handleDoubleClick(event, MESSAGES.release)
})

function formatNumber(value, step){
  if (typeof value !== 'number') return value
  const decimal = step.includes('.') ? step.toString().split('.')[1].length : 0
  const formatedValue = decimal !== 0 ? value.toFixed(decimal) : value
  return formatedValue
}

function showVal(event, value) {
  const step = event.target.step
  event.target.parentNode.querySelector('output').innerHTML = formatNumber(value, step)
}

function handleDoubleClick(event, name) {
  const value = name === MESSAGES.gain ? INITIAL_GAIN_PROPS.gain : INITIAL_COMP_PROPS[name.toLowerCase()]
  event.target.value = value
  showVal(event, value)
  sendMessage({name: name, value: value})
}

// on document ready load the current values by sending message GET
document.addEventListener('DOMContentLoaded', function() {
  sendMessage({name: MESSAGES.get}, function(response) {
    console.log('response', response)
    turnOnSAL.checked = response.enabled
    gain.value = response.gain
    showVal({target: gain}, response.gain)
    threshold.value = response.threshold
    showVal({target: threshold}, response.threshold)
    knee.value = response.knee
    showVal({target: knee}, response.knee)
    ratio.value = response.ratio
    showVal({target: ratio}, response.ratio)
    attack.value = response.attack
    showVal({target: attack}, response.attack)
    release.value = response.release
    showVal({target: release}, response.release)
  })
})