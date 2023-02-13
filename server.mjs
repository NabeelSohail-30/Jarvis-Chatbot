import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
//import dotenv from 'dotenv';
//import { OpenAIApi, Configuration } from 'openai';
import dialogflow from 'dialogflow'
import { WebhookClient } from 'dialogflow-fulfillment'

/* const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "hello there\n\nHello there! What can I do for you?",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
}); */

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5001;

/*---------------------APIs--------------------------*/

/* const agent = new WebhookClient({ request: request, response: response });

app.post('/webhook', (request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    agent.handleRequest(request, response);
}); */

app.post('/webhook', (request, response) => {
    // Pass the request and response objects to the WebhookClient instance
    const agent = new WebhookClient({ request, response });

    // Add the logic to handle the intent here
    function Welcome(agent) {
        agent.add('Welcome from Server');
    }

    // Map the intent handler functions to the corresponding intent names
    let intentMap = new Map();
    intentMap.set('Welcome', Welcome);

    // Pass the intent map to the handleRequest method of the WebhookClient instance
    agent.handleRequest(intentMap);
});


/*---------------------Static Files--------------------------*/

const __dirname = path.resolve();
app.get('/', express.static(path.join(__dirname, "/Web/index.html")));
app.use('/', express.static(path.join(__dirname, "/Web")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
