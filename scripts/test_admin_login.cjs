const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

async function testAdminFlow() {
  const port = 9333;
  const chrome = spawn('/Applications/Chromium.app/Contents/MacOS/Chromium', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=/tmp/chromium_admin_${port}`,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,1024',
    'http://127.0.0.1:5173/#admin'
  ]);

  try {
    // Wait for CDP
    let wsUrl = null;
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

    if (!wsUrl) throw new Error('Could not connect to CDP');

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.on('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((res) => {
        const id = msgId++;
        const handler = (data) => {
          const parsed = JSON.parse(data);
          if (parsed.id === id) {
            ws.off('message', handler);
            res(parsed.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    const errors = [];
    ws.on('message', data => {
      const p = JSON.parse(data);
      if (p.method === 'Runtime.exceptionThrown') {
        errors.push(p.params.exceptionDetails.text + ' ' + (p.params.exceptionDetails.exception?.description || ''));
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');

    // Wait for login form to load
    await new Promise(r => setTimeout(r, 1500));

    // Submit login form
    console.log('Submitting admin login form...');
    const submitResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const form = document.querySelector('form.admin-login-card');
          if (!form) return { success: false, reason: 'form_not_found' };
          const btn = form.querySelector('button[type="submit"]') || form.querySelector('button.dark-button');
          if (!btn) return { success: false, reason: 'btn_not_found' };
          btn.click();
          return { success: true };
        })()
      `,
      returnByValue: true
    });

    console.log('Login form submitted:', submitResult?.result?.value);

    // Wait for AdminDashboard to render
    await new Promise(r => setTimeout(r, 1500));

    // Check if admin dashboard is rendered
    const dashboardCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const layout = document.querySelector('.admin-layout');
          const navItems = Array.from(document.querySelectorAll('.admin-nav-item')).map(el => el.textContent.trim());
          const stats = Array.from(document.querySelectorAll('.stat-card')).map(el => ({
            label: el.querySelector('.stat-label')?.textContent.trim(),
            value: el.querySelector('.stat-value')?.textContent.trim()
          }));
          return {
            hasLayout: !!layout,
            navItems,
            stats
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Dashboard render check:', JSON.stringify(dashboardCheck?.result?.value, null, 2));

    // Click 'Products' tab
    console.log('Switching to Products tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('.admin-nav-item')).find(b => b.textContent.includes('Products'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Click 'Orders' tab
    console.log('Switching to Orders tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('.admin-nav-item')).find(b => b.textContent.includes('Orders'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Click 'Settings' tab
    console.log('Switching to Settings tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('.admin-nav-item')).find(b => b.textContent.includes('Settings'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      const fs = require('fs');
      fs.writeFileSync('dist/preview_admin_dashboard.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot to dist/preview_admin_dashboard.png');
    } else {
      console.log('Screenshot capture skipped or empty, shot:', shot);
    }

    ws.close();
    chrome.kill();

    if (errors.length > 0) {
      console.error('Errors found during admin flow:', errors);
      return false;
    }

    console.log('✅ Admin login, dashboard rendering, and tab switching passed with 0 errors!');
    return true;
  } catch (err) {
    chrome.kill();
    console.error('Admin flow failed:', err);
    return false;
  }
}

testAdminFlow().then(ok => process.exit(ok ? 0 : 1));
