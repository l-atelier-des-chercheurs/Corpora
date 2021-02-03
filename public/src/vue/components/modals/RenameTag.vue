<template>
  <Modal
    @close="$emit('close')"
    @submit="renameTag"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <span class>{{ $t("rename_tag") }}</span>
    </template>

    <template slot="sidebar">
      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("current_tag_name") }}</label>
        {{ old_tag }}
      </div>
      <div class="margin-bottom-small">
        <label>{{ $t("new_tag_name") }}</label>
        <input
          type="text"
          class="bold"
          v-model.trim="new_tag"
          required
          autofocus
        />
      </div>
    </template>
    <template slot="submit_button">{{ $t("save") }}</template>
  </Modal>
</template>
<script>
import Modal from "./BaseModal.vue";

export default {
  props: {
    old_tag: String,
    slugFolderName: String,
    fragments: Array,
  },
  components: { Modal },
  data() {
    return {
      new_tag: this.old_tag,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    renameTag() {
      this.new_tag;
      this.fragments;

      if (this.old_tag === this.new_tag) {
        this.$emit("close");
        return;
      }

      // for each fragment for this tag
      this.fragments.map((f) => {
        // get tags
        // remove old_tag
        let tags = f.tags.filter((t) => t.title !== this.old_tag);

        // add new_tag
        tags.push({
          title: this.new_tag,
        });

        this.$root.editMedia({
          type: "corpus",
          slugFolderName: this.slugFolderName,
          slugMediaName: f.metaFileName,
          data: {
            tags,
          },
        });
      });
    },
  },
};
</script>
<style lang="scss"></style>
