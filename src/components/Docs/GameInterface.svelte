<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Game Interface`,
    description: `Oyun içerisinde kartların kullanılabilmesi için bir 
      Component'a ihtiyacımız bulunuyor. Bu component'i oluşturarak, oyun 
      alanında istediğimiz sayıda kart oluşturacağız.`,
    id: "game-interface",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
</article>
