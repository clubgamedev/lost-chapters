<template>
<div class="cards-container">
    <p>Yes: {{yes}} No: {{no}}</p>
      <Card v-for="(card, i) in cards" :card="card" :index="i" :key="card.name" @choice="onChoice" />
</div>
</template>

<script>
import Card from "@/components/Card.vue";

import { initCards } from "@/game/reigns";

export default {
  name: "Reigns",
  components: { Card },
  data() {
    return {
      cards: initCards(),
      yes: 0,
      no: 0
    };
  },

  methods: {
    onChoice(choice) {
      this.cards.shift();
      choice ? this.yes++ : this.no++;
    }
  }
};
</script>

<style lang="postcss" scoped>
.cards-container {
  position: relative;
  width: 100%;
}
</style>
