const fs = require("fs");
const path = require("path");

const iconMap = {
  "folder_open": "FolderOpen",
  "admin_panel_settings": "Settings",
  "person": "User",
  "smart_toy": "Bot",
  "fingerprint": "Fingerprint",
  "person_add": "UserPlus",
  "expand_more": "ChevronDown",
  "play_arrow": "Play",
  "star": "Star",
  "emoji_events": "Trophy",
  "skull": "Skull",
  "arrow_back": "ArrowLeft",
  "visibility": "Eye",
  "history_edu": "History",
  "done": "Check"
};

const dir = "src/pages/mobile";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  let iconsToImport = new Set();
  
  // Replace <span className="material-symbols-outlined ...">icon_name</span>
  content = content.replace(/<span[^>]*className="material-symbols-outlined([^"]*)"[^>]*>([^<]+)<\/span>/g, (match, classNames, iconName) => {
    iconName = iconName.trim();
    if (iconMap[iconName]) {
      iconsToImport.add(iconMap[iconName]);
      const cls = classNames.trim();
      return `<${iconMap[iconName]} className="${cls || 'w-6 h-6'}" />`;
    }
    return match;
  });

  content = content.replace(/style=\{\{\s*fontSize:\s*'[^']+'\s*\}\}/g, "");
  content = content.replace(/style=\{\{\s*fontSize:\s*'[^']+',\s*lineHeight:\s*'[^']+'\s*\}\}/g, "");
  content = content.replace(/min-h-\[751px\]/g, "min-h-[70vh]");
  content = content.replace(/min-h-\[1051px\]/g, "min-h-[85vh]");
  content = content.replace(/min-h-\[353px\]/g, "min-h-[50vh]");
  content = content.replace(/text-\[32px\]/g, "text-3xl");
  content = content.replace(/text-\[64px\]/g, "text-6xl");
  content = content.replace(/text-\[14px\]/g, "text-sm");
  content = content.replace(/text-\[18px\]/g, "text-lg");

  if (iconsToImport.size > 0) {
    const importStr = `import { ${Array.from(iconsToImport).join(", ")} } from "lucide-react";\n`;
    const lines = content.split('\n');
    lines.splice(1, 0, importStr);
    content = lines.join('\n');
  }

  fs.writeFileSync(filePath, content);
}
console.log("Replaced icons and fixed dimensions.");
