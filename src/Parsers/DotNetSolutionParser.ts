import { ConstantsSolutionFile } from "../Constants/ConstantsSolutionFile";
import { ConstantsStringReader } from "../Constants/ConstantsStringReader";
import { CSharpProjectModel } from "../DotNet/CSharpProjectModel";
import { SolutionModel } from "../DotNet/SolutionModel";
import { AbsoluteFilePath } from "../FileSystem/AbsoluteFilePath";
import { StringReader } from "./StringReader";
const fs = require('fs');

export class DotNetSolutionParser {
  constructor(public readonly absoluteFilePath: AbsoluteFilePath,
    public readonly solutionModel: SolutionModel) {
  }

  private _stringReader!: StringReader;

  public async parse(callback: any) {
    // The solution file will be parsed by means of reading in the entire file to memory instead of streaming the contents.
    // If one finds solution files to be large enough to necessitate streaming the contents this should be changed.
    // However, solution files are typically RELATIVELY small.
    await fs.readFile(this.solutionModel.absoluteFilePath.initialAbsoluteFilePathStringInput, 'utf8', (err: any, data: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);

      this._stringReader = new StringReader(data);

      let currentCharacter = "";

      while ((currentCharacter = this._stringReader.consume(1)) !==
        ConstantsStringReader.END_OF_FILE_MARKER) {

        var handledToken = false;

        if (!handledToken && ConstantsSolutionFile.START_OF_PROJECT_DEFINITION.startsWith(currentCharacter)) {
          if (ConstantsSolutionFile.START_OF_PROJECT_DEFINITION.substring(1) ===
            this._stringReader.peek(ConstantsSolutionFile.START_OF_PROJECT_DEFINITION.length - 1)) {
            handledToken = true;
            this.readInProjectDefinition();
          }
        }
        if (!handledToken && ConstantsSolutionFile.START_OF_GLOBAL.startsWith(currentCharacter)) {
          if (ConstantsSolutionFile.START_OF_GLOBAL.substring(1) ===
            this._stringReader.peek(ConstantsSolutionFile.START_OF_GLOBAL.length - 1)) {
            handledToken = true;
            this.readInGlobalDefinition();
          }
        }
        if (!handledToken && ConstantsSolutionFile.START_OF_GLOBAL_SECTION.startsWith(currentCharacter)) {
          if (ConstantsSolutionFile.START_OF_GLOBAL_SECTION.substring(1) ===
            this._stringReader.peek(ConstantsSolutionFile.START_OF_GLOBAL_SECTION.length - 1)) {
            handledToken = true;
            this.readInGlobalSection();
          }
        }
        if (!handledToken && ConstantsSolutionFile.START_OF_SOLUTION_PROPERTIES.startsWith(currentCharacter)) {
          if (ConstantsSolutionFile.START_OF_SOLUTION_PROPERTIES.substring(1) ===
            this._stringReader.peek(ConstantsSolutionFile.START_OF_SOLUTION_PROPERTIES.length - 1)) {
            handledToken = true;
            this.readInSolutionProperties();
          }
        }
        if (!handledToken && ConstantsSolutionFile.START_OF_SOLUTION_FOLDERS.startsWith(currentCharacter)) {
          if (ConstantsSolutionFile.START_OF_SOLUTION_FOLDERS.substring(1) ===
            this._stringReader.peek(ConstantsSolutionFile.START_OF_SOLUTION_FOLDERS.length - 1)) {
            handledToken = true;
            this.readInSolutionFolders();
          }
        }
        if (!handledToken && ConstantsSolutionFile.START_OF_EXTENSIBILITY_GLOBALS.startsWith(currentCharacter)) {
          if (ConstantsSolutionFile.START_OF_EXTENSIBILITY_GLOBALS.substring(1) ===
            this._stringReader.peek(ConstantsSolutionFile.START_OF_EXTENSIBILITY_GLOBALS.length - 1)) {
            handledToken = true;
            this.readInExtensibilityGlobals();
          }
        }
      }

      callback();
    });
  }

  public readInProjectDefinition() {
    // In this file dashes are used to mark on the line above and below a comment what INTENDS to be parsed.

    let currentCharacter = "";

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== ConstantsSolutionFile.START_OF_GUID) {

    }

    //           ------------------------------------
    // Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyCrudApp", "MyCrudApp\MyCrudApp.csproj", "{8257B361-20EC-4D50-8987-169E8BEC46E4}"
    //           ------------------------------------
    let firstGuid = this.readInGuid();

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== '"') {
    }

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== '"') {
    }

    //                                                      ---------
    // Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyCrudApp", "MyCrudApp\MyCrudApp.csproj", "{8257B361-20EC-4D50-8987-169E8BEC46E4}"
    //                                                      ---------
    let displayName = "";

    // Read until quote that terminates the Project display name
    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== '"') {
      displayName += currentCharacter;
    }

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== '"') {
    }

    //                                                                   --------------------------
    // Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyCrudApp", "MyCrudApp\MyCrudApp.csproj", "{8257B361-20EC-4D50-8987-169E8BEC46E4}"
    //                                                                   --------------------------
    let projectRelativePathFromSolution = "";

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== '"') {
      projectRelativePathFromSolution += currentCharacter;
    }

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== ConstantsSolutionFile.START_OF_GUID) {

    }

    //                                                                                                  ------------------------------------
    // Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyCrudApp", "MyCrudApp\MyCrudApp.csproj", "{8257B361-20EC-4D50-8987-169E8BEC46E4}"
    //                                                                                                  ------------------------------------
    let secondGuid = this.readInGuid();

    let project = new CSharpProjectModel(this.solutionModel,
      firstGuid,
      displayName,
      projectRelativePathFromSolution,
      secondGuid);

    this.solutionModel.projects.push(project);
  }


  public readInGlobalDefinition() {
    return;
  }


  public readInGlobalSection() {
    return;
  }


  public readInSolutionProperties() {
    return;
  }


  public readInSolutionFolders() {
    let currentCharacter: string = "";

    let projectGuid: string | undefined = undefined;
    let solutionFolderGuid: string | undefined = undefined;

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER) {

      switch (currentCharacter) {
        case ConstantsSolutionFile.START_OF_GUID:
          var guid = this.readInGuid();

          if (!projectGuid) {
            projectGuid = guid;
          }
          else {
            solutionFolderGuid = guid;

            let project = this.solutionModel.projects
              .find(x => x.secondGuid === projectGuid);

            let solutionFolder = this.solutionModel.projects
              .find(x => x.secondGuid === solutionFolderGuid);

            if (project && solutionFolder) {
              project.solutionFolderParentSecondGuid = solutionFolderGuid;

              if (!solutionFolder.solutionFolderEntries) {
                solutionFolder.solutionFolderEntries = [];
              }

              solutionFolder.solutionFolderEntries.push(project);
            }
            else {
              throw new Error("Could not map project to solution folder in solution's .sln file");
            }

            projectGuid = undefined;
            solutionFolderGuid = undefined;
          }
      }
    }
  }

  public readInExtensibilityGlobals() {
    return;
  }

  public readInGuid(): string {
    //           ------------------------------------
    // Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "MyCrudApp", "MyCrudApp\MyCrudApp.csproj", "{8257B361-20EC-4D50-8987-169E8BEC46E4}"
    //           ------------------------------------
    let currentCharacter = "";
    let guid = "";

    while ((currentCharacter = this._stringReader.consume(1)) !==
      ConstantsStringReader.END_OF_FILE_MARKER &&
      currentCharacter !== ConstantsSolutionFile.END_OF_GUID) {

      guid += currentCharacter;
    }

    return guid;
  }
}


