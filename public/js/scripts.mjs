document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("initialPromptSent")) {
        document.getElementById('initial-buttons').style.display = 'none';
        document.getElementById('chat-form').style.display = 'block';
        document.getElementById('new-case-button').style.display = 'block';
    } else {
        document.getElementById('chat-form').style.display = 'none';
        document.getElementById('new-case-button').style.display = 'none';
    }
});

let isLoading = false;

function setInitialPrompt(input) {
    if (isLoading) return;
    
    isLoading = true;
    disableAllButtons(true);
    
    const defaultPrompt = `I'm a medical student, and together, we’re going to create a diagnosis simulation. You'll provide me with information about ${input}-related diseases, and I'll try to guess the condition. Give me information step by step, without revealing everything at once. When I request tests or lab results, respond in a way that fits the simulation. Each time I ask a question, you'll give me one piece of information and then wait for my next question. At the end, I'll make a diagnosis, and you’ll confirm if it's correct or not and provide a final report. Don't make any guesses yourself; just answer my questions step by step so I can try to deduce the disease. Start with the patient's age, gender, and primary complaints.`;

    fetch('/set-initial-prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: defaultPrompt })
    })
    .then(response => response.json())
    .then(data => {
        const chatHistory = document.getElementById('chat-history');
        const modelResponseElement = document.createElement('p');
        modelResponseElement.innerHTML = `<strong>Model:</strong> ${data.message}`;
        chatHistory.appendChild(modelResponseElement);

        document.getElementById('initial-buttons').style.display = 'none';
        document.getElementById('chat-form').style.display = 'block';
        document.getElementById('new-case-button').style.display = 'block';
        sessionStorage.setItem("initialPromptSent", "true");
    })
    .catch(error => {
        console.error("An error occurred while sending the initial prompt:", error);
    })
    .finally(() => {
        isLoading = false;
        disableAllButtons(false);
    });
}

function resetChat() {
    if (isLoading) return;
    
    isLoading = true;
    disableAllButtons(true);
    
    fetch('/reset-chat', { method: 'POST' })
        .then(() => {
            sessionStorage.removeItem("initialPromptSent");
            document.getElementById('initial-buttons').style.display = 'block';
            document.getElementById('chat-form').style.display = 'none';
            document.getElementById('new-case-button').style.display = 'none';
            document.getElementById('chat-history').innerHTML = '';
        })
        .catch(error => {
            console.error("An error occurred while resetting the chat history:", error);
        })
        .finally(() => {
            isLoading = false;
            disableAllButtons(false);
        });
}

function disableAllButtons(disabled) {
    const initialButtons = document.getElementById('initial-buttons').getElementsByTagName('button');
    for (let button of initialButtons) {
        button.disabled = disabled;
    }
    
    const newCaseButton = document.getElementById('new-case-button');
    if (newCaseButton) {
        newCaseButton.disabled = disabled;
    }
    
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        const submitButton = chatForm.querySelector('button[type="submit"]');
        const textarea = chatForm.querySelector('textarea');
        if (submitButton) submitButton.disabled = disabled;
        if (textarea) textarea.disabled = disabled;
    }
}

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (isLoading) return;
    
    isLoading = true;
    disableAllButtons(true);
    
    const textarea = this.querySelector('textarea');
    const prompt = textarea.value;
    
    fetch('/send-prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(() => {
        window.location.reload();
    })
    .catch(error => {
        console.error("An error occurred while sending the prompt:", error);
        isLoading = false;
        disableAllButtons(false);
    });
});

window.setInitialPrompt = setInitialPrompt;
window.resetChat = resetChat;