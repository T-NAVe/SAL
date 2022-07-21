// var tabAudio = new WeakMap()
// var state = {}
// var audioContext = {}
// var comp = {}
// var gain = {}
// var source = {}
// tabAudio.set(state, 'off')
// tabAudio.set(audioContext)
// tabAudio.set(source)
// tabAudio.set(comp)
// tabAudio.set(gain)

var audioContext = undefined
var source = undefined
var gain = undefined
var comp = undefined
var state = 'off'
var MEDIA_ELEMENT_NODES = new WeakMap();
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
// function analyzerInitialize() {
//   if (context == undefined) {
//     context = new AudioContext();
//   }
//   analyser = context.createAnalyser();
//   canvas = analyserElement;
//   ctx = canvas.getContext('2d');
//   if (MEDIA_ELEMENT_NODES.has(audio)) {
//     source = MEDIA_ELEMENT_NODES.get(audio);
//   } else {
//     source = context.createMediaElementSource(audio);
//     MEDIA_ELEMENT_NODES.set(audio, source);
//   }
//   source.connect(analyser);
//   analyser.connect(context.destination);
//   frameLooper()



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

// function initSalOnTab () {
//   tabAudio.set(state, 'on')
//   if(tabAudio.source){
//     tabAudio.get(audioContext).disconnect()
//     tabAudio.get(audioContext).close()
//     tabAudio = new WeakMap()
//   }
//   let element = document.querySelector("video");
//   console.log(element.src)
//  /*
// const audioCtx = new window.AudioContext();
// const audioElem = document.querySelector('audio');

// let options = {
//   mediaElement: audioElem
// }

// let source = new MediaElementAudioSourceNode(audioCtx, options);
// console.log(source.mediaElement);
//  */


//   console.log('element', element)
//   tabAudio.set(audioContext,new AudioContext())
//   tabAudio.set(source, new MediaElementAudioSourceNode(tabAudio.get(audioContext), {mediaElement: element}))
//   tabAudio.set(comp, new DynamicsCompressorNode(tabAudio.get(audioContext), {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25}))
//   tabAudio.set(gain, new GainNode(tabAudio.get(audioContext), {gain: 3}))
//   tabAudio.get(source).connect(tabAudio.get(gain)).connect(tabAudio.get(comp)).connect(tabAudio.get(audioContext).destination)
//   // tabAudio.get(audioContext).createMediaElementSource(element).connect(tabAudio.get(gain)).connect(tabAudio.get(comp)).connect(tabAudio.get(audioContext).destination)
//   // tabAudio.comp = new DynamicsCompressorNode(tabAudio.audioContext, {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25})
//   // tabAudio.gain = new GainNode(tabAudio.audioContext, {gain: 1.3})
//   // tabAudio.audioContext.createMediaElementSource(element).connect(tabAudio.gain).connect(tabAudio.comp).connect(tabAudio.audioContext.destination)

//   const config = { attributes: true, childList: true, subtree: true };
//   const callback = function(mutationList, observer) {
//     for(const mutation of mutationList) {
//         if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
//           //tabAudio.audioContext.mediaElementSource.disconnect()
//           tabAudio.get(source).disconnect()
//           tabAudio.get(audioContext).close()
//           tabAudio = new WeakMap()
//           tabAudio.set(audioContext,new AudioContext())
//           tabAudio.set(source, new MediaElementAudioSourceNode(tabAudio.get(audioContext), {mediaElement: element}))
//           tabAudio.set(comp, new DynamicsCompressorNode(tabAudio.get(audioContext), {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25}))
//           tabAudio.set(gain, new GainNode(tabAudio.get(audioContext), {gain: 3}))
//           tabAudio.get(source).connect(tabAudio.get(gain)).connect(tabAudio.get(comp)).connect(tabAudio.get(audioContext).destination)
//           // tabAudio.audioContext = new AudioContext()
//           // tabAudio.comp = new DynamicsCompressorNode(tabAudio.audioContext, {threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25})
//           // tabAudio.gain = new GainNode(tabAudio.audioContext, {gain: 1.3})
//           // tabAudio.audioContext.createMediaElementSource(element).connect(tabAudio.gain).connect(tabAudio.comp).connect(tabAudio.audioContext.destination)          

//         }
//     }
//   };
//   const observer = new MutationObserver(callback);

//   observer.observe(element, config)

//   //tabAudio.source.connect(tabAudio.gain).connect(tabAudio.comp).connect(tabAudio.audioContext.destination);
// }

/*
var audioCtx;
var analyserNode;
var audioSourceNode;   
 
var audioEle;
var wm = new WeakMap();
 
var firstFlag = true;
 
window.onload= function(){
  audioEle = document.getElementById('myAudio');
  audioEle.autoplay = true;
  audioEle.preload = 'auto'; 
}
 
function onAddFile(event) {
  var files;
  var reader = new FileReader();
  
  if(event.target.files){
    files = event.target.files;
  }else{ 
    files = event.dataTransfer.files;   
  }      
      
  reader.onload = function (event) {
    
    if(firstFlag){
      // AudioContextの生成
      audioCtx =  new AudioContext(); 
      firstFlag = false;     
    }    
      
    audioEle.onloadeddata = function (){ 
      
      if(audioSourceNode){
        audioSourceNode.disconnect();
      }          
      
      // WeakMapでHTMLMediaElementを管理する
      if (wm.has(audioEle)) { 
        audioSourceNode = wm.get(audioEle); 
      } else { 
        audioSourceNode = audioCtx.createMediaElementSource(audioEle); 
        wm.set(audioEle, audioSourceNode); 
      }      
      
      // AnalyserNodeの生成
      if(analyserNode){
        analyserNode.disconnect();
      }                
      analyserNode = audioCtx.createAnalyser();  
     
      audioSourceNode.connect(analyserNode);    
      analyserNode.connect(audioCtx.destination);
    };    
      
    audioEle.onerror = function (e) {
      alert("このファイルは読み込めません。");
    }  
        
    audioEle.src = reader.result;       
  };
  
  if (files[0]){    
    reader.readAsDataURL(files[0]); 
  }
}      
*/

//NOT WORKING
 async function disposeTab (tabId) {
  if (tabId in tabs) {
    (await tabs[tabId]).audioContext.close()
    delete tabs[tabId]
  }
}

//NOT WORKING

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