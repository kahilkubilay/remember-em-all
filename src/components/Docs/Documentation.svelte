<script>
  import ContentData from "./Data/TR/Content.json";

  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Section from "./Section/Templates/Section.svelte";

  import Prism from "svelte-prism";
  import { Codes } from "./Data/Shared/CodeExamples";

  const { detail } = ContentData;
</script>

<Section detail={detail.selamlar} />
<Section detail={detail.oyunHakkinda} />
<Section detail={detail.svelteNedir} />
<Section detail={detail.basitIfadeler} />
<Section detail={detail.svelteNasilCalisir} />
<Section detail={detail.bagimliliklar} />
<Section detail={detail.svelteYapisiniInceleme} />
<Section detail={detail.birazPratik} />
<!-- Svelte Projesi Olusturma -- burayı custom yap-->

<!-- <Prism language="svelte" source={Codes[example.codeId]} /> -->
<style>
</style>
