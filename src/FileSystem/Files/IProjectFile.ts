import { IProjectModel } from "../../DotNet/IProjectModel";
import { AbsoluteFilePath } from "../AbsoluteFilePath";
import { FileKind } from "../FileKind";
import { IdeFile } from "./IdeFile";

export interface IProjectFile {
    projectModel: IProjectModel;
    namespace: string;
    absoluteFilePath: AbsoluteFilePath;
    nonce: string;
    virtualParentNonce: string | undefined;
    fileKind: FileKind;
    childFiles: IdeFile[] | undefined;
    constantChildFiles: any[] | undefined;
    virtualChildFiles: IdeFile[] | undefined;
    hideExpansionChevronWhenNoChildFiles: boolean;
    isExpanded: boolean;
}