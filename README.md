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

[Test results](https://github.com/skrish30/hexology-demo/tree/master/testing)

## Deployment

### Running the system

After ```npm start``` or ```ibmcloud app push``` and opening the webpage, a chatbot will appear and talk to the user with the dialog created above.

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/chatbot.gif)

Here, the user can either follow a complete dialog or directly input the link of the video at the beginning for sophisticated users. Afterwards, the video will be played once it is downloaded. Then the video (mp4 file) will be converted to mp3 file to input into Watson Speech to Text tool to get the transcript of the video. The transcript will be sent to Watson Discovery in JSON format every 30 seconds, and it will be analysed in real time. The results from the Watson Discovery will show on the three blocks under the video and the chatbot:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/result%20blocks.PNG)

As shown, the Passage block shows a passage that contains one of the entities in the Entities block. The user can change other entities and their sources by clicking them in the Entities block:

***************************************

A complete flow of the process is shown in this picture:

![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/flow1.PNG)

### Customisation

If you want to create your own chatbot (dialog) or different functions in Watson Discovery, a fundamental tutorial is here in [IBM badges](https://www.youracclaim.com/org/ibm/badge/discover-your-inner-chatbot-find-valuable-insights-with-ibm-watson).

## Ethical Consequences & Sustainability

Details about the report of ethical consequences and sustainability report are included in the folder named [documentation report](https://github.com/skrish30/hexology-demo/blob/master/Documentation%20Report/Documentation%20Report.docx).

## Record of meetings, requirements gathering, decisions taken & design history

### 13th May

So far the team has been working independently to do their own research, and they meet up soon to discuss what they have learnt and built. The workload has been split into two parts: 1. Webpage development 2. Work with IBM Discovery. Required skills like JavaScript are learnt based on different jobs. Several initial tutorials shared on the IBM Trello board have completed.

### 28th May

The team has successfully used Watson Discovery to extract concepts and keywords from a transcript of a TED Talk Video. Screenshots of the JSON Data output were shared with client using Skype.

To produce real-time interactions with Watson from a video source whilst the video is playing, is regarded as the future next plan.

To emulate the idea that Watson will analyse content and share information to the user in real-time, as if the user were at an event listening to a Keynote Speaker, it is agreed that the team will download the Ted Talk reference video to a server and stream it to Watson.

Streaming video gives Watson instant access to the video content at any point in the timeline whilst the video is playing. This in turn, enables the prototype to simulate the user experience of gathering information curated by Watson in Real-time whilst being at an event.

Downloading and streaming video from their own server gives the student team the chance to manage the media asset and deliver it to Watson in a controlled manor.

Furthermore, an investigation into the qualitative performance of real-time interactions with Watson will be tested by comparing a range of different outputs from Watson discovery, taken from different points in a transcript.

To be specific, the intention is to select a video transcript and Split it into a range of different lengths:

30 second in length from the start
60 seconds in length from the start
90 seconds in length from the start
120 seconds in length from the start

A comparison of these different outputs will give an insight into the way Watson understands narrative and how it unfolds over time.

In this respect, we anticipate that the outcome of this experiment will enable us to validate whether a real-time outputs produce an engaging user experience.

To facilitate this experiment and also for general use in the building of the prototype, hexology will select 4 to 6 videos from the Ted Website for the team to use as a resource.

#### Next steps:

It is agreed that the student team will develop the parts of the prototype that:

Download and store a Ted Talk Video to their server and stream it to Watson
Store the output from Watson Discovery, capturing video timecode

It is mutually understood that delivery of this functionality represents a key milestone in the development of the prototype, as it represents the part which captures and analyses content.

For the benefit of doubt, the remaining steps include:

how to personalise content Watson curates so that it is relevant to the user
how to display the content Watson curates

In addition is it possible to do a google search of any keywords or concepts?
Explore DBPedia which Watson seems to reference

#### Hexology will

Select sample videos from Ted Website and evaluate the output of these from Watson Discovery before our next meeting or Skype call.

The JSON output from Watson Discovery will be evaluated by Hexology to establish how to personalise the information Watson curates and will be discussed at our next meeting.

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
