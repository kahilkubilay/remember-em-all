<script lang="ts">
  import UserName from "./name/UserName.svelte";
  import Header from "./Header.svelte";
  import Avatars from "./Avatar/Avatars.svelte";
  import Start from "./Start.svelte";
</script>

<main>
  <Header />
  <Avatars />
  <UserName />
  <Start />
</main>

<style>
  main {
    background-color: #f5f5f5;
    border-radius: 5px;
    padding-bottom: 15px;
    width: 1000px;
  }

  @media screen and (max-width: 800px) {
    main {
      width: 100%;
    }
  }
</style>
