<script lang="ts">
  import { userInfo } from "../../../store/User";

  const { avatar } = userInfo;

  export let userSelectAvatar: string;

  const selectAvatar = (e) => {
    const isPicked = document.querySelector(".picked");

    if (isPicked !== null) {
      isPicked.classList.add("unpicked");
      isPicked.classList.remove("picked");
    }

    e.target.classList.add("picked");
    e.target.classList.remove("unpicked");

    const avatarName = userSelectAvatar.match(/\w*(?=.\w+$)/)[0];

    $avatar = avatarName;
  };
</script>

<img
  src={userSelectAvatar}
  alt="avatar"
  class="avatar unpicked"
  on:click={selectAvatar}
/>

<style>
  .avatar {
    width: 100px;
    border-radius: 100px;
    justify-content: space-around;
    margin: 0 25px 15px 0;
    border: 2px solid #fff;
    box-shadow: 0px 0px 3px black;
    border: 2px solid whitesmoke;
  }

  .avatar:hover {
    opacity: 1;
    cursor: pointer;
  }

  .unpicked {
    opacity: 0.8;
  }

  .picked {
    opacity: 1;
  }
</style>
