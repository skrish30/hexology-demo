<<<<<<< Updated upstream


//**************end INIT */

let audioFileName = "aliens_test.mp3"



//***********************      Events      **************************************************/
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
  
=======
const express = require("express");
const rp = require("request-promise");
const cfenv = require("cfenv");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);
require('dotenv').config({silent: true});
const fs = require('fs');
const fsPromises=require('fs').promises;
const request = require('request');
const path = require("path")
const fs_extra = require('fs-extra');



let Types=[
    "Person",
    "Location",
    "Quantity",
    "Company",
    "Facility",
    "JobTitle"
  ]
  fsPromises.writeFile("./datas/dataCompany.json",JSON.stringify('',null,2))

setTimeout(()=>{
    fs.readFile("./datas/dataCompany.json",('utf8'),(err,data)=>{
        data = JSON.parse(data);
        console.log(data)
    })
})


// Types.forEach((Type)=>{
//     fs.readFile(path.join(__dirname,'datas','data'+Type+'.json'),'utf8',(err,data)=>{
//         console.log(path.join(__dirname,'datas','data'+Type+'.json'))
//         data = JSON.parse(data);
//         Entype = data.aggregations[0].aggregations[0].results;
//         // Entype.forEach((number)=>{
//         //   let entitybox = number.key;
//         //   //console.log("Emit",Type,entitybox)
  
//         //   //io.emit(Type, entitybox)
//         //   if(Type=="Person"||Type=="Quantity"||Type=="Location"){
//         //     io.emit(Type, entitybox)
//         //     logger.silly(`Emit :${Type} :${entitybox}`)
//         //   } else{
//         //     io.emit("Other",entitybox+","+ Type)
//         //     logger.silly("Other" + entitybox + "," + Type )
//         //   }
  
//         // })
//       })
//     });
>>>>>>> Stashed changes
