const { chromium } = require('playwright');
const fs = require('fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  fs.mkdirSync('verification', { recursive: true });
  for (const width of [360,390,412,1366,1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:8080');
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; } * { transition: none !important; }' });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(a => a.hash.length > 1 && !document.getElementById(a.hash.slice(1))).map(a => a.hash)), []);
    const config = await page.evaluate(() => ({ whatsapp: WHATSAPP_NUMBER, phone: PHONE_NUMBER, email: CONTACT_EMAIL, facebook: FACEBOOK_URL }));
    for (const link of await page.locator('[data-contact]').all()) {
      const channel = await link.getAttribute('data-contact');
      const href = await link.getAttribute('href');
      if (channel === 'whatsapp') assert.equal(new URL(href).pathname, '/' + config.whatsapp);
      if (channel === 'phone') assert.equal(href, 'tel:' + config.phone);
      if (channel === 'email') assert.equal(href.split('?')[0], 'mailto:' + config.email);
      if (channel === 'facebook') assert.equal(href, config.facebook);
      assert.equal(await link.getAttribute('target'), ['whatsapp','facebook'].includes(channel) ? '_blank' : null);
    }
    assert.equal(await page.locator('footer .contact-icon').count(), 4);
    assert.equal(await page.locator('footer [data-official-logo]').evaluate(img => getComputedStyle(img).backgroundColor), 'rgb(255, 255, 255)');
    if (width < 1050) {
      await page.locator('#menuBtn').click();
      assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'), 'true');
      await page.locator('#menu a[href="#servicios"]').click();
      assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'), 'false');
    }
    await page.locator('[data-lost]').first().click();
    assert.equal(await page.locator('#reportType').inputValue(), 'Objeto olvidado');
    await page.locator('#reportName').fill('NO INCLUIR');
    await page.locator('#anonymous').check();
    for (const id of ['reportName','reportPhone','reportEmail']) assert(await page.locator('#'+id).isDisabled());
    await page.locator('#description').fill('Objeto olvidado durante el recorrido de prueba.');
    await page.evaluate(() => { window.open = (url, target) => { window.lastReport = { url, target }; }; });
    await page.locator('#reportForm button[value="whatsapp"]').click();
    const sent = await page.evaluate(() => window.lastReport);
    const report = new URL(sent.url);
    assert.equal(report.pathname, '/' + config.whatsapp);
    assert.equal(sent.target, '_blank');
    assert(report.searchParams.get('text').includes('Reporte anónimo'));
    assert(!report.searchParams.get('text').includes('NO INCLUIR'));
    await page.locator('#anonymous').uncheck();
    await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('active')); scrollTo(0,0); });
    await page.screenshot({ path: `verification/page-${width}.png`, fullPage: true });
    console.log(`${width}px: contactos, iconos, fondo blanco, menú y reportes correctos`);
  }
  const session = await page.context().newCDPSession(page);
  await session.send('Page.enable');
  const navigation = new Promise(resolve => session.on('Page.frameRequestedNavigation', event => { if (event.url.startsWith('mailto:')) resolve(event.url); }));
  await page.locator('#reportForm button[value="email"]').click();
  const emailURL = await Promise.race([navigation, new Promise((_, reject) => setTimeout(() => reject(new Error('No se generó el correo')), 5000))]);
  const email = new URL(emailURL);
  assert.equal(email.pathname, await page.evaluate(() => CONTACT_EMAIL));
  assert(email.searchParams.get('body').includes('Objeto olvidado'));
  assert(email.searchParams.get('body').includes('NO INCLUIR'));
  assert.deepEqual(errors, []);
  console.log('Correo preparado y consola: correctos. No se enviaron mensajes.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
