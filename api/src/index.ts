import express from 'express';

const app = express();
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.listen(4000, () => console.log('API running on 4000'));
