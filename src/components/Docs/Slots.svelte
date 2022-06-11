<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Slots`,
    description: `Parent-child ilişkisinde olduğu gibi verilerin alt componente
      aktarılmasında kullanabilirsin. Bir template dahilinde (html içerikleri
      gibi) verilerin aktarılmasına sağlayabilirsin.`,
    id: "slots",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
