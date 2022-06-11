<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `References`,
    material: [
      `https://svelte.dev/blog/svelte-3-rethinking-reactivity`,
      `https://svelte.dev/examples/hello-world`,
      `https://svelte.dev/tutorial/basics`,
      `https://svelte.dev/docs`,
      `https://svelte.dev/blog`,
      `https://svelte.dev/blog/svelte-3-rethinking-reactivity`,
      `https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript`,
      `https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/`,
      `https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next`,
      `https://betterprogramming.pub/6-ways-to-do-component-communications-in-svelte-b3f2a483913c`,
      `https://livebook.manning.com/book/svelte-and-sapper-in-action/chapter-5/v-3/`,
    ],
    id: "references",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Matter matter={article.material} />
</article>
