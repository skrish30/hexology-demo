const fs = require('fs');
const ytdl = require('ytdl-core');
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

//ita 140-m4a, 250-Webm 70k , 171-WebM 128k

//How to call function in main file
function downloadVideo(videoURL){
  let start = Date.now();
  validateURL(videoURL)
  .then((URL)=>{
    console.log("valid URL", "Downloading......")
    videoStream = fs.createWriteStream('aliens-video');
    ytdl(URL)
      .pipe(videoStream);
    videoStream.on('close',() =>{
      console.log(`Download took  ${Math.floor((Date.now()-start)/1000)} seconds`)
      })
  })
  .catch((err)=>{
    console.log(err)
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


// Use to get video info for reference
//  ytdl.getInfo('https://www.youtube.com/watch?v=qaIghx4QRN4&t=24s')
//     .then(res => {
//         //console.log(res)
//     })
//     .catch(err => console.log(err))

module.exports = downloadVideo