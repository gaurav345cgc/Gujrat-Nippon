const fs = require('fs');
const path = require('path');

const files = [
    'd:/GitHub/GNIL/gujarat-nippon/components/HomeServices.tsx',
    'd:/GitHub/GNIL/gujarat-nippon/components/HomeProducts.tsx',
    'd:/GitHub/GNIL/gujarat-nippon/components/HomeIndustries.tsx',
    'd:/GitHub/GNIL/gujarat-nippon/components/HomeAdvantage.tsx',
    'd:/GitHub/GNIL/gujarat-nippon/components/HomeAbout.tsx',
    'd:/GitHub/GNIL/gujarat-nippon/components/Hero.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove import
    content = content.replace(/import\s+\{\s*motion\s*\}\s+from\s+['"]framer-motion['"];?\n?/g, '');

    // Replace <motion.tag with <tag
    content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
    content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');

    // Remove motion props (initial, animate, whileInView, variants, viewport, transition, onViewportEnter)
    // Note: This regex might be tricky if props span multiple lines.
    // Let's use a simpler approach for multiline props:
    content = content.replace(/\binitial=\{[^}]+\}/g, '');
    content = content.replace(/\initial="[^"]+"/g, '');
    content = content.replace(/\banimate=\{[^}]+\}/g, '');
    content = content.replace(/\banimate="[^"]+"/g, '');
    content = content.replace(/\bwhileInView=\{[^}]+\}/g, '');
    content = content.replace(/\bwhileInView="[^"]+"/g, '');
    // Variants can be complex with nested {}
    content = content.replace(/\bvariants=\{\{[\s\S]*?\}\}\}/g, ''); // try to match variants={{ ... }}
    content = content.replace(/\bviewport=\{\{[^}]+\}\}/g, '');
    content = content.replace(/\btransition=\{\{[^}]+\}\}/g, '');
    content = content.replace(/\onViewportEnter=\{[^}]+\}/g, '');

    // In HomeIndustries.tsx string splitting animation
    if (file.includes('HomeIndustries')) {
        content = content.replace(/\{"We serve a wide range of industries, including manufacturing, automation, electrical supplies, and more, providing solutions that drive efficiencies\."\.split\(" "\)\.map\(\(([^)]+)\) => \([\s\S]*?<\/span>[\s\n]*\)\)\}/g,
            '"We serve a wide range of industries, including manufacturing, automation, electrical supplies, and more, providing solutions that drive efficiencies."');
    }

    // In HomeAdvantage.tsx there might be a split mapped animation
    if (file.includes('HomeAdvantage')) {
        content = content.replace(/\{"One Point Engineering Solutions"\.split\(" "\)\.map\(\(([^)]+)\) => \([\s\S]*?<\/span>[\s\n]*\)\)\}/g,
            '"One Point Engineering Solutions"');
    }

    // Clean up empty lines or trailing spaces within tags
    content = content.replace(/\s+>/g, '>');

    fs.writeFileSync(file, content);
    console.log("Cleaned", file);
});
