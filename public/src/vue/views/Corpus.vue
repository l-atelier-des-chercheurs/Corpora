<template>
  <div style="width: 100%; height: 100%;">
    <CorpusPwd v-if="!can_access_corpus" :corpus="corpus" />
    <div v-else class="m_corpus">
      <div class="m_corpus--presentation">
        <!-- <div class>
          <button type="button" @click="$root.closeCorpus()">back</button>
        </div>-->

        <div class="m_corpus--presentation--name">
          <h1 v-if="!!corpus.name">{{ corpus.name }}</h1>
          <h3 v-if="!!corpus.subtitle">{{ corpus.subtitle }}</h3>
        </div>

        <div class="m_corpus--presentation--description">
          <!-- <label>{{ $t('description') }}</label> -->
          <p>{{ corpus.description }}</p>
        </div>

        <!-- <div class="m_corpus--presentation--tags">
          <label>{{ $t('keywords') }}</label>
          <button type="button" v-for="(tag, index) in all_tags" :key="index">{{ tag }}</button>
        </div>-->

        <div v-if="previewURL" class="m_corpus--presentation--vignette">
          <img :src="previewURL" class draggable="false" />
        </div>
      </div>

      <div
        class="m_tags"
        ref="corpus_content"
        @wheel="/* onMousewheel */"
        @scroll="/* onTimelineScroll */"
      >
        <!-- <div class="m_tags--alltags">
        <h3 v-for="{ tag } in tags_with_fragments" :key="tag">
          {{ tag }}
        </h3>
        </div>-->
        <div class="m_tags--options">
          <button
            type="button"
            class="m_tags--options--addFragmentButton"
            @click="show_create_fragment = !show_create_fragment"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              style="enable-background:new 0 0 24 24;"
              xml:space="preserve"
            >
              <path
                style="fill: currentColor;"
                d="M0,10.5h10.5V0h2.9v10.5H24v2.9H13.5V24h-2.9V13.5H0V10.5z"
              />
            </svg>
          </button>
          <CreateFragment
            v-if="show_create_fragment"
            :corpus="corpus"
            :all_tags="all_tags"
            @close="show_create_fragment = false"
          />
        </div>
        <div class="m_tags--allfragments">
          <div
            v-for="{ tag, fragments } in tags_with_fragments"
            :key="tag"
            class="m_tags--allfragments--tagfragment"
          >
            <div class="m_tags--allfragments--tagfragment--tag">
              <div>
                <button
                  type="button"
                  @click="toggleShowingFragmentsForTag(tag)"
                  :class="{ 'is--active' : showFragmentsFor(tag) }"
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
              <div
                class="m_tags--allfragments--tagfragment--fragments"
                v-if="showFragmentsFor(tag)"
                :style="`width: ${fragment_width * fragments.length}px`"
              >
                <Fragment
                  v-for="fragment in fragments"
                  :key="fragment.metaFileName"
                  :corpus="corpus"
                  :all_tags="all_tags"
                  :medias="medias"
                  :fragment="fragment"
                  :fragment_width="fragment_width"
                  :slugFolderName="corpus.slugFolderName"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CorpusPwd from "../components/modals/CorpusPwd.vue";
import Fragment from "../components/Fragment.vue";
import CreateFragment from "../components/modals/CreateFragment.vue";

