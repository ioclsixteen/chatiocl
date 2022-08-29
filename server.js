const express = require("express");
//const { dialogflow } = require("actions-on-google");
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const https = require('https');
const fs = require('fs');
const express = require("express");

const app = express();
app.use(express.json());

//const config = require("./config/keys");


app.get('/',function(req,res) {
    const url = "https://chatiocl.herokuapp.com";
    https.get(url,function(response) {
        console.log(response);
        response.on("data",function(data) {
        const q = JSON.parse(data);
        res.send(q)
        })
    })
});

app.get("/about",function(request,response) {
  res.send("About");
})

const CREDENTIALS = JSON.parse(fs.readFileSync('C:/Users/00516016/Documents/my-express-server/order-boqx-9963a9b13beb.json'));


const PROJECT_ID = CREDENTIALS.project_id;
const CONFIGURATION = {
    credentials: {
        private_key:CREDENTIALS.private_key,
        client_email:CREDENTIALS.client_email
    }
};

app.post('/webhook',async function(req,res){
    // [START dialogflow_detect_intent_text]
  
    /**
     * TODO(developer): UPDATE these variables before running the sample.
     */
    // projectId: ID of the GCP project where Dialogflow agent is deployed
    // const projectId = 'PROJECT_ID';
    // sessionId: String representing a random number or hashed user identifier
    // const sessionId = '123456';
    // queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
    // const queries = [
    //   'Reserve a meeting room in Toronto office, there will be 5 of us',
    //   'Next monday at 3pm for 1 hour, please', // Tell the bot when the meeting is taking place
    //   'B'  // Rooms are defined on the Dialogflow agent, default options are A, B, or C
    // ]
    // languageCode: Indicates the language Dialogflow agent should use to detect intents
    // const languageCode = 'en';
  

    // Instantiates a session client
    const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);
    
      // The path to identify the agent that owns the created intent.
      const sessionId = uuid.v4();
      const sessionPath = sessionClient.projectAgentSessionPath(
        'order-boqx',
        sessionId,
      );
      console.log(sessionId);
  
      // The text query request.
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: req.body.text,
            languageCode: 'en',
          },
        },
      };
      
      console.log(request);
      const responses = await sessionClient.detectIntent(request);
      console.log(responses);
      console.log('Detected intent:');
      const result = responses[0].queryResult;

      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log('  No intent matched.');
      }
      res.send(responses);
     }
);

// const PROJECTID = CREDENTIALS.project_id;
// app.post('/webhook',async function(req,res) {

//     const sessionId = uuid.v4();
//     const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);
//     const sessionPath = sessionClient.projectAgentSessionPath(PROJECTID,sessionId);
//         // The text query request.
//     const request = {
//         session: sessionPath,
//         queryInput: {
//         text: {
//             // The query to send to the dialogflow agent
//             text: req.body.text,
//             // The language used by the client (en-US)
//             languageCode: 'en',
//         },
//         },
//     };
    
//     // Send request and log result
//     const responses = await sessionClient.detectIntent(request);
//     console.log('Detected intent');
//     const result = responses[0].queryResult;
//     console.log(`  Query: ${result.queryText}`);
//     console.log(`  Response: ${result.fulfillmentText}`);
//     if (result.intent) {
//         console.log(`  Intent: ${result.intent.displayName}`);
//     } else {
//         console.log(`  No intent matched.`);
//     }

//     res.send(result)
// })


app.post('/dialogflow',function(request,response) {
    let agent = new WebhookClient({request: request,response: response});

    let intentMap = new Map();

    intentMap.set('Sum',handleWebHookIntent);

    agent.handleRequest(intentMap);
});


function handleWebHookIntent(agent) {
    agent.add("Response from node server");
}


const PORT = process.env.PORT || 3001
app.listen(PORT,function() {
 console.log("Server is running on port "+ PORT);
});


