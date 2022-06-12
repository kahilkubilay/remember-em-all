<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Module Context`,
    description: `If the data you use on the Component is located in a different
      Component and its operations are dependent on each other, 'Module Context'
      provides this scenario to be applied between Components. It allows sharing
      data with multiple components.`,
    id: "module-context",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
