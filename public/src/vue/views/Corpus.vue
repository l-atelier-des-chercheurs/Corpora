<template>
  <div>
    <div>
      <button type="button" @click="$root.closeCorpus()">back</button>
    </div>
    <div>Hello corpus {{ corpus.name }}</div>
    <div>
      <button type="button" @click="show_create_fragment = !show_create_fragment">Create fragment</button>

      <form v-if="show_create_fragment" @submit.prevent="createFragment()" class="input-group">
        <input type="text" v-model.trim="new_fragment_name" required autofocus />
        <button type="submit" :disabled="new_fragment_name === ''" v-html="$t('create')" class />
      </form>
    </div>

    <Fragment
      v-for="fragment in fragments"
      :key="fragment.metaFileName"
      :medias="medias"
      :fragment="fragment"
      :slugFolderName="corpus.slugFolderName"
    />
  </div>
</template>
<script>
import Fragment from "./components/Fragment.vue";

export default {
  props: {
    corpus: Object
  },
  components: {
    Fragment
  },
  data() {
    return {
      show_create_fragment: false,
      new_fragment_name: ""
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    medias() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      return Object.values(this.corpus.medias);
    },
    fragments() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      return Object.values(this.corpus.medias).filter(
        m => m.type === "fragment"
      );
    }
  },
  methods: {
    createFragment() {
      const title = this.new_fragment_name;

      if (this.corpus.medias && Object.values(this.corpus.medias).length > 0) {
        if (
          Object.values(this.corpus.medias).find(
            m => m.type === "fragment" && m.title === title
          )
        ) {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t("notifications.fragment_with_title_already_exists"));
          return;
        }
      }

      this.$root.createMedia({
        slugFolderName: this.corpus.slugFolderName,
        type: "corpus",
        additionalMeta: {
          type: "fragment",
          title,
          medias_slugs: []
        }
      });

      this.new_fragment_name = "";
      this.show_create_fragment = "";
    }
  }
};
</script>
<style lang="scss"></style>
