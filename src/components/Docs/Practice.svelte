<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `A little practice`,
    description: `Let's try to understand and interpret
      <code><i>Svelte</i></code> by making a few examples. The code samples will
      form the basis for the structures that we will use frequently on the
      game.`,
    otherDescription: `A variable named <code><i>name</i></code> is defined in
      the <code><i>app.svelte</i></code> file. Since it is based on 
      <code><i>Typescript</i></code> notation, string is given as value type.
      With this notation, I would prefer not to use it because the expression
      may be a little longer. If you're reviewing the code available on Github,
      what we're going to create here may be different.`,
    id: "practice",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
</article>
