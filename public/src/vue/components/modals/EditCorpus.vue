<template>
  <Modal
    @close="$emit('close')"
    @submit="editThiscorpus"
    :read_only="read_only"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <div class>{{ $t("edit_corpus") }}</div>
    </template>

    <template slot="sidebar">
      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("corpus_name") }}</label>
        <input
          type="text"
          v-model.trim="corpusdata.name"
          required
          autofocus
          :readonly="read_only"
        />
      </div>

      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("subtitle") }}</label>
        <input type="text" v-model.trim="corpusdata.subtitle" />
      </div>

      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("description") }}</label>
        <!-- <textarea v-model.trim="corpusdata.description" @keydown.enter.stop /> -->
        <CollaborativeEditor v-model="corpusdata.description" />
      </div>

      <!-- Preview -->
      <div class="margin-bottom-small">
        <label>
          <button
            type="button"
            class="button-nostyle text-uc button-triangle"
            :class="{ 'is--active': show_image }"
            @click="show_image = !show_image"
          >
            {{ $t("cover_image") }}
          </button>
        </label>
        <template v-if="show_image">
          <ImageSelect
            :previewURL="previewURL"
            @newPreview="
              (value) => {
                preview_rawdata = value;
              }
            "
          />
        </template>
      </div>

      <!-- Password -->
      <div class="margin-bottom-small">
        <label>
          <button
            type="button"
            class="button-nostyle text-uc button-triangle"
            :class="{ 'is--active': show_password }"
            @click="show_password = !show_password"
          >
            {{ $t("password") }}
          </button>
        </label>
        <template v-if="show_password">
          <input
            type="password"
            v-model="corpusdata.password"
            :readonly="read_only"
          />
          <small>
            <template v-if="!!corpus_password && corpusdata.password === ''">
              {{ $t("removing_password_warning") }}
            </template>
            <template v-else>{{ $t("adding_password_warning") }}</template>
          </small>
        </template>
      </div>
    </template>

    <template slot="submit_button">{{ $t("save") }}</template>
  </Modal>
</template>
<script>
import ImageSelect from "../subcomponents/ImageSelect.vue";
import CollaborativeEditor from "../subcomponents/CollaborativeEditor.vue";

export default {
  props: {
    slugCorpusName: String,
    corpus_password: String,
    corpus: Object,
  },
  components: {
    CollaborativeEditor,
    ImageSelect,
  },
  data() {
    return {
      show_image: !!this.corpus.preview,
      show_password: !!this.corpus_password,

      read_only: false,
      is_sending_content_to_server: false,

      corpusdata: {
        name: this.corpus.name,
        subtitle: this.corpus.subtitle,
        description: this.corpus.description,
        password: this.corpus_password ? this.corpus_password : "",
      },
      tag: "",
      preview_rawdata: undefined,
      askBeforeClosingModal: false,
    };
  },
  watch: {
    corpusdata: {
      handler() {
        this.askBeforeClosingModal = true;
      },
      deep: true,
    },
    preview_rawdata: function () {
      this.askBeforeClosingModal = true;
    },
  },
  mounted() {},
  computed: {
    previewURL() {
      if (
        !this.corpus.hasOwnProperty("preview") ||
        this.corpus.preview === ""
      ) {
        return "";
      }
      const thumb = this.corpus.preview.filter((p) => p.size === 640);
      if (thumb.length > 0) {
        return `${thumb[0].path}`;
      }
      return "";
    },
  },
  methods: {
    editThiscorpus: function (event) {
      console.log("editThiscorpus");

      // only if user changed the name of this folder
      if (this.corpusdata.name !== this.corpus.name) {
        function getAllcorpusNames() {
          let allcorpusName = [];
          for (let slugCorpusName in window.store.corpus) {
            let corpusName = window.store.corpus[slugCorpusName].name;
            allcorpusName.push(corpusName);
          }
          return allcorpusName;
        }
        let allcorpusName = getAllcorpusNames();

        // check if corpus name (not slug) already exists
        if (allcorpusName.indexOf(this.corpusdata.name) >= 0) {
          // invalidate if it does
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t("notifications.corpus_name_exists"));

          return false;
        }
      }

      if (this.preview_rawdata !== undefined) {
        this.corpusdata.preview_rawdata = this.preview_rawdata;
      }

      // check if password and password changed
      if (this.corpusdata.password) {
        this.$auth.updateFoldersPasswords({
          corpus: {
            [this.slugCorpusName]: this.corpusdata.password,
          },
        });
      }

      if (!!this.existing_group_name) {
        if (this.existing_group_name === "_none") this.corpusdata.folder = "";
        else this.corpusdata.folder = this.existing_group_name;
      } else if (!!this.new_group_name) {
        this.corpusdata.folder = this.new_group_name.toUpperCase();
      }

      this.is_sending_content_to_server = true;

      this.$root.editFolder({
        type: "corpus",
        slugFolderName: this.slugCorpusName,
        data: this.corpusdata,
      });

      this.$emit("close", "");
    },
  },
};
</script>
<style></style>
