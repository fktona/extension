var recorder = null;
var userMediaStream = null;
var displayMediaStream = null;


function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  }

  async function sendVideoToServer(blob) {
    try {
      const formData = new FormData();
      formData.append('video', blob, 'screen-recording.webm');

      console.log(formData);

      const response = await fetch('https://google-chrome-extensionapi.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Video uploaded successfully');
      } else {
        console.error('Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  }

  recorder.ondataavailable = function (event) {
    console.log('hyu');
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);
    sendVideoToServer(recordedBlob);
    

    let a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);


    window.close()
    
    
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name !== 'startRecordingOnBackground') {
    return;
  }

  console.log("requesting recording");

  sendResponse(`processed: ${message.name}`);

  Promise.all([
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }),
    navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: {
        width: 9999999999,
        height: 9999999999,
      }
    })
  ]).then((stream) => {
    const [cam, scr] = stream;
    userMediaStream = cam;
    displayMediaStream = scr;

    // Listen for changes in displayMediaStream
    displayMediaStream.oninactive = function () {
      console.log("Display media stream stopped");
      // Stop the microphone tracks
      if (userMediaStream) {
        userMediaStream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
    };

    const mergeStream = new MediaStream([
      ...cam.getTracks(),
      ...scr.getTracks()
    ]);
    onAccessApproved(mergeStream);
  });
  
});
