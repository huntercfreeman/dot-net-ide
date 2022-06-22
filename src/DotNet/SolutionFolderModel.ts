import { AbsoluteFilePath } from "../FileSystem/AbsoluteFilePath";
import { ProjectToProjectReferenceFile } from "../FileSystem/Files/ProjectReference/ProjectToProjectReferenceFile";
import { IdeFile } from "../FileSystem/Files/IdeFile";
import { IProjectModel } from "./IProjectModel";
import { ProjectKind } from "./ProjectKind";
import { SolutionModel } from "./SolutionModel";

const fs = require('fs');

export class SolutionFolderModel implements IProjectModel {
    /**
     * 
     * @param parentSolutionModel 
     * @param projectTypeGuid Identifies project type and is likely to be seen many times in one .sln file.
     * @param displayName 
     * @param projectRelativePathFromSolution 
     * @param projectIdGuid Identifies one unique project from another
     * @param rootNamespace 
     */
    constructor(parentSolutionModel: SolutionModel,
        public readonly projectTypeGuid: string,
        public readonly displayName: string,
        public readonly projectRelativePathFromSolution: string,
        public readonly projectIdGuid: string) {
        this.absoluteFilePath = AbsoluteFilePath
            .constructAbsoluteFilePathFromAbsoluteFilePathAndRelativePath(parentSolutionModel.absoluteFilePath,
                this.projectRelativePathFromSolution,
                false);

        this.solutionFolderEntries = [];

        this.parentSolutionAbsoluteFilePath = parentSolutionModel.absoluteFilePath;
    }

    public static async getFileContents(solution: SolutionModel, callback: any): Promise<string> {
        return await fs.readFile(solution.absoluteFilePath.initialAbsoluteFilePathStringInput, 'utf8', (err: any, data: any) => {
            callback(err, data);
        });
    }

    public readonly absoluteFilePath: AbsoluteFilePath;
    public solutionFolderEntries: IProjectModel[];
    public childFiles: IdeFile[] | undefined;
    public solutionFolderParentProjectIdGuid: string | undefined;
    public projectReferences: ProjectToProjectReferenceFile[] = [];
    public readonly parentSolutionAbsoluteFilePath: AbsoluteFilePath;
    public initialIsExpandedState: boolean = false;
    public projectKind: ProjectKind = ProjectKind.solutionFolder;
    public targetFramework: string = "";
    public rootNamespace: string = "";
}