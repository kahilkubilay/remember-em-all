<script lang="ts">
  import { userInfo } from "../../../store/User";
  import { score } from "../../../store/Score";

  const { avatar } = userInfo;
  const setAvatar = `images/${$avatar}.jpg`;

  $: degreeOfScore = (userScore: number) => {
    const dashOffsetDegree = 314; //  (2PI * stroke-dash array)
    const totalCardsOnPlayground = 5;
    const pieceOfDegree = dashOffsetDegree / totalCardsOnPlayground;
    const isAllCardsOpen = userScore % totalCardsOnPlayground === 0;

    let degree = isAllCardsOpen
      ? dashOffsetDegree
      : dashOffsetDegree - pieceOfDegree * (userScore % 5);

    return degree;
  };

  $: scoreDegree = degreeOfScore($score);
</script>

<svg width="150" height="120" stroke-dashoffset={scoreDegree}>
  <defs>
    <pattern id="image" patternUnits="userSpaceOnUse" height="150" width="150">
      <image x="0" y="0" height="150" width="150" xlink:href={setAvatar} />
    </pattern>
  </defs>
  <circle
    id="top"
    cx="75"
    cy="60"
    r="50"
    fill="url(#image)"
    stroke="#6a0dad"
    stroke-width="8"
  />
</svg>

<style>
  svg {
    stroke-dasharray: 314; /* (2PI * stroke-dash array) */
  }
</style>
