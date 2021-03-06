<script lang="ts">
	import type { IdeFile } from "../../../../../../out/FileSystem/Files/IdeFile";
	import type { VCXProjectFile } from "../../../../../../out/FileSystem/Files/CPlusPlus/VCXProjectFile";
	import { MessageReadFileIntoEditor } from "../../../../../../out/Messages/Read/MessageReadFileIntoEditor";
	import { MessageReadFiltersInVCXProject } from "../../../../../../out/Messages/Read/MessageReadFiltersInVCXProject";
	import TreeViewBase from "../../TreeViewBase.svelte";
	import type { MessageReadRequestForRefresh } from "../../../../../../out/Messages/Read/MessageReadRequestForRefresh";
	import { onMount } from "svelte";
	import { MessageCategory } from "../../../../../../out/Messages/MessageCategory";
	import { MessageReadKind } from "../../../../../../out/Messages/Read/MessageReadKind";
	
    export let vcxProjectFile: VCXProjectFile;
    export let index: number;
	export let depth: number;
    export let parent: IdeFile | undefined;
	export let parentChildren: IdeFile[];

	let children: IdeFile[] | undefined;

	$: titleText = vcxProjectFile.absoluteFilePath.filenameWithExtension;

	function titleOnSingleClick() {
		let messageReadFileIntoEditor = new MessageReadFileIntoEditor(vcxProjectFile, true);
		
		tsVscode.postMessage({
			type: undefined,
			value: messageReadFileIntoEditor,
		});
    }

	function titleOnDoubleClick() {
		let messageReadFileIntoEditor = new MessageReadFileIntoEditor(vcxProjectFile, false);
		
		tsVscode.postMessage({
			type: undefined,
			value: messageReadFileIntoEditor,
		});
    }

	function getChildFiles(): IdeFile[] {
		children = vcxProjectFile.virtualChildFiles
			?.filter(x => !hasDifferentParentContainer(x));
		
		if (!children) {
			let messageReadFiltersInVCXProject =
				new MessageReadFiltersInVCXProject(vcxProjectFile);
			
			tsVscode.postMessage({
				type: undefined,
				value: messageReadFiltersInVCXProject,
			});
			return [];
		}

		return children;
	}

	function hasDifferentParentContainer(childIdeFile: IdeFile): boolean {
		if (childIdeFile.virtualParentNonce) {
			if (childIdeFile.virtualParentNonce !== vcxProjectFile.nonce) {
				return true;
			}
		}

		return false;
	}
	
	onMount(async () => {
		window.addEventListener("message", async (event) => {
			const message = event.data;
			switch (message.messageCategory) {
				case MessageCategory.read:
					switch (message.messageReadKind) {
						case MessageReadKind.filtersInVCXProject:
							let messageReadFiltersInVCXProject =
								message as MessageReadFiltersInVCXProject;
							if (
								vcxProjectFile.nonce ===
									messageReadFiltersInVCXProject.vcxProjectFile.nonce
							) {
								vcxProjectFile =
									messageReadFiltersInVCXProject.vcxProjectFile;

								children = vcxProjectFile.virtualChildFiles
									?.filter(x => !hasDifferentParentContainer(x));
							}
							break;
					}
					case MessageReadKind.requestForRefresh:
							let messageReadRequestForRefresh =
								message as MessageReadRequestForRefresh;
								
							if (vcxProjectFile.nonce ===
									messageReadRequestForRefresh.ideFileNonce) {
								
									let messageReadFiltersInVCXProject =
										new MessageReadFiltersInVCXProject(
											vcxProjectFile
										);

									tsVscode.postMessage({
										type: undefined,
										value: messageReadFiltersInVCXProject,
									});
							}
							break;
			}
		});
	});
</script>

<TreeViewBase ideFile="{vcxProjectFile}" 
              titleText={titleText}
              {titleOnSingleClick}
              {titleOnDoubleClick}
              getChildFiles={getChildFiles}
			  bind:children={children}
			  {index}
			  {depth}
			  {parent}
			  {parentChildren} />