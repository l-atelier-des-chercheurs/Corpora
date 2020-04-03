<template>
  <div class="m_list">
    <div v-if="!can_admin_corpora">
      <p>Enter password to admin</p>
      <input type="password" v-model="$root.admin_pwd" />
    </div>
    <div v-else>
      <div>
        <h1>Les corpus</h1>
      </div>

      <div>
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
          v-for="corpus in corpuses"
          :key="corpus.slugFolderName"
        >
          <CorpusPreview :corpus="corpus" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreateCorpus from "../components/modals/CreateCorpus.vue";
import CorpusPreview from "../components/CorpusPreview.vue";

export default {
  props: {
    corpuses: Array
  },
  components: {
    CreateCorpus,
    CorpusPreview
  },
  data() {
    return {
      show_create_corpus: false
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    can_admin_corpora() {
      // todo actual admin checks
      return this.hashCode(this.$root.admin_pwd) === 2678;
    }
  },
  methods: {
    hashCode(s) {
      return s.split("").reduce(function(a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.m_list {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;

  > * {
    margin: var(--spacing);
  }
}

.m_list--corpuses {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
