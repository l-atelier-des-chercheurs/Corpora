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
          <FragmentContent
            :context="'edit'"
            :fragment="opened_fragment"
            :corpus="corpus"
            :all_keywords="all_keywords"
            :all_tags="all_tags"
            :medias="medias"
            :fragment_width="800"
            :slugFolderName="slugFolderName"
          />
        </div>

        <aside class="_linkedFragments">
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
    fragments: Array,
    opened_fragment: Object,
    all_tags: Array,
    all_keywords: Array,
    medias: Array,
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
  watch: {},
  computed: {
    linked_fragments() {
      return this.fragments;
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
  background: rgba(60, 53, 65, 0.95);
  padding: var(--spacing);
}
._sideBySide {
  display: flex;
  flex-flow: row wrap;
  gap: var(--spacing);

  ._singleFragment {
    flex: 1 0 500px;
  }
  ._linkedFragments {
    flex: 0 0 260px;
  }
}
._singleFragment {
}
._linkedFragments {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  /* grid-auto-rows: max-content; */
  grid-gap: calc(var(--spacing) * 2.5) calc(var(--spacing) * 2);
  padding: 0 calc(var(--spacing) * 2) calc(var(--spacing) * 2);
}
</style>
