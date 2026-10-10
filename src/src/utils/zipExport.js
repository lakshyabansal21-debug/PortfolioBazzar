/**
 * zipExport.js: Download helpers: a ZIP (index.html, style.css, script.js, README, assets/) or one single HTML file.
 */
import { saveAs } from 'file-saver';
import { buildSingleFileHtml } from './portfolioReader.js';
import { stripFieldDefs } from './editableFields.js';

/**
 * Generates and downloads a complete, offline-ready portfolio ZIP file
 * containing index.html, style.css, script.js, and documentation.
 */
export async function downloadPortfolioZip({ html, css, js, templateName = 'portfolio', authorName = 'Developer', zipName }) {
  try {
    const { default: JSZip } = await import('jszip'); // loaded only when someone downloads
    const zip = new JSZip();

    // 1. Add core files
    zip.file('index.html', stripFieldDefs(html));
    zip.file('style.css', css);
    zip.file('script.js', js);

    // 2. Add documentation & instructions
    const readmeContent = `# ${authorName}'s Portfolio Website
Generated with PortfolioHub AI (${templateName} Edition)

## 🚀 How to Use & Host
1. **Offline Preview**: Simply double-click \`index.html\` to view your portfolio in any web browser without needing a server!
2. **Deploy for Free**:
   - **GitHub Pages**: Create a repository named \`<your-username>.github.io\`, upload these files, and your portfolio will be live in 60 seconds.
   - **Vercel / Netlify**: Drag & drop this extracted folder onto https://vercel.com or https://netlify.com.
3. **Customization**:
   - Edit \`index.html\` to update text and links.
   - Modify \`style.css\` to tweak fonts, colors, or spacing.
   - Update \`script.js\` for interactive scripts.

Enjoy your new high-performance portfolio!
Created on PortfolioHub AI (https://portfoliohub.ai)
`;
    zip.file('README.md', readmeContent);

    // 3. Create assets folder with a placeholder indicator
    const assetsFolder = zip.folder('assets');
    assetsFolder.file('.gitkeep', '');

    // 4. Generate ZIP blob
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // 5. Trigger download
    const cleanFilename = zipName || `${authorName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${templateName.toLowerCase()}-portfolio.zip`;
    saveAs(content, cleanFilename);

    return { success: true, filename: cleanFilename };
  } catch (error) {
    console.error('Error generating portfolio zip:', error);
    throw error;
  }
}

/**
 * Downloads the portfolio as ONE self-contained .html file
 * (CSS and JS are inlined, so it opens by double-click and can be uploaded anywhere).
 */
export function downloadSingleHtml({ html, css, js, fileName = 'portfolio' }) {
  const output = buildSingleFileHtml(html, css, js);
  const clean = fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'portfolio';
  const filename = `${clean}.html`;
  saveAs(new Blob([output], { type: 'text/html;charset=utf-8' }), filename);
  return { success: true, filename };
}
