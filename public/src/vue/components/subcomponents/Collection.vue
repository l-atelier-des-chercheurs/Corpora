<template>
  <div class="m_collection">
    <div class="m_collection--presentation">
      <div class="_buttonRow">
        <template v-if="rename_coll">
          <button type="button" @click="rename_coll = false">
            {{ $t("cancel") }}
          </button>
          <button @click="submitNewCollName">
            {{ $t("save") }}
          </button>
          <button type="button" @click="removeCollection">
            {{ $t("remove") }}
          </button>
        </template>
        <template v-else>
          <button type="button" @click="rename_coll = !rename_coll">
            {{ $t("rename") }}
          </button>
          <button type="button" @click="removeCollection">
            {{ $t("remove") }}
          </button>
        </template>

        <button type="button" class="_closeButton" @click="$emit('close')">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="20"
            height="20"
            style="
              enable-background: new 0 0 56.6 50.1;
              transform: rotate(45deg);
            "
            xml:space="preserve"
            aria-hidden="true"
            stroke="currentColor"
            stroke-width="1px"
            fill="transparent"
          >
            <line
              vector-effect="non-scaling-stroke"
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
            />
            <line
              vector-effect="non-scaling-stroke"
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
            />
          </svg>
        </button>
      </div>

      <div class="_titleBar">
        <h2 v-if="!rename_coll">
          <template v-if="!rename_coll">
            {{ collection.title }}
          </template>
        </h2>
        <form v-else @submit.prevent="submitNewCollName">
          <h2>
            <input type="text" v-model="new_coll_name" />
            <input type="submit" style="display: none" />
          </h2>
          <div></div>
        </form>
      </div>
      <div>
        <div
          class="_meta"
          v-if="false"
          @click="show_advanced_meta = !show_advanced_meta"
        >
          <template v-if="!show_advanced_meta">
            {{ $t("created") }}&nbsp;•
            {{ $root.formatDateToPrecise(collection.date_created) }}
          </template>
          <template v-else>
            <div>
              {{ $t("created") }}&nbsp;•
              {{ $root.formatDateToPrecise(collection.date_created) }}
            </div>
            <div>
              {{ $t("edited") }}&nbsp;•
              {{ $root.formatDateToPrecise(collection.date_modified) }}
            </div>
          </template>
        </div>
      </div>

      <TextField
        :field_name="'collection_description'"
        class="_description"
        :content="collection.collection_description"
        type2="media"
        :metaFileName="collection.metaFileName"
        :slugFolderName="corpus.slugFolderName"
        :allow_editing="true"
      />
    </div>
    <SelectFragments
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
    />
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
      show_advanced_meta: false,
      rename_coll: false,
      new_coll_name: "",
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    rename_coll() {
      if (this.rename_coll) this.new_coll_name = this.collection.title;
    },
  },
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
    removeCollection() {
      this.$alertify
        .okBtn(this.$t("yes"))
        .cancelBtn(this.$t("cancel"))
        .confirm(this.$t("sure_to_remove_collection"), () => {
          this.$root.removeMedia({
            type: "corpus",
            slugFolderName: this.corpus.slugFolderName,
            slugMediaName: this.collection.metaFileName,
          });

          let query = Object.assign({}, this.$route.query) || {};
          delete query.collection;
          this.$router.push({
            query,
            params: { savePosition: true },
          });
        });
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
      return new Promise((resolve, reject) => {
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
      });
    },
    submitNewCollName() {
      this.updateMedia({
        data: {
          title: this.new_coll_name,
        },
      });

      this.rename_coll = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.m_collection--presentation {
  position: relative;

  border: 1px solid var(--color-blue);
  padding: calc(var(--spacing) * 1);
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

._titleBar {
  // display: flex;
  // flex-flow: row nowrap;
  // align-items: flex-start;
  // justify-content: space-between;

  h2 {
    margin-top: 0;
  }
}

._closeButton {
  // position: absolute;
  // right: 0;
  // top: 0;
  line-height: 0;
}

input {
  background: white;
}

._description {
  margin-left: calc(var(--spacing) / -4);
}

._buttonRow {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  line-height: 0;

  font-size: var(--font-size-small);

  button {
    text-transform: lowercase;
  }
}
</style>
