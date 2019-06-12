

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
  