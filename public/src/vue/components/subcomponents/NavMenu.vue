<template>
  <div class="_navPages">
    <router-link
      v-if="$root.can_admin_corpora"
      :to="{
        name: 'Corpora',
      }"
      class="button"
      v-html="$t('all_corpus')"
    />

    <button
      v-if="$root.can_admin_corpora"
      type="button"
      class="button-small"
      @click="show_edit_corpus_for = true"
    >
      {{ $t("edit_corpus") }} (admin)
    </button>

    <EditCorpus
      v-if="show_edit_corpus_for"
      :corpus="corpus"
      :slugCorpusName="corpus.slugFolderName"
      @close="show_edit_corpus_for = false"
    />

    <router-link
      :to="{
        name: 'Informations',
      }"
      class="button"
      v-html="$t('about')"
    />

    <LangSwitch />
  </div>
</template>
<script>
import EditCorpus from "../modals/EditCorpus.vue";
import LangSwitch from "./LangSwitch.vue";

export default {
  props: {
    corpus: Object,
  },
  components: {
    EditCorpus,
    LangSwitch,
  },
  data() {
    return {
      show_edit_corpus_for: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
._navPages {
  float: right;
  display: flex;
  align-items: center;
  gap: calc(var(--spacing));
  margin-top: calc(var(--spacing) / 2);
}
</style>
