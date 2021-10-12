<template>
  <Modal
    @close="$emit('close')"
    @submit="newCollection"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <span class>{{ $t("create_a_collection") }}</span>
    </template>

    <template slot="sidebar">
      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("name") }}</label>
        <input
          type="text"
          class
          v-model.trim="collectiondata.title"
          required
          autofocus
        />
      </div>
    </template>
    <template slot="submit_button">{{ $t("create") }}</template>
  </Modal>
</template>
<script>
export default {
  props: {
    slugFolderName: String,
    collections: Array,
  },
  components: {},
  data() {
    return {
      collectiondata: {
        title: "",
      },
      askBeforeClosingModal: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    newCollection: function (event) {
      console.log("newCollection");

      // TODO check for conflicts

      this.is_sending_content_to_server = true;

      const title = this.collectiondata.title;

      this.$root
        .createMedia({
          type: "corpus",
          slugFolderName: this.slugFolderName,
          additionalMeta: {
            type: "collection",
            title,
          },
        })
        .then((mdata) => {
          this.is_sending_content_to_server = false;
          this.$emit("openCollection", mdata.metaFileName);
          this.$emit("close", "");
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
