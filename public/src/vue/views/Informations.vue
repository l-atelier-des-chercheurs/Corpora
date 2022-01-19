<template>
  <div class="m_informations">
    <div class="margin-vert-small">
      <router-link
        :to="{
          name: 'Corpus',
          params: { slugFolderName: corpus.slugFolderName },
        }"
        class="button"
        v-html="$t('back_to_fragments')"
      />
    </div>
    <div class="margin-vert-small">
      <label>Description</label>
      <TextField
        :field_name="'description_long'"
        :content="corpus.description_long"
        type="corpus"
        :slugFolderName="corpus.slugFolderName"
        :allow_editing="$root.can_admin_corpora"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    corpus: Object,
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss">
.m_informations {
  padding: calc(var(--spacing)) calc(var(--spacing) * 2)
    calc(var(--spacing) * 2);
  max-width: 99ch;

  .ql-editor {
    max-width: none;
  }
}
</style>
