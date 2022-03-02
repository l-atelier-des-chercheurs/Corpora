<template>
  <div>
    <div class="m_collection">
      <div class="m_collection--presentation">
        <button type="button" class="_closeButton" @click="$emit('close')">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="25"
            height="25"
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

        <div class="_titleBar">
          <h2>
            <template v-if="!rename_coll">
              {{ collection.title }}
            </template>
          </h2>
          <form v-if="rename_coll" @submit.prevent="submitNewCollName">
            <input type="text" v-model="new_coll_name" />
            <div>
              <button type="button" @click="rename_coll = false">
                {{ $t("cancel") }}
              </button>
              <button type="submit">
                {{ $t("save") }}
              </button>
            </div>
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

        <div class="_buttonRow">
          <button type="button" @click="edit_coll = !edit_coll">
            {{ $t("edit") }}
          </button>
          <template v-if="edit_coll">
            <button type="button" @click="rename_coll = !rename_coll">
              {{ $t("rename") }}
            </button>
            <button type="button" @click="removeCollection">
              {{ $t("remove") }}
            </button>
          </template>
        </div>

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
      show_advanced_meta: false,
      rename_coll: false,
      new_coll_name: "",
      edit_coll: false,
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
  // padding: 0 calc(var(--spacing) * 2);
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
  position: absolute;
  right: 0;
  top: 0;
}

input {
  background: white;
}

._description {
  margin-left: calc(var(--spacing) / -4);
}
</style>
