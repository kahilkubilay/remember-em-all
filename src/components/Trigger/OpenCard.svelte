<script lang="ts">
  import { userInfo } from "../../store/User";
  import { openCardsCapsule, catchEmAll } from "../../store/OpenedCards";
  import { score } from "../../store/Score";
  // range ===== 5

  const { level } = userInfo;

  const removeAllHovers = (time: number, callback: Function) => {
    document.querySelectorAll(".hover").forEach((domData) => {
      domData.classList.remove("hover");
    });
  };

  const levelUp = () => {
    $level++;
  };

  export const openCard = (event: any) => {
    const element = event.currentTarget;
    const childElement = event.target;
    const key = childElement.getAttribute("alt");

    if (key !== null) {
      element.classList.add("hover");

      $openCardsCapsule.push(parseInt(key));

      if ($openCardsCapsule.length === 2) {
        const firstSelect = $openCardsCapsule[0];
        const secondSelect = $openCardsCapsule[1];

        if (firstSelect === secondSelect) {
          $catchEmAll.push(firstSelect);
          $score++;

          if ($catchEmAll.length === $level * 5) {
            setTimeout(removeAllHovers, 500);
            setTimeout(levelUp, 750);
          }
        } else {
          setTimeout(() => {
            document
              .querySelector(
                `.flip-container.hover [pokemonDetail="${firstSelect}"]`
              )
              .closest(".flip-container")
              .classList.remove("hover");

            document
              .querySelector(
                `.flip-container.hover [pokemonDetail="${secondSelect}"]`
              )
              .closest(".flip-container")
              .classList.remove("hover");
          }, 750);
        }

        $openCardsCapsule = [];
      }
    }
  };
</script>
