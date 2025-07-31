export default async function handler(req, res) {
  // 🔒 Ασφαλής CORS ρύθμιση (όχι '*')
  const allowedOrigins = [
    'http://localhost:8080',
    'https://sigmalabs.gr'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🛑 Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();  // 204 No Content είναι πιο σωστό για OPTIONS
  }

  // 🚫 Μόνο POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');  // Προσθέτουμε Allow header για σωστό 405
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, systemPrompt } = req.body;

    // ✅ Έλεγχος για κενά μηνύματα
    if (!messages || !systemPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);  // Timeout 10 δευτ.

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.filter(m => m.content.trim())  // Φιλτράρουμε κενά μηνύματα
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return res.status(response.status).json({ 
        error: 'OpenAI API error',
        details: errorData
      });
    }

    // 🔄 Streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();  // Σημαντικό για SSE

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        res.write(chunk);
        // Εξασφαλίζουμε ότι τα δεδομένα αποστέλλονται αμέσως
        if (typeof res.flush === 'function') {
          res.flush();
        }
      }
    } finally {
      reader.releaseLock();
    }

    return res.end();

  } catch (error) {
    console.error('Server Error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}