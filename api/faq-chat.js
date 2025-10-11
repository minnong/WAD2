export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful FAQ assistant for the ShareLah app. Only answer questions related to the app features, rentals, safety, or usage. Keep answers short and clear.',
          },
          { role: 'user', content: question },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I don’t have an answer for that yet.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ error: 'Failed to contact chatbot service' });
  }
}
