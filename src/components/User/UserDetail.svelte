<script>
  import Score from "../GameElements/Score.svelte";
  import Level from "../GameElements/Level.svelte";
  import Name from "./name/UserSelectName.svelte";
  import UserSelectAvatar from "./Avatar/UserSelectAvatar.svelte";
</script>

<main>
  <UserSelectAvatar />
  <Name />
  <Score />
  <Level />
</main>

<style>
  main {
    width: 300px;
    margin-top: 20px;
    margin: 20px auto;
    padding: 20px 10px;
    background-color: #f5f5f5;
    border-radius: 6px;
    display: block;
  }
</style>
