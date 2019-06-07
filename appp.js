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

console.log(process.env.ASSISTANT_ID);

//modules for V2 assistant
var bodyParser = require('body-parser'); // parser for post requests


//Import Watson Developer Cloud SDK
var AssistantV2 = require('watson-developer-cloud/assistant/v2'); // watson sdk
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');



// Get the environment variables from Cloud Foundry
const appEnv = cfenv.getAppEnv();

// Serve the static files in the /public directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Create the Conversation object
//   var assistant = new AssistantV2({
//   version: '2018-11-08'
// });

// Create the Discovery object
const discovery = new DiscoveryV1({
  version: '2019-04-02',
  url: process.env.DISCOVERY_URL || 'https://gateway.watsonplatform.net/discovery/api',
});

//Create the NLU object
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2018-11-16',
  iam_apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY,
  url: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL
});

// start server on the specified port and binding host
server.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

//creat necessary documents
fsPromises.writeFile("categories.json",'')
        .then(()=> console.log("categories created"))
        .catch(()=> console.log("failure"))

fsPromises.writeFile("data.json",'')
        .then(()=> console.log("data created"))
        .catch(()=> console.log("failure"))

let Types=[
  "Person",
  "Location",
  "Quantity",
  "Company",
  "Facility",
  "JobTitle"
]

let entities=[
  "Person",
  "Location",
  "Quantity",
  "Company",
  "Facility",
  "JobTitle",
];

/////////////////////////////Krish's Part////////////////////////////////////////////////
function queryConcepts(){
    const queryParams = {
    environment_id: process.env.ENVIRONMENT_ID,
    collection_id: process.env.COLLECTION_ID,
    filter: "id::\"39f38b9c1cd046d3ac50d7f8ace63fe0\""
  };

  discovery.query(queryParams)
    .then(queryResponse => {
      //print query results
      //console.log(JSON.stringify(queryResponse, null, 2));
    data = JSON.stringify(queryResponse, null, 2);
      fsPromises.writeFile("data.json", data)
    .then(()=> console.log("Query logged in data.json"))
    .catch(()=> console.log("failure"))
    })
    .catch(err => {
      console.log('error:', err);
    });
};

//reads file and returns the JSON object
function readJson(fileName){
  var readableStream = fs.createReadStream(fileName);
  var data = '';
  // Return new promise 
  return new Promise(function(resolve, reject) {
      readableStream.on('data', function(chunk) {
          data+=chunk;
      });
      readableStream.on('end', function() {
          data = JSON.parse(data)
          elements = [];
          data.results[0].enriched_text.concepts.forEach(element => {
              elements.push(element.text);
          });
          resolve(elements)
      });
      readableStream.on('error', function(err){
          reject(err);
      });
  })
  };

  function getDbpedia(concept){
    let requestURL = "http://dbpedia.org/data/"+ concept + ".json";
    request(requestURL, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    let resourceURL = "http://dbpedia.org/resource/"+ concept;
    //All the languages
    //console.log(body[resourceURL]['http://dbpedia.org/ontology/abstract']);
    let found =body[resourceURL]['http://dbpedia.org/ontology/abstract'].filter( (abstract)=>{
        return abstract.lang == 'en' 
    });
    //abstract in the correct language
    //console.log(concept,"\n",found[0].value + "\n\n")
    io.emit('concept',
    {
      concept : concept,
      abstract: found[0].value.slice(0,500)
    });
    //return found[0].value;
    });
  };
///////////////////////////////Yiwen's Part//////////////////////////////////////////////


  function queryDiscoveryEntities(entities){
  
    const queryParams = {
      environment_id: process.env.ENVIRONMENT_ID,
      collection_id: process.env.COLLECTION_ID,
      filter: "id::\"39f38b9c1cd046d3ac50d7f8ace63fe0\"",
      aggregation: "nested(enriched_text.entities).filter(enriched_text.entities.type::" + entities + ").term(enriched_text.entities.text,count:10)"
      
    };
  
    discovery.query(queryParams)
      .then(queryResponse => {
        //console.log(JSON.stringify(queryResponse.aggregations[0], null, 2));
        data=JSON.stringify(queryResponse.aggregations[0], null, 2);
      fsPromises.writeFile("data"+entities+".json", data)
      .then(()=> console.log("successful query"))
      .catch(()=> console.log("failure"))
      })
      .catch(err => {
        console.log('errorssssss:', err);
      });
  }


  var entitiyPromise = new Promise((resolve,reject)=>{
    entities.forEach((entitity)=>{
      queryDiscoveryEntities(entitity)
       // fsPromises.writeFile("data"+entitity+".json", data)
       //   .then(()=> console.log("success"))
       //   .catch(()=> console.log("failure"))
   });
    resolve("Entities found")
    reject(err);
  })
  .then((res)=>{
    console.log(res)
    queryConcepts();
  })
  .catch((err)=>{
    console.log("Entity Error", err);
  });


