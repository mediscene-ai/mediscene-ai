# Medi-Scene - Simulation Software in Medical Education

**Medi-Scene** is a medical simulation software that allows medical students to experience and practice clinical scenarios. Through virtual patients, it simulates step-by-step case management and diagnostic processes, supporting the development of essential medical skills such as emergency management, diagnosis, and patient assessment.

## Features

- **Clinical Scenarios**: Develops various clinical skills, including emergency management, patient assessment, and diagnosis.
- **Chat-Based Interface**: Users can ask questions related to medical scenarios and receive answers from an AI model to manage the case process.
- **Start New Case**: Allows users to transition between different cases, providing the opportunity to work on various scenarios.
- **Medical Topics**: Provides access to information in diverse medical fields, including physiology, biochemistry, pharmacology, and pediatrics.

## How It Was Created

Based on topics from the Medical Specialization Exam (TUS) and general medical education, datasets were created using copyright-free resources. This dataset, produced in a case-diagnosis simulation format, was fine-tuned using Gemini 1.0 Pro AI Studio.

<img width="1168" alt="Tuned Model" src="/images/tuned.png">

---

After successfully fine-tuning our model, we created case scenarios with various medical courses and tested our simulation with medical students, achieving successful results.

---

<img width="1168" alt="Aistudio chat history" src="/images/aistudio_chat.png">

---

Later, we adapted the cURL commands in [Google's documentation](https://ai.google.dev/gemini-api/docs/model-tuning/tutorial?lang=rest#try-model) to the node.js format. Since Google requires Google authentication to use fine-tuned models, we utilized the google-authentication module. We used `.mjs` extensions for JavaScript files due to the ease of ES modules. For the frontend, we used embedded JavaScript (.ejs). To optimize our model's performance, we developed various initial prompts and embedded them as buttons in the frontend.

---

<img width="1168" alt="Aistudio chat history" src="/images/home_page.jpeg">

---

<img width="1168" alt="Aistudio chat history" src="/images/chat_history.jpeg">

---

## Installation

To run this project in your local environment, follow these steps:

1. **Download Project Files**: 
    ```bash
    git clone https://github.com/furkanaknc/medi-scene-ai.git
    cd medisim
    ```

2. **Install Required Dependencies**:
    ```bash
    npm install
    ```

3. **Set Environment Variables**:
   Create a `.env` file and add the following environment variables:
   ```bash
    CLIENT_ID=<Google OAuth Client ID>
    CLIENT_SECRET=<Google OAuth Client Secret>
    REDIRECT_URI=<Google OAuth Redirect URI>
    GOOGLE_API_KEY=<Google API Key>
    MODEL_NAME=<AI Model Name>
    ```

4. **Start the Server**:
    ```bash
    npm start
    ```

5. **Access Medisim**:
    Go to `http://localhost:3000/login` in your browser to start the simulation.

## Usage

### Case Management
The user can select a medical field through the buttons displayed on the screen and then enter questions related to the scenario. The AI model supports the case process by providing appropriate answers to the user’s questions.

1. **Initial Case Selection**: Start the scenario by selecting a medical field.
2. **Question-Answer Process**: Throughout the scenario, the user asks questions about the condition and manages the diagnosis process.
3. **New Case**: Continue the training by switching to a different scenario using the “New Case” button.

### Interface
- **Prompt Area**: Users can enter medical questions in this area.
- **Chat History**: This section lists the user’s questions and the AI model’s responses.

## Packages Used

- `express`: For server creation and routing
- `ejs`: Template engine
- `googleapis` and `google-auth-library`: For Google authentication connections
- `dotenv`: Environment variables
- `axios`: For HTTP and cURL connections
- `nodemon`: Automatic restart during development
