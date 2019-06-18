'use strict';
const moment=require('moment');
var fs = require('fs');
const fsPromises=require('fs').promises;
var Throttle = require('throttle');
var throttle = new Throttle(16000);
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
require('dotenv').config({silent: true});
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');


var transcripts = fs.createWriteStream('./transcripts');
var speechToText =  new SpeechToTextV1({
  iam_apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY,
  url: process.env.SPEECH_TO_TEXT_URL
});

// Create the Discovery object
const discovery = new DiscoveryV1({
  version: '2019-04-02',
  url: process.env.DISCOVERY_URL || 'https://gateway.watsonplatform.net/discovery/api',
  iam_apikey: process.env.DISCOVERY_IAM_APIKEY
});



//creat necessary documents
// fsPromises.writeFile("categories.json",'')
//         .then(()=> console.log("categories created"))
//         .catch(()=> console.log("failure"))

// fsPromises.writeFile("data.json",'')
//         .then(()=> console.log("data created"))
//         .catch(()=> console.log("failure"))

//Global variables
// let uploadCount =0;
// let audioFileName = "aliens_test.mp3"

//***********Events **************************************************/
// myEmitter.on('video',(audioFileName)=>{
//   getTranscript(audioFileName);
// })

// myEmitter.once('video',()=>{
//   setInterval(()=>{
//     uploadCount +=1;
//     myEmitter.emit('readTranscript');
// },30000)
// });

// myEmitter.on('readTranscript', () => {
//   console.log('an event occurred!');
//   let outputRead = fs.createReadStream('./transcripts')
//   outputRead.setEncoding('utf8')
//   //prints the output
//   //outputRead.pipe(process.stdout)
//   readTranscript(outputRead)
//   .then((message)=>{
//       //let transcriptObject=JSON.parse(message)
//       //console.log(JSON.parse(message))
//       console.log(message)
//       //upload doc.json in the current directory
//       discoveryUpload(message)
//   })
  
//   function readTranscript(readable){
//       return new Promise((resolve,reject)=>{
//           let data = null;
//           readable.on('data', (chunk) => {
//                   if(data==null){
//                       data = chunk
//                   } else{
//                       data += chunk
//                   }
              
//               })
          
//           readable.on('end', () => {
//               resolve(data)
//           });
//       })
//   }
// });

//***********speech2text **************************************************/

let speech2text ={

getTranscript: function(audioFileName){
    const setAudioParams = () => {
        return new Promise((resolve,reject)=>{
            var audioParams ={
                objectMode: true,
                //content_type: 'audio/webm;codecs=opus',
                content_type: 'audio/mp3',
                model: 'en-US_BroadbandModel',
                keywords: ['NASA'],
                keywords_threshold: 0.5,
                max_alternatives:1,
                smart_formatting: true,
                interim_results:true
            };
            resolve({msg:"sucess:set audioParams",audioParams:audioParams})
            reject();
        })
    }

    setAudioParams().then((message)=>{
        //create the stream
        var recognizeStream = speechToText.recognizeUsingWebSocket(message.audioParams);
        console.log(message.msg)
        return startTranscription(recognizeStream)
    }).then((recognizeStream)=>{            
        //pipe in the audio
        fs.createReadStream(audioFileName).pipe(throttle).pipe(recognizeStream);
        
        const transcriptData = fs.createWriteStream('transcriptData')

        //Listen for events
        recognizeStream.on('data',function(event){ 
            //console.log(event)
            if(event.results[0].final){
                event.time =  moment().format();
                event.results[0].alternatives[0].transcript += ".";
                let transcript =event.results[0].alternatives[0].transcript;
                ////print one sentence
                //console.log(transcript)
                transcripts.write(transcript,'utf8')
                console.log('files written')
                //event.results[0].alternatives[0].transcript
            };
        });
        recognizeStream.on('error', function(event){ onEvent('error:', event,transcripts);})
        recognizeStream.on('close', function(event) { closeEvent('close:', event,transcripts); });

        // //Displays event on the console
        // function onEvent(name,event,transcripts){
        //     //console.log(event)
        //     if(event.results[0].final){
        //         event.time =  moment().format();
        //         event.results[0].alternatives[0].transcript += ".";
        //         let transcript = (event,null,2);
        //         //console.log(transcript)
        //         transcripts.write(transcript,'utf8')
        //         console.log('files written')
        //         //event.results[0].alternatives[0].transcript
        //     };
        // };

        function closeEvent(name,event,transcript){
            transcripts.end();
            console.log('files closed')
            };
    })

    let startTranscription = (recognizeStream)=>{
        return new Promise((resolve,reject)=>{
            let date = moment().format();
            var startStream = new Promise((resolve,reject)=>{
                fs.createWriteStream('log').write(date,'utf8',()=>{
                    if("error"){
                        reject("timer error" + "error")
                    }
                })
                resolve(date);
            })
            .then((date)=> {
                console.log("start @",date)
                resolve(recognizeStream)
            })
            .catch((err)=> reject(err))
        })
    }
},

discoveryUpload: function(uploadData,uploadCount){
    return new Promise((resolve,reject)=>{
    let fileName= "b" + uploadCount + ".json";
    fsPromises.writeFile('./'+fileName,JSON.stringify(
        {
            title:fileName,
            text: uploadData
        },null,2)
        ).then(()=>{
    // fsPromises.writeFile('./docs.json',"hello")
    // .then(()=>{
        console.log("./docs.json written")
        setUploadParams(fileName)
        .then((message)=>{
          console.log(message.msg)
          discovery.addDocument(message.uploadParams)
          .then(documentAccepted => {
            let docID = documentAccepted.document_id;
            console.log(JSON.stringify(documentAccepted, null, 2));
            return this.checkUpload(docID)
          })
          .then((message)=>{
            console.log(message)
            resolve("Start Query")

          })
          .catch((err)=>{console.log("Upload error",err)})
        })
    }).catch((err)=>{console.log("Write error",err)})
  })
    function setUploadParams(fileName){
      return new Promise((resolve,reject)=>{
        const uploadParams = {
          environment_id: process.env.ENVIRONMENT_ID,
          collection_id: process.env.COLLECTION_ID,
          file: fs.createReadStream('./'+ fileName) 
        
        };
          resolve({msg:"sucess:set upload Params",uploadParams:uploadParams})
          reject();
      })
    }
    
      // .catch(()=>{console.log("set params error")})
      // .then((message)=>{
      //   console.log("message",message)
      // })
  
  },

  checkUpload: function(docID){
    const getDocumentStatusParams = {
      environment_id: process.env.ENVIRONMENT_ID,
      collection_id: process.env.COLLECTION_ID,
      document_id: docID,
    };

    return new Promise((resolve,reject)=>{

        
      let intervalObject = setInterval(()=>{
        discovery.getDocumentStatus(getDocumentStatusParams)
        .then(documentStatus => {
          //console.log(JSON.stringify(documentStatus, null, 2));
          console.log(documentStatus.status)
          if(documentStatus.status === "available"){
            console.log(documentStatus.status)
            setImmediate(()=>{
              clearInterval(intervalObject)
            })
            resolve("done")
          }
          
        })
        .catch(err => {
          console.log('interval error:', err);
          reject(err);
        });
      },2000)
    })
  }
}

module.exports = speech2text;



