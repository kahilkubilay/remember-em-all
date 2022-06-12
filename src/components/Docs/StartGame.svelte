<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Start Game`,
    description: `We're getting to know <code><i>Svelte</i></code> a little
      better, we've learned enough to create our app together. We can start to
      construct the structures required for the game from simple to difficult.
      There are two Components that the user can see on the interface,
      <b>Username and User Component</b> with <b>avatar selected, Playground
      Component</b> accessed after these selections. Let's start building our
      game with the <b>User Component</b>. You can create a new project or
      remove the code we have been practicing. Let's start by creating the
      <code><i>src > components > User and src > components > Playground</i>
      </code> folders.`,
    image: `assets/documentation/start-folder.png`,
    alternativeText: `start folder`,
    id: "start-game",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
