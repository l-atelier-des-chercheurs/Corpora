<template>
  <div class="m_corpusPreview">
    <div class="m_corpusPreview--title">
      <h2>{{ corpus.name }}</h2>
    </div>
    <div class="m_corpusPreview--subtitle">
      <h3>
        <template v-if="$root.lang.current === 'fr'">
          {{ corpus.subtitle }}
        </template>
        <template v-else-if="$root.lang.current === 'en'">
          {{ corpus.subtitle_en }}
        </template>
      </h3>
    </div>

    <div class="m_corpusPreview--time">
      <time>
        {{ $t("created_on") }}&nbsp;{{
          $root.formatDateToHuman(corpus.date_created)
        }}
      </time>
      <br />
      <time>
        {{ $t("last_edited_on") }}&nbsp;{{
          $root.formatDateToHuman(corpus.date_modified)
        }}
      </time>
    </div>
    <!-- <div class="m_corpusPreview--description">
      <p v-html="corpus.description" />
    </div> -->
    <div v-if="previewURL" class="m_corpusPreview--preview">
      <img :src="previewURL" class draggable="false" />
    </div>

    <div class="m_corpusPreview--options">
      <div
        class
        v-if="
          can_access_corpus &&
          corpus.password === 'has_pass' &&
          context !== 'full'
        "
      >
        <label>{{ $t("protected_by_pass") }}</label>
      </div>
      <button
        v-if="!can_access_corpus"
        type="button"
        class="buttonLink _open_pwd_input"
        :class="{ 'is--active': showInputPasswordField }"
        style
        :readonly="read_only"
        @click="showInputPasswordField = !showInputPasswordField"
      >
        {{ $t("password_required_to_edit") }}
      </button>

      <div
        class="padding-verysmall _pwd_input"
        v-if="showInputPasswordField && !can_access_corpus"
      >
        <div class="margin-bottom-small">
          <label>{{ $t("password") }}</label>
          <input
            type="password"
            ref="passwordField"
            @keydown.enter.prevent="submitPassword"
            required
            autofocus
            placeholder="…"
          />
        </div>
        <!-- <div class="switch switch-xs margin-bottom-small">
                <input
                  type="checkbox"
                  class="switch"
                  id="remember_corpus_password_for_this_device"
                  v-model="remember_corpus_password_for_this_device"
                />
                <label
                  for="remember_corpus_password_for_this_device"
                >{{ $t('remember_corpus_password_for_this_device') }}</label>
        </div>-->

        <button
          type="button"
          class="button bg-bleuvert button-thin"
          @click="submitPassword"
        >
          {{ $t("send") }}
        </button>
      </div>

      <div v-if="can_access_corpus && corpus_password" class="m_metaField">
        <button
          type="button"
          @click="showCurrentPassword = !showCurrentPassword"
          v-html="
            !showCurrentPassword ? $t('show_password') : $t('hide_password')
          "
        />
        <div v-if="showCurrentPassword && can_access_corpus">
          {{ corpus_password }}
        </div>
      </div>
      <router-link
        :to="{
          name: 'Corpus',
          params: { slugFolderName: corpus.slugFolderName },
        }"
        class="button"
        v-html="$t('open')"
      />
      <button
        type="button"
        v-if="can_access_corpus"
        @click="show_edit_corpus_for = true"
      >
        {{ $t("edit") }}
      </button>

      <EditCorpus
        v-if="show_edit_corpus_for"
        :corpus="corpus"
        :corpus_password="corpus_password"
        :slugCorpusName="corpus.slugFolderName"
        @close="show_edit_corpus_for = false"
      />

      <button
        type="button"
        v-if="can_access_corpus"
        @click="removeThisCorpus()"
      >
        {{ $t("remove") }}
      </button>
    </div>
  </div>
</template>
<script>
import EditCorpus from "../components/modals/EditCorpus.vue";

export default {
  props: {
    corpus: Object,
  },
  components: {
    EditCorpus,
  },
  data() {
    return {
      show_edit_corpus_for: false,
      showInputPasswordField: false,
      showCurrentPassword: true,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    previewURL() {
      if (
        !this.corpus.hasOwnProperty("preview") ||
        this.corpus.preview === ""
      ) {
        return false;
      }
      const thumb = this.corpus.preview.filter((p) => p.size === 640);
      if (thumb.length > 0) {
        return `${thumb[0].path}`;
      }
      return false;
    },
    can_access_corpus() {
      return this.$root.canAccessFolder({
        type: "corpus",
        slugFolderName: this.corpus.slugFolderName,
      });
    },
    corpus_password() {
      const corpus_password = this.$auth.getFoldersPasswords();

      if (
        corpus_password.hasOwnProperty("corpus") &&
        corpus_password["corpus"].hasOwnProperty(this.corpus.slugFolderName) &&
        this.corpus.password === "has_pass"
      ) {
        return corpus_password["corpus"][this.corpus.slugFolderName];
      }
      return "";
    },
  },
  methods: {
    submitPassword() {
      console.log("METHODS • Project: submitPassword");

      this.$auth.updateFoldersPasswords({
        corpus: {
          [this.corpus.slugFolderName]: this.$refs.passwordField.value,
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
              this.$t("notifications.wrong_password_for") + this.corpus.name
            );
          this.$refs.passwordField.value = "";
          this.$refs.passwordField.focus();
        } else {
          this.showInputPasswordField = false;
          // this.$root.openCorpus(this.corpus.slugFolderName);
        }
      });
    },

    removeThisCorpus() {
      this.$alertify
        .okBtn(this.$t("yes"))
        .cancelBtn(this.$t("cancel"))
        .confirm(
          this.$t("sure_to_remove_corpus"),
          () => {
            this.$root.removeFolder({
              type: "corpus",
              slugFolderName: this.corpus.slugFolderName,
            });
          },
          () => {}
        );
    },
  },
};
</script>
<style lang="scss" scoped>
.m_corpusPreview {
  border-top: 1px solid var(--color-blue);
  // background: var(--active-color);
  // margin: var(--spacing);
  padding: calc(var(--spacing)) 0;
  // background: white;

  > *:not(:last-child) {
    margin-bottom: calc(var(--spacing) / 2);
  }
}
.m_corpusPreview--title {
  display: block;
  h2 {
    margin-top: 0;
    margin: 0;
    font-size: 1.4rem;
    font-weight: 300;
  }
}
.m_corpusPreview--subtitle {
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
  }
}

.m_corpusPreview--description > p {
  display: block;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // overflow: hidden;
}

.m_corpusPreview--preview {
  max-width: 140px;
}

.m_corpusPreview--options {
  button {
  }
}

.m_corpusPreview--time {
  // font-style: italic;
  font-size: var(--font-size-small);
}

.m_corpusPreview--open {
}
</style>
