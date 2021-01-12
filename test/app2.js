navigator.getUserMedia=navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; 
const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.92,    // confidence threshold for predictions.
  }
const video=document.querySelector("#video")
const audio=document.querySelector("#audio")
const canvas=document.querySelector("#canvas")
const fingerCanvas=document.querySelector("#fingerCanvas")

const ctx=canvas.getContext('2d')
const fingerCtx=fingerCanvas.getContext('2d')

let model5;
 handTrack.startVideo(video).then(status=>{
    if(status){
        navigator.getUserMedia({video:{}},stream=>{
            video.srcObject=stream
            
            setInterval(runDetection,200)
        },
            err=>{
                console.log(err)
        })
    }
})


async function runDetection(){
    

    
    
    model.detect(video).then(async (predictions)=>{
      
        console.log("Predictions",predictions)
        if (predictions.length !== 0) {
          model.renderPredictions(predictions,canvas,ctx,video)
            let hand1 = predictions[0].bbox;
            //let hand2 = predictions[1].bbox;
            //   let hand2 = predictions[1].bbox;
            // extracting coordinates
            let x1 = hand1[0];
            let y1 = hand1[1];
              //let x2 = hand2[0];
            //   let y2 = hand2[1];
            drawHandImageCanvas(hand1);
            const modelF = await handpose.load({
              maxContinuousChecks :5,
              detectionConfidence :0.9,
              iouThreshold :0.5,
              scoreThreshold :0.82
            });
            
            const predictionsFinger = await modelF.estimateHands(fingerCanvas,true);
            console.log(predictionsFinger)
           /*  var imgData = ctx.getImageData(predictions[0].bbox[0],predictions[0].bbox[1],predictions[0].bbox[2]+100,predictions[0].bbox[3]+100);

           var img=fingerCtx.putImageData(imgData, 0,0);
         
         console.log(imgData)
         console.log("imageData",imgData)
        console.log("img",img)

              const predictionsFinger = await modelF.estimateHands(fingerCanvas,true);
            console.log(predictionsFinger)  */

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
    }) 
}
 function drawHandImageCanvas(hand){

  var imgData = ctx.getImageData(hand[0]-100,hand[1]-100,hand[2]+200,hand[3]+200);
  fingerCtx.clearRect(0, 0, 1280, 720);
  fingerCtx.putImageData(imgData, hand[0],hand[1]);

  console.log("DRAW HAND", hand)
}
handTrack.load(modelParams).then(lmodel => {
        model=lmodel
  });  