<script lang="ts">
    import { contextMenuTarget } from "../menu";
    import MenuOption from "../MenuOption.svelte";
    import DotNetIdeButton from "../MaterialDesign/DotNetIdeButton.svelte";
    import { MessageUpdateRemoveNugetPackageReference } from "../../../../../out/Messages/Update/MessageUpdateRemoveNugetPackageReference";

    export let closeMenu;
    export let namespaceId: string;
    export let index: number;
	export let category;

    $: contextMenuTargetValue = $contextMenuTarget;

    $: isFocusedCssClass = isFocused
        ? "dni_focused"
        : "";
    
    let isFocused = false;

    let showPrompt: boolean = false;

    function removeNugetPackageReference() {
        let messageUpdateRemoveNugetPackageReference =
            new MessageUpdateRemoveNugetPackageReference(
                contextMenuTargetValue
            );

        tsVscode.postMessage({
            type: undefined,
            value: messageUpdateRemoveNugetPackageReference,
        });

        performCloseMenu();
    }

    function showConfirmQuestion() {
        showPrompt = true;
    }

    function performCloseMenu() {
        showPrompt = false;
        closeMenu();
    }

    function onKeyDown() {
    }
</script>

{#if contextMenuTargetValue}
    <div class="dni_menu-option {isFocusedCssClass}">
        <MenuOption
            onClickStopPropagation={true}
            onClick={showConfirmQuestion}
			{closeMenu}
            text="Remove Nuget Package Reference."
            {namespaceId}
            {index}
            {category}
            bind:isFocused={isFocused}
        />

        {#if showPrompt}
            <div>
                <em>Remove</em> Reference:

                <div style="margin-left: 12px;">
                    <em
                        >{contextMenuTargetValue.absoluteFilePath
                            .filenameWithExtension}</em
                    >
                </div>
            </div>
            <div>
                From Project:

                <div style="margin-left: 12px;">
                    {contextMenuTargetValue
                        .parentProjectInitialAbsoluteFilePath
                        .filenameWithExtension}
                </div>
            </div>

            <DotNetIdeButton onClickCallback={removeNugetPackageReference}>
                Accept
            </DotNetIdeButton>

            <DotNetIdeButton onClickCallback={performCloseMenu}>
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
