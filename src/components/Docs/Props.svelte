<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Props`,
    description: `By using props, we can transfer data from a component to
      different components. This relationship between components is expressed as
      parent-child. While you can pass data to child components through the
      parent, you can also pass data to the parent component through the child
      component.`,
    id: "props",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
