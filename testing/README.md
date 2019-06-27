## Test results
The log_example.log file is a copy of the log file generated when the program is working properly. The timing will be analysed by using the timestamp for the events which are recorded in the log file.

### Conversation with Chatbot and downloading video
![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/timeline1.png)
When the program is started, the user will talk to the chatbot and the time taken to input the interest will differ for every user therefore the timing for this is not shown. When the user inputs the URL, the video starts being downloaded. This takes 10s when connected to the internet with a download speed of 28.18Mbps. The next block in the sequence is the mp3 conversion which can only be done when the video is downloaded. Using the FFMPEG software and fluent-FFMPEG, this operation takes an additional 20s and therefore the setup time is 30s in total. However, in a conference setting, the organiser will live stream the video directly to our service and eliminate the setup time.

### Obtaining transcripts
![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/timeline2.png)
As soon as the audio is converted to mp3, the audio is streamed to the speech to text service and a result is returned when each sentence is completed. 

### Watson Discovery Query
![Alt Text](https://github.com/skrish30/hexology-demo/blob/master/GIF/timeline3.png)

The transcript is then uploaded every 30s and this step involves uploading a JSON file to the Watson Discovery Service. The uploading process takes around 12s and is the main bottleneck in the program. After the uploading process, the document is ingested into the Discovery Service and we can perform a query on the document. We are interested in the entities and concept enrichments of the documents and the necessary query takes an additional 2 seconds.

### Timing
The full timing diagram can be found using the [link](https://imperiallondon-my.sharepoint.com/:x:/g/personal/sk4316_ic_ac_uk/EfBzSnHvMPhOgD1cJNdGgYABG5-2dF3oIwTmVxznjJ9MAA?e=oLmkd2)

