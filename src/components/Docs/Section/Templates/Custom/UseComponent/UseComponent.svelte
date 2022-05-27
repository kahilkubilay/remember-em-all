<script>
  import Header from "../../Header.svelte";
  import Image from "../../Image.svelte";
  import Paragraph from "../../Paragraph.svelte";
  import FileTitle from "../../FileTitle.svelte";
  import CodeSyntax from "../../CodeDescription/CodeSyntax.svelte";
  import { Codes } from "../../../../Data/Shared/CodeExamples";

  const codes = Codes;

  const header = `Component kullanımı`;
  const text = `Uygulamalarımızda yer alan bileşenleri parçalayarak istediğimiz 
    gibi bir bütün haline getirebilmek üzerinde çalışırken kolaylık sağlar, 
    tekrar eden bileşen parçalarında yeniden çağırabilmek daha az efor 
    sarfettirir.`;
  const image = "assets/components/component-with-sabuha.png";
  const alternativeText = "use component with Sabuha";
  const description = `Bir önceki örnekte yaptığımız random sayı üreten basit 
    yapıyı bir component haline getirelim. 'components/Content/' dizininde 
    'RandomNumber.svelte' dosyasını oluşturalım. Bu yeni componentimizi 
    'App.svelte' dosyasında kullanalım.`;
  const title = "Components > Content > RandomNumber.svelte";
  const otherText = `'RandomNumber' componentini istediğimiz gibi çağırarak 
    kullanmaya başlayabiliriz.`;
  const otherTitle = "App.svelte";
  const anotherImage = "assets/components/random-number-component.gif";
  const anotherAlternativeText = "Random Number Component";
</script>

<main>
  <Header {header} />
  <Paragraph {text} />
  <Image {image} {alternativeText} />
  <Paragraph text={description} />
  <FileTitle {title} />
  <CodeSyntax code={codes.useOfComponents} />
  <Paragraph text={otherText} />
  <FileTitle title={otherTitle} />
  <CodeSyntax code={codes.useOfComponentsAnother} />
  <Image image={anotherImage} alternativeText={anotherAlternativeText} />
</main>

<style>
</style>
