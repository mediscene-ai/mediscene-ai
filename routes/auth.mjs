import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

const router = express.Router();
let oAuth2Client;
let accessToken = null;

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUris = process.env.REDIRECT_URI;

oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUris);

router.get('/login', (req, res) => {
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/cloud-platform',
            'https://www.googleapis.com/auth/generative-language.retriever',
            'https://www.googleapis.com/auth/generative-language.tuning'
        ]
    });
    res.redirect(url);
});

router.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;

    if (code) {
        try {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);
            accessToken = tokens.access_token;

            res.redirect('/chat');
        } catch (error) {
            console.error("Error during OAuth callback:", error);
            res.status(500).send('Authentication failed');
        }
    } else {
        res.status(400).send('No code provided');
    }
});

export { router as authRoutes, oAuth2Client, accessToken };
