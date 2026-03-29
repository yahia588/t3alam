export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages } = req.body;

  // Build messages array with system prompt as first message
  const groqMessages = [
    { role: 'system', content: system },
    ...messages
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: groqMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // Return in a simple format the frontend can use
    const text = data.choices?.[0]?.message?.content || 'عذراً، حدث خطأ.';
    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
