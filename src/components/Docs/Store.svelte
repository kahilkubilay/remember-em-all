<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Store`,
    description: `Data transportation company's joker card.. It enables us to
      call and update data anywhere. It does not need to be in a hierarchy for
      its use.`,
    id: "store",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
