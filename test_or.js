'use strict';
const speech2text=require('./newspeechText');
const EventEmitter = require('events');
var fs = require('fs');
const fsPromises=require('fs').promises;
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
const express = require('express'); 
require('dotenv').config({silent: true});
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

//**************Start Init */
const app = express();
app.use(express.static('./public'));


//**************end INIT */

let uploadCount =0;
let audioFileName = "aliens_test.mp3"

fsPromises.writeFile("categories.json",'')
        .then(()=> console.log("categories created"))
        .catch(()=> console.log("failure"))

fsPromises.writeFile("data.json",'')
        .then(()=> console.log("data created"))
        .catch(()=> console.log("failure"))


//***********Events **************************************************/
setTimeout(()=>{
    myEmitter.emit('video', audioFileName)

},2000)


myEmitter.on('video',(audioFileName)=>{
    speech2text.getTranscript(audioFileName);
  })
  
  myEmitter.once('video',()=>{
    setInterval(()=>{
      uploadCount +=1;
      myEmitter.emit('readTranscript');
  },15000)
  });
  
  myEmitter.on('readTranscript', () => {
    console.log('an event occurred!');
    let outputRead = fs.createReadStream('./transcripts')
    outputRead.setEncoding('utf8')
    //prints the output
    //outputRead.pipe(process.stdout)
    readTranscript(outputRead)
    .then((message)=>{
        //let transcriptObject=JSON.parse(message)
        //console.log(JSON.parse(message))
        console.log(message)
        //upload doc.json in the current directory
        speech2text.discoveryUpload(message,uploadCount)
        .then((message)=>{
            console.log(message)
            myEmitter.emit('startQuery');
        })
        .catch(()=>{"Upload error...."})
    })
    
    function readTranscript(readable){
        return new Promise((resolve,reject)=>{
            let data = null;
            readable.on('data', (chunk) => {
                    if(data==null){
                        data = chunk
                    } else{
                        data += chunk
                    }
                
                })
            
            readable.on('end', () => {
                resolve(data)
            });
        })
    }
  });
  