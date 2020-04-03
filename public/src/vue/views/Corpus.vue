<template>
  <div style="width: 100%; height: 100%;">
    <CorpusPwd v-if="!can_access_corpus" :corpus="corpus" />
    <div v-else class="m_corpus">
      <div class="m_corpus--presentation">
        <div class="">
          <button type="button" @click="$root.closeCorpus()">back</button>
        </div>

        <div class="m_corpus--presentation--name">
          <h1>{{ corpus.name }}</h1>
          <h3>{{ corpus.subtitle }}</h3>
        </div>

        <div>
          <p>
            {{ corpus.description }}
          </p>
        </div>

        <div v-if="previewURL" class="m_corpus--presentation--vignette">
          <img :src="previewURL" class draggable="false" />
        </div>

        <div>
          <button
            type="button"
            @click="show_create_fragment = !show_create_fragment"
          >
            Create fragment
          </button>

          <CreateFragment
            v-if="show_create_fragment"
            :corpus="corpus"
            :all_tags="all_tags"
            @close="show_create_fragment = false"
          />
        </div>

        <div>
          Les logos ici
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
      </div> -->
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
                >
                  <h2>
                    <template v-if="tag === 'zzz'">
                      Non-taggés
                    </template>
                    <template v-else>
                      {{ tag }}
                    </template>
                    &nbsp;<small>({{ fragments.length }})</small>
                  </h2>
                </button>
              </div>
            </div>

            <transition name="slide-fade">
              <div
                class="m_tags--allfragments--tagfragment--fragments"
                v-if="showFragmentsFor(tag)"
              >
                <Fragment
                  v-for="fragment in fragments"
                  :key="fragment.metaFileName"
                  :corpus="corpus"
                  :all_tags="all_tags"
                  :medias="medias"
                  :fragment="fragment"
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
      if (!this.fragments) return [];

      let fragments_by_tag = this.$_.groupBy(this.fragments, f => {
        if (!!f.tags && Array.isArray(f.tags) && f.tags.length > 0)
          return f.tags[0].title;
        return "zzz";
      });

      fragments_by_tag = Object.entries(fragments_by_tag).map(
        ([tag, fragments]) => {
          return { tag, fragments };
        }
      );

      fragments_by_tag = this.$_.sortBy(fragments_by_tag, "tag");

      return fragments_by_tag;
    },
    fragments_without_tags() {},
    all_tags() {
      return this.tags_with_fragments.map(t => t.tag);
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
  > * {
    flex: 0 0 auto;
  }
}

.m_corpus--presentation {
  // position: absolute;
  margin: calc(var(--spacing) * 2) calc(var(--spacing) * 2);
  z-index: 1;

  max-width: 66ch;
}

.m_tags {
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;

  height: 100%;
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
    padding-left: var(--spacing);
    border-right: 1px solid currentColor;
  }
}

.m_tags--allfragments--tagfragment--tag {
  // position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;

  button {
    background-color: transparent;
    padding: 0;
    border-bottom: 0.2em solid transparent;

    &:hover,
    &:active,
    &:focus {
      outline: 0;
      border-bottom: 0.2em solid currentColor;
    }
  }

  h2 {
    margin: 0;
    white-space: nowrap;
  }

  > * {
    transform: rotate(-90deg);
  }
}
.m_tags--allfragments--tagfragment--fragments {
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;

  min-width: 400px;
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
