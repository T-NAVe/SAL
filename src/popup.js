// Initialize button with user's preferred color
const turnOnSAL = document.getElementById("turnOnSAL");
const volume = document.getElementById('volume')


volume.addEventListener('input', function(event){
  showVal(event.target.value)
  console.log(event.target.value)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {name: 'volume', value: event.target.value}, function(response) {
      console.log('response', response)
    })
  })
})


// When the button is clicked, inject setPageBackgroundColor into current page
turnOnSAL.addEventListener("click", async () => {
  console.log('click')
  const tabId = await getActiveTabId()
  // chrome.tabCapture.getMediaStreamId((streamId)=>{
  //   console.log('streamId', streamId)
  //   const message = { name: 'turn-on-sal', tabId , streamId }
  //   turnOnSal(message)
  // })
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ["src/content.js"],
    },
    () => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {name: 'turn-on-sal'}, function(response) {
          console.log('response', response)
        })
      })
    }
  )
})

function turnOnSal (message) {
  console.log('turnOnSal', message)
  chrome.runtime.sendMessage(message)
}

async function getActiveTabId () {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return activeTab.id
}
function showVal(value){
  document.getElementById("valBox").innerHTML=value;
}
