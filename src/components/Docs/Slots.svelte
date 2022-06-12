<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Slots`,
    description: `You can use it to pass the data to the child component, as in
      the parent-child relationship. You can pass data (such as html content)
      within a template.`,
    id: "slots",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
