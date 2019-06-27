# Hexology Conference Companion

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites (Linux Ubuntu 16.04 LTS)

* Ensure you have a [IBM Cloud account](https://www.ibm.com/cloud/)
* Install npm and node js
```
sudo npm install nodejs
```
#### If running locally

1. Install the dependencies

    ```
    npm install
    ```

1. Run the application

    ```
    npm start
    ```

1. View the application in a browser at `localhost:3000`

#### If deploying to IBM Cloud as a Cloud Foundry Application

1. Login to IBM Cloud with the [IBM Cloud CLI](https://cloud.ibm.com/docs/cli/index.html#overview)

    ```
    ibmcloud login
    ```

1. Target a Cloud Foundry organization and space.

    ```
    ibmcloud target --cf
    ```

1. Edit the *manifest.yml* file. Change the **name** field to something unique.  
  For example, `- name: my-app-name`.
1. Deploy the application

    ```
    ibmcloud app push
    ```

1. View the application online at the app URL.  
For example: https://my-app-name.mybluemix.net

## Building the system

Explain what has been done to develop the system

### Back-end (Watson) Services

#### Watson Assistant

Watson Assistant is an artificial chatbot builder that allows you to construct a conversation interface into any application, device, or channel.
In the back end, you will need to create a dialog in Watson Assistant tool:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/dialog.PNG)

By doing this, a chatbot will be created on the webpage to achieve the goals of a warm welcome, a simple user instruction, receiving the link of a video, a quick questionnaire about user interests, then storing the interest as a string and feeding   back with related information to make it a personalised summary.
#### Watson Speech to Text
Watson Speech to Text is a service that can easily convert audio and voice into written text for quick understanding of content. The service can be used by sending API requests or over a Websocket which sends audio and returns transcription results for recognition requests over a WebSocket connection. The prototype aims to simulate how the Hexology conference companion can analyse the live stream of the speaker delivering the talk in real-time. In order to do so, we require a live stream of a conference which we will simulate in this case using the [throttle library](https://www.npmjs.com/package/throttle) which will limit the rate that the audio is uploaded over the Websockets connection. Additionally, Watson Speech to Text only works on specific audio formats such as MP3, therefore to obtain this, we will use the [ytdl-core library](https://www.npmjs.com/package/ytdl-core) as well as [fluent-ffmpeg library](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) to first download a TED talk from youtube and then convert MP4 to MP3 format.

#### Watson Discovery

Watson Discovery is a query tool that can add cognitive search and content analysis engines to identify patterns, trends, and actionable insights. It is able to integrate structured and unstructured data with certain topics or types of entities, filter documents from a large data set or passages from a single document with specified contents and provide tone analysis or keyword extractions.
The conference companion is designed to extract concepts and entities from the transcript documents, and it is able to enrich the information by searching for extra knowledge on other sources of data base and get the text where the keywords appear in the documents.
In Watson Discovery, the process of getting all the concepts, listing all the entities and searching for the passages where keywords appear is shown below:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/discovery.gif)

These will also be shown on the webpage as the analysis proceeds.

### Front-end server

As a standalone prototype, a web-based tool, which loads a TED Talk video by inputting the share link, is built.

Instead of using a microphone, a website is finally chosen as the proof-of-concept method since it is the easiest way to get access to tones of reliable conference videos online, which is crucial for AI training and testing.

#### Webpage Design
The whole webpage is developed by using JavaScript, HTML and CSS under Node.js environment. Bootstrap, which contains CSS and JavaScript-based design templates for forms, buttons, and other interface components, is used as the CSS framework directed at front-end web development. JQuery, a JavaScript library, is used to simplify development. MongoDB database can be used to store or load conference transcripts and user profiles, which are saved and analysed to provide better user experience. The database is not included in this version, but codes are kept as references for further development. User Interface is designed to be simple but informative. Using Socket IO library, a hexology chatbot is implemented to give useful user instructions and enable users to input their certain expertise, interests or requirements. There also three modules on the website which containing outputs from IBM Watson Discovery, IBM Speech-To-Text and DBpedia. To enable these outputs, which contain different topics, be shown on the webpage like slides, one component called 'Carousel' from Bootstrap is introduced.

***************************************

An example (HTML file) of the webpage UI design is shown in this picture:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/UI%20design.JPG)

## Testing the System
The real-time feature is an essential element for Hexology to be a feasible conference companion tool. Therefore we have analysed the important timing characteristics of the program as shown in the [Test results](https://github.com/skrish30/hexology-demo/tree/master/testing). Also, we have implemented a logger by utilising the [winstonjs library](https://github.com/winstonjs/winston) in order to record the important events and the timestamp. The results.log file logs the event in heirarchy of importance from error(highest importance) to debug(lowest importance).

## Deployment

### Running the system

After ```npm start``` or ```ibmcloud app push``` and opening the webpage, a chatbot will appear and talk to the user with the dialog created above.

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/chatbot.gif)

Here, the user can either follow a complete dialog or directly input the link of the video at the beginning for sophisticated users. Afterwards, the video will be played once it is downloaded. Then the video (mp4 file) will be converted to mp3 file to input into Watson Speech to Text tool to get the transcript of the video. The transcript will be sent to Watson Discovery in JSON format every 30 seconds, and it will be analysed in real time. The results from the Watson Discovery will show on the three blocks under the video and the chatbot:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/result%20blocks.PNG)

As shown, the Passage block shows a passage that contains one of the entities in the Entities block. The user can change other entities and their sources by clicking them in the Entities block:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/passages.gif)

***************************************

A complete flow of the process is shown in this picture:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/flow1.PNG)

### Customisation

If you want to create your own chatbot (dialog) or different functions in Watson Discovery, a fundamental tutorial is here in [IBM badges](https://www.youracclaim.com/org/ibm/badge/discover-your-inner-chatbot-find-valuable-insights-with-ibm-watson).

## Ethical Consequences & Sustainability

Details about the report of ethical consequences and sustainability report are included in the folder named [documentation report](https://github.com/skrish30/hexology-demo/blob/master/Documentation%20Report/Documentation%20Report.docx).

## Record of meetings, requirements gathering, decisions taken & design history


## Built With

* Watson Assistant - The web chatbot used. Version 2.0
* Watson Speech to Text - Dependency Management
* Watson Discovery - Used to query and filter transcript. Version 1.0
* Bootstrap - Used for front-end design template. Version 4.3.1
* jQuery - Used for messages emit and receive. Version 3.4.1
* Node.js - Used as develope environment. Version 10.16.0
* MongoDB - Used as an additional function to save user profiles. Version 4.0.8

## Potential Legal dispute

The whole prototype is built on open-source work, libraries, database or APIs. IBM Watson services can be accessed by anyone without charges. Therefore, based on the work at this stage, it is believed that there will no potential legal dispute in the near future.

## Authors

* **Che Zhang** - *Initial work* 
* **Subhakrish Krishnamra** - *Initial work* 
* **Yiwen Zou** - *Initial work*  
* **Zhenyu Luo** - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
