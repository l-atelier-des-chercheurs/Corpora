<template>
  <Modal
    @close="closeModal"
    :read_only="false"
    :typeOfModal="'LargeAndScroll'"
    :is_loading="is_sending_content_to_server"
    class="m_fragmentModal"
  >
    <template slot="body">
      <div class="_sideBySide">
        <div class="_singleFragment">
          <transition name="fade" :duration="200" mode="out-in">
            <FragmentContent
              v-if="opened_fragment"
              :key="opened_fragment.metaFileName"
              :context="'edit'"
              :fragment="opened_fragment"
              :corpus="corpus"
              :all_keywords="all_keywords"
              :all_tags="all_tags"
              :medias="medias"
              :fragment_width="800"
              :slugFolderName="slugFolderName"
            />
          </transition>
        </div>

        <aside class="_fragmentList">
          <Loader v-if="!show_fragmentlist" />

          <div
            class="_fragmentList--content"
            v-if="show_fragmentlist && linked_fragments"
          >
            <h2>
              {{ linked_fragments.length + " " + $t("with_similar_keywords") }}
            </h2>
            <transition-group
              class="_fragmentList--content--list"
              name="list-complete"
              tag="div"
            >
              <FragmentContent
                v-for="fragment in linked_fragments"
                :key="fragment.metaFileName"
                :context="'preview'"
                :corpus="corpus"
                :all_keywords="all_keywords"
                :all_tags="all_tags"
                :medias="medias"
                :fragment="fragment"
                :fragment_width="300"
                :slugFolderName="corpus.slugFolderName"
              />
            </transition-group>
          </div>
          <div
            class="_fragmentList--content"
            v-if="show_fragmentlist && not_linked_fragments"
          >
            <h2>
              {{ not_linked_fragments.length + " " + $t("other_fragments") }}
            </h2>

            <transition-group
              class="_fragmentList--content--list"
              name="list-complete"
              tag="div"
            >
              <FragmentContent
                v-for="fragment in not_linked_fragments"
                :key="fragment.metaFileName"
                :context="'preview'"
                :corpus="corpus"
                :all_keywords="all_keywords"
                :all_tags="all_tags"
                :medias="medias"
                :fragment="fragment"
                :fragment_width="300"
                :slugFolderName="corpus.slugFolderName"
              />
            </transition-group>
          </div>
        </aside>
      </div>
    </template>
  </Modal>
</template>
<script>
import FragmentContent from "../components/FragmentContent.vue";

export default {
  props: {
    corpus: Object,
    fragments: [Boolean, Array],
    opened_fragment: [Boolean, Object],
    all_tags: Array,
    all_keywords: Array,
    medias: [Boolean, Array],
    slugFolderName: String,
    fragment_width: Number,
  },
  components: {
    FragmentContent,
  },
  data() {
    return {
      show_fragmentlist: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    "opened_fragment.metaFileName"() {
      // scroll to top
      this.$el.scrollTop = 0;
    },
  },
  computed: {
    all_fragments_except_current() {
      return (
        this.fragments &&
        this.fragments.filter(
          (f) => f.metaFileName !== this.opened_fragment.metaFileName
        )
      );
    },
    linked_fragments() {
      return this.all_fragments_except_current.filter(
        (f) => f.keywords && this.hasCommonKeywordWithOpened(f)
      );
    },
    not_linked_fragments() {
      const linked_fragments_meta = this.linked_fragments.map(
        (lf) => lf.metaFileName
      );
      return this.all_fragments_except_current.filter(
        (f) => !linked_fragments_meta.includes(f.metaFileName)
      );
    },
  },
  methods: {
    closeModal() {
      this.$router.push({
        name: "Corpus",
        query: this.$route.query ? this.$route.query : {},
      });
    },
    hasCommonKeywordWithOpened(f) {
      if (
        !this.opened_fragment.keywords ||
        !Array.isArray(this.opened_fragment.keywords) ||
        !Array.isArray(f.keywords)
      )
        return false;
      const kws = this.opened_fragment.keywords.map((kw) => kw.title);
      return kws.find((kw) => f.keywords.map((k) => k.title).includes(kw));
    },
  },
};
</script>
<style lang="scss" scoped>
.m_fragmentModal {
  z-index: 9999;
  background: rgba(60, 53, 65, 0.75);
  padding: clamp(2vmin, 4vw, calc(var(--spacing) * 4));
}
._sideBySide {
  display: flex;
  flex-flow: row wrap;
  grid-gap: calc(var(--spacing) * 2);

  ._singleFragment {
    flex: 1 1 500px;
  }
  ._fragmentList {
    flex: 0 1 440px;
  }
}

._fragmentList {
  position: relative;
  h2 {
    color: var(--color-beige);
  }
}
._fragmentList--content--list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* grid-auto-rows: max-content; */
  grid-gap: calc(var(--spacing) * 1) calc(var(--spacing) * 1);
  // padding: 0 calc(var(--spacing) * 2) calc(var(--spacing) * 2);
}
</style>
