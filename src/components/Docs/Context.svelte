<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Context`,
    description: `Bir veriyi iletmeniz gereken component sayısı arttıkça, 
      yapısını kurgulamak ve takibini sağlamak zor ve bir yerden sonra da 
      oldukça sıkıcı bir duruma dönüşebilir. Context ile dataların parent 
      üzerinden child componentler üzerinde erişilmesini sağlar.`,
    id: "context",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
