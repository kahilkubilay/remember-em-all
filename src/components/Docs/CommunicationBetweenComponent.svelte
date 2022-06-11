<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Componentler Arası İletişim`,
    description: `Küçük yapılı projelerden, komplex yapılılara kadar birçok 
      veriyi component üzerinden alıp farklı bir yerde kullanma, güncelleme gibi 
      ihtiyaçlarımız olacaktır. Modern framework yapılarının çözüm olarak 
      kullanılan yapılarından biri de buradaki dataları <code><i>DOM, 
      storage</i></code> gibi yapılara ihtiyaç duymadan uygulaman üzerinde 
      kullanabilmeni sağlamaktır. Kullanılan framework, library veya 
      compiler'in bu ihtiyacımıza esnek çözümler sağlayabilmesi gerekiyor. 
      Svelte bu ihtiyaçlarımız için birden fazla çözümlere sahip.`,
    image: `assets/documentation/communication-is-key.jpg`,
    alternativeText: `SpongeBob 'communication is key' meme`,
    id: "communication-between-components",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.description} />
</article>
