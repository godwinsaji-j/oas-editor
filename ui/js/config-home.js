const vscode = acquireVsCodeApi();
window.addEventListener('load',function(){
    document.getElementById('open-oas-editor').addEventListener('click',function(e){
        console.log("open-oas-editor clicked");
        vscode.postMessage({ command: 'open-oas-virtual-editor', oasFilePath:'pi-update-users.yaml' });

    })
})