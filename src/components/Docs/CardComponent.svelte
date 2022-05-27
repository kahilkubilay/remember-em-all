<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Card Component`,
    description: `Oyun alanında kullanacağımız kartlar için componentlere 
      ihtiyacımız olacak. 'CardFront' componentinde kartın pokemon resmini 
      tutarken, 'CardBack' componentinde '?' resmini tutacağız. Componentleri 
      'Card' componentinde çağıracağız.`,
    otherDescription: `'Card' componentini test ederken, sürekli olarak 'User' 
      componenti üzerinde isim ve avatar seçimi yapmamak için 'Playground' 
      componentinde yer alan _isStart_ şartını true ifadesine çevirelim.`,
    anotherDescription: `'CardFront' componentinde 'img src' özelliği olarak bir
      API adresi verilmiş. Bu API'da dosya isimlerinde yer alan numaraları
      güncelleyerek, farklı pokemon resimlerine erişilebilir.`,
    anAnotherDescription: `'CardFront' componentini öncelikle 'Card' 
      componentinde, 'Card' componentini de 'Playground' içerisinde true dönen
      blokta çağıralım. Aynı işlemi 'CardBack' componentinde tekrarlayarak Card
      componentleri üzerinde yaptığımız her güncellemeyi inceleyebileceğiz.`, // 💩
    moreAnotherDescription: `'Card' componentleri birer block-element olduğu 
      için alt alta durmaktadır. Componentleri bir kapsayıcı içerisine alarak,
      inline-block seviyesine alalım. Aynı Component içerisinde çağırdığımızdan
      dolayı, 'position: absolute' stilini verdiğimizde 'Card' Componentinde yer
      alan 'child componentler' üst üste duracaktır.`, // 💩
    moreDescription: `CSS kullanarak Card'ın arka yüzülen her tıklama ile 
      birlikte 'transform' özelliğini kullanarak 'CardBack' Componentinin 
      altında yer alan 'CardFront' içerisinde yer alan kartın görüntülenmesini
      sağlayacağız. 'Global.css' dosyamıza aşağıdaki özellikleri ekleyelim.`,
    descriptionCode: `'img' kapsayıcısı olan 'back ve front' classlarına sahip 
      kapsayıcılara belirli özellikler katarak basit şekilde bir kart görünümü
      vermeye çaba sarfettik. 'CardBack' componentinde 'Card' componentinde 
      çağırarak arayüz üzerinde nasıl göründüğünü inceleyelim.`,
    oneMoreDescription: `'Card' componentlerinin bir bütün gibi birlikte aynı 
      hızda, ve aynı perspektif üzerinden dönüş sağlaması gerekiyor. Svelte'de
      her component içerisinde tanımlanan _style_ özellikleri, Component'e ait 
      scope kadardır, diğer componentler bu stillendirmelerden etkilenmezler. 
      Bundan dolayı her iki class için aynı tanımlamaları gerçekleştirelim.`,
    codeExplanation: `'CardBack' Componentinin kapsayıcı class'ına _.back_, 
      'position: absolute' değerini verdiğimizde her iki kart üst üste 
      görüntülenecektir.`,
    otherCodeExplanation: `'Card' componentlerinde 'transform' stillendirmesi 
      sağlayarak, 'hover' class eklendiğinde dönme efekti vermesini 
      sağlayalım.`,
    oneLineDescription: `+ /Components/Playground/Cards/Card.svelte, 
      CardBack.svelte, CardFront.svelte.`,
    endStory: `Birazdan geçeceğimiz bölüm içerisinde, kartları EventDispatcher
      kullanarak kartın açılma efektini yapacağız. Eventi kullanmadan önce CSS
      üzerinde nasıl güncellemeler yapmamız gerektiğini göstermek istedim. 
      Konsol üzerinde 'CardBack' componentine ait 'flipper' bulunan element 
      'hover' class eklediğinde efekt gerçekleştiğini inceleyebilirsin.`,
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
  <Paragraph text={article.oneLineDescription} />
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
