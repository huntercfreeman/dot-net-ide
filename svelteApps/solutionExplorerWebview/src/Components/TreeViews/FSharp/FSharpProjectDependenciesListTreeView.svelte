<script lang="ts">
	import type { IdeFile } from "../../../../../../out/FileSystem/Files/IdeFile";
	import TreeViewBase from "../../TreeViewBase.svelte";
	import type { FSharpProjectDependenciesListFile } from "../../../../../../out/FileSystem/Files/FSharp/FSharpProjectDependenciesListFile";
	
    export let fSharpProjectDependenciesListFile: FSharpProjectDependenciesListFile;
    export let index: number;
	export let depth: number;
    export let parent: IdeFile | undefined;
	export let parentChildren: IdeFile[];

	let children: IdeFile[] | undefined;

	$: titleText = fSharpProjectDependenciesListFile.absoluteFilePath.filenameWithExtension;

	function getChildFiles(): IdeFile[] {
		children = fSharpProjectDependenciesListFile.constantChildFiles
			?.filter(x => !hasDifferentParentContainer(x));
		
		return children;
	}

	function hasDifferentParentContainer(childIdeFile: IdeFile): boolean {
		if (childIdeFile.virtualParentNonce) {
			if (childIdeFile.virtualParentNonce !== fSharpProjectDependenciesListFile.nonce) {
				return true;
			}
		}
		return false;
	}
</script>

<TreeViewBase ideFile="{fSharpProjectDependenciesListFile}" 
              titleText={titleText}
              getChildFiles={getChildFiles}
			  bind:children={children}
			  {index}
			  {depth}
			  {parent}
			  {parentChildren} />