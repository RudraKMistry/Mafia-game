const fs = require('fs');
const html = fs.readFileSync('scratch_mobile_ui/stitch_mafia_mobile_ui_1/mafia_home_mobile_ratio/code.html', 'utf-8');

const match = html.match(/tailwind\.config = (\{[\s\S]*?\});/);
if (match) {
    const config = eval(`(${match[1]})`);
    let themeCss = '@theme {\n';
    
    if (config.theme.extend.colors) {
        for (const [key, value] of Object.entries(config.theme.extend.colors)) {
            themeCss += `  --color-${key}: ${value};\n`;
        }
    }
    
    if (config.theme.extend.fontFamily) {
        for (const [key, value] of Object.entries(config.theme.extend.fontFamily)) {
            themeCss += `  --font-${key}: '${value[0]}', sans-serif;\n`;
        }
    }
    
    themeCss += '}\n\n';
    
    // Extract custom styles
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        // Namespace the styles to avoid desktop collision
        let styles = styleMatch[1].trim();
        styles = styles.replace(/\.paper-texture/g, '.m-paper-texture');
        styles = styles.replace(/\.desk-texture/g, '.m-desk-texture');
        themeCss += styles;
    }
    
    fs.writeFileSync('src/mobile.css', themeCss);
    console.log('Extraction complete. Saved to src/mobile.css');
}
