document.addEventListener("DOMContentLoaded", ()=>{
    // GET THE SELECTORS OF THE BUTTONS
    const startVideoButton = document.querySelector("button#start_video")
    const stopVideoButton = document.querySelector("button#stop_video")
    const errmsg = document.querySelector(".error")

    // Get the popup container element



    // adding event listeners
const startRecording = () => {
  chrome.runtime.sendMessage({ name: 'request_recording' });
};
  const stopRecording = () => {
    const port = chrome.runtime.connect({ name: 'content-script' });
    port.postMessage({ name: 'stopall' });
  };
    startVideoButton.addEventListener("click",startRecording)
    stopVideoButton.addEventListener("click",stopRecording)


    // Get the toggle switch element and the status element
const cameraToggle = document.getElementById("cameraToggle");
const audioToggle = document.getElementById("audioToggle");

const labelcameraToggle = document.getElementById("labelcamera");
const labelaudioToggle = document.getElementById("labelaudio");


// Add an event listener to the toggle switch
function toggleCamera() {
  cameraToggle.checked = !cameraToggle.checked;
}
function toggleAudio() {
  audioToggle.checked = !audioToggle.checked;
}

//cameraToggle.addEventListener('click' , toggleCamera)
//audioToggle.addEventListener('click' , toggleAudio)
labelcameraToggle.addEventListener('click' , toggleCamera)
labelaudioToggle.addEventListener('click' , toggleAudio)



    
})