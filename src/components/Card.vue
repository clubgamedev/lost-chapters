<template>
<div class="card">
    <div class="card-image">
        <span class="card-image-yes" ref="textYes">Yes</span>
        <span class="card-image-no" ref="textNo">No</span>
        <img :src="card.image">
    </div>
    <div class="card-info clearfix">{{ card.description || ""}}</div>
</div>
</template>

<script>
import Hammer from "hammerjs";

export default {
  name: "Card",

  props: {
    card: Object,
    index: Number
  },

  data() {
    return {
      active: false, // the active variable is used to render each frame of the animation
      transform: null,
      offsetTop: 0
    };
  },

  methods: {
    // all animation takes place between when active changes state from true
    // in requestElementUpdate to false in updateElementTransform
    requestElementUpdate() {
      if (!this.active) {
        requestAnimationFrame(this.updateElementTransform);
        this.active = true;
      }
    },

    resetElement() {
      this.$el.className = "card animate";
      this.$refs.textYes.style.opacity = 0;
      this.$refs.textNo.style.opacity = 0;
      this.transform = {
        translate: {
          x: 0,
          y: this.offsetTop
        },
        angle: 0
      };
      this.requestElementUpdate();
    },

    updateElementTransform() {
      const {
        angle,
        translate: { x, y }
      } = this.transform;
      const style = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;

      this.$el.style.webkitTransform = style;
      this.$el.style.mozTransform = style;
      this.$el.style.transform = style;
      this.active = false;
    },

    onHammerInput(ev) {
      if (ev.isFinal) {
        if (this.$refs.textYes.style.opacity == 1) {
          //offscreen
          this.$el.className = "card animate";
          this.transform.translate = {
            x: ev.deltaX * 3,
            y: ev.deltaY * 3
          };
          this.requestElementUpdate();
          setTimeout(() => {
            this.$emit("choice", true);
          }, 500);
        } else if (this.$refs.textNo.style.opacity == 1) {
          //offscreen
          this.$el.className = "card animate";
          this.transform.translate = {
            x: ev.deltaX * 3,
            y: ev.deltaY * 3
          };
          this.requestElementUpdate();
          setTimeout(() => {
            this.$emit("choice", false);
          }, 500);
        } else {
          this.resetElement();
        }
      }
    },

    onPanMove(ev) {
      const MAX_ANGLE = 25;

      this.$el.className = "card";
      this.transform.translate = {
        x: ev.deltaX,
        y: ev.deltaY
      };

      // change opacity of the YES / NO text and angle of card
      let multiplier = Math.min(
        Math.max(Math.abs(ev.deltaX) / (this.$el.offsetWidth / 1.5), 0),
        1
      );
      if (ev.deltaX > 0) {
        this.transform.angle = MAX_ANGLE * multiplier;
        this.$refs.textYes.style.opacity = multiplier;
        this.$refs.textNo.style.opacity = 0;
      } else if (ev.deltaX <= 0) {
        this.transform.angle = -MAX_ANGLE * multiplier;
        this.$refs.textYes.style.opacity = 0;
        this.$refs.textNo.style.opacity = multiplier;
      }

      this.requestElementUpdate();
    }
  },

  mounted() {
    // set the stack order and the cascade effect
    this.$el.style.zIndex = 99 - this.index;
    this.offsetTop = Math.min(Math.max(this.index * 5, 0), 15);

    let mc = new Hammer.Manager(this.$el);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

    this.resetElement();

    mc.on("hammer.input", this.onHammerInput);

    mc.on("panstart panmove", this.onPanMove);
  }
};
</script>

<style lang="postcss" scoped>
img {
  pointer-events: none;
  width: 100%;
  height: auto;
}

.text-active {
  color: #d94b3f;
}
.text-inactive {
  color: #d3d3d3;
}

.card {
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  margin: 0 auto;
  width: 512px;
  border: 1px solid #d3d3d3;
  border-radius: 40px;
}
.card.animate {
  transition: all 0.3s;
}
.card-image {
  position: relative;
}
.card-image-yes,
.card-image-no {
  z-index: 99;
  position: absolute;
  top: 50px;
  padding: 5px;
  border: 5px solid;
  border-radius: 10px;
  font-size: 5rem;
  box-shadow: 0 0 16px 16px rgba(0, 0, 0, 0.95);
  letter-spacing: 2px;
  text-align: center;
  font-weight: bold;
  opacity: 0;
}
.card-image-yes {
  left: 30px;
  color: white;
  background-color: green;
  transform: rotate(-30deg);
}
.card-image-no {
  left: calc(512px - 140px - 30px);
  color: white;
  background-color: red;
  transform: rotate(30deg);
}
.card-info {
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  color: white;
  padding: 1.4em;
  font-size: 1.4em;
}
.card-info .info-name {
  font-weight: bold;
}
</style>
