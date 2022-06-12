<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Avatar Component`,
    description: `Since we will need more than one component in the
      <code><i>Avatar component</i></code>, let's create a folder and define
      all the components it needs in the folder. 
      <a href="https://github.com/kahilkubilay/remember-em-all/tree/master/public/images">
      You can access the images we will use in the components here. </a>`,
    otherDescription: `Let's call the <code><i>Avatars.svelte</i></code> file in
      <code><i>Userground.svelte Avatars.svelte</code></i> will act as a
      container to the <code><i>ImageAvatar.svelte</i></code> component. It will
      also send data to the <code><i>ImageAvatar.svelte</i></code> component.`,
    anotherDescription: `These two beauties will come up when I call
      <code><i>Avatars on Userground</i></code>.`,
    moreDescription: `Here we turn the <code>i>Avatars component</i></code> into
      a more functional structure.`, //💩
    oneMoreDescription: `We access every element of the <b>avatars</b> array we
      created in the <b>#each</b> loop on html. We pass the information of each
      accessed element to the <code><i>ImageAvatar component</i></code>.
      Together with these values transferred to the component, we will get the
      image of each element in the array.`, //💩
    oneAnotherMoreDescription: `We deserve a better view. We should make some
      adjustments with CSS on the avatars.`, //💩
    codeExplanation: `If you are not calling the images you will use from the
      remote server, you can keep them under the public folder. When you want to
      use it, you can use it with a path like <b>images/image-name.png<b>
      without including the public folder.`,
    image: `assets/components/User/avatars-component.png`,
    anotherImage: `assets/components/User/user-component-end.png`,
    alternativeText: `call Avatar Component`,
    anotherAlternativeText: `call User Component`,
    id: "avatar-component",
  };

  const code = `
    <script>
      // avatar list
      let sabuha = "images/sabuha.jpg";
      let pasa = "images/pasa.jpg";  
    <\/script>

    <div class="avatars">
      <img src={sabuha} alt="" />
      <img src={pasa} alt="" />
    </div>

    <style>
      img {
        width: 100px;
      }
    </style>
  `;

  const otherCode = `
    <script>
      ...
      // avatar list
      let sabuha = "images/sabuha.jpg";
      let mohito = "images/mohito.jpg";
      let pasa = "images/pasa.jpg";
      let susi = "images/susi.jpg";
      let limon = "images/limon.jpg";

      const avatars = [pasa, mohito, sabuha, limon, susi];
    <\/script>

    <div class="avatars">
      {#each avatars as userAvatar}
        <ImageAvatar {userAvatar} />
      {/each}
    </div>

    <style>
      .avatars {
        display: flex;
        justify-content: center;
      }
    </style>
  `;

  const moreCode = `
    <script>
      export let userAvatar;
    <\/script>

    <img src={avatar} class="avatar unpicked" alt="avatar" />

    <style>
      .avatar {
        width: 100px;
        border-radius: 100px;
        justify-content: space-around;
        margin: 0 25px 15px 0;
        border: 2px solid #fff;
        box-shadow: 0px 0px 3px black;
        border: 2px solid whitesmoke;
      }
  
      .avatar:hover {
        opacity: 1;
        cursor: pointer;
      }
      
      .unpicked {
        opacity: 0.8;
      }
      
      .picked {
        opacity: 1;
      }
    </style>
  `; // 💩

  const title = `User > Avatar > Avatars.svelte`;
  const otherTitle = `User > Avatar > Avatars.svelte`;
  const moreTitle = `User > Avatar > ImageAvatar.svelte`; // 💩
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <Paragraph text={article.anotherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.oneMoreDescription} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Paragraph text={article.oneAnotherMoreDescription} />
  <Image
    image={article.anotherImage}
    alternativeText={article.anotherAlternativeText}
  />
</article>
