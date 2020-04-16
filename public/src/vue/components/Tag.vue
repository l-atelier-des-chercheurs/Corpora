<template>
  <div class="m_tag">
    <div class="m_tag--tag" v-visible="!show_fragments || !tag_title_position">
      <div>
        <button
          type="button"
          @click="showFragments"
          :class="{
            'is--active': show_fragments,
          }"
        >
          <h2>
            <span>
              <template v-if="tag === ''">Non-taggés</template>
              <template v-else>{{ tag }}</template>
            </span>
            <small>{{ fragments.length * 1 }}</small>
          </h2>
        </button>
      </div>
    </div>
    <div
      class="m_tag--tag m_tag--tag_fixed"
      :class="[`has--position_${tag_title_position}`]"
      v-if="show_fragments && tag_title_position"
    >
      <div>
        <button
          type="button"
          @click="showFragments"
          :class="{
            'is--active': show_fragments,
          }"
        >
          <h2>
            <span>
              <template v-if="tag === ''">Non-taggés</template>
              <template v-else>{{ tag }}</template>
            </span>
            <small>{{ fragments.length * 1 }}</small>
          </h2>
        </button>
      </div>
    </div>

    <transition name="width_collapse">
      <div class="m_tag--fragments" v-if="show_fragments">
        <!-- :style="`width: ${fragment_width * fragments.length}px`" -->
        <Fragment
          v-for="fragment in fragments"
          :key="fragment.metaFileName"
          :corpus="corpus"
          :all_tags="all_tags"
          :medias="medias"
          :fragment="fragment"
          :fragment_width="fragment_width"
          :slugFolderName="slugFolderName"
        />
      </div>
    </transition>
  </div>
</template>
<script>
import Fragment from "./Fragment.vue";

export default {
  props: {
    tag: String,
    all_tags: Array,
    medias: Array,
    corpus: Object,
    slugFolderName: String,
    fragments: Array,
    fragment_width: Number,
    corpus_scroll_left: Number,
  },
  components: {
    Fragment,
  },
  data() {
    return {
      show_fragments: false,
      tag_title_position: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    corpus_scroll_left: function () {
      this.setTitleBarRightPos();
    },
  },
  computed: {},
  methods: {
    showFragments(tag) {
      this.show_fragments = !this.show_fragments;
      this.$nextTick(() => {
        this.setTitleBarRightPos();
      });
    },
    setTitleBarRightPos() {
      if (this.show_fragments) {
        const tag_box = this.$el.getBoundingClientRect();
        // console.log(`tag_box ${JSON.stringify(tag_box)}`);

        if (tag_box.x < 0 && tag_box.right > 84) {
          this.tag_title_position = "in-between";
        } else if (tag_box.x < 0 && tag_box.right < 84) {
          this.tag_title_position = "end-of-container";
        } else {
          this.tag_title_position = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.m_tag {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;

  // min-width: max-content;
  // overflow-y: auto;

  &::after {
    content: "";
    display: block;
    height: calc(100% - var(--spacing) * 2);
    margin: calc(var(--spacing) * 1) 0;
    // padding-left: var(--spacing);
    // border-right: 1px solid currentColor;
  }
}

.m_tag--tag {
  position: relative;
  // position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 100%;
  transition: all 1s linear;

  &.m_tag--tag_fixed {
    position: fixed;
    left: 0;
    z-index: 100;
    // background-color: var(--body-bg);
    background: linear-gradient(
      to right,
      var(--body-bg) 75%,
      transparent calc(75% + 1px)
    );

    background-size: 200% 100%;
    background-position: -100% 0;

    &.has--position_end-of-container {
      position: absolute;
      right: 0;
      left: auto;
      background-position: -150% 0;
    }
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    height: calc(100% - var(--spacing) * 4);
    width: 2px;
    background-color: #c0d8dd;
    z-index: 0;
  }

  button {
    background-color: transparent;
    padding: calc(var(--spacing) / 2) calc(var(--spacing) * 1)
      calc(var(--spacing) / 2) calc(var(--spacing) * 1.5);
    // padding-right: 0;
    border-radius: 28px;
    // width: 80vh;
    // border-bottom: 0.2em solid transparent;
    // width: 50vh;
    text-align: center;

    text-transform: initial;

    background-color: var(--body-bg);
    border: 2px solid transparent;

    &:hover,
    &:active,
    &:focus {
      background-color: #c0d8dd;
      span {
        text-decoration: underline;
      }
    }
    &.is--active {
      outline: 0;
      border-color: #c0d8dd;
      background-color: var(--body-bg);
    }
  }

  h2 {
    margin: 0;
    // white-space: nowrap;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    span {
      margin-right: var(--spacing);
    }

    small {
      font-size: 0.7em;
      background-color: #c0d8dd;
      border-radius: 50%;
      min-width: 1.7em;
      height: 1.7em;
      display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
  }

  > * {
    display: block;
    flex: 0 0 80vh;
    transform: rotate(-90deg);
    // background-color: rosybrown;
    text-align: center;
  }
}
.m_tag--fragments {
  display: flex;
  flex-flow: row nowrap;
  // align-content: stretch;
  // min-width: max-content;
  // transform-origin: left center;
  overflow: hidden;
  // min-width: 400px;
}

// .m_fragment--content {
//   position: relative;
//   padding: 0 calc(var(--spacing) * 1);
//   width: 100%;
//   height: 100%;

//   // max-height: 90vh;
// }

// .m_fragment--content--title {
// }

// .m_fragment--content--fragments {
//   display: flex;
//   flex-flow: row nowrap;
//   align-content: stretch;
//   min-width: max-content;

//   height: 100%;
// }
</style>
