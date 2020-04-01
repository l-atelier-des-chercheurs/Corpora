<template>
  <div>
    <div>
      <h1>Les corpus</h1>
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
          <span v-if="rename_this_corpus !== corpus.slugFolderName">
            {{ corpus.name }}
          </span>
          <span v-else>
            <form @submit.prevent="renameCorpus(corpus.slugFolderName)">
              <input type="text" v-model="new_corpus_name" />
              <button
                type="submit"
                :disabled="new_corpus_name === ''"
                v-html="$t('rename')"
              />
            </form>
            <button type="button" @click="rename_this_corpus = false">
              {{ $t("cancel") }}
            </button>
          </span>

          <template v-if="rename_this_corpus !== corpus.slugFolderName">
            <button
              type="button"
              @click="$root.openCorpus(corpus.slugFolderName)"
            >
              {{ $t("open") }}
            </button>
            <button
              type="button"
              @click="enableRenameThisCorpus(corpus.slugFolderName)"
            >
              {{ $t("rename") }}
            </button>
            <button
              type="button"
              @click="removeThisCorpus(corpus.slugFolderName)"
            >
              {{ $t("remove") }}
            </button>
          </template>
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
      show_create_corpus: false,
      rename_this_corpus: false
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
          this.show_create_corpus = false;
          this.new_corpus_name = "";
          this.$root.openCorpus(fdata.slugFolderName);
        });
    },
    enableRenameThisCorpus(slugFolderName) {
      this.new_corpus_name = this.corpuses.find(
        c => c.slugFolderName === slugFolderName
      ).name;
      this.rename_this_corpus = slugFolderName;
    },
    renameCorpus(slugFolderName) {
      this.$root
        .editFolder({
          type: "corpus",
          slugFolderName,
          data: {
            name: this.new_corpus_name
          }
        })
        .then(fdata => {
          this.rename_this_corpus = false;
          this.new_corpus_name = "";
        });
    },
    removeThisCorpus(slugFolderName) {
      this.$root.removeFolder({
        type: "corpus",
        slugFolderName
      });
    }
  }
};
</script>
<style lang="scss"></style>
