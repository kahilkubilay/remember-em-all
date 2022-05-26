<script>
  import Paragraph from "./Paragraph.svelte";
  import Header from "./Header.svelte";
  import Image from "./Image.svelte";
  import List from "./List.svelte";
  import ArrayList from "./ArrayList.svelte";

  export let detail;

  const header = (detail || {}).header || "";
  const text = (detail || {}).text || "";
  const image = (detail || {}).image || "";
  const alternativeText = (detail || {}).alternativeText || "";
  const description = (detail || {}).description || "";
  const material = (detail || {}).material || "";
  const list = (detail || {}).list || "";
</script>

<main>
  <Header {header} />
  <Paragraph {text} />
  <Image {image} {alternativeText} />
  <Paragraph {description} />
  <List {material} />
  <ArrayList {list} />
</main>

<style>
  main {
  }
</style>
