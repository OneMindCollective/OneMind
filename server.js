const express = require('express');
const cors = require('cors');

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/gpt', async (req, res) => {
    const prompt = req.body.prompt;
    const apiKey = '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';
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };
    const body = JSON.stringify({
		model: "gpt-4",
		messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
		max_tokens: 2000,
		temperature: 0.5,
	});

    try {
        const response = await fetch(url, { method: 'POST', headers: headers, body: body });
        const data = await response.json();
		console.log('GPT API response:', data);
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
			const assistantResponse = data.choices[0].message.content.trim();
			res.json({ result: assistantResponse });
		} else {
			res.json({ error: 'An error occurred while fetching the GPT response.', details: data });
		}

    } catch (error) {
    console.error('Error fetching GPT response:', error);
    res.status(500).json({ error: 'An error occurred while fetching the GPT response.', details: error.message });
	}
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});