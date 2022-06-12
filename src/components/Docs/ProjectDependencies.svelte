<script>
  import Header from "./Section/Templates/Header.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import List from "./Section/Templates/List.svelte";

  const article = {
    head: `Project dependencies`,
    terms: [
      {
        command: `Typescript`,
        description: `<code><i>Typescript</i></code> is a <code><i>Javascript
          </i></code> based programming language that makes your <code><i>
          Javascript</i></code> code more efficient and prevents code-based
          errors. It supports <code><i>.ts</i></code> files as well as you can
          use it in <code><i>.svelte</i></code> files in your project. We will
          not continue with Typescript format in the game we will develop. I
          realized that I did not have complete control over it and that I had
          deviated from the essence of the subject. Just remember that you can
          use <code><i>Typescript on Svelte</code></i>.`,
      },
      {
        command: `Rollup`,
        description: `With your <code><i>Svelte</i></code> installation, the
          rollup.config.js file will be created on the root folder.
          <code><i>Rollup</i></code> is a module wrapper for <code><i>
          Javascript</i></code> applications, it parses the codes in our
          application in a way that the browser can understand. It will be
          included in your project with the installation of
          <code><i>Svelte</i></code>.`,
      },
    ],
    id: "dependencies",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <List material={article.terms} />
</article>
