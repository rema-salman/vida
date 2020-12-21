const modelParams = {
  flipHorizontal: true, // flip e.g for video
  imageScaleFactor: 0.7, // reduce input image size for gains in speed.
  maxNumBoxes: 2, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.82, // confidence threshold for predictions.
};

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const audio = document.querySelector("#audio");
const context = canvas.getContext("2d");
let model;

// Fetch an array of devices of a certain type (can be cameras, microphones, and headphones)
async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
}

// getting all cameras connected
const cameras = getConnectedDevices("videoinput");

//promise function stream the video
function startUserMedia(stream) {
  video.srcObject = stream;
  setInterval(runDetection, 1000);
}

//main hand tracker video
handTrack.startVideo(video).then((status) => {
  if (status) {
    if (cameras && cameras.length > 0) {
      console.log("External camera ");
      // Open first available video camera with a resolution of 1280x720 pixels
      const stream = openCamera(cameras[0].deviceId, 1280, 720);
      () => startUserMedia(stream);
    } else {
      console.log("Web camera");
      navigator.getUserMedia({ video: {} }, startUserMedia, (error) =>
        console.log(error)
      );
    }
  }
});

// detect objects in the video.
function runDetection() {
  model.detect(video).then((predictions) => {
    console.log("Predictions: ", predictions);
    //for the blue-box around the hand
    // model.renderPredictions(predictions, canvas, context, video);
    if (predictions.length !== 0) {
      let hand1 = predictions[0].bbox;
      //   let hand2 = predictions[1].bbox;
      // extracting coordinates
      let x1 = hand1[0];
      let y1 = hand1[1];
      //   let x2 = hand2[0];
      //   let y2 = hand2[1];

      // the hand was detected in teh top-left box
      if (x1 > 300 && y1 < 250) {
        console.log("top-left");
      }
      // the hand was detected in teh top-right box
      else if (x1 < 300 && y1 < 250) {
        console.log("top-right");
      } // the hand was detected in teh bottom-left box
      else if (x1 > 300 && y1 > 250) {
        console.log("bottom-left");
      } else if (x1 < 300 && y1 > 250) {
        console.log("bottom-right");
      } else console.log("no area was detected");
    }
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  model = lmodel;
});
