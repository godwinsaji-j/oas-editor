// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {getConfigContent,getWebviewContent} = require('./config-utils')
const {openVirtualEditor} = require('./oas-editor-utils')
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let configWebViewPanel;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "spec-portals" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.viewConfig', function () {
     configWebViewPanel = vscode.window.createWebviewPanel(
      'configViewer',
      'View Config',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    const configData = getConfigContent(context);
	console.log("configData",configData)
    configWebViewPanel.webview.html = getWebviewContent(configData);

		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from spec-portals!');
		configWebViewPanel.webview.onDidReceiveMessage(
		message => {
			if (message.command === 'openOAS') {
				openVirtualEditor(context,message.oasFilePath);
			}
		},
		undefined,
		context.subscriptions
		);
	context.subscriptions.push(disposable);
	});
	
}

// This method is called when your extension is deactivated
function deactivate() {}



module.exports = {
	activate,
	deactivate
}
