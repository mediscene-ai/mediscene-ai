import express from 'express';
import axios from 'axios';
import { accessToken } from './auth.mjs';

const router = express.Router();
let chatHistory = [];

router.post('/set-initial-prompt', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await sendPromptToAIModel([{ role: "user", text: prompt }]);
        const modelResponse = response.candidates[0].content.parts[0].text;

        chatHistory.push({ role: "model", text: modelResponse });

        res.json({ message: modelResponse });
    } catch (error) {
        console.error("Error sending initial prompt to AI model:", error);
        res.status(500).send('Failed to connect to AI model');
    }
});

router.post('/reset-chat', (req, res) => {
    chatHistory = []; 
    res.sendStatus(200);
});

router.get('/chat', (req, res) => {
    res.render('chat', { chatHistory });
});

router.post('/send-prompt', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        if (!accessToken) {
            res.redirect('/login');
            return;
        }

        chatHistory.push({ role: "user", text: prompt });

        const response = await sendPromptToAIModel(chatHistory);
        chatHistory.push({ role: "model", text: response.candidates[0].content.parts[0].text });

        res.redirect('/chat');
    } catch (error) {
        console.error("Error sending prompt to AI model:", error);
        res.status(500).send('Failed to connect to AI model');
    }
});

async function sendPromptToAIModel(chatHistory) {
    const modelName = process.env.MODEL_NAME;
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(
            url,
            {
                contents: chatHistory.map(entry => ({
                    role: entry.role,
                    parts: [{ text: entry.text }]
                }))
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error sending prompt to AI model:", error.response ? error.response.data : error.message);
        throw new Error('Failed to connect to AI model');
    }
}

export { router as chatRoutes };
