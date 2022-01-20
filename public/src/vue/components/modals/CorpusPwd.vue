<template>
  <Modal
    @close="$emit('close')"
    @submit="submitPassword"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :prevent_close="true"
  >
    <template slot="header">
      <span class>{{ corpus.name }}</span>
    </template>

    <template slot="sidebar">
      <p>{{ $t("enter_password_to_connect") }}</p>

      <div class="margin-bottom-small">
        <!-- <label>{{ $t("password") }}</label> -->
        <PasswordField
          :required="true"
          :placeholder="'…'"
          :field_type="'current-password'"
          :value="pwd"
          @input="(value) => (pwd = value)"
        />
      </div>

      <span
        class="switch switch-xs margin-bottom-small flex-nowrap align-items-stretch"
      >
        <input
          id="remember_password_on_this_device"
          type="checkbox"
          v-model="remember_password_on_this_device"
        />
        <label for="remember_password_on_this_device">
          <small>
            {{ $t("remember_password_on_this_device") }}
          </small>
        </label>
      </span>
    </template>

    <template slot="submit_button">{{ $t("send") }}</template>
  </Modal>
</template>
<script>
export default {
  props: {
    corpus: Object,
  },
  components: {},
  data() {
    return {
      pwd: "",
      remember_password_on_this_device: true,
    };
  },

  created() {},
  mounted() {},
  beforeDestroy() {},

  watch: {},
  computed: {},
  methods: {
    submitPassword() {
      console.log("METHODS • CorpusPwd: submitPassword");

      this.$auth.updateFoldersPasswords({
        corpus: {
          [this.corpus.slugFolderName]: this.pwd,
        },
      });

      this.$socketio.sendAuth();

      // check if password matches or not
      this.$eventHub.$once("socketio.authentificated", () => {
        const has_passworded_folder =
          window.state.list_authorized_folders.filter(
            (f) =>
              f.type === "corpus" &&
              f.allowed_slugFolderNames.includes(this.corpus.slugFolderName)
          );
        if (has_passworded_folder.length === 0) {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(
              this.$t("notifications.wrong_password_for") +
                " " +
                this.corpus.name
            );
          this.pwd = "";
          // this.$refs.passwordField.focus();
        } else {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .success(
              this.$t("notifications.correct_password") + " " + this.corpus.name
            );

          this.$router.push({ path: `/${this.corpus.slugFolderName}` });
        }
      });
    },
  },
};
</script>
<style></style>
