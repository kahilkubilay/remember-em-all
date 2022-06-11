<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Card Component`,
    description: `Oyun alanında kullanacağımız kartlar için componentlere 
      ihtiyacımız olacak. <code><i>CardFront componentinde</i></code> kartın
      pokemon resmini tutarken, <code><i>CardBack componentinde</i></code>
      '?' resmini tutacağız. Her iki bileşenin ortak kapsayıcısı <code><i>Card 
      bileşeni</i></code> olacak.`,
    otherDescription: `<code><i>Card componentini</i></code> test ederken,
      sürekli olarak <code><i>User componenti</i></code> üzerinde isim ve 
      avatar seçimi yapmamak için <code><i>Playground componentinde</i></code>
      yer alan <code><i>isStart</i></code> şartını <code><i>true</i></code>
      ifadesine çevirelim.`,
    anotherDescription: `<code><i>CardFront</i></code> componentinde yer alan 
      resimlerde <code><i>img src özelliği</i></code> olarak bir API adresi
      verilmiş. Bu API'da dosya isimlerinde yer alan numaraları güncelleyerek,
      farklı pokemon resimlerine erişilebilir.`,
    anAnotherDescription: `<code><i>CardFront componentini</i></code> öncelikle
      <code><i>Card componentinde</i></code>, 
      <code><i>Card componentini</i></code> de <code><i>Playground</i></code>
      içerisinde <code><i>true</i></code> dönen blokta çağıralım. Aynı işlemi
      <code><i>CardBack componentinde</i></code> tekrarlayarak 
      <code><i>Card componentleri</i></code> üzerinde yaptığımız her 
      güncellemeyi inceleyebileceğiz.`, // 💩
    moreAnotherDescription: `<code><i>Card componentleri</i></code> birer 
      block-element olduğu için alt alta durmaktadır. Componentleri bir 
      kapsayıcı içerisine alarak, inline-block seviyesine alalım. Aynı Component
      içerisinde çağırdığımızdan dolayı, 'position: absolute' stilini 
      verdiğimizde <code><i>Card Componentinde</i></code> yer alan 
      <code><i>child componentler</i></code> üst üste duracaktır. Bu şekilde 
      aynı kartın farklı iki yüzü görünümüne sahip olacaklar.`, // 💩
    moreDescription: `CSS kullanarak Card'ın arka yüzülen her tıklama ile 
      birlikte <code><i>transform özelliği</i></code> ile <code><i>CardBack
      Componentinin</i></code> altında yer alan <code><i>CardFront</i></code>
      içerisinde yer alan kartın görüntülenmesini sağlayacağız. 
      <code><i>Global.css</i></code> dosyamıza aşağıdaki özellikleri 
      ekleyelim.`,
    descriptionCode: `<code><i>img</i></code> kapsayıcısı olan 
      <code><i>back ve front classlarına</i></code> sahip kapsayıcılara belirli
      özellikler katarak basit şekilde bir kart görünümü vermeye çaba sarfettik.
      <code><i>CardBack componentinde Card componentinde</i></code> 
      çağırarak arayüz üzerinde nasıl göründüğünü inceleyelim.`,
    oneMoreDescription: `<code><i>Card componentlerinin</i></code> bir bütün
      gibi birlikte aynı hızda, ve aynı perspektif üzerinden dönüş sağlaması
      gerekiyor. <code><i>Svelte'de</i></code> her component içerisinde 
      tanımlanan <code><i>style özellikleri</i></code>, Component'e ait 
      kapsayıcısı kadardır, diğer componentler bu stillendirmelerden
      etkilenmezler. Bundan dolayı her iki class için aynı tanımlamaları
      gerçekleştirelim veya bu stillendirmeleri <code><i>Global</i></code> 
      olarak tanımlayalım.`,
    codeExplanation: `<code><i>CardBack Componentinin</i></code> kapsayıcı 
      class'ına <code><i>.back</i></code>, 'position: absolute' değerini 
      verdiğimizde her iki kart üst üste görüntülenecektir.`,
    otherCodeExplanation: `<code><i>Card componentlerinde</i></code> transform
      stillendirmesi sağlayarak, <code><i>hover class</i></code> eklendiğinde
      dönüş efekti vermesini sağlayalım.`,
    endStory: `Konsol üzerinde 'CardBack' componentine ait 'flipper' class 
      bulunan elemente 'hover' class eklediğinde efekt gerçekleştiğini 
      inceleyebilirsin.`,
    image: `assets/components/Card/card-views.png`,
    anotherImage: `assets/components/Card/card-position.gif`,
    anotherOneImage: `assets/components/Card/card-turn-effect-back.png`,
    moreImage: `assets/components/Card/card-turn-effect-front.png`,
    alternativeText: `class Directives`,
    anotherAlternativeText: `card position`,
    anotherOneAlternativeText: `Card turn effect back`,
    moreAlternativeText: `Card turn effect front`,
    id: "card-component",
  };

  const code = `
    <script><\/script>

    <img
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
      alt="card on the playing field"
      class="single-poke"
    />

    <style>
      .front {
        width: 100px;
        height: 100px;
        top: 0;
        left: 0;
      }

      .single-poke {
        border-radius: 11px;
        background-color: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }  
    </style>
  `;

  const otherCode = `
    <script><\/script>

    <div class="back">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
        class="single-poke"
        alt="card back on the playing field"
      />
    </div>

    <style>
      .back {
        width: 100px;
        height: 100px;
        top: 0;
        left: 0;
        border-radius: 11px;
      }

      .back:hover {
        cursor: pointer;
      }

      .single-poke {
        border-radius: 11px;
        background: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }
    </style>
  `;

  const oneMoreCode = `
    .flipper.hover .front {
      transform: rotateY(0deg);
    }

    .flipper.hover .back {
      transform: rotateY(180deg);
    }
  `;

  const anotherOneMoreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <FrontCardFace />
        <BackCardFace />
      </div>
    </main>

    <style>
      .flip-container {
        display: inline-block;
        margin: 5px;
        width: 100px;
        height: 100px;
      }
  
      .flipper {
        position: relative;
      }  
    </style>
  `;

  const moreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper"></div>
    </main>

    <style>
      .back {
        width: 100px;
        height: 100px;
        backface-visibility: hidden;
        transition: 0.6s;
        transform-style: preserve-3d;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        transform: rotateY(0deg);
        border-radius: 11px;
      }

      .back:hover {
        cursor: pointer;
      }

      .single-poke {
        border-radius: 11px;
        background: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }  
    </style>
  `;

  const anotherAnOneMoreCode = `
    <script><\/script>

    <div class="front">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
        alt="card on the playing field"
        class="single-poke"
      />
    </div>

    <style>
      .front {
        width: 100px;
        height: 100px;
        backface-visibility: hidden;
        transition: 0.6s;
        transform-style: preserve-3d;
        position: absolute;
        top: 0;
        left: 0;
        transform: rotateY(-180deg);
      }

      .single-poke {
        border-radius: 11px;
        background-color: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }  
    </style>
  `;

  const title = `componenets > Playground > Cards > CardFront.svelte`;
  const otherTitle = `componenets > Playground > Cards > CardBack.svelte`;
  const oneMoreTitle = `public > global.css`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.anAnotherDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.descriptionCode} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.moreAnotherDescription} />
  <CodeSyntax code={anotherOneMoreCode} title={otherTitle} />
  <Paragraph text={article.codeExplanation} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={oneMoreCode} title={oneMoreTitle} />
  <Paragraph text={article.otherCodeExplanation} />
  <CodeSyntax code={moreCode} title={otherTitle} />
  <Paragraph text={article.oneMoreDescription} />
  <CodeSyntax code={anotherAnOneMoreCode} {title} />
  <Paragraph text={article.endStory} />
  <Image
    image={article.anotherOneImage}
    alternativeText={article.anotherAlternativeText}
  />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
</article>
