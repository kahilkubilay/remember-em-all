<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Selamlaaaaar 👋`,
    description: `Herşeyden önce umuyorum ki bu basit döküman Svelte 
    yolculuğunda rehber olabilir. Son zamanlarda Svelte ile uygulama 
    geliştirmeye başladım. Svelte'in yapısına daha çok hakim olabilmek ve 
    öğrendiklerimi paylaşabilmek için bu dökümanı oluşturdum. Döküman içerisinde
    adım adım _Game_ bağlantısında görebileğin oyunu nasıl geliştirdiğimi 
    anlattım, ilgi duyuyorsan aynı adımları takip ederek benzer bir uygulama 
    oluşturabilir, veya küçük bir kaynak modelinde kullanabilirsin. Svelte 
    içeriği iyi ayrıntılanmış dökümantasyonlara 
    ([docs](https://svelte.dev/docs "Svelte Documentation"), 
    [examples](https://svelte.dev/examples/hello-world "Svelte Examples")) 
    sahip, dökümantasyonları inceledikten sonra uygulamayı takip etmen daha 
    faydalı olabilir.`,
    otherDescription: `İçeriğin detaylarını sol tarafta yer alan 
    haritalandırma ile takip edebilirsin. İlk bölümlerde Svelte'i nasıl 
    kullanabileceğine dair bilgilendirmeler yer alıyor. Bu kısımlara hakimsen, 
    atlayarak [Start Game](#start-game "Access Start Game section") bölümünden 
    devam edebilirsin.`,
    image: `assets/documentation/squirtle-squad.webp`,
    alternativeText: `hello team`,
    id: "hello-team",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
</article>
