<template>
  <div class="">
    <label v-if="title">{{ $t(title) }}</label>

    <div v-if="!edit_mode" v-html="content" class="mediaTextContent" />
    <CollaborativeEditor
      class="_editor"
      v-else
      v-model="new_content"
      :placeholder="placeholder"
    />

    <div class="_editText">
      <button
        type="button"
        v-if="allow_editing && !edit_mode"
        @click="edit_mode = true"
      >
        {{ $t(edit_text_btn) }}
      </button>
    </div>

    <div class="_btns margin-vert-verysmall ta-ri">
      <button type="button" v-if="edit_mode" @click="edit_mode = false">
        {{ $t("cancel") }}
      </button>
      <button type="button" @click="save()" v-if="edit_mode">
        {{ $t("save") }}
      </button>
    </div>

    <!-- :help="help ? $t(help) : ''" -->
  </div>
</template>
<script>
import CollaborativeEditor from "./CollaborativeEditor.vue";

export default {
  props: {
    title: String,
    field_name: String,
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "corpus",
    },
    metaFileName: String,
    type2: String,
    slugFolderName: String,
    allow_editing: {
      type: Boolean,
      default: true,
    },
    edit_text_btn: {
      type: String,
      default: "edit_text",
    },
    placeholder: String,
  },
  components: {
    CollaborativeEditor,
  },
  data() {
    return {
      edit_mode: false,
      is_saving: false,
      new_content: this.content,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    edit_mode() {
      if (this.edit_mode) this.new_content = this.content;
    },
    content() {
      this.new_content = this.content;
    },
  },
  computed: {},
  methods: {
    cancel() {
      this.edit_mode = false;
      this.is_saving = false;
      this.new_content = this.content;
    },
    save() {
      this.is_saving = true;

      return Promise.resolve()
        .then(
          this.type2 &&
            this.type2 === "media" &&
            this.$root.editMedia({
              type: this.type,
              slugFolderName: this.slugFolderName,
              slugMediaName: this.metaFileName,
              data: {
                [this.field_name]: this.new_content,
              },
            })
        )
        .then(
          !this.type2 &&
            this.$root.editFolder({
              type: this.type,
              slugFolderName: this.slugFolderName,
              data: {
                [this.field_name]: this.new_content,
              },
            })
        )
        .then(() => {
          this.is_saving = false;
          this.edit_mode = false;
        })
        .catch(() => {
          this.is_saving = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
._editor {
  background: white;
}
._editText {
  text-align: right;
  font-size: var(--font-size-small);
}
</style>
