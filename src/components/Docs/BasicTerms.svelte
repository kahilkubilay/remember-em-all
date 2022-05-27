<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import List from "./Section/Templates/List.svelte";

  const article = {
    head: `Basit ifadeler`,
    description: `Bazı bölümlerde aynı kelimeleri tekrar etmemek için, bazı 
      kısayol ifadeleri kullandım(tamamen salladım). Sayısı çok fazla değil, 
      sorun yaşayacağını düşünmüyorum.`,
    terms: [
      {
        command: `_Playground_`,
        description: `Playground.svelte Component`,
      },
      {
        command: `+ User.svelte`,
        description: `_User.svelte_ dosyası oluşturuldu.`,
      },
      {
        command: `Avatar/`,
        description: `_Avatar_ klasörü oluşturuldu.`,
      },
      {
        command: `+ User.svelte + Header.svelte + Avatars.svelte`,
        description: `_User.svelte, Header.svelte, Avatars.svelte_ dosyaları 
          oluşturuldu.`,
      },
      {
        command: `+ User > Avatar.svelte`,
        description: `_User_ klasörü içerisinde _Avatar.svelte_ dosyası 
          oluşturuldu.`,
      },
      {
        command: `+ public > assets > images > pasa.jpg, sabuha.jpg`,
        description: `_public > assets > images_ klasörü içerisinde _pasa.jpg_,
          _sabuha.jpg_ dosyaları oluşturuldu.`,
      },
    ],

    id: "basic-terms",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <List material={article.terms} />
</article>
