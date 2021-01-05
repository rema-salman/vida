 navigator.getUserMedia=navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
const video=document.querySelector("#video")
const canvas=document.querySelector("#canvas")
const ctx=canvas.getContext('2d')
const audio = document.querySelector("#audio");
//const baseAudio = document.querySelector("#base-audio");
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
  async function main() {



    // load handpose model
    const model = await handpose.load({

    });
    console.log("Handpose model loaded");
    

    // main estimation loop
    const estimateHands = async () => {

      // clear canvas overlay
      //ctx.clearRect(0, 0, 1280, 720);
     //console.log(model)
  console.log("RUN DETECTION")
     const predictions = await model.estimateHands(video,true);
     if(predictions.length!==0){
       
     // console.log("LAST JOINT FINGER",predictions[0].annotations.indexFinger)
      let x=predictions[0].annotations.indexFinger[3][0]
      let y=predictions[0].annotations.indexFinger[3][1]
/*       console.log("LAST JOINT FINGER X",x)
      console.log("LAST JOINT FINGER Y",y) */

      if(x>700){
        console.log("Left Section")
        if(y>350){
          console.log("Bottom Left")
          audio.src = "./natural-sounds/snow_steps.wav";
          console.log("Nature")
         // audio.autoplay=true
         //await audio.load()

        }
        else{
          console.log("Top Left")
          audio.src = "./natural-sounds/waterfall_loop.mp3";
          console.log("Ambient")
         // audio.autoplay=true

        }
      }
      else{
        console.log("Right Section")
        if(y>350){
          console.log("Bottom Right")
          console.log("Music & Nature")
          audio.src = "./natural-sounds/wind_through_trees.mp3";
          //audio.autoplay=true

          //audio.load()
         

        }
        else{
          console.log("Top Right")
          console.log("Instruments")
          audio.src = "./natural-sounds/night_sounds_and_fire.mp3";
        //  audio.autoplay=true
         // audio.load()
          
        }
        
      }
     }
        else{
            audio.pause();
        }
     
      // get hand landmarks from video
      // Note: Handpose currently only detects one hand at a time
      // Therefore the maximum number of predictions is 1
      
     // console.log(predictions[0])

 /*        for(let i = 0; i < predictions.length; i++) {
        console.log(predictions[0].handInViewConfidence)
        // draw colored dots at each predicted joint position
        for(let finger in predictions[i].annotations) {
          console.log(predictions[i].annotations.indexFinger);
           for(let point of predictions[i].annotations[finger]) {
            drawPoint(ctx, point[0], point[1], 3, landmarkColors[finger]);
          } 
        } 
      } */
//baseAudio.play();

      setInterval(() => { estimateHands(); }, 5000 );
    };

     estimateHands();
    console.log("Starting predictions");
  }