<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Props`,
    description: `Props kullanarak dataları bir component üzerinden farklı 
      componentlere aktarabilirsiniz. Componentler arası bu ilişki parent-child
      ile ifade edilir. Parent üzerinden child componentlere veri 
      aktarabiliyorken, aynı zamanda child component üzerinden parent 
      componente veri iletebilirsiniz.`,
    id: "props",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
