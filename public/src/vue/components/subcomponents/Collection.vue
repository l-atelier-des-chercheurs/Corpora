<template>
  <div>
    <div class="m_collection">
      <div class="m_collection--presentation">
        <h2>
          {{ collection.title }}
        </h2>
        <div>
          {{ $t("created") }}&nbsp;{{
            $root.formatDateToHuman(collection.date_created).toLowerCase()
          }}
        </div>

        <br />

        <label>{{ $t("description") }}</label>
        // TODO

        <hr />

        <div class="_editFragmentsLabel">
          <label>
            {{ $t("fragments_in_collection") }}
          </label>

          <button type="button" @click="show_selectfragments_modal = true">
            {{ $t("add_remove_fragments") }}
          </button>
        </div>
      </div>
      <SelectFragments
        v-if="show_selectfragments_modal"
        :collection="collection"
        :corpus="corpus"
        :all_keywords="all_keywords"
        :all_tags="all_tags"
        :medias="medias"
        :collection_fragments="collection_fragments"
        :fragments="fragments"
        @addToCollection="addToCollection"
        @changePos="changePos"
        @removeFromCollection="removeFromCollection"
        @close="show_selectfragments_modal = false"
      />
    </div>
  </div>
</template>
<script>
import SelectFragments from "../modals/SelectFragments.vue";
import FragmentContent from "../FragmentContent.vue";
import FragmentsList from "./FragmentsList.vue";

export default {
  props: {
    collection: Object,
    fragments: Array,
    corpus: Object,
    all_tags: Array,
    all_keywords: Array,
    medias: [Boolean, Array],
    collection_fragments: [Boolean, Array],
  },
  components: {
    FragmentContent,
    SelectFragments,
    FragmentsList,
  },
  data() {
    return {
      show_selectfragments_modal: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    addToCollection({ metaFileName, index }) {
      let fragments_slugs = this.collection.fragments_slugs
        ? this.collection.fragments_slugs.slice()
        : [];

      // check if existing and remove if thats the case
      fragments_slugs = fragments_slugs.filter(
        (fs) => fs.metaFileName !== metaFileName
      );

      if (index >= 0)
        fragments_slugs.splice(index, 0, {
          metaFileName,
        });
      else fragments_slugs.push({ metaFileName });
      // else fragments_slugs.unshift({ metaFileName });
      this.updateMedia({ data: { fragments_slugs } });
    },

    changePos({ metaFileName, $event }) {
      const new_pos = Number.parseFloat($event.currentTarget.value) - 1;
      this.addToCollection({ metaFileName, index: new_pos });
    },
    removeFromCollection(metaFileName) {
      let fragments_slugs = this.collection.fragments_slugs
        ? this.collection.fragments_slugs.slice()
        : [];
      fragments_slugs = fragments_slugs.filter(
        (fs) => fs.metaFileName !== metaFileName
      );

      this.updateMedia({ data: { fragments_slugs } });
    },
    updateMedia({ data }) {
      this.is_sending_content_to_server = true;

      this.$root
        .editMedia({
          type: "corpus",
          slugFolderName: this.corpus.slugFolderName,
          slugMediaName: this.collection.metaFileName,
          data,
        })
        .then((mdata) => {
          // setTimeout(() => {
          this.is_sending_content_to_server = false;
          // }, 300);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.m_collection--presentation {
  padding: 0 calc(var(--spacing) * 2);
}

._editFragmentsLabel {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}

.m_fragments {
  padding-top: calc(var(--spacing) / 2);
}
</style>
