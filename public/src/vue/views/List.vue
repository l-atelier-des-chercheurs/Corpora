<template>
  <div class="m_list">
    <Admin :collapsable="false" />
    <template v-if="$root.can_admin_corpora">
      <div class="m_list--titles">
        <h1>Les corpus (admin)</h1>
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
      <input
        type="text"
        v-model="find_by_title"
        placeholder="Chercher par titre de corpus"
      />

      <div class="m_list--corpuses">
        <div
          class="m_list--corpuses--corpus"
          v-for="corpus in filtered_corpus"
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
      find_by_title: "",
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
    filtered_corpus() {
      return this.sorted_corpuses.filter(
        (c) =>
          !this.find_by_title ||
          c.name.toLowerCase().includes(this.find_by_title.toLowerCase())
      );
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
  gap: calc(var(--spacing));
}

input {
  background: white;
}
</style>
