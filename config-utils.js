const path = require('path');
const fs = require('fs');

function getConfigContent(context) {
  const configPath = path.join(context.extensionPath, 'test','src', 'config.json');
  try {
    const jsonContent = fs.readFileSync(configPath, 'utf8');
    return jsonContent;
  } catch (error) {
    console.error('Failed to read config.json:', error);
    return '{}';
  }
}
function getWebviewContent(config) {
  let formatted;
  try {
    formatted = JSON.stringify(JSON.parse(config), null, 2);
  } catch (e) {
    formatted = 'Invalid JSON';
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <style>
        body { font-family: Consolas, monospace; padding: 20px; background-color: #1e1e1e; color: #d4d4d4; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
      </style>
    </head>
    <body>
      <!--<h2>📦 Config Contents</h2>-->
      <h2>
        <span class="material-symbols-outlined">cards_star</span>
      </h2>
      <pre>${formatted}</pre>
      <button id="open-oas-editor">🛠 Open OAS Editor</button>

      <script src="./ui/js/config-home.js"></script>
    </body>
    </html>
  `;
}
module.exports = {getConfigContent, getWebviewContent};