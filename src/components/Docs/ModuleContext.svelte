<script>
  import ChildTitle from "./Section/Templates/ChildTitle.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Module Context`,
    description: `Component üzerinde kullandığınız veri farklı bir Component'da 
      yer alıyorsa ve çalışmaları birbirlerine bağımlı olduğu senaryolarda 
      Module Context Componentlar arasında bu senaryonun uygulanmasını sağlıyor.
      Verileri birden çok component ile paylaşılmasını olanak tanır.`,
    id: "module-context",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <ChildTitle head={article.head} />
  <Paragraph text={article.description} />
</article>
