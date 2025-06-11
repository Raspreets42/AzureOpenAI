require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Azure OpenAI configuration
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;

app.get('/', async (req,res) => {
    res.status(200).json({ message: `Server running on port ${port}` });
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        const response = await axios.post(
            `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2023-05-15`,
            {
                messages,
                max_tokens: 800,
                temperature: 0.7,
                frequency_penalty: 0,
                presence_penalty: 0,
                top_p: 0.95,
                stop: null
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_OPENAI_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Azure OpenAI:', error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});