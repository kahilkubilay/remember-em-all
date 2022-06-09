<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";
  import List from "./Section/Templates/List.svelte";

  const article = {
    head: `Elindeki Kartları Göster ♠️`,
    description: `Arayüz üzerindeki bu güncellemelerimizin ardından, oyun 
      alanımıza kartları sereserpebiliriz. Bu bölümde kartları oyun alanına 
      ekleyeceğiz.`,
    otherDescription: `Oyun arayüzünde birtakım işlemleri gerçekleştirebilmek 
      için bazı fonksiyonlar tanımlayacağız. SRC klasörümün altında 
      <code><i>GameAction</i></code> isminde yeni bir klasör oluşturuyorum.
      Bu klasör altında tanımlayacağımız fonksiyonlar aşağıdaki işlemleri 
      gerçekleştirecek:`,
    anotherDescription: `Adım adım ilerleyelim.. Seviyeye bağımlı 
      olarak Arayüz üzerinde yer alacak sayı aralığını oluşturalım.`,
    anAnotherDescription: `Parametre olarak verdiğimiz sayı değerleri 1, 5 ve 4
      değerleri konsol üzerinde görüntülenen array değerlerini oluşturmamızı 
      sağlıyor. Belirli aralıkları kapsayan bir sayımız bulunuyorsa, array 
      içerisinde yer alan sayıları random olarak karıştırmamızın önüne 
      geçebilecek bir durum bulunmuyor.`, // 💩
    moreDescription: `Kartları oyun arayüzü üzerinde listeleyebilmemiz için 
      gerekli fonksiyonlarımızı oluşturduk. Bunları kullanarak 
      <code><i>Playground</i></code> alanını coşturalım.`,
    descriptionCode: `<code><i>Playground bileşeninde 
      mixedListOfPokemon</i></code> isminde store değeri oluşturduk. Bu değer
      random sayıları, id değerlerimiz ile birlikte tutuyor. Bir döngü 
      içerisinde bu değerleri props olarak <code><i>Card</i></code> ismindeki
      bileşene aktaralım. Aktarılan değerleri CardFront ve CardBack isimli 
      bileşenlerimizde kullancağız.`,
    codeExplanation: `<code><i>ListCards.svelte</i></code> dosyasında yer alan
      list fonksiyonuna ihtiyacım olduğu için modülü dışarı aktardım.
      Fonksiyonun basit bir görevi bulunuyor. Parametre olarak verilen değerle
      birlikte 5 sayı büyüklüğünde bir aralığı array tipinde döndürmelidir.
      <code><i>range</i></code> değerimiz erişmek istediğimiz toplam aralık
      uzunluğunu ifade ediyor. <code><i>maxNumberReachedOnRange</i></code> 
      değeri erişilecek olan maximum sayı değerini verirken, 
      <code><i>minNumberReachedOnRange</i></code> değeri maximum değeri 
      kullanarak minumum sayıyı elde etmemize imkan sağlıyor. 
      <code><i>Playground bileşenimizde</i></code> çağırarak nasıl bir sonuç
      verdiğini kontol edelim.`,
    otherCodeExplanation: `<code><i>MixCards bileşeninde</i></code> 
      oluşturacağımız fonksiyonu kullanarak, list fonksiyonundan elde ettiğimiz
      array içerisinde yer alan değerleri kopyalayacağız. Sayı aralığımız 5 
      olduğunda, yeni oluşacak olan array değerimizde toplamda 10 değer yer 
      alacak. Bu değerler belirli bir sırayı takip etmek yerine array içerisinde
      random yer alacaklar. İlerde kartları eşleştirebilme işlemi için, her
      kartın sıra numarasına göre id değeri atayalım.`,
    endStory: `Kartlarımızı arayüz üzerine başarılı bir şekilde sıraladık. 
      Bir önceki bölümde yaptığımız gibi, .flipper class değerinin bulunduğu 
      elemente .hover eklediğimizde kartın CardFront componentini 
      gözlemleyebiliriz.`,
    image: `assets/components/GameAction/function-of-list-cards.png`,
    anotherImage: `assets/components/GameAction/shuffle-cards.png`,
    moreImage: `assets/components/GameAction/card-components.png`,
    alternativeText: `Display of ListCards module on console`,
    anotherAlternativeText: `Display of MixCards module on console`,
    moreAlternativeText: `Observing CardFront and CardBack components`,
    terms: [
      {
        command: `LevelUpdate`,
        description: `Arayüz üzerinde bütün kartlar doğru eşleştirildiğinde, 
          bir sonraki seviye geçilmesi sağlanacak.`,
      },
      {
        command: `ListCards`,
        description: `Arayüz üzerindeki kartlar seviyeye göre getirilecek. 
          1. seviyede 0-5 aralığında kartlar getirilirken, 2. seviyede 5-10 ve 
          3. seviyede 10-15 sayılarına ait kartlar arayüze yansıtılacak. Aralık 
          değerlerini buradaki fonksiyon ile kurgulayacağız.`,
      },
      {
        command: `MixCards`,
        description: `Arayüz üzerine gelen kartlar bir sıra halinde değil, 
          random dağıtılmalıdır. MixCards fonksiyonu ile bunu 
          gerçekleştireceğiz.`,
      },
      {
        command: `CloseOpenCards`,
        description: `Eşleşmeyen 2 kart açıldığında veya bütün kartlar doğru 
          eşleştiğinde bir sonraki erişilecek seviye için kartlar arayüzde 
          kapalı olmalıdır. Her iki durumda geçerli fonksiyonları 
          tanımlayacağız.`,
      },
    ],
    id: "show-cards-in-your-hand",
  };

  const code = `
    <script context="module">
      export const list = (level) => {
        const list = [];
        const range = 5;
        const maxNumberReachedOnRange = level * 5;
        let minNumberReachedOnRange = maxNumberReachedOnRange - 4;

        for(minNumberReachedOnRange; 
          minNumberReachedOnRange <= maxNumberReachedOnRange; 
          minNumberReachedOnRange++) {
          list.push(levelCounter);
        }

        return list;
      }
    <\/script>
  `;

  const otherCode = `
    <script context="module">
      export const shuffle = (pokemonList) => {
        let shakeList = [];
        const duplicateList = pokemonList.concat(pokemonList);
        const totalNumberRange = duplicateList.length - 1;

        for(let counter = 0; counter <= totalNumberRange; counter++) {
          let pokemonNo = counter;
          const randomNumb = Math.trunc(Math.random() * duplicateList.length);

          shakeList = [
            { no: pokemonNo, id: duplicateList[randomNumber] },
            ...shakeList
          ];

          duplicateList.splice(duplicateList.indexOf(duplicateList[randomNumb]), 1);
        }

        return shakeList;
      }
    <\/script>
  `;

  const oneMoreCode = `
      <script>
        import UserGround from "../../User/UserGround.svelte";
        import { userInfo } from "../../../Store/User";
        import Card from "./Cards/Card.svelte";
        import { list } from "../../GameAction/ListCards.svelte";
        import { shuffle } from "../../GameAction/MixCards.svelte";
        import { level } from "../../../Store/Level";

        const { isStart } = userInfo;
        $: pokemonList = list($level);
        $: mixedListOfPokemon = shuffle(pokemonList);
      <\/script>

      <main class="playground">
        {#if !$isStart}
          {#each mixedListOfPokemon as pokemon}
            <Card {pokemon} />
          {/each}
        {:else}
          <UserGround />
        {/if}
      </main>

      <style>
        .playground {
          width: 900px;
          margin: 0 auto;
          text-align: center;
        }
      </style>
  `;

  const anotherOneMoreCode = `
    <script>
      export let pokemon;

      $: pokemonId = pokemon.id;
    <\/script>

    <div class="front">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonId}.png"
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
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";

      export let pokemon;  
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <BackCardFace {pokemon} />
        <FrontCardFace {pokemon} />
      </div>
    </main>

    <style>
      .flip-container {
        perspective: 1000px;
        transform-style: preserve-3d;
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

  const title = `componenets > GameAction > ListCards.svelte`;
  const otherTitle = `componenets > GameAction > MixCards.svelte`;
  const oneMoreTitle = `components > Playground > Cards > Wrapper > 
    Playground.svelte`;
  const moreTitle = `components > Playground > Wrapper > Cards > Card.svelte`;
  const anotherTitle = `components > Playground > Wrapper > Cards > 
    CardBack.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <List material={article.terms} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.anAnotherDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.otherCodeExplanation} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={oneMoreCode} title={oneMoreTitle} />
  <Paragraph text={article.descriptionCode} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <CodeSyntax code={anotherAnOneMoreCode} title={anotherTitle} />
  <CodeSyntax code={anotherOneMoreCode} title={anotherTitle} />
  <Paragraph text={article.endStory} />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
</article>
