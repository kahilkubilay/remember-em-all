<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Score & Level Updates`,
    description: `Son bölümümüzde kullanıcının kart eşleştirmesi ile birlikte 
      puan kazanmasını ve bütün kartları başarılı eşleştirildikten sonra level 
      atlaması gibi kurgular oluşturalım. Bunlara ek olarak oyunu daha eğlenceli
      bir hale getirebilmek için kullanıcı kart açtığında veya kartları başarılı
      eşleştirdiğinde ses veya bazı stillendirmeler kullanabilirsiniz. Bütün 
      kartlar eşleştirildiklerinde kullanıcıyı tebrik eden bir içerik yazısı 
      oluşturabilirsiniz. Kurguladığımız yapıda kullanıcı yanlış kartları 
      eşleştirdiğinde, aldığı puanı azaltmak veya açabileceği kart sayısını 
      sınırlandırmak gibi aksiyonlar almadık. Bunları yaparak oyun deneyimini 
      arttırabilirsin. Biz seninle birlikte kaldığımız kısımdan devam edelim..`,
    otherDescription: `Kullanıcının eşleştirebildiği kartlarda puan kazanmasını 
      istiyoruz. Bunun için hemen GameAction klasörüme gidip yeni bir component 
      oluşturuyorum.`,
    anotherDescription: `<code><i>score</i></code> değerini henüz arayüz 
      üzerinde görüntülememize rağmen, konsol üzerinde inceleyebiliriz. 
      <code><i>Score</i></code>'da olduğu gibi level'i arttırmada da benzer bir
      yolu takip edeceğiz.`,
    anAnotherDescription: ``, // 💩
    moreDescription: `Oyuna dönüş bütün kartları eşleştirmeye çalış.. Oluşan 
      hataya farkettin mi? Bütün kartlar eşleştirildikten sonra yeniden 
      kapatılmadan önceki 1-2 saniye içerisinde CardFront içerisindeki değerler
      gözüküyor. Bunu engellemeye çalışalım..`,
    descriptionCode: `Yeni oluşturduğumuz <code><i>LevelUp</i></code> 
      fonksiyonu <code><i>ScoreUp</i></code> fonksiyonuna oldukça benziyoruz. 
      <code><i>level</i></code> store değerini set etmeden önce 
      <code><i>setTimeOut</i></code> içerisinde tanımladım. Bunun birazdan bütün
      kartlar üzerinde yapacağımız kartların kapanma işlemi sırasında en son 
      eşleştirilen kart çiftinin, önceden açılan 4 kart çiftinden daha  geç 
      kapanmasını engellemektir. Tekrardan main Card bileşenimize dönerek 
      oluşturduğumuz fonksiyonu kullanalım.`,
    codeExplanation: `Export ettiğimiz <code><i>ScoreUp</i></code> fonksiyonunu 
      istediğimiz yerde kullanabiliriz. Card bileşenlerinde kartların doğru 
      eşleştirme yaptığımız şart ifadesinin içerisinde fonksiyonu çağıralım.`,
    otherCodeExplanation: `ScoreUp bileşeni kullanıcı doğru eşleştirmeleri 
      gerçekleştirdiğinde +1 şeklinde sürekli güncellenecektir.`,
    anotherMoreDescription: `CloseOpenCards bileşenimizde closeAllCards isminde 
      bir fonksiyon oluşturarak Card bileşenimizde kullandığımız store 
      değerlerini sıfırlayalım.`,
    endStory: ``,
    image: `assets/components/Card/ScoreUp-Component.gif`,
    anotherImage: `assets/components/Card/bug.png`,
    moreImage: `<code><i>levelUp</i></code> fonksiyonumuzu closeAllCards 
      içerisinde çağırdığımızda bu hatanın önüne geçebiliriz.`,
    alternativeText: `ScoreUp component`,
    moreAlternativeText: `Bug when closing cards`,
    id: "score-and-level-updates",
  };

  const code = `
    <script context="module">
      import { score } from "../../Store/Score";

      export let scoreUp = () => {
        let getScore;

        score.subscribe((callScore) => {
          getScore = callScore;
        })

        let up = getScore + 1;

        score.set(up);
      }
    <\/script>
  `;

  const otherCode = `
    <script>
      ...
      import { scoreUp } from "../../../GameAction/ScoreUpdate.svelte";
      import { score } from "../../../../Store/Score"; 
      /*
        * score değerinin nasıl güncellendiğini incelemek için Card bileşene
        * import edelim.
      */
      ...

      ...
      if ($openCardsCapsule.length >= 2) {
        const firstOpenCard = $openCardsCapsule[0];
        const secondOpenCard = $openCardsCapsule[1];

        if (firstOpenCard === secondOpenCard) {
          $catchEmAll = [firstOpenCard, ...$catchEmAll];

          scoreUp();

          console.log("score=>", $score);
        }
      }
      ...
    <\/script>
  `;

  const oneMoreCode = `
    <script>
      import { level } from "../../Store/Level";

      export const levelUp = () => {
        let getLevel;

        level.subscribe((callLevel) => {
          getLevel = callLevel;
        })
        
        let up = getLevel + 1;

        setTimeout(level.set(up))
      }
    <\/script>
  `;

  const moreCode = `
    <script>
      ...
        import { levelUp } from "../../../GameAction/levelUpdate.svelte"
      ...

      ...
      if ($openCardsCapsule.length >= 2) {
        const firstOpenCard = $openCardsCapsule[0];
        const secondOpenCard = $openCardsCapsule[1];

        if (firstOpenCard === secondOpenCard) {
          $catchEmAll = [firstOpenCard, ...$catchEmAll];

          scoreUp();

          console.log("score=>", $score);

          if ($catchEmAll.length === 5) {
            levelUp();
          }
        }
      }
      ...
    <\/script>
  `;

  const anotherAnOneMoreCode = `
      <script>
        import {
          openCardsCapsule,
          cardFlipperCapsule,
          catchEmAll,
        } from "../../store/OpenedCards";

        export const mismatchedCards = (flipTime) => {
          setTimeout(() => {
            cardFlipperCapsule.set([]);
            openCardsCapsule.set([]);
          }, flipTime);
        };

        export const closeAllCards = (flipTime, callback) => {
          setTimeout(() => {
            catchEmAll.set([]);
            cardFlipperCapsule.set([]);
            openCardsCapsule.set([]);

            callback();
          }, flipTime);
        };
      <\/script>
  `;

  const title = `components > GameAction > ScoreUpdate.svelte`;
  const otherTitle = `components > Playground > Cards > Card.svelte`;
  const oneMoreTitle = `components > GameAction > LevelUpdate.svelte`;
  const moreTitle = `components > GameAction > CloseOpenCards.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.otherCodeExplanation} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.anAnotherDescription} />
  <CodeSyntax code={oneMoreCode} title={oneMoreTitle} />
  <Paragraph text={article.descriptionCode} />
  <CodeSyntax code={moreCode} title={otherTitle} />
  <Paragraph text={article.moreDescription} />
  <Image
    image={article.anotherImage}
    alternativeText={article.moreAlternativeText}
  />
  <Paragraph text={article.anotherMoreDescription} />
  <CodeSyntax code={anotherAnOneMoreCode} title={moreTitle} />
  <Paragraph text={article.endStory} />
</article>
