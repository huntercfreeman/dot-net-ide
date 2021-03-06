<script lang="ts">
	import { onMount } from "svelte";
	import type { DotNetSolutionFile } from "../../../out/FileSystem/Files/DotNetSolutionFile";
	import { MessageCategory } from "../../../out/Messages/MessageCategory";
	import { MessageReadKind } from "../../../out/Messages/Read/MessageReadKind";
	import { MessageReadSolutionsInWorkspace } from "../../../out/Messages/Read/MessageReadSolutionsInWorkspace";
	import SelectDotNetSolutionFileForm from "./Components/SelectDotNetSolutionFileForm.svelte";
	import ContextMenu from "./Components/ContextMenu.svelte";
	import SolutionFileControlButtons from "./Components/SolutionFileControlButtons.svelte";
	import TreeViewMapper from "./Components/TreeViewMapper.svelte";
    import { activeFocusTarget } from "./Components/activeFocus";
	import { ConstantsFocusTrap } from "../../../out/Constants/ConstantsFocusTrap";

	let dotNetSolutionFiles: DotNetSolutionFile[] = [];
	let selectedDotNetSolutionFile: DotNetSolutionFile | undefined;

	$: activeFocusTargetValue = $activeFocusTarget;

	$: solutionExplorerHasFocus = activeFocusTargetValue
		? "dni_focused"
		: "";

	window.onfocus = () => {
		let treeViewBaseActiveIdeFileFocusTrap = document
			.getElementById(ConstantsFocusTrap
				.getFocusTrapId(ConstantsFocusTrap.NAMESPACE_ID_TREE_VIEW_BASE_ACTIVE, 0, 0));
		
		if (treeViewBaseActiveIdeFileFocusTrap) {
			treeViewBaseActiveIdeFileFocusTrap.focus();
		}

		activeFocusTarget.set(true);
	}
	window.onblur = () => activeFocusTarget.set(undefined);
	
	function getSolutionFilesInWorkspace() {
		let messageReadSolutionsInWorkspace =
			new MessageReadSolutionsInWorkspace();

		tsVscode.postMessage({
			type: undefined,
			value: messageReadSolutionsInWorkspace,
		});
	}

	onMount(async () => {
		window.addEventListener("message", async (event) => {
			const message = event.data;

			switch (message.messageCategory) {
				case MessageCategory.read:
					switch (message.messageReadKind) {
						case MessageReadKind.solutionsInWorkspace:
							dotNetSolutionFiles = message.dotNetSolutionFiles;

							// Check if currently selected solution was removed in some way
							if (selectedDotNetSolutionFile) {
								if (!dotNetSolutionFiles
									.find(x => 
										x.absoluteFilePath.initialAbsoluteFilePathStringInput ===
											selectedDotNetSolutionFile.absoluteFilePath.initialAbsoluteFilePathStringInput)) {

												// Was removed therefore set selected solution as undefined
												selectedDotNetSolutionFile = undefined;
								}
							}
							break;
						case MessageReadKind.solutionIntoTreeView:
							selectedDotNetSolutionFile =
								message.dotNetSolutionFile;
							break;
						case MessageReadKind.messageReadUndefinedSolution:
							selectedDotNetSolutionFile =
								undefined;
							break;
					}
			}
		});

		getSolutionFilesInWorkspace();
	});
</script>

<div id="dni_solution-explorer" class="dni_app {solutionExplorerHasFocus}">
	<SolutionFileControlButtons {getSolutionFilesInWorkspace} />

	<SelectDotNetSolutionFileForm {selectedDotNetSolutionFile} {dotNetSolutionFiles} />

	<div style="margin-bottom: 5px;" />

	{#if selectedDotNetSolutionFile}
		<TreeViewMapper ideFile={selectedDotNetSolutionFile}
			index={0}
			depth={0}
			parent={undefined}
			parentChildren={undefined} />
	{/if}

	<ContextMenu />
</div>

<style>
	.dni_app {
		height: calc(100vh - var(--input-margin-vertical) * 2);
	}
</style>
