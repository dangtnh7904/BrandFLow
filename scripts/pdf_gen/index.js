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
        
        // Remove H1 from markdown to avoid duplicate titles
        markdown = markdown.replace(/^#\s+(.+)$/m, '');

        // Extract Subtitle
        const subtitleMatch = markdown.match(/^\*\*(.+?)\*\*(?:\r?\n|$)/m);
        let subtitle = 'Exclusive Strategy';
        if (subtitleMatch) {
            subtitle = subtitleMatch[1];
            // Remove subtitle from markdown
            markdown = markdown.replace(/^\*\*(.+?)\*\*(?:\r?\n|$)/m, '');
        }

        // Clean up any leading horizontal rules (---) or empty lines that cause an empty page
        markdown = markdown.replace(/^[\s\r\n-]+/, '');

        // Convert MD to HTML
        let htmlContent = marked.parse(markdown);

        // === POST-PROCESS: Biến H2 thành Slide Divider cầu kỳ ===
        let chapterIndex = 0;
        htmlContent = htmlContent.replace(/<h2>(.*?)<\/h2>/gi, (match, chapterTitle) => {
            chapterIndex++;
            const chapterNum = String(chapterIndex).padStart(2, '0');
            return `
            <h2>
                <!-- Nền trang trí trừu tượng dạng lưới và glowing -->
                <div style="position:absolute; inset:0; z-index:0; overflow:hidden; background: #0f172a;">
                    <!-- Lưới tọa độ vàng mờ -->
                    <div style="position:absolute; inset:0; background-image: linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px); background-size: 60px 60px; background-position: center center;"></div>
                    
                    <!-- Họa tiết nhiễu hạt/Dots -->
                    <div style="position:absolute; inset:0; background-image: radial-gradient(rgba(212,175,55,0.15) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3;"></div>

                    <!-- Glowing orbs -->
                    <div style="position:absolute; top:-20%; left:-10%; width:70%; height:70%; background:radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%); filter:blur(60px);"></div>
                    <div style="position:absolute; bottom:-20%; right:-10%; width:70%; height:70%; background:radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%); filter:blur(60px);"></div>
                    <div style="position:absolute; top:40%; left:40%; width:30%; height:30%; background:radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%); filter:blur(40px);"></div>
                </div>

                <!-- Các đường viền góc (Corner Accents) sang trọng -->
                <div style="position:absolute; top:40px; left:40px; width:80px; height:80px; border-top:3px solid #d4af37; border-left:3px solid #d4af37; z-index:1; opacity: 0.8;"></div>
                <div style="position:absolute; bottom:40px; right:40px; width:80px; height:80px; border-bottom:3px solid #d4af37; border-right:3px solid #d4af37; z-index:1; opacity: 0.8;"></div>
                <div style="position:absolute; top:40px; right:40px; width:40px; height:40px; border-top:2px solid rgba(212,175,55,0.4); border-right:2px solid rgba(212,175,55,0.4); z-index:1;"></div>
                <div style="position:absolute; bottom:40px; left:40px; width:40px; height:40px; border-bottom:2px solid rgba(212,175,55,0.4); border-left:2px solid rgba(212,175,55,0.4); z-index:1;"></div>
                
                <!-- Khung viền mỏng bao quanh toàn trang -->
                <div style="position:absolute; top:20px; left:20px; right:20px; bottom:20px; border:1px solid rgba(212,175,55,0.15); z-index:1; pointer-events: none;"></div>

                <!-- Khối nội dung chính (Glassmorphism Card) -->
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; z-index:2; padding:5rem 4rem; width: 75%; max-width: 800px; 
                            background: rgba(15, 23, 42, 0.45); 
                            -webkit-backdrop-filter: blur(16px);
                            backdrop-filter: blur(16px); 
                            border: 1px solid rgba(212,175,55,0.25); 
                            border-radius: 24px;
                            box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(212,175,55,0.08);">
                    
                    <!-- Nhãn chương (Chapter Label) -->
                    <div style="display:flex; align-items:center; gap:1.5rem;">
                        <div style="height:2px; width:60px; background:linear-gradient(90deg, transparent, #d4af37);"></div>
                        <div style="font-family:'Inter',sans-serif; font-size:1.1rem; letter-spacing:0.5em; color:#d4af37; text-transform:uppercase; font-weight:700;">CHAPTER ${chapterNum}</div>
                        <div style="height:2px; width:60px; background:linear-gradient(270deg, transparent, #d4af37);"></div>
                    </div>
                    
                    <!-- Tiêu đề chương -->
                    <div style="font-size:3.5rem; font-family:'Playfair Display',serif; font-weight:800; line-height:1.25; color:#ffffff; text-align:center; text-shadow: 0 4px 16px rgba(0,0,0,0.6); max-width: 95%;">
                        ${chapterTitle}
                    </div>
                    
                    <!-- Icon hoặc họa tiết nhỏ ở giữa -->
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <div style="width: 6px; height: 6px; background: #d4af37; transform: rotate(45deg);"></div>
                        <div style="width: 8px; height: 8px; background: #d4af37; transform: rotate(45deg); opacity: 0.7;"></div>
                        <div style="width: 6px; height: 6px; background: #d4af37; transform: rotate(45deg);"></div>
                    </div>
                    
                    <!-- Tagline/Footer của Card -->
                    <div style="font-family:'Inter',sans-serif; font-size:0.85rem; letter-spacing:0.35em; color:rgba(212,175,55,0.75); text-transform:uppercase; margin-top:0.5rem; font-weight: 500;">
                        BRANDFLOW EXCLUSIVE STRATEGY
                    </div>
                </div>
            </h2>`;
        });

        // Read Template
        const templatePath = path.join(__dirname, 'template.html');
        let template = fs.readFileSync(templatePath, 'utf8');

        // Inject Data
        // Add Cover Page HTML
        const coverPageHtml = `
        <div class="cover-grid"></div>
        <div class="cover-frame"></div>
        <div class="cover-content">
            <div class="cover-brand">BRANDFLOW.AI</div>
            <div class="cover-title">${title}</div>
            <div class="cover-subtitle">${subtitle}</div>
            <div class="cover-divider"></div>
            <div class="cover-footer">EXECUTIVE BRIEFING • 2026 EDITION</div>
        </div>
        `;
        
        // Remove the old img tag from template and inject our cover HTML
        template = template.replace('<img src="{{COVER_IMAGE}}" alt="Cover" class="cover-image" />', coverPageHtml);
        
        // Add Title Page before content
        const titlePageHtml = `
        <div class="title-page">
            <div class="title-page-eyebrow">Strategic Masterclass</div>
            <div class="title-page-text">${title}</div>
            <div class="title-page-subtitle">${subtitle}</div>
            <div class="title-page-divider"></div>
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
