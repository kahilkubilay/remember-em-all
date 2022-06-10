<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Selamlaaaaar 👋`,
    description: `Herşeyden önce umuyorum ki bu basit döküman 
    <code><i>Svelte</i></code> yolculuğunda rehber olabilir. Son zamanlarda 
    Svelte ile uygulama geliştirmeye başladım. Svelte yapısına daha çok hakim 
    olabilmek ve öğrendiklerimi paylaşabilmek için bu yazıyı hazırladım. 
    Döküman içerisinde adım adım <code><i>Game</i></code> bağlantısında 
    görebileceğin oyunu nasıl geliştirdiğimi  anlattım, ilgi duyuyorsan aynı 
    adımları takip ederek benzer bir uygulama oluşturabilir, veya küçük bir 
    kaynak modelinde kullanabilirsin. Svelte içeriği iyi ayrıntılanmış 
    dökümantasyonlara (<a href="https://svelte.dev/docs" 
    title="Svelte Documentation">Svelte Documentation</a>, <a 
    href="https://svelte.dev/examples/hello-world" title="Svelte Examples">
    Svelte Examples</a>) sahip, dökümantasyonları inceledikten sonra uygulamayı
    takip etmen daha faydalı olabilir.`,
    otherDescription: `İlk bölümlerde <code><i>Svelte</i></code> nasıl 
    kullanabileceğine dair bilgilendirmeler yer alıyor. Bu kısımlara hakimsen, 
    atlayarak <a href="#start-game" title="Access Startm Game section">
    Start Game</a> bölümünden devam edebilirsin.`,
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
