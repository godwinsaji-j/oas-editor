const vscode = require('vscode');
const fs = require('fs');
const path = require('path')
const yaml = require('yaml');

// function openVirtualEditor(context, oasFilePath) {
//   oasFilePath = path.join(context.extensionPath, 'test', oasFilePath);
//   let oasContent = '';//'openapi: 3.0.0\ninfo:\n  title: Sample API\n  version: 1.0.0\npaths:\n  /example:\n    get:\n      summary: Get example';

//   try {
//     oasContent = fs.readFileSync(oasFilePath, 'utf8');
//   } catch (err) {
//     console.warn('Fallback to inline content:', err);
//   }

//   //Open Text Editor
//   // vscode.workspace.openTextDocument({ content: oasContent, language: 'yaml' }).then(doc => {
//   //   vscode.window.showTextDocument(doc, vscode.ViewColumn.One, true);
//   // });
// }

function openVirtualEditor(context, oasFilePath) {
  try {
    const yamlEditorWebViewPanel = vscode.window.createWebviewPanel('configViewer', oasFilePath?.split('/').slice(-1)||'', vscode.ViewColumn.One, { enableScripts: true });
    vscode.window.showInformationMessage('Hello World from window 2!'+oasFilePath);
    yamlEditorWebViewPanel.webview.html = getWebviewContent(context, oasFilePath);
    yamlEditorWebViewPanel.webview.onDidReceiveMessage(
        message => {
          if(message.command === 'load-yaml-file'){
            openVirtualEditor(context,message.oasFilePath);
          }
        },
        undefined,
        context.subscriptions
        );
  } catch (err) {
    console.warn('Fallback to inline content:', err);
  }

  //Open Text Editor
  // vscode.workspace.openTextDocument({ content: oasContent, language: 'yaml' }).then(doc => {
  //   vscode.window.showTextDocument(doc, vscode.ViewColumn.One, true);
  // });
}

function readOASFile(context, oasFilePath){
  oasFilePath = path.join(context.extensionPath, 'test', oasFilePath);
  let oasContent = '';//'openapi: 3.0.0\ninfo:\n  title: Sample API\n  version: 1.0.0\npaths:\n  /example:\n    get:\n      summary: Get example';
  try {
    oasContent = fs.readFileSync(oasFilePath, 'utf8');
    const doc = yaml.parse(oasContent);
    return yaml.stringify(doc); // Proper indentation
  } catch (err) {
    console.warn('Fallback to inline content:', err);
    return '';
  }
}

function getWebviewContent(context, oasFilePath){
  let oasContent = readOASFile(context,oasFilePath)
  return `<!DOCTYPE html>
<html lang="en">
<head>
 <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-yaml.min.js"></script>
  <style>
    :root {
      --bg-color: #121212;
      --panel-color: #1e1e2e;
      --accent-color: #00ffd0;
      --text-color: #f8f8f2;
      --heading-color: #ff79c6;
      --border-color: #282a36;
      --font-family: 'Fira Code', 'Consolas', monospace;
    }

    body {
      margin: 0;
      padding: 20px;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: var(--font-family);
    }

    h2 {
      color: var(--heading-color);
      margin-bottom: 10px;
      font-weight: 600;
    }

    .editor {
      background-color: var(--panel-color);
      border: 1px solid var(--border-color);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 255, 208, 0.1);
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 14px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <h2>⚙️ OpenAPI Spec</h2>
  <div class="editor">
    <pre class="language-yaml" id="yamlContent">Loading...</pre>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('yamlContent').textContent = \`${oasContent}\`;
     Prism.highlightElement(document.getElementById('yamlContent'))
    // You can also dynamically populate YAML content if injected from extension
    //window.addEventListener('message', event => {
    //  const yamlText = event.data.yaml;
    //  document.getElementById('yamlContent').textContent = yamlText;
    //});
  </script>
</body>
</html>`
}

module.exports = {openVirtualEditor}