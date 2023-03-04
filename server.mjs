import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import { OpenAIApi, Configuration } from 'openai';
import dialogflow from 'dialogflow'
import { WebhookClient } from 'dialogflow-fulfillment'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const textGeneration = async (prompt) => {

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Human: ${prompt}\nAI: `,
            temperature: 0.9,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
        });
        console.log(response);

        return {
            status: 1,
            response: `${response.data.choices[0].text}`
        };
    } catch (error) {
        console.log("error: ", error.response.data);
        return {
            status: 0,
            response: ''
        };
    }
};

const app = express()
app.use(express.json())
app.use(cors())
app.use(urlencoded({ extended: true }));
app.use(json());
app.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});


app.get('/', (req, res) => {
    res.sendStatus(200);
});
const port = process.env.PORT || 5001;

/*---------------------APIs--------------------------*/

app.post('/webhook', async (req, res) => {

    let result = await textGeneration(req.body.text);

    res.send({ text: result.response });

});


/*---------------------Static Files--------------------------*/

const __dirname = path.resolve();
app.get('/', express.static(path.join(__dirname, "/Web/index.html")));
app.use('/', express.static(path.join(__dirname, "/Web")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
