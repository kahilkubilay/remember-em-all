<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Oyun hakkında`,
    description: `Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcının 
    seviyesine göre arayüz üzerinde farklı kartlar bulunacak. Kartlara click 
    eventi gerçekleştiğinde kartlar açılacak, kullanıcı açılan kartları 
    eşleştirmeye çalışacak. Eşleşen kartlar açık bir şekilde arayüz üzerinde 
    dururken başarılı eşleşme sonucunda kullanıcıya puan kazandıracak, başarısız
    her eşleşmede kartlar bulundukları yerde yeniden kapatılacaklar. Bütün 
    kartlar eşleştiklerinde, bir sonraki seviyede yer alan kartlar arayüze 
    kapalı olarak yeniden gelecektir.`,
    otherDescription: `Oyun başlangıcında kullanıcıdan bir kullanıcı adı 
      girmesi, avatar listesinde yer alan görsellerden birini seçmesi 
      beklenecektir (Avatarlar ne kadar evcil gözükseler de, güç içlerinde 
      gizli 🐱‍👤). Bu seçilen değerler oyunun arayüzünde kartların yer aldığı 
      bölümün altında <code><i>score & level</i></code> değerleri ile birlikte 
      gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak 
      tutulurken, <code><i>score & level</i></code> değerleri dinamik olarak 
      kullanıcı davranışına göre güncellenecektir.`,
    image: `assets/documentation/playground.png`,
    alternativeText: `view of cards on the playground`,
    otherImage: `assets/userground.png`,
    otherImageAlternativeText: `view user component on the playground`,
    id: "about-game",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
  <Image
    image={article.otherImage}
    alternativeText={article.otherImageAlternativeText}
  />
</article>
