<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `About the game`,
    description: `In our project we will develop a memory game. There will be
      different cards on the interface according to the level of the user. When
      the card click event occurs, the cards will be opened and the user will
      try to match the opened cards. While the matching cards are open on the
      interface, the user will gain points as a result of a successful match,
      cards will be closed again in their place with each unsuccessful match.`,
    otherDescription: `At the start of the game, the user will be expected to
      enter a username and choose one of the images in the avatar list (No 
      matter how tame the avatars look, the power is hidden in them 🐱‍👤). These
      selected values will be displayed together with the <code><i>score &
      level</i></code> values under the section where the cards are located in
      the game interface. While the username and selected avatar will be kept as
      stable values, the <code><i>score & level</i></code>values will be
      dynamically updated according to the correct choices made by the user.`,
    image: `assets/documentation/playground.png`,
    alternativeText: `view of cards on the playground`,
    otherImage: `assets/userground.png`,
    otherImageAlternativeText: `view user component on the playground`,
    id: "about-the-game",
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
