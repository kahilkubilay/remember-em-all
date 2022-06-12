<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Hiiiiiiiiii 👋`,
    description: `First of all, I hope this simple document can be a guide on
      your <code><i>Svelte</i></code> journey. I recently started developing
      applications with Svelte. I have prepared this article in order to have a
      better understanding of the Svelte structure and to share what I have
      learned. In the document, I explained step by step how I developed the
      game, which you can see in the <code><i>#Game</i></code> link, if you are
      interested, you may createa similar application by following the same
      steps or use it as a small resource. Svelte has well-detailed
      documentation (<a href="https://svelte.dev/docs" title="Svelte
      Documentation">Svelte Documentation</a>, <a 
      href="https://svelte.dev/examples/hello-world" title="Svelte Examples">
      Svelte Examples</a>), so it may be more helpful to follow the application
      after reviewing the documentation.`,
    otherDescription: `In the first few chapters, there is information about
      how to use <code><i>Svelte</i></code>. If you have mastered these parts,
      you can skip ahead and continue from the  <a href="#start-game" title="
      Access Startm Game section">Start Game</a> section.`,
    image: `assets/documentation/squirtle-squad.webp`,
    alternativeText: `hello team`,
    id: "hello-team",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
</article>
