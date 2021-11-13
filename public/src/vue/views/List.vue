<template>
  <div class="m_list">
    <template v-if="!$root.can_admin_corpora">
      <p>Enter password to admin</p>
      <input type="password" autofocus v-model="$root.admin_pwd" />
    </template>
    <template v-else>
      <div class="m_list--titles">
        <h1>Les corpus</h1>
        <button
          type="button"
          class="buttonLink"
          :class="{ 'is--active': show_create_corpus }"
          @click="show_create_corpus = !show_create_corpus"
        >
          {{ $t("create") }}
        </button>

        <CreateCorpus
          v-if="show_create_corpus"
          @close="show_create_corpus = false"
        />
      </div>

      <div class="m_list--corpuses">
        <div
          class="m_list--corpuses--corpus"
          v-for="corpus in sorted_corpuses"
          :key="corpus.slugFolderName"
        >
          <CorpusPreview :corpus="corpus" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import CreateCorpus from "../components/modals/CreateCorpus.vue";
import CorpusPreview from "../components/CorpusPreview.vue";

export default {
  props: {},
  components: {
    CreateCorpus,
    CorpusPreview,
  },
  data() {
    return {
      show_create_corpus: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    corpuses() {
      return Object.values(this.$root.store.corpus);
    },
    sorted_corpuses() {
      return this.$_.sortBy(this.corpuses, "date_created").reverse();
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_list {
  > * {
    margin: var(--spacing);
  }
}

.m_list--titles {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: var(--spacing);
}
.m_list--corpuses {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: calc(var(--spacing) / 2);
}
</style>
