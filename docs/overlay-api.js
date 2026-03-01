/**
 * ARK Games 2.0 - Overlay API
 * Updates timer and scores for ffmpeg compositor
 * 
 * Run: node overlay-api.js
 * Port: 3333
 */

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3333;
const TIMER_FILE = process.env.TIMER_FILE || '/tmp/ark_timer.txt';
const SCORES_FILE = process.env.SCORES_FILE || '/tmp/ark_scores.txt';

// Initialize files
fs.writeFileSync(TIMER_FILE, '00:00');
fs.writeFileSync(SCORES_FILE, 'Lane 1: --- | Lane 2: --- | Lane 3: ---');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      handleRequest(req, res, data);
    } catch (e) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

function handleRequest(req, res, data) {
  const url = req.url;
  const method = req.method;

  // POST /api/overlay/timer
  // Body: { "time": "05:30" } or { "seconds": 330 }
  if (method === 'POST' && url === '/api/overlay/timer') {
    let time = data.time;
    
    if (data.seconds !== undefined) {
      const min = Math.floor(data.seconds / 60);
      const sec = data.seconds % 60;
      time = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    
    if (!time) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Missing time or seconds' }));
      return;
    }
    
    fs.writeFileSync(TIMER_FILE, time);
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, timer: time }));
    return;
  }

  // POST /api/overlay/scores
  // Body: { "lanes": [{ "name": "🦁 Leoni", "score": "5:30" }, ...] }
  if (method === 'POST' && url === '/api/overlay/scores') {
    const lanes = data.lanes || [];
    const scoreText = lanes.map((l, i) => 
      `Lane ${i + 1}: ${l.name || '---'} ${l.score || ''}`
    ).join(' | ');
    
    fs.writeFileSync(SCORES_FILE, scoreText || 'No scores');
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, scores: scoreText }));
    return;
  }

  // POST /api/overlay/full
  // Body: { "timer": "05:30", "lanes": [...] }
  if (method === 'POST' && url === '/api/overlay/full') {
    if (data.timer) {
      fs.writeFileSync(TIMER_FILE, data.timer);
    }
    
    if (data.lanes) {
      const scoreText = data.lanes.map((l, i) => 
        `Lane ${i + 1}: ${l.name || '---'} ${l.score || ''}`
      ).join(' | ');
      fs.writeFileSync(SCORES_FILE, scoreText);
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // DELETE /api/overlay - Clear all
  if (method === 'DELETE' && url === '/api/overlay') {
    fs.writeFileSync(TIMER_FILE, '');
    fs.writeFileSync(SCORES_FILE, '');
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, message: 'Overlay cleared' }));
    return;
  }

  // GET /api/overlay - Get current state
  if (method === 'GET' && url === '/api/overlay') {
    const timer = fs.existsSync(TIMER_FILE) ? fs.readFileSync(TIMER_FILE, 'utf8') : '';
    const scores = fs.existsSync(SCORES_FILE) ? fs.readFileSync(SCORES_FILE, 'utf8') : '';
    
    res.writeHead(200);
    res.end(JSON.stringify({ timer, scores }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
}

server.listen(PORT, () => {
  console.log(`🎬 Overlay API running on http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /api/overlay/timer   - Update timer');
  console.log('  POST /api/overlay/scores  - Update scores');
  console.log('  POST /api/overlay/full    - Update both');
  console.log('  DELETE /api/overlay       - Clear overlay');
  console.log('  GET /api/overlay          - Get current state');
});
