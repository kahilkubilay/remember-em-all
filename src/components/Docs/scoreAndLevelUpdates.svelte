<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Score & Level Updates`,
    description: `Let's create setups such as the user to earn points with card
      matching and to <code><i>level</i></code> up after all cards are
      successfully matched. In addition to these, you can use sound or some
      styling when the user opens cards or matches cards successfully to make
      the game more fun. You can create a caption that congratulates the user
      when all the cards are matched. In the structure we designed, we did not
      take actions such as reducing the score or limiting the number of wrong
      matches when the user matches the wrong cards. By doing these, you can
      increase your gaming experience. We can continue from where we left off
      with you..`,
    otherDescription: `We want the user to earn points on cards that they can
      match. For this, I am going to go to my <code><i>GameAction</i></code>
      folder and create a new component.`,
    anotherDescription: `Although we have not yet displayed the
      <code><i>score</i></code> value on the interface, we can view it on the
      console. We will follow a similar path in increasing the <b>level</b> as
      we did in the <b>score</b>.`,
    anAnotherDescription: ``, // 💩
    moreDescription: `Go back to the game and try to match all the cards.. Did
      you notice the error that occurred? After all the cards are matched, the
      values in the <code><i>CardFront</i></code> appear within 1-2 seconds
      before they are closed again. Let's try to prevent this.`,
    descriptionCode: `The <code><i>LevelUp</i></code> function we just created
      is very similar to the <code><i>ScoreUp</i></code> function. I defined the
      <b>level store</b> value in setTimeOut before I set it. What we will do on
      all the cards soon is to prevent the last pair of cards from closing later
      than the previously opened 4 pairs of cards during the closing process of
      the cards. Let's go back to our main <code><i>Card component</i></code>
      and use the function we created.`,
    codeExplanation: `We can use the <code><i>ScoreUp</i></code> function we
      exported wherever we want. Let's call the function inside the condition
      statement where we make the correct matching of the cards in the card
      components.`,
    otherCodeExplanation: `The <code><i>ScoreUp</i></code> component will be
      constantly updated as <b>+1</b> when the user does the correct matches.`,
    anotherMoreDescription: `Let's create a function called
      <code><i>closeAllCards</i></code> in our <code><i>CloseOpenCards
      component</i></code> and reset the store values we use in our
      <code><i>Card component</i></code>.`,
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
</article>
