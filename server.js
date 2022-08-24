const express = require("express");

const app = express();
app.use(express.json())


app.get("/",function(request,response) {
response.send("<h1>Server is up and working</h1>");
});

app.get("/about",function(request,response) {
    response.send("About Page")
})


app.post('/dialogflow',function(request,response) {
let agent = new WebhookClient({request: request,response: response});

let intentMap = new Map();

intentMap.set('Sum',handleWebHookIntent);

agent.handleRequest(intentMap);
});


function handleWebHookIntent(agent) {
    agent.add("Response from node server");
}


const PORT = process.env.PORT || 3000
app.listen(PORT,function() {
 console.log("Server is running on port 3000");
});

