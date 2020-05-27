<template>
  <Modal
    @close="$emit('close')"
    @submit="newCorpus"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <span class>{{ $t("create_a_corpus") }}</span>
    </template>

    <template slot="sidebar">
      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("corpus_name") }}</label>
        <input type="text" class v-model.trim="corpusdata.name" required autofocus />
      </div>

      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("subtitle") }}</label>
        <input type="text" v-model.trim="corpusdata.subtitle" />
      </div>

      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("description") }}</label>
        <CollaborativeEditor v-model="corpusdata.description" />
      </div>

      <!-- Preview -->
      <div class="margin-bottom-small">
        <label>{{ $t("cover_image") }}</label>
        <ImageSelect
          @newPreview="
              value => {
                preview = value;
              }
            "
        />
      </div>

      <!-- Password -->
      <div class="margin-bottom-small">
        <label>{{ $t("password") }}</label>
        <div>
          <input type="password" v-model="corpusdata.password" autocomplete="new-password" />
        </div>
      </div>
    </template>

    <template slot="submit_button">{{ $t("create") }}</template>
  </Modal>
</template>
<script>
import Modal from "./BaseModal.vue";
import ImageSelect from "../subcomponents/ImageSelect.vue";
import CollaborativeEditor from "../subcomponents/CollaborativeEditor.vue";

export default {
  props: {},
  components: {
    Modal,
    ImageSelect,
    CollaborativeEditor
  },
  data() {
    return {
      show_folder: !!this.$root.settings.opened_folder,
      show_image: false,
      show_password: false,
      show_keywords: false,
      show_authors: false,

      is_sending_content_to_server: false,

      existing_group_name: !!this.$root.settings.opened_folder
        ? this.$root.settings.opened_folder
        : "_none",
      new_group_name: "",

      corpusdata: {
        name: "",
        subtitle: "",
        description: "",
        password: "",
        keywords: []
      },
      preview: undefined,
      askBeforeClosingModal: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    newCorpus: function(event) {
      console.log("newCorpus");

      function getAllCorpusNames() {
        let allCorpusName = [];
        for (let slugCorpusName in window.store.corpus) {
          let projectName = window.store.corpus[slugCorpusName].name;
          allCorpusName.push(projectName);
        }
        return allCorpusName;
      }
      let allCorpusName = getAllCorpusNames();

      // check if project name (not slug) already exists
      if (allCorpusName.indexOf(this.corpusdata.name) >= 0) {
        // invalidate if it does
        this.$alertify
          .closeLogOnClick(true)
          .delay(4000)
          .error(this.$t("notifications.project_name_exists"));

        return false;
      }
      if (!!this.preview) {
        this.corpusdata.preview_rawdata = this.preview;
      }

      this.$eventHub.$on(
        "socketio.folder_created_or_updated",
        this.newFolderCreated
      );

      this.is_sending_content_to_server = true;

      this.$root
        .createFolder({ type: "corpus", data: this.corpusdata })
        .then(fdata => {
          this.is_sending_content_to_server = true;

          if (fdata.password === "has_pass") {
            this.$auth.updateFoldersPasswords({
              corpus: {
                [fdata.slugFolderName]: this.corpusdata.password
              }
            });
            this.$socketio.sendAuth();

            this.$eventHub.$once("socketio.authentificated", () => {
              this.$emit("close", "");
              this.$root.openCorpus(fdata.slugFolderName);
            });
          } else {
            this.$nextTick(() => {
              this.$emit("close", "");
              this.$root.openCorpus(fdata.slugFolderName);
            });
          }
        });
    }
  }
};
</script>
<style></style>
