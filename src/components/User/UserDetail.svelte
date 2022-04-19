<script lang="ts">
  import Score from "../GameElements/Score.svelte";
  import Name from "./name/UserSelectName.svelte";
  import UserSelectAvatar from "./Avatar/UserSelectAvatar.svelte";
</script>

<main>
  <UserSelectAvatar />
  <Name />
  <Score />
</main>

<style>
  main {
    margin-top: 20px;
    padding: 20px 10px;
    background-color: #f5f5f5;
    border-radius: 6px;
    display: block;
  }
</style>
