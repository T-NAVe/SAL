var tabAudio ={
  audioContext: null,
  source : null,
  comp : null,
  gain : null,
  state: 'off'
}

const messageHandler = (request, sender, sendResponse) => {
  const handler = {
    'turn-on-sal': () => {
      console.log('SAL is on')
      initSalOnTab()
    },
    'volume': () => {
      sendResponse({
        gain: tabAudio.gain.gain.value
      })
      tabAudio.gain.gain.value = request.value
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


function initSalOnTab () {
  tabAudio.state = 'on'
  console.log('SAL IS INITIALIZED')
  if(tabAudio.source){
    tabAudio.source.disconnect()
  }
  let element = document.querySelector("video");
  console.log('element', element)
  tabAudio.audioContext = new AudioContext()
  tabAudio.comp = new DynamicsCompressorNode(tabAudio.audioContext, {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25})
  tabAudio.gain = new GainNode(tabAudio.audioContext, {gain: 1.3});
  tabAudio.audioContext.createMediaElementSource(element).connect(tabAudio.gain).connect(tabAudio.comp).connect(tabAudio.audioContext.destination);

  //tabAudio.source.connect(tabAudio.gain).connect(tabAudio.comp).connect(tabAudio.audioContext.destination);
}


//NOT WORKING
/**
 * Removes the tab from `tabs` object and closes its AudioContext.
 * This function gets called when a tab is closed.
 * @param tabId Tab ID
 */
 async function disposeTab (tabId) {
  if (tabId in tabs) {
    (await tabs[tabId]).audioContext.close()
    delete tabs[tabId]
  }
}

//NOT WORKING
/**
 * Captures a tab's sound, allowing it to be programmatically modified.
 * Puts a promise into the `tabs` object. We only need to call this function
 * if the tab isn't yet in that object.
 * @param tabId Tab ID
 */
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