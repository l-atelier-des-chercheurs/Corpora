<template>
  <div class="m_informations">
    <div class="margin-vert-small">
      <router-link
        :to="{
          name: 'Corpus',
          params: { slugFolderName: corpus.slugFolderName },
        }"
        class="button"
        v-html="'← ' + $t('show_fragments')"
      />
    </div>
    <div class="margin-vert-small _description">
      <template v-if="$root.lang.current === 'fr'">
        <TextField
          :field_name="'description_long'"
          :content="corpus.description_long"
          type="corpus"
          :slugFolderName="corpus.slugFolderName"
          :allow_editing="$root.can_admin_corpora"
        />
        <small v-if="!corpus.description_long" class="text-gray">
          Pas encore de description. Admin : connectez-vous pour en ajouter une.
        </small>
      </template>
      <template v-else-if="$root.lang.current === 'en'">
        <TextField
          :field_name="'description_long_en'"
          :content="corpus.description_long_en"
          type="corpus"
          :slugFolderName="corpus.slugFolderName"
          :allow_editing="$root.can_admin_corpora"
        />
        <small v-if="!corpus.description_long_en" class="text-gray">
          No description yet. Admin: connect to add one.
        </small>
      </template>
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
  padding: 0;

  ._description {
    max-width: 99ch;

    .ql-editor {
      max-width: none;
    }

    .app:not(.mobile_view) & {
      // margin-left: 33%;
    }
  }
}
</style>
