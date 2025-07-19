const vscode = require('vscode');
const fs = require('fs');
const path = require('path')
const yaml = require('yaml');

function openVirtualEditor(context, oasFilePath) {
  oasFilePath = path.join(context.extensionPath, 'test', oasFilePath);
  let oasContent = '';//'openapi: 3.0.0\ninfo:\n  title: Sample API\n  version: 1.0.0\npaths:\n  /example:\n    get:\n      summary: Get example';

  try {
    oasContent = fs.readFileSync(oasFilePath, 'utf8');
  } catch (err) {
    console.warn('Fallback to inline content:', err);
  }

  vscode.workspace.openTextDocument({ content: oasContent, language: 'yaml' }).then(doc => {
    vscode.window.showTextDocument(doc, vscode.ViewColumn.One, true);
  });
}


function extractRefsFromYaml(content) {
  const doc = yaml.parse(content);
  const refs = [];

  function scan(obj, path = []) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        scan(value, path.concat(key));
      } else if (key === '$ref') {
        refs.push({ path: path.concat(key), refValue: value });
      }
    }
  }

  scan(doc);
  return refs;
}
module.exports = {openVirtualEditor}