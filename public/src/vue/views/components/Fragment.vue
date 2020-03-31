<template>
  <div class="m_fragment">
    <h2>{{ fragment.title }}</h2>
    <!-- {{ linked_medias }} -->
    <div v-for="media in linked_medias" :key="media.metaFileName">
      <MediaContent
        v-model="media.content"
        :context="'preview'"
        :slugFolderName="slugProjectName"
        :media="media"
      />
    </div>

    <AddMedias :slugFolderName="slugFolderName" @newMediaCreated="newMediaCreated" />
  </div>
</template>
<script>
import AddMedias from "./AddMedias.vue";
import MediaContent from "./MediaContent.vue";

export default {
  props: {
    fragment: Object,
    medias: Array,
    slugFolderName: String
  },
  components: {
    AddMedias,
    MediaContent
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    linked_medias() {
      if (
        typeof this.fragment.medias_slugs !== "object" ||
        this.fragment.medias_slugs.length === 0
      )
        return [];

      return this.fragment.medias_slugs.reduce((acc, item) => {
        const linked_media = this.medias.find(
          m => m.metaFileName === item.metaFileName
        );
        if (linked_media) acc.push(linked_media);
        return acc;
      }, []);
    }
  },
  methods: {
    newMediaCreated(metaFileName) {
      if (window.state.dev_mode === "debug")
        console.log("Fragment • METHODS: newMediaCreated");

      let medias_slugs =
        typeof this.fragment.medias_slugs === "object"
          ? JSON.parse(JSON.stringify(this.fragment.medias_slugs))
          : [];

      medias_slugs.push({
        metaFileName: metaFileName
      });

      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.slugFolderName,
        slugMediaName: this.fragment.metaFileName,
        data: {
          medias_slugs
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.m_fragment {
  border: 2px solid black;
  padding: var(--spacing);
  margin: var(--spacing);
}
</style>
