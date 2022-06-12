<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `Examining the Svelte structure`,
    description: `When we check the default 'src/App.svelte' file, as we
      mentioned before, there are script tags where you can define Javascript
      codes, main for html codes and style tags that allow you to develop on
      styling.`,
    material: [
      `In the script tag, the 'lang' attribute is available in the 'ts' value
      because of the <code><i>Typescript</i></code> dependency. In the
      <code><i>Svelte</i></code> files that you want to use
      <code><i>Typescript</i></code>, it will be sufficient to give the ts value
      to the lang property.`,
      `As you can define html codes in the 'main' tag, you can define HTML codes
      outside of this tag as you wish. Although <code><i>Svelte</i></code>
      compiles the codes you define as HTML code, it may be better to gather
      them under a container tag, so that the project structure and code may be
      more legible.`,
      `The style properties you define under the style tag are affected by the
      selectors in the HTML field in the same file. You can define global
      selectors or edit the selectors you want to define globally in 
      'public/global.css' file.`,
      `All builds compiled in the project are in the '/public/build/bundle.js'
      file. The 'index.html' file presents the <code><i>Svelte</i></code>
      project to the user by referencing the structure here.`,
    ],
    id: "examine-svelte-structure",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Matter matter={article.material} />
</article>
