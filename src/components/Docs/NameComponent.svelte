<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `Name Component`,
    description: `Pokemon eğitmenimizin bir isim girebilmesi için gerekli olan 
      componenti oluşturalım.`,
    otherDescription: `+ /components/User/Avatar/Name, /components/User/Avatar/Name/UserName.svelte`,
    anotherDescription: `Diğer componentlerde yaptığımız gibi, _UserName_ 
      componentinin _Userground_ componentinde kullanalım.`,
    moreDescription: `Geriye son bir componentimiz kaldı. "Start" yazısına sahip
      bir buton componentini oluşturarak, _User_ klasöründe _Start.svelte_ 
      ismiyle kaydedelim. Ve son olarak _UserGround_ componentinde çağıralım.`, //💩
    oneMoreDescription: `Ta daaaa... Şuana kadar yaptığımız componentler dinamik
      işlemler gerçekleştirmedi. Arayüzü oluşturmak için yeteri kadar malzememiz
      ortaya çıktı, ve bunları istediğin gibi stillendirebilirsin. Svelte 
      dosyana ait her stillendirme, svelte dosyasının kapsamı kadardır. 
      Child-Parent componentler bu stil özelliklerine sahip olmazlar. Bundan 
      sonraki aşamalarda bu componentlara dinamik özellikler kazandıracağız.`, //💩
    image: `assets/components/User/end-interface.png`,
    alternativeText: `call Avatar Component`,
    id: "name-component",
  };

  const code = `
    <script><\/script>

    <div class="user">
      <input type="text" class="name" name="name" placeholder="pika pika" />
    </div>

    <style>
      .name {
        width: 40%;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        padding: 8px 0;
      }
    </style>
  `;

  const title = `User > Avatar > Name > UserName.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.moreDescription} />
  <Paragraph text={article.oneMoreDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
