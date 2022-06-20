import * as vscode from 'vscode';
import { NugetPackageManagerWebviewProvider } from './UiProviders/NugetPackageManagerWebviewProvider';
import { SolutionExplorerWebviewProvider } from './UiProviders/SolutionExplorerWebviewProvider';
import { XmlEditorWebviewPanel } from './UiProviders/XmlEditorWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
	const nugetPackageManagerProvider = new NugetPackageManagerWebviewProvider(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"dot-net-ide.nuget-package-manager-webview",
			nugetPackageManagerProvider,
			{
				"webviewOptions": {
					// do not use retainContextWhenHidden for the nuget package manager
					// retainContextWhenHidden is resource intensive and should be used sparingly
				}
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('dot-net-ide.open-project-in-xml-editor', () => {
			XmlEditorWebviewPanel.createOrShow(context);
		})
	);

	const solutionExplorerWebviewProvider = new SolutionExplorerWebviewProvider(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"dot-net-ide.solution-explorer-webview",
			solutionExplorerWebviewProvider,
			{
				"webviewOptions": {
					// retainContextWhenHidden is resource intensive and should be used sparingly
					// preferably the code would maintain an 'isExpanded' property on 
					// all entries of the TreeView so that this is not needed to be here
					retainContextWhenHidden: true
				}
			}
		)
	);
}

export function deactivate() { }
