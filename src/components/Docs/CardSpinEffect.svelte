<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Cards Spin Effect`,
    description: ``,
    otherDescription: ``,
    anotherDescription: ``,
    anAnotherDescription: ``, // 💩
    moreDescription: ``,
    descriptionCode: ``,
    codeExplanation: ``,
    otherCodeExplanation: ``,
    endStory: ``,
    image: `assets/components/GameAction/function-of-list-cards.png`,
    alternativeText: ``,
    id: "cards-spin-effects",
  };

  const code = ``;

  const otherCode = ``;

  const oneMoreCode = ``;

  const anotherOneMoreCode = ``;

  const moreCode = ``;

  const anotherAnOneMoreCode = ``;

  const title = `componenets > GameAction > ListCards.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.anAnotherDescription} />
  <Paragraph text={article.otherCodeExplanation} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
  <Paragraph text={article.moreDescription} />
  <Paragraph text={article.descriptionCode} />
  <Paragraph text={article.endStory} />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
</article>
