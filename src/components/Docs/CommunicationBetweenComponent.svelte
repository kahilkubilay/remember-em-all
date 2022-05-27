<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Componentler Arası İletişim`,
    description: `Küçük yapılı projelerden, komplex yapılılara kadar birçok 
      component üzerinden alıp farklı bir yerde kullanma, güncelleme gibi 
      ihtiyaçlarımız olacak. Kullanılan framework, library veya compiler'in bu 
      ihtiyacınıza esnek çözümler sağlayabilmesi gerekiyor. Svelte bu 
      ihtiyaçlarınız için birden fazla ve basit yapılara sahip çözümler 
      barındırıyor.`,
    image: `assets/documentation/communication-is-key.jpg`,
    alternativeText: `SpongeBob 'communication is key' meme`,
    id: "communication-between-component",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.description} />
</article>
