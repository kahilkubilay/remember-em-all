<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `How Svelte Works?`,
    description: `<code><i>Svelte</i></code> components are created with files
      with the <code><i>.svelte</i></code> extension. Similar to HTML, there are
      three different sections where you can create <code><i>script, style and
      html</i></code> code structures.`,
    otherDescription: `<code><i>Svelte</i></code> files are compiled and
      converted to vanilla <code><i>Javascript</i></code> codes. Svelte compiles
      on runtime. With this build process, it eliminates addiction of the
      Virtual DOM.`,
    image: `assets/documentation/build-map.png`,
    alternativeText: `Svelte build file`,
    id: "how-svelte-works",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
