<script lang="ts">
  import { userInfo } from "../../store/User";
  const { name, avatar, isStart } = userInfo;

  const startGame = () => {
    if ($avatar === "") {
      document.querySelector(".avatarError span").classList.remove("unvisible");
      return;
    }

    if ($name === "") {
      document.querySelector(".nameError span").classList.remove("unvisible");
      return;
    }

    $isStart = true;

    console.log("::: start game :::");
    console.log("enjoy");
  };
</script>

<div class="start">
  <button on:click={startGame}>Start</button>
  <div class="avatarError visible">
    <span class="unvisible">please, select a avatar..</span>
  </div>
  <div class="nameError visible">
    <span class="unvisible">enter a name..</span>
  </div>
</div>

<style>
  .start button {
    width: 70%;
    background-color: white;
    color: black;
    cursor: pointer;
    border-radius: 10px;
    padding: 10px 0;
    font-size: 24px;
    font-weight: bold;
  }

  .nameError,
  .avatarError {
    color: red;
    font-size: 18px;
  }

  .unvisible {
    display: none;
  }

  .visible {
    display: block;
  }

  .start button:active {
    border: 2px solid white;
  }
</style>
