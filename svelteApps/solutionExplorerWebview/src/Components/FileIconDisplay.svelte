<script lang="ts">
    import { FileKind } from "../../../../out/FileSystem/FileKind";
    import CSharpProjectIcon from "./Icons/CSharpProjectIcon.svelte";
    import SolutionIcon from "./Icons/SolutionIcon.svelte";
    import DirectoryIcon from "./Icons/DirectoryIcon.svelte";
    import CSharpIcon from "./Icons/CSharpIcon.svelte";
    import FSharpIcon from "./Icons/FSharpIcon.svelte";
    import CshtmlIcon from "./Icons/CshtmlIcon.svelte";
    import RazorIcon from "./Icons/RazorIcon.svelte";
    import CssIcon from "./Icons/CssIcon.svelte";
    import TxtIcon from "./Icons/TxtIcon.svelte";
    import SolutionFolderIcon from "./Icons/SolutionFolderIcon.svelte";
    import JsonIcon from "./Icons/JsonIcon.svelte";
    import ProjectDependenciesIcon from "./Icons/ProjectDependenciesIcon.svelte";
    import NugetPackageDependencyIcon from "./Icons/NugetPackageDependencyIcon.svelte";
    import NugetPackageDependenciesIcon from "./Icons/NugetPackageDependenciesIcon.svelte";
    import ProjectReferencesIcon from "./Icons/ProjectReferencesIcon.svelte";
    import ProjectReferenceIcon from "./Icons/ProjectReferenceIcon.svelte";
    import type { IdeFile } from "../../../../out/FileSystem/Files/IdeFile";
    import WwwRootIcon from "./Icons/WwwRootIcon.svelte";
    import { ConstantsUniqueFiles } from "../../../../out/Constants/ConstantsUniqueFiles";
    import PropertiesIcon from "./Icons/PropertiesIcon.svelte";
    import VcxProjectIcon from "./Icons/VCXProjectIcon.svelte";
    import FSharpProjectIcon from "./Icons/FSharpProjectIcon.svelte";
    import FSXIcon from "./Icons/FSXIcon.svelte";
    import CIcon from "./Icons/CIcon.svelte";
    import CPlusPlusIcon from "./Icons/CPlusPlusIcon.svelte";
    import JavaScriptIcon from "./Icons/JavaScriptIcon.svelte";
    import TypeScriptIcon from "./Icons/TypeScriptIcon.svelte";

    export let ideFile: IdeFile;

    $: fileKind = ideFile.fileKind;
</script>

<span class="dni_file-icon-display">
    {#if fileKind === FileKind.solution}
        <SolutionIcon />
    {:else if fileKind === FileKind.solutionFolder}
        <SolutionFolderIcon />
    {:else if fileKind === FileKind.cSharpProject}
        <CSharpProjectIcon />
    {:else if fileKind === FileKind.fSharpProject}
        <FSharpProjectIcon />
    {:else if fileKind === FileKind.vcxProject}
        <VcxProjectIcon />
    {:else if fileKind === FileKind.default}
        <TxtIcon />
    {:else if fileKind === FileKind.directory}
        {#if ideFile.absoluteFilePath.filenameNoExtension === ConstantsUniqueFiles.WWW_ROOT_FILENAME_NO_EXTENSION}
            <WwwRootIcon />
        {:else if ideFile.absoluteFilePath.filenameNoExtension === ConstantsUniqueFiles.PROPERTIES_FILENAME_NO_EXTENSION}
            <PropertiesIcon />
        {:else}
            <DirectoryIcon />
        {/if}
    {:else if fileKind === FileKind.cSharp}
        <CSharpIcon />
    {:else if fileKind === FileKind.fSharp}
        <FSharpIcon />
    {:else if fileKind === FileKind.fSX}
        <FSXIcon />
    {:else if fileKind === FileKind.cPlusPlus}
        <CPlusPlusIcon />
    {:else if fileKind === FileKind.c}
        <CIcon />
    {:else if fileKind === FileKind.js}
        <JavaScriptIcon />
    {:else if fileKind === FileKind.typeScript}
        <TypeScriptIcon />
    {:else if fileKind === FileKind.cshtml}
        <CshtmlIcon />
    {:else if fileKind === FileKind.razor}
        <RazorIcon />
    {:else if fileKind === FileKind.css}
        <CssIcon />
    {:else if fileKind === FileKind.json}
        <JsonIcon />
    {:else if fileKind === FileKind.cSharpProjectDependencies}
        <ProjectDependenciesIcon />
    {:else if fileKind === FileKind.fSharpProjectDependencies}
        <ProjectDependenciesIcon />
    {:else if fileKind === FileKind.nugetPackageDependenciesList}
        <NugetPackageDependenciesIcon />
    {:else if fileKind === FileKind.nugetPackageDependency}
        <NugetPackageDependencyIcon />
    {:else if fileKind === FileKind.projectReferencesList}
        <ProjectReferencesIcon />
    {:else if fileKind === FileKind.projectReference}
        <ProjectReferenceIcon />
    {/if}
</span>