<script>
  // import ContentData from "./Data/TR/Content.json";
  // import CodeDescriptionData from "./Data/TR/CodeDescriptionData.json";
  // import Section from "./Section/Templates/Section.svelte";
  // import CodeDescription from "./Section/Templates/CodeDescription/CodeDescription.svelte";
  // import { Codes } from "./Data/Shared/CodeExamples";
  // import UseComponent from "./Section/Templates/Custom/UseComponent/UseComponent.svelte";

  import AboutProject from "./AboutGame.svelte";
  import AvatarComponent from "./AvatarComponent.svelte";
  import BasicTerms from "./BasicTerms.svelte";
  import CardComponent from "./CardComponent.svelte";
  import CommunicationBetweenComponent from "./CommunicationBetweenComponent.svelte";
  import Context from "./Context.svelte";
  import CreateASvelteProject from "./CreateASvelteProject.svelte";
  import ExamineSvelteStructure from "./ExamineSvelteStructure.svelte";
  import GameInterface from "./GameInterface.svelte";
  import GameRequirements from "./GameRequirements.svelte";
  import HeaderComponent from "./HeaderComponent.svelte";
  import Hello from "./Hello.svelte";
  import ModuleContext from "./ModuleContext.svelte";
  import NameComponent from "./NameComponent.svelte";
  import Practice from "./Practice.svelte";
  import ProjectDependencies from "./ProjectDependencies.svelte";
  import Props from "./Props.svelte";
  import ReactiveUserComponent from "./ReactiveUserComponent.svelte";
  import ReactiveVariables from "./ReactiveVariables.svelte";
  import Slots from "./Slots.svelte";
  import StartGame from "./StartGame.svelte";
  import Store from "./Store.svelte";
import SvelteRun from "./SvelteRun.svelte";
  import UseOfComponent from "./UseOfComponent.svelte";
  import UserComponent from "./UserComponent.svelte";
  import VaribleAccess from "./VaribleAccess.svelte";
  import WhatIsSvelte from "./WhatIsSvelte.svelte";

  // const { detail } = ContentData;
  // const { codeDetail } = CodeDescriptionData;

  // const codes = Codes;

  // console.log("here=>", Codes);
  // console.log("here=>", Codes.variableErisimi);
</script>

<!-- <Section detail={detail.selamlar} />
<Section detail={detail.oyunHakkinda} />
<Section detail={detail.svelteNedir} />
<Section detail={detail.basitIfadeler} /> -->
<!-- Svelte Projesi Olusturma -- burayı custom yap-->
<!-- <Section detail={detail.svelteNasilCalisir} />
<Section detail={detail.bagimliliklar} />
<Section detail={detail.svelteYapisiniInceleme} />
<Section detail={detail.birazPratik} /> -->

<!-- <CodeDescription
  code={codes.variableErisimi}
  header={codeDetail.variableErisimi.header}
  text={codeDetail.variableErisimi.description}
  title={codeDetail.variableErisimi.fileName}
  description={codeDetail.variableErisimi.endStory}
/> -->
<!-- 
<CodeDescription
  code={codes.reaktifDegiskenler}
  header={codeDetail.reaktifDegiskenler.header}
  text={codeDetail.reaktifDegiskenler.description}
  title={codeDetail.reaktifDegiskenler.fileName}
  description={codeDetail.reaktifDegiskenler.endStory}
  image={codeDetail.reaktifDegiskenler.image}
  alternativeText={codeDetail.reaktifDegiskenler.alternativeText}
/> -->

<!-- <UseComponent /> -->

<!-- <Prism language="svelte" source={Codes[example.codeId]} /> -->

<Hello />
<AboutProject />
<WhatIsSvelte />
<SvelteRun />
<BasicTerms />
<CreateASvelteProject />
<ProjectDependencies />
<ExamineSvelteStructure />
<Practice />
<VaribleAccess />
<ReactiveVariables />
<UseOfComponent />
<CommunicationBetweenComponent />
<Props />
<Slots />
<Context />
<ModuleContext />
<Store />
<StartGame />
<UserComponent />
<HeaderComponent />
<AvatarComponent />
<NameComponent />
<GameRequirements />
<ReactiveUserComponent />
<GameInterface />
<CardComponent />

<style>
</style>
