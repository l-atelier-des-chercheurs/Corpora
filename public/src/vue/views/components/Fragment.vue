<template>
  <div class="m_fragment">
    <div class="m_fragment--content">
      <h2>{{ fragment.title }}</h2>

      <div>
        <p>
          Aliquam sit amet mauris eget nisi interdum auctor. Donec efficitur
          tellus ultrices enim cursus accumsan. Donec at elit quis eros varius
          convallis pulvinar at nunc. Vivamus cursus leo ligula, ac vestibulum
          purus viverra gravida. Donec pulvinar interdum enim at laoreet.
          Vestibulum mollis accumsan eleifend. Sed at orci nisi. Donec ut dolor
          ultricies, lacinia odio ac, mattis nulla. Duis ultricies justo et
          lobortis tincidunt. Sed feugiat, turpis nec vulputate tempor, dui diam
          tempor leo, sollicitudin feugiat erat tellus ac diam. Nullam semper
          diam tortor, in posuere ipsum fermentum non. Integer at sollicitudin
          enim. Nullam nulla magna, tempor in imperdiet eu, consectetur sit amet
          ligula. Etiam in ullamcorper mauris. Vivamus velit lorem, volutpat
          rutrum fermentum id, volutpat sed magna. Nam quis dignissim quam.
        </p>
      </div>
      <!-- {{ linked_medias }} -->
      <div class="m_fragment--medias">
        <MediaContent
          v-for="media in linked_medias"
          :key="media.metaFileName"
          v-model="media.content"
          :context="'edit'"
          :slugFolderName="slugFolderName"
          :media="media"
        />
      </div>

      <AddMedias
        :slugFolderName="slugFolderName"
        @newMediaCreated="newMediaCreated"
      />
    </div>
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

      this.fragment.medias_slugs = medias_slugs;

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
  // margin: 0 var(--spacing);
  // width: 100%;
  max-width: 400px;
  flex: 0 1 100vw;

  overflow-y: auto;
  // columns: 50ch;
  // column-gap: 1em;
  // column-fill: auto;
  // height: 90vh;
  // padding-top: 100px;

  --scrollbarBG: transparent;
  --thumbBG: #90a4ae;

  &::-webkit-scrollbar {
    width: 8px;
  }
  & {
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  }
  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 6px;
    border: 3px solid var(--scrollbarBG);
  }

  .m_fragment--content {
    padding: var(--spacing);
    margin: calc(var(--spacing) * 1) calc(var(--spacing) * 1);

    background-color: #f9f3db;
    background: linear-gradient(
      180deg,
      #fff 50%,
      #f9f3db calc(100% - 1px),
      #000 100%
    );
    // border: 0.5px solid black;

    border-radius: 2px;

    > *:first-child {
      margin-top: 0;
    }
  }

  .m_fragment--medias {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    // grid-gap: var(--spacing);

    > * {
      // display: flex;
      // align-items: center;
      // background-color: #eee;
    }

    // > * {
    //   margin-bottom: var(--spacing);
    //   display: inline-block;
    //   margin: 0;
    //   width: 25%;
    // }
  }
}
</style>
