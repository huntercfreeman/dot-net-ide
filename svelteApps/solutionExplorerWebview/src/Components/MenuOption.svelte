<script lang="ts">
	import { getContext } from "svelte";
	import { key } from "./menu.js";
	import DotNetIdeFocusTrap from "./MaterialDesign/DotNetIdeFocusTrap.svelte";

	export let isDisabled = false;
    export let closeMenu;
	export let text = "";
    export let onKeyDown: (e: KeyboardEvent) => void = (e) => {
		if (ConstantsKeyboard.ALL_SHOULD_PREVENT_DEFAULT_KEYS
				.indexOf(e.key) !== -1) {

					e.preventDefault();
		}

		if (e.key === ConstantsKeyboard.KEY_ENTER &&
			onClick) {
				handleClick(undefined);
		}
		else if (ConstantsKeyboard.ALL_ARROW_UP_KEYS.indexOf(e.key) !== -1 &&
			index > 0) {

			let previousFocusTrap = undefined;
			let currentCategory = category;
			let currentIndex = index - 1;

			while (previousFocusTrap === undefined) {
				previousFocusTrap = document
					.getElementById(ConstantsFocusTrap
						.getFocusTrapId(namespaceId, currentCategory, currentIndex));

				if (currentIndex < 0) {

				}
			}

			if (previousFocusTrap) {
				previousFocusTrap.focus();
			}
		}
		else if (ConstantsKeyboard.ALL_ARROW_DOWN_KEYS.indexOf(e.key) !== -1) {
			// index out of bounds will not occur from not checking index < list.length - 1
			// the variable will just be set to undefined and nothing will get ran

			let nextFocusTrap = document.getElementById(ConstantsFocusTrap.getFocusTrapId(namespaceId, category, index + 1));

			if (nextFocusTrap) {
				nextFocusTrap.focus();
			}
		}
		else if (ConstantsKeyboard.KEY_ESCAPE === e.key) {
			closeMenu();
		}
	};
	export let namespaceId: string;
    export let index: number;
	export let onClickStopPropagation = false;
	export let onClick = undefined;
	export let isFocused;
	export let category;

	let focusTrapHtmlElement;
	
	import { createEventDispatcher } from "svelte";
	import { ConstantsKeyboard } from "../../../../out/Constants/ConstantsKeyboard.js";
import { ConstantsFocusTrap } from "../../../../out/Constants/ConstantsFocusTrap.js";
	const dispatch = createEventDispatcher();

	const { dispatchClick } = getContext(key);

	const handleClick = (e) => {

		if(focusTrapHtmlElement) {
			focusTrapHtmlElement.focus();
		}
		
		if (onClick) {
			onClick();
		}

		if (isDisabled) return;
		if (onClickStopPropagation) return;

		dispatch("click");
		dispatchClick();
	};
</script>

<div class:disabled={isDisabled} on:click={handleClick}>
	<DotNetIdeFocusTrap onKeyDown={onKeyDown}
		                {namespaceId}
						{index}
						{category}
						bind:isFocused={isFocused}
						bind:inputHtmlElement={focusTrapHtmlElement} />

	{#if text}
		{text}
	{:else}
		<slot />
	{/if}
</div>

<style>
	div {
		padding: 4px 15px;
		cursor: default;
		font-size: 14px;
		display: flex;
		align-items: center;
		grid-gap: 5px;
	}
	div:hover {
		color: var(--vscode-button-foreground);
		background: var(--vscode-button-hoverBackground);
	}
	div.disabled {
		color: var(--vscode-disabledForeground);
	}
	div.disabled:hover {
		color: var(--vscode-button-foreground);
		background: var(--vscode-button-hoverBackground);
	}
</style>
