const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require ('fluent-ffmpeg');
const moment = require('moment')
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

//ita 140-m4a, 250-Webm 70k , 171-WebM 128k

function downloadVideo(videoURL){
  return new Promise((resolve,reject)=>{
    validateURL(videoURL)
    .then((URL)=>{
      console.log("valid URL")
      return download(URL)
    })
    .catch((err)=>{
      console.log(err)
    })
    .then((message)=>{
      console.log(message)
      return convertmp3()
    })
    .catch((err)=>{
      console.log(err)
    })
    .then((message)=>{
      console.log(message)
      // console.log('yooo')
      resolve("ready for speech text")
    })
    .catch((err)=>{
      console.log(err)
    })
  });
}

function convertmp3(){
    console.log("doing mp3 conversion")
    return new Promise((resolve,reject)=>{
      var proc = new ffmpeg({ source: './public/video.mp4', nolog: true })
      proc.setFfmpegPath("/usr/bin/ffmpeg")
    .toFormat('mp3')
     .on('end', function() {
     resolve('file has been converted successfully');
     })
     .on('error', function(err) {
     console.log('an error happened: ' + err.message);
     })
     // save to file <-- the new file I want -->
     .saveToFile('./public/audio.mp3');     
    })
  }


function validateURL(videoURL){
  return new Promise((resolve,reject)=>{
    //validate if URL is valid on youtube if(validurl){return true}
    let validURL = ytdl.validateURL(videoURL)
    if(validURL){
      resolve(videoURL)
    }
    else{
      reject("Invalid URL")
    }
  })
}

function download(URL){
  return new Promise((resolve,reject)=>{
    let start = Date.now()
    console.log(`Start on  ${start}`)
    videoStream = fs.createWriteStream('./public/video.mp4');
    ytdl(URL)
      .pipe(videoStream);

    videoStream.on('close',() =>{
      resolve(`Download took  ${Math.floor((Date.now()-start)/1000)} seconds`)  
    })
    videoStream.on('error',(err)=>{reject(err)})
  })
}

// downloadVideo('https://www.youtube.com/watch?v=_B8RaLCNUZw')
//   .then((message)=>{console.log(message)})


// Use to get video info for reference
//  ytdl.getInfo('https://www.youtube.com/watch?v=qaIghx4QRN4&t=24s')
//     .then(res => {
//         //console.log(res)
//     })
//     .catch(err => console.log(err))

module.exports = downloadVideo
