<script lang="ts">
	import type { IdeFile } from "../../../../../../out/FileSystem/Files/IdeFile";
	import TreeViewBase from "../../TreeViewBase.svelte";
	import type { ProjectNugetPackageDependenciesListFile } from "../../../../../../out/FileSystem/Files/Nuget/ProjectNugetPackageDependenciesListFile";
	import { MessageReadNugetPackageReferencesInProject } from "../../../../../../out/Messages/Read/MessageReadNugetPackageReferencesInProject";
	import { MessageCategory } from "../../../../../../out/Messages/MessageCategory";
	import { MessageReadKind } from "../../../../../../out/Messages/Read/MessageReadKind";
	import { onMount } from "svelte";
	import { FileKind } from "../../../../../../out/FileSystem/FileKind";
	
    export let projectNugetPackageDependenciesListFile: ProjectNugetPackageDependenciesListFile;
    export let index: number;
	export let depth: number;
    export let parent: IdeFile | undefined;
	export let parentChildren: IdeFile[];

	let children: IdeFile[] | undefined;

	$: titleText = projectNugetPackageDependenciesListFile.absoluteFilePath.filenameWithExtension;

	function getChildFiles(): IdeFile[] {
		children = projectNugetPackageDependenciesListFile.virtualChildFiles
			?.filter(x => !hasDifferentParentContainer(x));

		if (!children) {
			let messageReadNugetPackageReferencesInProject =
				new MessageReadNugetPackageReferencesInProject(projectNugetPackageDependenciesListFile);
			
			tsVscode.postMessage({
				type: undefined,
				value: messageReadNugetPackageReferencesInProject,
			});

			return [];
		}
		return children;
	}

	function hasDifferentParentContainer(childIdeFile: IdeFile): boolean {
		if (childIdeFile.virtualParentNonce) {
			if (childIdeFile.virtualParentNonce !== projectNugetPackageDependenciesListFile.nonce) {
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
						case MessageReadKind.nugetPackageReferencesInProject:
							let messageReadNugetPackageReferencesInProject =
								message as MessageReadNugetPackageReferencesInProject;
							if (projectNugetPackageDependenciesListFile.nonce === 
								messageReadNugetPackageReferencesInProject.projectNugetPackageDependenciesFile.nonce) {
								
								projectNugetPackageDependenciesListFile =
									messageReadNugetPackageReferencesInProject.projectNugetPackageDependenciesFile;
									
								children = projectNugetPackageDependenciesListFile.virtualChildFiles
									?.filter(x => !hasDifferentParentContainer(x));
							}
							break;
					}
			}
		});
	});
</script>

<TreeViewBase ideFile="{projectNugetPackageDependenciesListFile}" 
              titleText={titleText}
              getChildFiles={getChildFiles}
			  bind:children={children}
			  {index}
			  {depth}
			  {parent}
			  {parentChildren} />