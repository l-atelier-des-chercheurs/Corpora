<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    :enter-active-class="transitionEnterActiveClass"
    @beforeLeave="beforeLeave"
    @enter="enter"
    @afterEnter="afterEnter"
  >
    <slot />
  </transition>
</template>

<script>
const DEFAULT_TRANSITION = "pagetransition";
const DEFAULT_TRANSITION_MODE = "out-in";

export default {
  name: "TransitionPage",
  data() {
    return {
      prevHeight: 0,
      transitionName: DEFAULT_TRANSITION,
      transitionMode: DEFAULT_TRANSITION_MODE,
      transitionEnterActiveClass: "",
    };
  },
  watch: {
    // $route(to, from) {
    //   const toDepth = to.path.split("/").length;
    //   const fromDepth = from.path.split("/").length;
    //   this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    // },
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName =
        to.meta.transitionName ||
        from.meta.transitionName ||
        DEFAULT_TRANSITION;

      if (transitionName === "slide") {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
      }

      this.transitionMode = DEFAULT_TRANSITION_MODE;
      this.transitionEnterActiveClass = `${transitionName}-enter-active`;

      if (to.meta.transitionName === "zoom") {
        this.transitionMode = "in-out";
        this.transitionEnterActiveClass = "zoom-enter-active";
        document.body.style.overflow = "hidden";
      }

      if (from.meta.transitionName === "zoom") {
        this.transitionMode = null;
        this.transitionEnterActiveClass = null;
        document.body.style.overflow = null;
      }

      this.transitionName = transitionName;

      next();
    });

    this.$router.afterEach((to) => {
      this.$nextTick(() => {
        if (to.meta.title) document.title = to.meta.title;
      });
    });
  },
  methods: {
    beforeLeave(element) {
      // this.prevHeight = getComputedStyle(element).height;
      element;
    },
    enter(element) {
      // const { height } = getComputedStyle(element);
      element;
      // element.style.height = this.prevHeight;
      // setTimeout(() => {
      //   element.style.height = height;
      // });
    },
    afterEnter(element) {
      element;
      // element.style.height = "auto";
    },
  },
};
</script>

<style lang="scss">
.pagetransition-enter-active,
.pagetransition-leave-active {
  transition-duration: 0.25s;
  transition-property: height, opacity;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  // overflow: hidden;
}

.pagetransition-enter,
.pagetransition-leave-active {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}

.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: zoom;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoom {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  100% {
    opacity: 1;
  }
}
</style>
