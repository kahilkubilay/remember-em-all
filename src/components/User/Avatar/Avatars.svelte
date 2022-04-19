<script lang="ts">
  // avatar list
  let sabuha = "images/sabuha.jpg";
  let mohito = "images/mohito.jpg";
  let pasa = "images/pasa.jpg";
  let susi = "images/susi.jpg";
  let limon = "images/limon.jpg";

  import ImageAvatar from "./ImageAvatar.svelte";
  const avatars = [pasa, mohito, sabuha, limon, susi];
</script>

<div class="avatars">
  {#each avatars as userSelectAvatar}
    <ImageAvatar {userSelectAvatar} />
  {/each}

  <img src={sabuha} alt="bla bla" class="only"/>
</div>

<style>
  .avatars {
    display: flex;
    justify-content: center;
  }

  .only {
    width: 100px;
    height: 100px;
  }
</style>
