<template>
  <div class="m_corpus">
    <div class="m_corpus--topbar">
      <div>
        <button type="button" @click="$root.closeCorpus()">back</button>
      </div>
      <div>
        <h1>{{ corpus.name }} Morbi sed. Morbi sed. Morbi sed. Morbi sed.</h1>
        <h3>Un titre h3</h3>
      </div>

      <div>
        <p>
          Fusce tempus arcu nec turpis consectetur, non dignissim nulla
          interdum. Quisque consectetur vulputate sem ac aliquet. Etiam eu
          vulputate augue, non molestie eros. Integer efficitur nisl purus, nec
          vehicula ligula sollicitudin vel. Pellentesque porttitor id orci in
          bibendum. Suspendisse eleifend eget neque a facilisis. Aliquam erat
          volutpat. Mauris a enim id nulla hendrerit blandit. Praesent tempor
          fermentum neque, non eleifend quam.
        </p>
      </div>

      <div>
        <button
          type="button"
          @click="show_create_fragment = !show_create_fragment"
        >
          Create fragment
        </button>

        <form
          v-if="show_create_fragment"
          @submit.prevent="createFragment()"
          class="input-group"
        >
          <div>
            <input
              type="text"
              v-model.trim="new_fragment_name"
              required
              autofocus
            />
          </div>
          <div>
            <select v-model="new_fragment_tag">
              <option value="">
                {{ $t("new_tag") }}
              </option>
              <option v-for="tag in all_tags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          <div v-if="new_fragment_tag === ''">
            <label>New tag name</label>
            <input
              type="text"
              v-model.trim="new_fragment_tag_custom"
              required
              autofocus
            />
          </div>

          <button
            type="submit"
            :disabled="new_fragment_name === ''"
            v-html="$t('create')"
            class
          />
        </form>
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
      <div class="m_tags--alltags">
        <h3 v-for="{ tag } in tags_with_fragments" :key="tag">
          {{ tag }}
        </h3>
      </div>
      <div class="m_tags--allfragments">
        <div
          v-for="{ tag, fragments } in tags_with_fragments"
          :key="tag"
          class="m_tags--allfragments--tagfragment"
        >
          <div class="m_tags--allfragments--tagfragment--tag">
            <h2>{{ tag }}</h2>
          </div>
          <div class="m_tags--allfragments--tagfragment--fragments">
            <Fragment
              v-for="fragment in fragments"
              :key="fragment.metaFileName"
              :medias="medias"
              :fragment="fragment"
              :slugFolderName="corpus.slugFolderName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Fragment from "./components/Fragment.vue";

export default {
  props: {
    corpus: Object
  },
  components: {
    Fragment
  },
  data() {
    return {
      show_create_fragment: false,
      new_fragment_name: "",
      new_fragment_tag: "",
      new_fragment_tag_custom: "",
      translation: 0
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
          return f.tags[0].name;

        return "no-tag";
      });

      fragments_by_tag = Object.entries(fragments_by_tag).map(
        ([tag, fragments]) => {
          return { tag, fragments };
        }
      );
      return fragments_by_tag;
    },
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

      debugger;
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

    createFragment() {
      const title = this.new_fragment_name;

      if (this.corpus.medias && Object.values(this.corpus.medias).length > 0) {
        if (
          Object.values(this.corpus.medias).find(
            m => m.type === "fragment" && m.title === title
          )
        ) {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t("notifications.fragment_with_title_already_exists"));
          return;
        }
      }

      let tag_name = this.new_fragment_tag;
      if (tag_name === "") {
        tag_name = this.new_fragment_tag_custom;
      }

      const tags = [{ name: tag_name }];

      this.$root.createMedia({
        slugFolderName: this.corpus.slugFolderName,
        type: "corpus",
        additionalMeta: {
          type: "fragment",
          title,
          tags,
          medias_slugs: []
        }
      });

      this.new_fragment_name = "";
      this.new_fragment_tag = "";
      this.new_fragment_tag_custom = "";
      this.show_create_fragment = false;
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

    &.m_fragment--container {
      flex: 1 1 auto;
    }
  }
}

.m_corpus--topbar {
  // position: absolute;
  margin: calc(var(--spacing) * 2) calc(var(--spacing) * 2);
  pointer-events: none;
  pointer-events: auto;
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
    border: 2px solid black;
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
}

.m_tags--allfragments--tagfragment--tag {
  // position: absolute;
  transform: rotate(-90deg);
  display: flex;
  align-items: center;
}
.m_tags--allfragments--tagfragment--fragments {
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;
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
