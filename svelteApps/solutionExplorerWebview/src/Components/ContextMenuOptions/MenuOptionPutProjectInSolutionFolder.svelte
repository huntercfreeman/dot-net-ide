<script lang="ts">
    import { contextMenuTarget } from "../menu";
    import MenuOption from "../MenuOption.svelte";
    import DotNetIdeButton from "../MaterialDesign/DotNetIdeButton.svelte";
    import { FileKind } from "../../../../../out/FileSystem/FileKind";
    import { MessageUpdatePutProjectInSolutionFolder } from "../../../../../out/Messages/Update/MessageUpdatePutProjectInSolutionFolder";
import DotNetIdeInputText from "../MaterialDesign/DotNetIdeInputText.svelte";
    
    export let closeMenu;
    export let namespaceId: string;
    export let index: number;
	export let category;

    $: contextMenuTargetValue = $contextMenuTarget;

    $: isFocusedCssClass = isFocused
        ? "dni_focused"
        : "";
    
    let isFocused = false;

    let solutionFolderName: string | undefined;

    function putInSolutionFolder() {
        if ((contextMenuTargetValue as any).projectModel) {

            if (contextMenuTargetValue.fileKind === FileKind.solutionFolder) {
                return;
            }

            // IProjectModel
            let projectModel: any = (contextMenuTargetValue as any).projectModel;

            let messageUpdatePutProjectInSolutionFolder =
                new MessageUpdatePutProjectInSolutionFolder(
                    projectModel,
                    solutionFolderName
                );

            tsVscode.postMessage({
                type: undefined,
                value: messageUpdatePutProjectInSolutionFolder,
            });
        }

        closeMenu();
    }

    function startFormPutInSolutionFolder() {
        solutionFolderName = "";
    }
    
    function onKeyDown() {
    }
</script>

{#if contextMenuTargetValue}
    <div class="dni_menu-option {isFocusedCssClass}">
        <MenuOption
            onClickStopPropagation={true}
            onClick={startFormPutInSolutionFolder}
			{closeMenu}
            text="Put in Solution Folder"
            {namespaceId}
            {index}
            {category}
            bind:isFocused={isFocused}
        />

        {#if solutionFolderName !== undefined}
            <DotNetIdeInputText bind:value={solutionFolderName}
                                placeholder="Solution Folder Name" />

            <div>
                <div>
                    <div>Create Solution Folder:</div>
                    <div style="margin-left: 12px;">
                        <em>{solutionFolderName}</em>
                    </div>
                </div>
            </div>

            <DotNetIdeButton onClickCallback={putInSolutionFolder}>
                Accept
            </DotNetIdeButton>

            <DotNetIdeButton onClickCallback={closeMenu}>
                Decline
            </DotNetIdeButton>
        {/if}
    </div>
{/if}

<style>
    em {
        font-style: normal;
        color: var(--vscode-editorInfo-foreground);
    }
</style>
