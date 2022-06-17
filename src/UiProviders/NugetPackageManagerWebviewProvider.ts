import * as vscode from 'vscode';
import { ActiveDotNetSolutionFileContainer } from '../ActiveDotNetSolutionFileContainer';
import { DotNetSolutionFile } from '../FileSystem/Files/DotNetSolutionFile';
import { NugetPackageManagerMessageHandler } from '../MessageHandlers/NugetPackageManagerMessageHandler';
import { IMessage } from '../Messages/IMessage';
import { MessageCategory } from '../Messages/MessageCategory';
import { IMessageRead } from '../Messages/Read/IMessageRead';
import { MessageReadActiveDotNetSolutionFile } from '../Messages/Read/MessageReadActiveDotNetSolutionFile';
import { MessageReadKind } from '../Messages/Read/MessageReadKind';

const fs = require('fs');

export class NugetPackageManagerWebviewProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  
  private activeDotNetSolutionFile: DotNetSolutionFile | undefined;

  constructor(private readonly context: vscode.ExtensionContext) { }

  public resolveWebviewView(webviewView: vscode.WebviewView) {

    ActiveDotNetSolutionFileContainer.nugetPackageManagerWebviewProviderSubscription = (activeDotNetSolution) =>
    {
      this.activeDotNetSolutionFile = activeDotNetSolution;

      let messageReadActiveDotNetSolutionFile =
        new MessageReadActiveDotNetSolutionFile(this.activeDotNetSolutionFile);

      webviewView.webview.postMessage(messageReadActiveDotNetSolutionFile);
    };

    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this.context.extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      let message = data.value as IMessage;

      if (message.messageCategory === MessageCategory.read &&
          (message as any as IMessageRead).messageReadKind 
            === MessageReadKind.activeDotNetSolutionFile) {

              let messageReadActiveDotNetSolutionFile =
                new MessageReadActiveDotNetSolutionFile(this.activeDotNetSolutionFile);

              webviewView.webview.postMessage(messageReadActiveDotNetSolutionFile);
      }
      else {
        NugetPackageManagerMessageHandler.handleMessage(webviewView, data.value);
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private getWebviewContent(webview: vscode.Webview) {
    const dotNetIdeSvelteAppJavaScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri, 'out/nugetPackageManagerWebview', 'nugetPackageManagerWebview.js'));

    const dotNetIdeSvelteAppCssUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri, 'out/nugetPackageManagerWebview', 'nugetPackageManagerWebview.css'));

    const resetCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "reset.css")
    );

    const vSCodeCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "vscode.css")
    );

    const dotNetIdeCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "dotNetIde.css")
    );

    return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>NugetPackageManagerWebview</title>
    <link href="${resetCssUri}" rel="stylesheet">
    <link href="${vSCodeCssUri}" rel="stylesheet">
    <link href="${dotNetIdeCssUri}" rel="stylesheet">
    <link href="${dotNetIdeSvelteAppCssUri}" rel="stylesheet">
	  <script>
		const tsVscode = acquireVsCodeApi();
	</script>
  </head>
  <body style="padding: 0 5px;" class="">
	  <script src="${dotNetIdeSvelteAppJavaScriptUri}"></script>
  </body>
  </html>`;
  }
}