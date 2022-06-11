<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `User Component`,
    description: `<code><i>User</i></code> klasörü altında Kullanıcıdan 
      alacağımız her değer için <code><i>Avatar</code></i> ve <code><i>Name</i>
      </code> klasörlerini oluşturalım. Root klasörde <code><i>User</i></code>
      Component altında tanımlanan bütün yapıların yer alacağı bir kapsayıcı 
      dahil edeceğiz. <code><i>UserGround.svelte</i></code> isminde bir dosya 
      oluşturuyorum, parçaladığımız bütün componentler burada yer alacak.`,
    otherDescription: `<code><i>Playground</i></code> klasörü içerisinde buna
      benzer bir yapıyı oluşturarak, oyun içerisindeki bütün componentleri aynı
      dosya üzerinde çağıracağız. <code><i>Playground</i></code> altında 
      <code><i>Wrapper > Playground.svelte</i></code> dizin ve dosyasını
      oluşturalım.`,
    anotherDescription: `User Componenti üzerinde çalışırken, yapacağımız 
      değişiklikleri inceleyebilmek için User Component'ini 
      <code><i>Playground > Wrapper > Playground.svelte</i></code> dosyasında
      çağıralım.`,
    anAnotherDescription: `<code><i>User Component</i></code> çağırdıktan sonra
      üzerinde geliştirme yapmaya başlayalım.`, // 💩
    moreAnotherDescription: `Component üzerinde 4 farklı bölüm yer alıyor.`, // 💩
    codeExplanation: `Bileşenimizde basit bir header etiketi tanımladık. Header
      içerisinde componentDetail değerini çağırıyoruz.`,
    moreCodeExplanation: `Bileşenimizde yapacağımız geliştirmeleri tarayıcıda 
      inceleyebilmek için Playground bileşenine import ederek kullanalım.`,
    material: [
      `Kullanıcıyı bilgilendiren bir header yazısı`,
      `Kullanıcının görseller üzerinden avatar seçimi yapabildiği bir bölüm`,
      `Kullanıcı adının girilebilmesi için alan`,
      `Ve bütün bunlar tamamlandığında oyuna start veren bir button elementi 
        bulunuyor.`,
    ],
    image: `assets/components/User/call-user-component.png`,
    anotherImage: `assets/components/User/components-section.png`,
    alternativeText: `Call User Component`,
    anotherAlternativeText: `displaying components on the dom`,
    id: "user-component",
  };

  const code = `
    <script>
      const componentDetail = "User";
    <\/script>

    <main>
      <h2>{componentDetail} Component</h2>
    </main>

    <style>
      h2 {
        color: white;
        background-color: orangered;
        text-align: center;
      }  
    </style>
  `;

  const otherCode = `
    <script>
      import Userground from "../../User/Userground.svelte";
    <\/script>

    <main>
      <UserGround />
    </main>

    <style>
      h2 {
        color: white;
        background-color: orangered;
        text-align: center;
      }
    </style>
  `;

  const title = `User > UserGround.svelte`;
  const otherTitle = `Playground > Wrapper > Playground.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.moreCodeExplanation} />
  <Paragraph text={article.anAnotherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.moreAnotherDescription} />
  <Matter matter={article.material} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
</article>
