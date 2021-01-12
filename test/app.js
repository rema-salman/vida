 
const landmarkColors = {
    thumb: 'red',
    indexFinger: 'blue',
    middleFinger: 'yellow',
    ringFinger: 'green',
    pinky: 'pink',
    palmBase: 'white'
  };

const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
  }
  navigator.getUserMedia=navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
const video=document.querySelector("#video")
const canvas=document.querySelector("#canvas")
const ctx=canvas.getContext('2d')
const audio = document.querySelector("#audio");
//const baseAudio = document.querySelector("#base-audio");
let audioForPlay;
let model5;
//set the volume of the base sound to be lower than the rest
//baseAudio.volume = 0.2;

  window.onload = (event) => {
    console.log('page is fully loaded');
    initCamera(
       1280, 720, 30
      ).then(video => {
        video.play();
        video.addEventListener("loadeddata", event => {
          console.log("Camera is ready");
          
           main();
        });
      });
      const canvas = document.querySelector("#canvas");
      //canvas.width = 640;
      //canvas.height = 480;
      console.log("Canvas initialized");
  };

  async function initCamera(width, height, fps) {

    const constraints = {
      audio: false,
      video: {
        facingMode: "user",
        width: width,
        height: height,
        frameRate: { max: fps }
      }
    };

    const video = document.querySelector("#video");
    video.width = width;
    video.height = height;

    // get video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    return new Promise(resolve => {

      video.onloadedmetadata = () => { resolve(video) };
    });
  }
  const pauseAudio=()=>{
    console.log("Audio Play" ,audioForPlay)
    if(audioForPlay===undefined || audioForPlay===null){
      console.log("Nothing")
    } 
    else{
      audioForPlay.pause()
    }
  }
  const playAudio=()=>{
    console.log("Audio Play" ,audioForPlay)
    if(audioForPlay===undefined || audioForPlay===null){
      console.log("Nothing")
    } 
    else{
      audioForPlay.play()
    }
  }
  async function main() {



    // load handpose model
  
    console.log("Handpose model loaded");
    
    model5 = await handpose.load({

    });
    // main estimation loop

    const estimateHands = async () => {

  console.log("RUN DETECTION")
     const predictions = await model5.estimateHands(video,true);
     
     //console.log(plat)
     
    
     if(predictions.length!==0){
      pauseAudio()
     // console.log("LAST JOINT FINGER",predictions[0].annotations.indexFinger)
      let x=predictions[0].annotations.indexFinger[3][0]
      let y=predictions[0].annotations.indexFinger[3][1]
/*       console.log("LAST JOINT FINGER X",x)
      console.log("LAST JOINT FINGER Y",y) */

      if(x>700){
        console.log("Left Section")
        if(y>350){
          console.log("Bottom Left")
          audioForPlay= document.getElementById("audio-birds");
          console.log("Audio LEFT",audioForPlay)
        }
        else{
          console.log("Top Left")
          audioForPlay= document.getElementById("audio-snow");
          console.log("Audio LEFT",audioForPlay)
          console.log("Ambient")
        }
      }
      else{
        console.log("Right Section")
        if(y>350){
          console.log("Bottom Right")
          audioForPlay= document.getElementById("audio-wind");
          console.log("Music & Nature")      
        }
        else{
          console.log("Top Right")
          audioForPlay= document.getElementById("audio-night");
          console.log("Instruments") 
        }
        
      }
      console.log(audioForPlay)
       // audioForPlay.play()
     }
      playAudio()
      setTimeout(() => { estimateHands(); }, 1000 );
    };
    //playSound();
     estimateHands();
    console.log("Starting predictions");
  }

