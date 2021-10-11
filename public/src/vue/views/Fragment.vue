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

        <aside class="_linkedFragments">
          <h2>{{ $t("with_same_keywords") }}</h2>
          <transition-group
            class="_linkedFragments--list"
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
    return {};
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
    linked_fragments() {
      return (
        this.fragments &&
        this.fragments.filter(
          (f) => f.metaFileName !== this.opened_fragment.metaFileName
        )
      );
    },
  },
  methods: {
    closeModal() {
      this.$router.push({ path: `./` });
    },
  },
};
</script>
<style lang="scss" scoped>
.m_fragmentModal {
  z-index: 9999;
  background: rgba(60, 53, 65, 0.75);
  padding: var(--spacing);
}
._sideBySide {
  display: flex;
  flex-flow: row wrap;
  grid-gap: calc(var(--spacing) * 2);

  ._singleFragment {
    flex: 1 1 500px;
  }
  ._linkedFragments {
    flex: 0 1 440px;
  }
}
._singleFragment {
}
._linkedFragments {
  h2 {
    color: var(--color-beige);
  }
}
._linkedFragments--list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* grid-auto-rows: max-content; */
  grid-gap: calc(var(--spacing) * 1) calc(var(--spacing) * 1);
  // padding: 0 calc(var(--spacing) * 2) calc(var(--spacing) * 2);
}
</style>
