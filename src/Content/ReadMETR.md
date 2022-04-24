Selam, son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in yapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu dökümanı oluşturdum. Döküman içerisinde adım adım 'Game' bağlantısında görebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı adımları takip ederek ortaya bir uygulama oluşturabilirsiniz. Svelte içeriği iyi ayrıntılanmış [dökümantasyona](https://svelte.dev/docs "Svelte Documentation") sahip, dökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı olabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip edebilirsiniz.

<p align="center">
  <img src="./assets/svelte-logo.png" alt="Svelte logo"/>
</p>

## Proje hakkında

Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre arayüz üzerinde kartlar bulunacak. Üzerlerine tıklandıklarında kartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar. Eşleşen kartlar açık bir şekilde arayüz üzerinde dururken bu başarılı eşleşme kullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar bulundukları yerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, 11. seviyeye kadar yeni kartlar dağıtılacak ve arayüzde bulunan kart sayısı arttılacak. 11. seviyeden sonra arayüzde bulunan kart sayısının bezdirici ve sıkıcı bir özelliği olabileceğinden dolayı kart sayısını arttırmadım.

image 1.1 ---> kartların genel görünümü

Arayüz üzerinde kart alanından farklı olarak score ve preview alanları bulunuyor.

Score'da tahmin edebileceğiniz gibi, kullanıcının yapmış olduğu toplam puan tutulacak.

image 1.2 ---> puan alanı

Preview alanında kullanıcın açmış olduğu son kartın büyük bir görünümü yer alacak.
Henüz herhangi bir kart açılmamışsa kartların arkasını temsil eden resim yer alacak.

image 1.3 ---> preview önü | image 1.4 ---> preview arkası

## Svelte nedir?

Svelte günümüz modern library ve framework habitatının komplex yapılarını azaltarak
daha basit şekilde yüksek verimliliğe sahip uygulamalar geliştirilmesini sağlamayı
amaçlayan bir araçtır. Svelte Javascript dünyasında fikir olarak benzer
framework/library önlerine geçiyor. Modern framework/library ile birlikte geride
bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme süreci ortaya
çıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin karşısına çıkması bir
süre sonrasında bir bezginlik halinin doğmasına sebep oluyor.
Svelte'in bu döngünün dışına çıkarak modern framework bağımlılıklarını
azalttı.

## Svelte nasıl çalışır?

Svelte bileşenleri `.svelte` uzantılı dosyalar ile oluşturulur. HTML'de olduğu
gibi `script, style, html` kod yapılarını oluşturabilirdiğiniz üç farklı bölüm
bulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure
Javascript kodlarına dönüştürülür.

<p align="center">
  <img src="./assets/build-map.png" alt="Svelte Build map" style="width: 800px"/>
</p>

## ? Rollup nedir

## [.] Proje bağımlılıkları

- #### Svelte
  lduğu son kartın büyük bir görünümü yer alacak.
- #### Typescript
  lduğu son kartın büyük bir görünümü yer alacak.
- #### SCSS
  lduğu son kartın büyük bir görünümü yer alacak.
- #### Lerna
  lduğu son kartın büyük bir görünümü yer alacak.

## Svelte projesi oluşturma

Npx ile yeni bir proje oluşturma:

```
npx degit sveltejs/template svelte-typescript-app
```

Yazdığımız kodun tiplemesini TypeScript ile kontrol edeceğiz.

```
cd svelte-typescript-app
node scripts/setupTypeScript.js
```

## Dizin Yapısı

## Router oluşturma

## GitHub Pages üzerinde Deploy Etme

## GitLab Pages üzerinde Deploy Etme

## Kaynak

- Svelte nedir?

  - https://svelte.dev/blog/svelte-3-rethinking-reactivity

- Svelte Documentation:

  - https://svelte.dev/examples/hello-world
  - https://svelte.dev/tutorial/basics
  - https://svelte.dev/docs
  - https://svelte.dev/blog
  - https://svelte.dev/blog/svelte-3-rethinking-reactivity

* Svelte Projesi Oluşturma

  - https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript

* ## Deploy:

  - https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next

* ## md files importing

  - https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project
