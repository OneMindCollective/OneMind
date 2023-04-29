document.getElementById('submit').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatHistory = document.getElementById('chat-history');

    if (!userInput) {
        return;
    }

    // Add user message to chat history
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.textContent = userInput;
    chatHistory.appendChild(userMessage);

    document.getElementById('user-input').value = '';

    // Fetch GPT response
    const result = await fetchGptResponse(userInput);

    // Add GPT response to chat history
    const assistantMessage = document.createElement('div');
    assistantMessage.className = 'chat-message assistant-message';
    assistantMessage.textContent = result;
    chatHistory.appendChild(assistantMessage);

    // Scroll to the bottom of the chat history
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function fetchGptResponse(prompt) {
    const url = '/api/gpt';
    const headers = {
        'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
        prompt: prompt,
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        const data = await response.json();
        if (data.result) {
            return data.result;
        } else {
            console.error('Server-side error:', data.details);
            return data.error;
        }
    } catch (error) {
        console.error('Error fetching GPT response:', error);
        return 'An error occurred while fetching the GPT response.';
    }
}
