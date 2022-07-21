// Initialize buttons
const turnOnSAL = document.getElementById("turnOnSAL")
const volume = document.getElementById('volume')
const threshold = document.getElementById('threshold')
const knee = document.getElementById('knee')
const ratio = document.getElementById('ratio')
const attack = document.getElementById('attack')
const release = document.getElementById('release')


volume.addEventListener('input', function(event){
  showVal(event.target.value)
  console.log(event.target.value)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {name: 'volume', value: event.target.value}, function(response) {
      console.log('response', response)
    })
  })
})


// When the button is clicked, inject content.js into current page
turnOnSAL.addEventListener("input", async (event) => {
  console.log('event', event)
  console.log('click')
  const tabId = await getActiveTabId()
  // chrome.tabCapture.getMediaStreamId((streamId)=>{
  //   console.log('streamId', streamId)
  //   const message = { name: 'turn-on-sal', tabId , streamId }
  //   turnOnSal(message)
  // })
  // chrome.scripting.executeScript(
  //   {
  //     target: { tabId },
  //     files: ["src/content.js"],
  //   },
  //   () => {
  //    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //       chrome.tabs.sendMessage(tabId, {name: 'turn-on-sal'}, function(response) {
  //         console.log('response', response)
  //       })
  //     //})
  //   }
  // )
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {name: 'turn-on-sal', tabId: tabs[0].id }, function(response) {
      console.log('response', response)
    })
  })
})

// function turnOnSal (message) {
//   console.log('turnOnSal', message)
//   chrome.runtime.sendMessage(message)
// }

async function getActiveTabId () {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return activeTab.id
}
function showVal(value){
  document.getElementById("valBox").innerHTML=value;
}

/**
 * Hide & Show Basic Properties 0.1
 */
function myFunction() {
  console.log('myFunction')
  let x = document.getElementById("advanced__options");
  if (x.style.display === "none") {
    x.style.display = "block";
    x.style.transition = "all 0.3s ease-in;"
  } else {
    x.style.display = "none";
  }
}

