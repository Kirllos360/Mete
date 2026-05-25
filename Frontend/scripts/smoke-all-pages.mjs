import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from 'playwright';

const PORT = Number(process.env.SMOKE_PORT || 3100);
const BASE_URL = `http://localhost:${PORT}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 120000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await sleep(500);
  }

  throw new Error(`Server did not become ready at ${url} within ${timeoutMs}ms`);
}

function startAppServer() {
  const output = [];

  const proc = spawn('bunx', ['next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(),
    env: { ...process.env, FORCE_COLOR: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stdout?.on('data', (chunk) => output.push(String(chunk)));
  proc.stderr?.on('data', (chunk) => output.push(String(chunk)));

  return {
    proc,
    getOutput: () => output.join(''),
  };
}

async function stopAppServer(proc) {
  if (!proc || proc.killed) return;

  proc.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => proc.once('exit', resolve)),
    sleep(4000),
  ]);

  if (!proc.killed) {
    proc.kill('SIGKILL');
  }
}

async function run() {
  const { proc: appServer, getOutput } = startAppServer();
  const visited = [];
  const consoleErrors = [];
  let browser;

  try {
    await waitForServer(BASE_URL);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const wait = (ms = 350) => page.waitForTimeout(ms);
    const navButton = (name) => page.getByRole('button', { name, exact: true }).first();

    const clickNav = async (name) => {
      const btn = navButton(name);
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await wait();
      visited.push(name);
    };

    const clickChild = async (parent, child) => {
      const childBtn = navButton(child);

      if (!(await childBtn.isVisible().catch(() => false))) {
        const parentBtn = navButton(parent);
        await parentBtn.scrollIntoViewIfNeeded();
        await parentBtn.click();
        await wait(250);
      }

      await childBtn.scrollIntoViewIfNeeded();
      await childBtn.click();
      await wait();
      visited.push(`${parent} > ${child}`);
    };

    const openFirstTableRow = async (label, expectedMarker) => {
      const rows = page.locator('table tbody tr');
      if ((await rows.count()) === 0) {
        throw new Error(`No table rows found while opening ${label}`);
      }

      await rows.first().click();
      await wait(600);

      if (expectedMarker) {
        const markerVisible = await page.getByText(expectedMarker).first().isVisible().catch(() => false);
        if (!markerVisible) {
          throw new Error(`${label} did not render expected marker: ${expectedMarker}`);
        }
      }

      visited.push(label);
    };

    await page.goto(`${BASE_URL}/`);
    await wait(700);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await wait(900);
    visited.push('login -> dashboard');

    const mainPages = [
      'Dashboard',
      'Projects',
      'Locations',
      'Customers',
      'SIM Cards',
      'Consumption',
      'Water Balance',
      'Invoices',
      'Payments',
      'Balances',
      'Reports',
      'Alerts',
      'Tickets',
      'Support',
      'Settings',
    ];

    for (const pageName of mainPages) {
      await clickNav(pageName);
    }

    await clickChild('Meters', 'All Meters');
    await clickChild('Meters', 'Assign Meter');
    await clickChild('Meters', 'Replace Meter');
    await clickChild('Meters', 'Terminate Meter');
    await clickChild('Readings', 'All Readings');
    await clickChild('Readings', 'New Reading');

    await clickNav('Projects');
    await openFirstTableRow('Project Detail', 'Project Info');

    await clickNav('Customers');
    await openFirstTableRow('Customer Detail', 'Customer Info');

    await clickChild('Meters', 'All Meters');
    await openFirstTableRow('Meter Detail', 'Reading History');

    await clickNav('Invoices');
    await openFirstTableRow('Invoice Detail', 'Line Items');

    if (consoleErrors.length > 0) {
      const unique = [...new Set(consoleErrors)];
      throw new Error(`Console errors detected:\n${unique.join('\n---\n')}`);
    }

    console.log('Smoke test passed.');
    console.log(`Visited ${visited.length} views.`);
    for (const view of visited) {
      console.log(`- ${view}`);
    }
  } catch (error) {
    console.error('Smoke test failed.');
    console.error(error);
    console.error('\nApp server output:\n');
    console.error(getOutput());
    process.exitCode = 1;
  } finally {
    await browser?.close();
    await stopAppServer(appServer);
  }
}

await run();
