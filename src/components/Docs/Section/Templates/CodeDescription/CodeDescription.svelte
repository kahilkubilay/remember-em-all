<script>
  import CodeSyntax from "./CodeSyntax.svelte";
  import Header from "../Header.svelte";
  import Paragraph from "../Paragraph.svelte";
  import FileTitle from "../FileTitle.svelte";
  import Image from "../Image.svelte";

  export let code;
  export let header;
  export let text;
  export let title;
  export let description;
  export let image;
  export let alternativeText;
</script>

<Header {header} />
<Paragraph {text} />
<FileTitle {title} />
<CodeSyntax {code} />
<Paragraph {description} />
<Image {image} {alternativeText}/>

<style>
</style>
