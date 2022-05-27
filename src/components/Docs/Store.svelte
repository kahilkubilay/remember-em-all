<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Store`,
    description: `Veri taşımacılık ltd. şti.'nin joker kartı.. Verilerinizi her 
      yerde güncellenmesini, çağırılmasını sağlar. Kullanımı için bir hiyerarşi
      içerisinde olmasına gereksinimi bulunmuyor.`,
    id: "store",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
