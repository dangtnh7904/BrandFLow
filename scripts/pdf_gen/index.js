const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { chromium } = require('playwright');

const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\8e99eaca-ed08-4972-ae5d-1588732cef7b';
const PUBLIC_DIR = path.resolve(__dirname, '../../frontend/public/resources');

async function generatePDF(mdFile, pdfFile, coverImage) {
    try {
        console.log(`\n=== Generating ${pdfFile} ===`);
        const mdPath = path.join(ARTIFACTS_DIR, mdFile);
        let markdown = fs.readFileSync(mdPath, 'utf8');
        
        // Remove markdown image syntax that points to the cover image or divider
        // because we handle cover image separately, and divider can be a horizontal rule
        markdown = markdown.replace(/!\[.*?\]\(.*?\)/g, '');
        
        // Convert alerts to blockquotes
        markdown = markdown.replace(/> \[!.*?\]/g, '>');

        // Extract Title
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'BRANDFLOW MASTERCLASS';

        // Convert MD to HTML
        let htmlContent = marked.parse(markdown);

        // Read Template
        const templatePath = path.join(__dirname, 'template.html');
        let template = fs.readFileSync(templatePath, 'utf8');

        // Inject Data
        // Path to the cover image must be absolute file:// for playwright to load local files
        const absoluteCoverPath = `file:///${coverImage.replace(/\\/g, '/')}`;
        template = template.replace('{{COVER_IMAGE}}', absoluteCoverPath);
        
        // Add Title Page before content
        const titlePageHtml = `
        <div class="title-page">
            <div class="title-page-text">${title}</div>
            <div class="title-page-footer">CONFIDENTIAL • FOR C-LEVEL ONLY • BRANDFLOW STRATEGY</div>
        </div>
        `;
        template = template.replace('{{CONTENT}}', titlePageHtml + htmlContent);

        // Save temp HTML
        const tempHtmlPath = path.join(__dirname, 'temp.html');
        fs.writeFileSync(tempHtmlPath, template);

        // Launch Playwright
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Go to local HTML file
        await page.goto(`file:///${tempHtmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });

        // Wait for fonts to load
        await page.evaluate(() => document.fonts.ready);

        // Generate PDF
        const outPath = path.join(PUBLIC_DIR, pdfFile);
        
        // Header & Footer template
        const headerTemplate = `
            <div style="font-size: 8px; font-family: 'Inter', sans-serif; color: #94a3b8; width: 100%; text-align: right; padding-right: 20mm;">
                ${title.toUpperCase()}
            </div>
        `;
        const footerTemplate = `
            <div style="font-size: 10px; font-family: 'Inter', sans-serif; color: #64748b; width: 100%; display: flex; justify-content: space-between; padding: 0 20mm;">
                <span>BRANDFLOW.AI</span>
                <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
            </div>
        `;

        await page.pdf({
            path: outPath,
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            margin: { top: '25mm', right: '20mm', bottom: '25mm', left: '20mm' }
        });

        await browser.close();
        fs.unlinkSync(tempHtmlPath);

        console.log(`✅ Successfully created: ${outPath}`);
    } catch (err) {
        console.error(`❌ Error generating ${pdfFile}:`, err);
    }
}

async function main() {
    // Ebook 1
    await generatePDF(
        'high_end_ebook_ai.md',
        'THE_AI_POWERED_SME.pdf',
        path.join(ARTIFACTS_DIR, 'ai_marketing_cover_1780228497849.png')
    );

    // Ebook 2
    await generatePDF(
        'high_end_guideline_branding.md',
        'BRANDING_MASTERCLASS.pdf',
        path.join(ARTIFACTS_DIR, 'branding_masterclass_cover_1780228518941.png')
    );

    // Ebook 3
    await generatePDF(
        'high_end_ebook_marketing_plan.md',
        'MARKETING_PLAN_MASTERCLASS.pdf',
        path.join(ARTIFACTS_DIR, 'marketing_plan_cover_1780233786494.png')
    );
}

main();