export default {
  props: {
    corpus: Object
  },
  components: {
    CorpusPwd,
    Fragment,
    CreateFragment
  },
  data() {
    return {
      show_create_fragment: false,
      new_fragment_name: "",
      new_fragment_tag: "",
      new_fragment_tag_custom: "",
      translation: 0,
      show_fragments_for: {}
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    translation: function() {
      this.$refs.corpus_content.scrollLeft = this.translation;
    }
  },
  computed: {
    fragment_width() {
      return Math.min(400, this.$root.settings.windowWidth * 0.9);
    },
    can_access_corpus() {
      return this.$root.canAccessFolder({
        type: "corpus",
        slugFolderName: this.corpus.slugFolderName
      });
    },
    previewURL() {
      if (
        !this.corpus.hasOwnProperty("preview") ||
        this.corpus.preview === ""
      ) {
        return false;
      }
      const thumb = this.corpus.preview.filter(p => p.size === 640);
      if (thumb.length > 0) {
        return `${thumb[0].path}`;
      }
      return false;
    },

    medias() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      return Object.values(this.corpus.medias);
    },
    fragments() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      let fragments = Object.values(this.corpus.medias).filter(
        m => m.type === "fragment"
      );

      fragments = this.$_.sortBy(fragments, "date_created");
      return fragments.reverse();
    },
    tags_with_fragments() {
      // get all tags from fragments
      if (this.all_tags.length === 0) return [];

      // get all tags
      let fragments_by_tag = this.all_tags.map(tag => {
        const fragments_for_tag = this.fragments.filter(
          f =>
            !!f.tags &&
            Array.isArray(f.tags) &&
            f.tags.some(t => t.title === tag)
        );

        return {
          tag,
          fragments: fragments_for_tag
        };
      });

      // append all fragments
      const fragments_with_no_tags = this.fragments.filter(
        f => !f.tags || !Array.isArray(f.tags) || f.tags.length === 0
      );
      if (fragments_with_no_tags.length > 0) {
        fragments_by_tag.push({
          tag: "",
          fragments: fragments_with_no_tags
        });
      }

      // fragments_by_tag.sort((a, b) => a.tag.localeCompare(b.tag));
      // fragments_by_tag = this.$_.sortBy(fragments_by_tag, "tag");

      return fragments_by_tag;
    },
    all_tags() {
      if (!this.fragments) return [];

      let all_tags = this.fragments.reduce((acc, f) => {
        if (!!f.tags && Array.isArray(f.tags) && f.tags.length > 0)
          acc = acc.concat(f.tags.map(t => t.title));
        return acc;
      }, []);

      all_tags = all_tags.filter(function(item, pos) {
        return all_tags.indexOf(item) == pos;
      });

      all_tags.sort((a, b) => a.localeCompare(b));

      return all_tags;
    }
  },
  methods: {
    onMousewheel(event) {
      // console.log('METHODS • TimeLineView: onMousewheel');
      event.preventDefault();

      let new_translation = this.translation;
      new_translation += event.deltaX;
      new_translation += event.deltaY;

      const el = this.$refs.corpus_content;

      const timeline_width = el.children[0].offsetWidth - el.offsetWidth;

      new_translation = Math.max(new_translation, 0);
      new_translation = Math.min(new_translation, timeline_width);

      if (new_translation !== this.translation) {
        this.translation = new_translation;
      }
    },
    onTimelineScroll() {
      // console.log('METHODS • TimeLineView: onTimelineScroll');
      const el = this.$refs.corpus_content;
      this.translation = el.scrollLeft;
    },

    showFragmentsFor(tag) {
      if (!this.show_fragments_for.hasOwnProperty(tag)) return false;
      return this.show_fragments_for[tag];
    },
    toggleShowingFragmentsForTag(tag) {
      console.log("Corpus • METHODS: toggleShowingFragmentsForTag");

      const current_opt = this.show_fragments_for.hasOwnProperty(tag)
        ? this.show_fragments_for[tag]
        : false;

      Object.keys(this.show_fragments_for).map(
        s => (this.show_fragments_for[s] = false)
      );

      this.$set(this.show_fragments_for, tag, !current_opt);
    }
  }
};
</script>
<style lang="scss" scoped>
.m_corpus {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  overflow-y: auto;

  > * {
    flex: 0 0 auto;
  }
}

.m_corpus--presentation {
  // position: absolute;
  margin: calc(var(--spacing) * 2) calc(var(--spacing) * 2);
  z-index: 1;
  // in case of very small height of viewport
  max-height: 100%;
  max-width: 66ch;

  > * {
    margin-bottom: calc(var(--spacing));
  }
}

.m_corpus--presentation--name {
  h1 + h3 {
    margin-top: calc(-1 * var(--spacing));
  }
}
.m_corpus--presentation--description {
  margin-bottom: calc(var(--spacing) * 1.5);
}

.m_corpus--presentation--vignette {
  max-width: 240px;
}

.m_tags {
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;

  height: 100%;
}

.m_tags--options {
  display: flex;
  flex-flow: column wrap;
  margin: calc(var(--spacing) * 1.9) 0;

  .m_tags--options--addFragmentButton {
    background-color: white;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    padding: 0;
    font-size: 4em;
    width: 1em;
    height: 1em;
    border-radius: 50%;
  }
}

.m_tags--alltags {
  position: fixed;
  // position: relative;
  width: 100%;

  h2 {
    display: inline-block;
    background-color: #fff;
    padding: var(--spacing);
    border: 2px solid currentColor;
    margin-right: var(--spacing);
  }
}

.m_tags--allfragments {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;
  overflow-y: auto;
}

.m_tags--allfragments--tagfragment {
  display: flex;
  flex-flow: row nowrap;

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

.m_tags--allfragments--tagfragment--tag {
  position: relative;
  // position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;

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

    background-color: var(--body-bg);

    &:hover {
      background-color: #c0d8dd;
    }
    &:active,
    &.is--active,
    &:focus {
      outline: 0;
      span {
        text-decoration: underline;
        // border-bottom: 0.1em solid currentColor;
      }
    }
  }

  h2 {
    margin: 0;
    white-space: nowrap;

    display: flex;
    flex-flow: row wrap;
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
.m_tags--allfragments--tagfragment--fragments {
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
