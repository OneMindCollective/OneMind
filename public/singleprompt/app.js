document.getElementById('submit').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
	const customText = '';
	const modifiedUserInput = customText + userInput;
    const responseDiv = document.getElementById('response');

    if (!userInput) {
        responseDiv.innerHTML = 'Please enter text to generate a response.';
        return;
    }

    const result = await fetchGptResponse(modifiedUserInput);
    responseDiv.innerHTML = result;
});

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