<script lang="ts">
	import type { IdeFile } from "../../../../../../out/FileSystem/Files/IdeFile";
	import TreeViewBase from "../../TreeViewBase.svelte";
	import type { ProjectNugetPackageDependencyFile } from "../../../../../../out/FileSystem/Files/Nuget/ProjectNugetPackageDependencyFile";
	
    export let projectNugetPackageDependencyFile: ProjectNugetPackageDependencyFile;
    export let index: number;
	export let depth: number;
    export let parent: IdeFile | undefined;
	export let parentChildren: IdeFile[];

	let children: IdeFile[] | undefined;

	$: titleText = projectNugetPackageDependencyFile.absoluteFilePath.filenameWithExtension;
	
	function getChildFiles(): IdeFile[] {
        children = projectNugetPackageDependencyFile.virtualChildFiles
			?.filter(x => !hasDifferentParentContainer(x));

		return children;
	}

	function hasDifferentParentContainer(childIdeFile: IdeFile): boolean {
		if (childIdeFile.virtualParentNonce) {
			if (childIdeFile.virtualParentNonce !== projectNugetPackageDependencyFile.nonce) {
				return true;
			}
		}

		return false;
	}
</script>

<TreeViewBase ideFile="{projectNugetPackageDependencyFile}" 
              titleText={titleText}
              getChildFiles={getChildFiles}
			  bind:children={children}
			  {index}
			  {depth}
			  {parent}
			  {parentChildren} />