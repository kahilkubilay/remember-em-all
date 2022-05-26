<script>
  import { userInfo } from "../../store/User";

  const { name, avatar, isStart } = userInfo;

  let isAvatarEmpty = false;
  let isNameEmpty = false;

  const startGame = () => {
    if ($avatar === "") {
      isAvatarEmpty = true;
      return;
    }

    if ($name === "") {
      isNameEmpty = true;
      return;
    }

    $isStart = true;

    console.log(":::: start game ::::");
    console.log(`:: enjoy ${$name} ::`);
  };
</script>

<div class="start">
  <button on:click={startGame}>Start</button>
  <div class="avatarError visible">
    <span class="unvisible" class:visible={$avatar === "" && isAvatarEmpty}
      >please, select a avatar..</span
    >
  </div>
  <div class="nameError visible">
    <span class="unvisible" class:visible={$name === "" && isNameEmpty}
      >please, enter a name..</span
    >
  </div>
</div>

<style>
  .start button {
    width: 70%;
    cursor: pointer;
    border-radius: 10px;
    padding: 10px 0;
    font-size: 18px;
    border: 2px solid black;
    background-color: purple;
    color: white;
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
