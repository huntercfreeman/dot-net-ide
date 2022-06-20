import * as vscode from 'vscode';
import { ConstantsDotNetCli } from '../../Constants/ConstantsDotNetCli';
import { IMessage } from '../../Messages/IMessage';
import { IMessageUpdate } from '../../Messages/Update/IMessageUpdate';
import { MessageUpdateAddNugetPackageReference } from '../../Messages/Update/MessageUpdateAddNugetPackageReference';
import { MessageUpdateAddProjectReference } from '../../Messages/Update/MessageUpdateAddProjectReference';
import { MessageUpdateExistingCSharpProjectIntoSolution } from '../../Messages/Update/MessageUpdateExistingCSharpProjectIntoSolution';
import { MessageUpdateKind } from '../../Messages/Update/MessageUpdateKind';
import { MessageUpdatePutProjectInSolutionFolder } from '../../Messages/Update/MessageUpdatePutProjectInSolutionFolder';
import { MessageUpdateRemoveNugetPackageReference } from '../../Messages/Update/MessageUpdateRemoveNugetPackageReference';
import { MessageUpdateRemoveProject } from '../../Messages/Update/MessageUpdateRemoveProject';
import { MessageUpdateRemoveProjectReference } from '../../Messages/Update/MessageUpdateRemoveProjectReference';
import { TerminalService } from '../../Terminal/TerminalService';

export class SolutionExplorerUpdateMessageHandler {
    public static async handleMessage(webviewView: vscode.WebviewView, message: IMessage): Promise<void> {
        let updateMessage = message as unknown as IMessageUpdate;

        switch (updateMessage.messageUpdateKind) {
            case MessageUpdateKind.existingCSharpProjectIntoSolution:
                await this.handleMessageUpdateExistingCSharpProjectIntoSolution(webviewView, message);
                break;
            case MessageUpdateKind.removeProject:
                await this.handleMessageUpdateRemoveProject(webviewView, message);
                break;
            case MessageUpdateKind.putProjectInSolutionFolder:
                await this.handleMessageUpdatePutProjectInSolutionFolder(webviewView, message);
                break;
            case MessageUpdateKind.addProjectReference:
                await this.handleMessageUpdateAddProjectReference(webviewView, message);
                break;
            case MessageUpdateKind.removeProjectReference:
                await this.handleMessageUpdateRemoveProjectReference(webviewView, message);
                break;
            case MessageUpdateKind.removeNugetPackageReference:
                await this.handleMessageUpdateRemoveNugetPackageReference(webviewView, message);
                break;
        }
    }

    public static async handleMessageUpdateExistingCSharpProjectIntoSolution(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdateExistingCSharpProjectIntoSolution;

        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Existing C# Project',
            canSelectFiles: true,
            canSelectFolders: false
        };

        vscode.window.showOpenDialog(options).then(fileUri => {
            if (fileUri && fileUri[0]) {
                console.log('Selected file: ' + fileUri[0].fsPath);

                let generalUseTerminal = TerminalService.getGeneralUseTerminal();

                generalUseTerminal.sendText(
                    ConstantsDotNetCli.formatDotNetAddCSharpProjectToSolutionUsingProjectFsPath(fileUri[0].fsPath,
                        message.dotNetSolutionFile));

                generalUseTerminal.show();
            }
        });
    }

    public static async handleMessageUpdateRemoveProject(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdateRemoveProject;

        let generalUseTerminal = TerminalService.getGeneralUseTerminal();

        generalUseTerminal.sendText(
            ConstantsDotNetCli.formatDotNetRemoveCSharpProjectFromSolutionUsingProjectUsingAbsoluteFilePath(message.cSharpProjectFile.absoluteFilePath,
                message.cSharpProjectFile.cSharpProjectModel.parentSolutionAbsoluteFilePath));

        generalUseTerminal.show();
    }
    
    public static async handleMessageUpdatePutProjectInSolutionFolder(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdatePutProjectInSolutionFolder;

        let generalUseTerminal = TerminalService.getGeneralUseTerminal();

        let removeProjectCommand = ConstantsDotNetCli.formatDotNetRemoveCSharpProjectFromSolutionUsingProjectUsingAbsoluteFilePath(message.projectModel.absoluteFilePath,
            message.projectModel.parentSolutionAbsoluteFilePath);

        let addBackProjectButInSolutionFolderCommand = ConstantsDotNetCli.formatDotNetPutProjectInSolutionFolder(message.projectModel.absoluteFilePath,
            message.projectModel.parentSolutionAbsoluteFilePath,
            message.solutionFolderName);

        generalUseTerminal.sendText(removeProjectCommand + " && " +
                                       addBackProjectButInSolutionFolderCommand);

        generalUseTerminal.show();
    }

    public static async handleMessageUpdateAddProjectReference(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdateAddProjectReference;

        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Existing C# Project',
            canSelectFiles: true,
            canSelectFolders: false
        };

        vscode.window.showOpenDialog(options).then(fileUri => {
            if (fileUri && fileUri[0]) {
                let generalUseTerminal = TerminalService.getGeneralUseTerminal();

                generalUseTerminal.sendText(
                    ConstantsDotNetCli.formatDotNetAddCSharpProjectReferenceToCSharpProject(message.cSharpProjectProjectReferencesFile.parentCSharpProjectInitialAbsoluteFilePath,
                        fileUri[0].fsPath));

                generalUseTerminal.show();
            }
        });
    }

    public static async handleMessageUpdateRemoveProjectReference(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdateRemoveProjectReference;

        let generalUseTerminal = TerminalService.getGeneralUseTerminal();

        generalUseTerminal.sendText(
            ConstantsDotNetCli.formatDotNetRemoveCSharpProjectReferenceFromCSharpProject(message.cSharpProjectProjectReferenceFile.parentCSharpProjectInitialAbsoluteFilePath,
                message.cSharpProjectProjectReferenceFile.cSharpProjectReferenceAbsoluteFilePath));

        generalUseTerminal.show();
    }

    public static async handleMessageUpdateAddNugetPackageReference(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdateAddNugetPackageReference;

        let generalUseTerminal = TerminalService.getGeneralUseTerminal();

        generalUseTerminal.sendText(
            ConstantsDotNetCli.formatDotNetAddNugetPackageReferenceToCSharpProject(message.cSharpProjectFile.absoluteFilePath,
                message.nugetPackageModel,
                message.nugetPackageVersionModel));

        generalUseTerminal.show();
    }

    public static async handleMessageUpdateRemoveNugetPackageReference(webviewView: vscode.WebviewView, iMessage: IMessage) {
        let message = iMessage as MessageUpdateRemoveNugetPackageReference;

        let generalUseTerminal = TerminalService.getGeneralUseTerminal();

        generalUseTerminal.sendText(
            ConstantsDotNetCli.formatDotNetRemoveNugetPackageReferenceFromCSharpProject(message.cSharpProjectNugetPackageDependencyFile.parentCSharpProjectInitialAbsoluteFilePath,
                message.cSharpProjectNugetPackageDependencyFile.nugetPackageId));

        generalUseTerminal.show();
    }
}