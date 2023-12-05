let audioContext = undefined
let gainNode = undefined
let compNode = undefined
let videoConnected = false
let mutationObserver = null

const videoListeners = new Map()

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

const outputNodeMap = new Map()

function getOutputNode(video) {
  let outputNode = outputNodeMap.get(video)

  if (outputNode === undefined) {
    const audioCtx = getAudioContext();
    compNode = new DynamicsCompressorNode(audioContext, INITIAL_COMP_PROPS)
    gainNode = new GainNode(audioContext, INITIAL_GAIN_PROPS)
    const source = new MediaElementAudioSourceNode(audioCtx, {
      mediaElement: video,
    })
    outputNode = {
      outputNode: source,
      destinationConnected: false,
      compressorConected: false,
    };
    outputNodeMap.set(video, outputNode)
  }

  return outputNode;
}

function connectVideo(video) {
  const nodeData = getOutputNode(video)

      // // Add the compressor node to the audio source
      // source.disconnect(audioCtx.destination);
      // source.connect(compressor);
      // compressor.connect(audioCtx.destination);

  const sourceNode = nodeData.outputNode; // source

  if (!nodeData.compressorConected) {
    const audioCtx = getAudioContext()
    // outputNode.disconnect(audioCtx.destination);
    // outputNode.connect(jungle.input);
    sourceNode.connect(compNode).connect(gainNode).connect(audioCtx.destination)
    nodeData.compressorConected = true
  }

  if (nodeData.destinationConnected) {
    const audioCtx = getAudioContext()
    sourceNode.disconnect(audioCtx.destination)
    nodeData.destinationConnected = false
  }
  videoConnected = true;
}

function disconnectVideo(video) {
  
  const audioCtx = getAudioContext()
  // // Remove the compressor node from the audio source
  // source.disconnect(compressor);
  // compressor.disconnect(audioCtx.destination);
  // source.connect(audioCtx.destination);
  
  const nodeData = getOutputNode(video)
  
  const sourceNode = nodeData.outputNode
  
  if (nodeData.compressorConected) {
    sourceNode.disconnect()
    compNode.disconnect()
    gainNode.disconnect()
    nodeData.compressorConected = false
  }

  if (!nodeData.destinationConnected) {
    sourceNode.connect(audioCtx.destination)
    nodeData.destinationConnected = true
  }

}

function disconnectAllVideos() {
  outputNodeMap.forEach((_nodeData, video) => {
    disconnectVideo(video)
  });

  videoListeners.forEach((listener, video) => {
    video.removeEventListener('playing', listener)
  });
  videoConnected = false
}


const changeVideo = (newVideoEl) => {
  connectVideo(newVideoEl)
}

const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2)


const listener = (videoEl) => {
  const listener = videoListeners.get(videoEl)
  if (listener === undefined) {
    const callback = () => {
      changeVideo(videoEl);
    };
    videoEl.addEventListener('playing', callback)
    videoListeners.set(videoEl, callback)
  }

  if (isVideoPlaying(videoEl)) {
    changeVideo(videoEl);
  }
}

function initVideoObservers() {
  mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes !== undefined && mutation.addedNodes !== null) {
        mutation.addedNodes.forEach(function(newVideoEl) {
          if (!(newVideoEl instanceof HTMLVideoElement)) {
            if (newVideoEl.querySelectorAll !== undefined) {
              newVideoEl.querySelectorAll('video').forEach((v) => {
                listener(v)
              })
            }
            return
          }
          listener(newVideoEl)
        })
      }
    })
  })

  const observerConfig = {
    childList: true,
    subtree: true,
  }

  const targetNode = document.body
  mutationObserver.observe(targetNode, observerConfig)

  videoEls = document.querySelectorAll('video')
  videoEls.forEach((v) => {
    if (v instanceof HTMLVideoElement) {
      listener(v)
    }
  })
}

const messageHandler = (request, sender, sendResponse) => {
  const handler = {
    [MESSAGES.get]: () => {
      const compProps = Object.keys(INITIAL_COMP_PROPS).reduce((acc, key) => {
        acc[key] = compNode?.[key]?.value ?? INITIAL_COMP_PROPS[key]
        return acc
      }, {})
      const response = {
        enabled: videoConnected,
        gain: gainNode?.gain?.value ?? INITIAL_GAIN_PROPS.gain,
        ...compProps
      }
      sendResponse(response)
    },
    [MESSAGES.turnOnSAL]: () => {
      if (request.enabled !== undefined && request.enabled !== null) {
        if (request.enabled) {
          initVideoObservers()
        } else if (!request.enabled && videoConnected) {
          if (mutationObserver !== undefined && mutationObserver !== null) {
            mutationObserver.disconnect()
            mutationObserver = null
          }
          disconnectAllVideos()
        }
      }
    },
    [MESSAGES.gain]: () => {
      sendResponse({
        gain: gainNode.gain.value
      })
      gainNode.gain.value = request.value
    },
    [MESSAGES.threshold]: () => {
      sendResponse({
        threshold: compNode.threshold.value
      })
      compNode.threshold.value = request.value
    },
    [MESSAGES.knee]: () => {
      sendResponse({
        knee: compNode.knee.value
      })
      compNode.knee.value = request.value
    },
    [MESSAGES.ratio]: () => {
      sendResponse({
        ratio: compNode.ratio.value
      })
      compNode.ratio.value = request.value
    },
    [MESSAGES.attack]: () => {
      sendResponse({
        attack: compNode.attack.value
      })
      compNode.attack.value = request.value
    },
    [MESSAGES.release]: () => {
      sendResponse({
        release: compNode.release.value
      })
      compNode.release.value = request.value
    },
    'default': () => {
      console.warn('No handler for this message!')
    }
  };
  return (handler[request.name] || handler['default'])();
}

chrome.runtime.onMessage.addListener(function(request, _sender, sendResponse) {
  messageHandler(request, _sender, sendResponse)
  return true
})