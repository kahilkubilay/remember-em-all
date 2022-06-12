<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Context`,
    description: `As the number of components you need to transfer data,
      increases, it can be difficult to edit and follow the structure, and it
      can turn into a rather boring situation after a while. With Context, it
      enables data to be accessed on child components via parent.`,
    id: "context",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
