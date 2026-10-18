// scripts/devtools_test.js
// Chrome DevTools Protocol automated test harness for Anukool store
const { spawn } = require('child_process');
const http = require('http');

async function testPage(targetUrl = 'http://127.0.0.1:5173/', screenshotPath = null) {
  const port = 9222 + Math.floor(Math.random() * 500);
  const chrome = spawn('/Applications/Chromium.app/Contents/MacOS/Chromium', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=/tmp/chromium_cdp_${port}`,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,1024',
    targetUrl
  ]);

  try {
    // Wait for CDP endpoint
    let wsUrl = null;
    let spawnError = null;
    chrome.stderr.on('data', d => {
      // capture any fatal error
      const s = d.toString();
      if (s.includes('FATAL') || s.includes('ERROR:')) spawnError = s;
    });

    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const targets = await res.json();
        const pageTarget = targets.find(t => t.type === 'page');
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          wsUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }

    if (!wsUrl) throw new Error(`Could not connect to Chromium DevTools endpoint on port ${port}. ${spawnError || ''}`);

    const WebSocket = global.WebSocket || require('ws');
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    const consoleLogs = [];
    const errors = [];
    let id = 1;

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
        errors.push(desc);
      }
    };

    await send('Runtime.enable');
    await send('Console.enable');
    await send('Page.enable');

    // Wait for client rendering & any network fetches
    await new Promise(r => setTimeout(r, 2000));

    // Capture screenshot if requested
    if (screenshotPath) {
      const fs = require('fs');
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(screenshotPath, Buffer.from(data, 'base64'));
    }

    // Inspect DOM element count
    const evalRes = await send('Runtime.evaluate', {
      expression: 'document.querySelectorAll("*").length'
    });
    const domCount = evalRes.result?.value || 0;

    ws.close();
    chrome.kill();

    return {
      url: targetUrl,
      domCount,
      errors,
      consoleLogs,
      clean: errors.length === 0
    };
  } finally {
    try { chrome.kill(); } catch {}
  }
}

// CLI invocation
const url = process.argv[2] || 'http://127.0.0.1:5173/';
const screenshot = process.argv[3] || null;

testPage(url, screenshot).then(res => {
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.clean ? 0 : 1);
}).catch(err => {
  console.error('Fatal DevTools Test Error:', err);
  process.exit(1);
});
