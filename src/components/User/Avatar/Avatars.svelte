<script lang="ts">
  // avatar list
  let sabuha = "./images/sabuha.JPG";
  let mohito = "./images/mohito.JPG";
  let pasa = "./images/pasa.JPG";
  let susi = "./images/susi.JPG";
  let limon = "./images/limon.JPG";

  import ImageAvatar from "./ImageAvatar.svelte";
  const avatars = [pasa, mohito, sabuha, limon, susi];
</script>

<div class="avatars">
  {#each avatars as userSelectAvatar}
    <ImageAvatar {userSelectAvatar} />
  {/each}
</div>

<style>
  .avatars {
    display: flex;
    justify-content: center;
  }
</style>
