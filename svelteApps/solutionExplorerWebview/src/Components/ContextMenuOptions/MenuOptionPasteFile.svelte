<script lang="ts">
    import { contextMenuTarget } from "../menu";
    import MenuOption from "../MenuOption.svelte";
    import { MessageUpdatePasteIntoAny } from "../../../../../out/Messages/Update/MessageUpdatePasteIntoAny";

    export let closeMenu;
    export let namespaceId: string;
    export let index: number;
	export let category;

    $: contextMenuTargetValue = $contextMenuTarget;

    $: isFocusedCssClass = isFocused
        ? "dni_focused"
        : "";
    
    let isFocused = false;

    function pasteOnClick() {

        let messageUpdatePasteIntoAny =
            new MessageUpdatePasteIntoAny(
                contextMenuTargetValue
            );

        tsVscode.postMessage({
            type: undefined,
            value: messageUpdatePasteIntoAny,
        });

        closeMenu();
    }

    function onKeyDown() {
    }
</script>

{#if contextMenuTargetValue}
    <div class="dni_menu-option {isFocusedCssClass}">
        <MenuOption
            onClickStopPropagation={true}
            onClick={pasteOnClick}
			{closeMenu}
            text="Paste."
            {namespaceId}
            {index}
            {category}
            bind:isFocused={isFocused}
        />
    </div>
{/if}
