import { ContextualInformationDatum } from "../../ContextMenus/ContextualInformationDatum";
import { getNonce } from "../../IdGeneration/getNonce";
import { AbsoluteFilePath } from "../AbsoluteFilePath";
import { FileKind } from "../FileKind";
import { FileKindMatcher } from "../FileKindMatcher";

export abstract class IdeFile {
    constructor(public readonly absoluteFilePath: AbsoluteFilePath,
        public namespace: string) {
        this.fileKind = FileKindMatcher.getFileKind(absoluteFilePath.extensionNoPeriod);
    }

    public nonce: string = getNonce();
    public virtualParentNonce: string | undefined = undefined;
    public refreshParentNonce: string | undefined = undefined;
    public fileKind: FileKind;
    public childFiles: IdeFile[] | undefined = undefined;
    public constantChildFiles: any[] | undefined = undefined;
    public virtualChildFiles: IdeFile[] | undefined = undefined;
    public hasUnexpectedParent: boolean = false;
    public hideExpansionChevronWhenNoChildFiles: boolean = false;
    public isExpanded: boolean = false;

    public abstract readonly contextualInformation: ContextualInformationDatum[];

    public abstract setVirtualChildFiles(siblingFiles: IdeFile[]): void;
}