/////////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket) {
  console.log('a user has connected');

  io.emit('chat message', "you: " + "Someone connected")
  // Handle incomming chat messages
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.emit('chat message', "you: " + msg)
    })
//****************************/test emit***************************************
    io.emit('Person','Darrel');
    io.emit('concept1', {
      concept: "Earth",
      abstract: "Earth is round"
    })
///////////////////////////////////////////////////////////////////////////////
setTimeout(()=>{
  READFile(Types)
  console.log("start emitting")
},8000)

setTimeout(()=>{

  readJson('data.json')
  .then((results)=> {
      elements = [];
      results.forEach(concepts=>{
      const analyzeParams = {
          'text':'I am interested in ' + concepts,
          'features': {
            'categories': {
              'limit': 3
            }
          }
        };
        //print all the concepts
        //console.log(analyzeParams.text);
        
        naturalLanguageUnderstanding.analyze(analyzeParams)
          .then(analysisResults => {
              analysisResults.concepts = analyzeParams.text.slice(19);
              elements.push(analysisResults)
          })
          .catch(err => {
            console.log('error:', err);
          });
      });
      // setTimeout(function() {
      //     data = JSON.stringify(elements,null,2);
      //     fsPromises.appendFile("categories.json", data)
      //     .then(()=> console.log("success"))
      //     .catch(()=> console.log("failure"))
      // }, 5000);
      setTimeout(function() {
              //console.log(elements[0].categories[0].label)
              console.log('matched interests')
              userInterest = 'science';
              elements.forEach((concept)=>{
                  let interest = concept.categories[0].label;
                  interest = concept.categories[0].label.slice(1) + "\/";
                  num = interest.search('\/')
                  interest =interest.slice(0,num);
                  if(interest === userInterest){
                      //console.log(concept);
                      getDbpedia(concept.concepts.replace(/ /g,"_"))
                      //console.log(getDbpedia(concept.concepts.replace(/ /g,"_")));
                  };
                  //print out the avaliable interests
                  //console.log(concept.categories[0].label, "\t\t" + concept.concepts)
              });
              //return res.status(200).json({mes:'Successs'})
          }, 5000);
  })
  .catch((err)=> console.log("error:",err))
     
  },5000);

//Start Readfile
function READFile(Types){
  Types.forEach((Type)=>{
    
  fs.readFile('./data'+Type+'.json','utf8',(err,data)=>{
      data = JSON.parse(data);

      Entype = data.aggregations[0].aggregations[0].results;

      Entype.forEach((number)=>{
        entities = number.key;
        //console.log("Emit",Type,entities)

        //io.emit(Type, entities)
        if(Type=="Person"||Type=="Quantity"||Type=="Location"){
          io.emit(Type, entities)
          console.log("Emit",Type,entities)
        } else{
          io.emit("Other",entities+","+ Type)
          console.log("Other",entities +","+Type)
        }

      })
    })
  });
}
//end Readfile

  });
//**********************************end of  Socke.IO

//   //let Type_Quantity = JSON.parse(fs.readFile('./dataQuantity.json', 'utf8'))
//   //let Type_Person = JSON.parse(fs.readFile('./dataPerson.json', 'utf8'))
//   //let Type_Location = JSON.parse(fs.readFile('./dataLocation.json', 'utf8'))
//   //let Type_Company = JSON.parse(fs.readFile('./dataCompany.json', 'utf8'))
//   //let Type_Facility = JSON.parse(fs.readFile('./dataFacility.json', 'utf8'))
//   //let Type_JobTitle = JSON.parse(fs.readFile('./dataJobTitle.json', 'utf8'))

//   quantity = Type_Quantity.aggregations[0].aggregations.results.key;
//   io.emit('Quantity', quantity)





//     // ***************************************

//    });


/*****************************
    Function Definitions
******************************/


function initialize() {
  // Setting URL and headers for request
  var options = {
      url: 'https://api.github.com/users/narenaryan',
      headers: {
          'User-Agent': 'request'
      }
  };
}



