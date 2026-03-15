const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, fp) => {
    if (fp.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

app.post('/api/claude', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        system: req.body.system,
        messages: req.body.messages
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SafewayFinder running on port ${PORT}`));
