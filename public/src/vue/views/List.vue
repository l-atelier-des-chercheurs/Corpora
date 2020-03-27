<template>
  <div>
    <div>
      Les corpus
    </div>
    <hr />

    <button
      type="button"
      class="buttonLink"
      :class="{ 'is--active': show_create_corpus }"
      @click="show_create_corpus = !show_create_corpus"
    >
      {{ $t("create") }}
    </button>

    <form
      v-if="show_create_corpus"
      @submit.prevent="createCorpus()"
      class="input-group"
    >
      <input type="text" v-model.trim="new_corpus_name" required autofocus />
      <button
        type="submit"
        :disabled="new_corpus_name === ''"
        v-html="$t('create')"
      />
    </form>

    <div>
      <ul>
        <li v-for="corpus in corpuses" :key="corpus.slugFolderName">
          {{ corpus.name }}
          <button
            type="button"
            @click="$root.openCorpus(corpus.slugFolderName)"
          >
            Ouvrir
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    corpuses: Array
  },
  components: {},
  data() {
    return {
      new_corpus_name: "",
      show_create_corpus: false
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    createCorpus() {
      this.$root
        .createFolder({
          type: "corpus",
          data: {
            name: this.new_corpus_name
          }
        })
        .then(fdata => {
          this.$root.openCorpus(fdata.slugFolderName);
        });
    },
    newFolderCreated: function(fdata) {
      debugger;
    }
  }
};
</script>
<style lang="scss"></style>
