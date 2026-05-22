const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to A4 size approximately
  await page.setViewport({ width: 794, height: 1122, deviceScaleFactor: 2 });
  
  console.log('Navigating to http://localhost:3000/onepager ...');
  try {
    await page.goto('http://localhost:3000/onepager', { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log('Could not load the page. Make sure the Next.js server is running on port 3000.');
    process.exit(1);
  }

  const pdfPath = path.join(__dirname, '..', 'docs', 'BrandFlow_PitchDeck.pdf');
  console.log(`Exporting PDF to ${pdfPath} ...`);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log('PDF generated successfully!');
  await browser.close();
})();
