let audioContext = undefined
let source = undefined
let gain = undefined
let comp = undefined
let state = 'off'
let MEDIA_ELEMENT_NODES = new WeakMap();
console.log('CONTENT EXECUTED')
//a good idea coud be that instead of recieving the order fromt the popup, i could just use the player itself and add a button to handle this.
const messageHandler = (request, sender, sendResponse) => {
  console.log('request', request)
  const handler = {
    'turn-on-sal': () => {
      console.log('SAL is on')
      initSalOnTab(request.tabId)
    },
    'volume': () => {
      sendResponse({
        gain: gain.gain.value
      })
      gain.gain.value = request.value
    },
    'default': () => {
      return 'Default';
    }
  };
  return (handler[request.name] || handler['default'])();
}


chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  messageHandler(request, sender, sendResponse)
})


function initSalOnTab(tabId) {
 
  //youd do only if off
  if(audioContext === undefined) {
    audioContext = new AudioContext()
  }
  //on prime video should be videos[1] coz the first one is a trailer
  let element = document.querySelector('video')

  comp = new DynamicsCompressorNode(audioContext, {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25})
  gain = new GainNode(audioContext, {gain: 1.3})
  if(MEDIA_ELEMENT_NODES.has(element)) {
    source = MEDIA_ELEMENT_NODES.get(element)
  }else{
    source = audioContext.createMediaElementSource(element)
    MEDIA_ELEMENT_NODES.set(element, source)
  }
  //so i added this but idk if it works.
  //the jist of it is that chrome does not want to let go of the sourceNode that easy
  //in theory using a weakmap would be a good idea as a work arround, but is not entirely working
  MEDIA_ELEMENT_NODES.get(element).connect(comp).connect(gain).connect(audioContext.destination)

  state = 'on'
  const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationList, observer) {
    for(const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          //works on youtube for some reason, but not in netflix, for the time being i should add condition to set off on netflix
          // on netflix the problem we get is that supposedly the video is not loaded yet or something like that
          // since it returns that the HTMLmediaElement is not valid. Meaby with a timeout?...
          let element = document.querySelector('video')

          // comp = new DynamicsCompressorNode(audioContext, {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25})
          // gain = new GainNode(audioContext, {gain: 1.3})
          if(MEDIA_ELEMENT_NODES.has(element)) {
            source = MEDIA_ELEMENT_NODES.get(element)
          }else{
            source = audioContext.createMediaElementSource(element)
            MEDIA_ELEMENT_NODES.set(element, source)
          }
          MEDIA_ELEMENT_NODES.get(element).connect(comp).connect(gain).connect(audioContext.destination)
        }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(element, config)

}


//NOT WORKING, KEEPING IT FOR REFERENCE
 async function disposeTab (tabId) {
  if (tabId in tabs) {
    (await tabs[tabId]).audioContext.close()
    delete tabs[tabId]
  }
}

//NOT WORKING, KEEPING IT FOR REFERENCE

 function captureTab (tabId) {
  tabs[tabId] = new Promise(async resolve => {
    const stream = await chrome.tabCapture.capture({ audio: true, video: false })

    const audioContext = new AudioContext()
    const streamSource = audioContext.createMediaStreamSource(stream)
    const gainNode = audioContext.createGain()
    const compressorNode = audioContext.createDynamicsCompressor()
    compressorNode.threshold.value = -50
    compressorNode.knee.value = 40
    compressorNode.ratio.value = 12
    compressorNode.attack.value = 0
    compressorNode.release.value = 0.25
    gainNode.gain.value = 1.3
    streamSource.connect(gainNode)
    streamSource.connect(compressorNode)
    compressorNode.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // compressorNode.connect(audioContext.destination)
    // streamSource.connect(gainNode)
    // gainNode.connect(audioContext.destination)

    resolve({ audioContext, streamSource, gainNode })
  })
}