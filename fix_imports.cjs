const fs = require("fs");
const path = require("path");

const dir = "src/pages/mobile";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Match all lucide-react imports
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
  
  let allIcons = new Set();
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const icons = match[1].split(",").map(s => s.trim()).filter(Boolean);
    icons.forEach(i => allIcons.add(i));
  }
  
  if (allIcons.size > 0) {
    // Remove all existing lucide-react imports
    content = content.replace(importRegex, "");
    
    // Add consolidated import after the React import
    const consolidatedImport = `import { ${Array.from(allIcons).join(", ")} } from "lucide-react";`;
    
    // Insert after first line
    const lines = content.split("\n");
    // Find last React import line
    let insertIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("import ") && lines[i].includes("react")) {
            insertIdx = i + 1;
        }
    }
    // We insert a blank line if needed
    lines.splice(insertIdx, 0, consolidatedImport);
    
    fs.writeFileSync(filePath, lines.join("\n"));
  }
}
console.log("Imports consolidated.");
