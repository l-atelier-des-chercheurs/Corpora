<template>
  <div style="" v-if="corpus">
    <CorpusPwd v-if="!can_access_corpus" :corpus="corpus" />
    <template v-else>
      <WelcomeModal v-if="$root.settings.show_welcome_modal" />

      <div class="m_topBar">
        <div class="m_topBar--content">
          <hgroup>
            <h1 v-if="!!corpus.name">{{ corpus.name }}</h1>
            <h2 v-if="!!corpus.subtitle">{{ corpus.subtitle }}</h2>
          </hgroup>

          <button type="button">{{ $t("guide") }}</button>
          <button type="button">{{ $t("about_corpus") }}</button>
          <button type="button"></button>
        </div>
      </div>

      <router-view
        :fragments="sorted_fragments"
        :context="'edit'"
        :corpus="corpus"
        :all_keywords="all_keywords"
        :all_tags="all_tags"
        :medias="medias"
        :opened_fragment="opened_fragment"
        :slugFolderName="corpus.slugFolderName"
      />

      <div class="m_corpus" ref="corpus">
        <div class="m_corpus--presentation">
          <Infos />

          <div class="m_feedbacks">
            <a
              class="js--openInBrowser"
              target="_blank"
              href="mailto:info@plurality-university.org?subject=feedbacks%20on%20Corpora"
              >{{ $t("feedbacks") }}</a
            >
          </div>

          <div class="m_corpus--presentation--content">
            <div class="margin-bottom-small" v-if="$root.can_admin_corpora">
              <button
                type="button"
                class="button-small"
                @click="show_edit_corpus_for = true"
              >
                {{ $t("edit") }}
              </button>
            </div>
            <EditCorpus
              v-if="show_edit_corpus_for"
              :corpus="corpus"
              :corpus_password="corpus_password"
              :slugCorpusName="corpus.slugFolderName"
              @close="show_edit_corpus_for = false"
            />

            <!-- <div class="m_corpus--presentation--tags">
          <label>{{ $t('keywords') }}</label>
          <button type="button" v-for="(tag, index) in all_tags" :key="index">{{ tag }}</button>
          </div>-->

            <!-- <div class="m_corpus--presentation--contributionModes">
              <label>{{ $t("filter_by_source_of_contribution") }}</label>

              <div class="margin-bottom-verysmall">
                <CollectMode
                  v-model="current_contribution_mode"
                  :is_filter="true"
                />
              </div>

              <div class>
                <button
                  type="button"
                  class="button-small margin-bottom-verysmall"
                  @click="show_create_time_modal = !show_create_time_modal"
                >
                  <template v-if="!show_create_time_modal">{{
                    $t("create_a_source")
                  }}</template>
                  <template v-else>{{ $t("close") }}</template>
                </button>

                <form
                  class
                  v-if="show_create_time_modal"
                  @submit.prevent="createNewMoment"
                >
                  <div class>
                    <label>{{ $t("new_source_name") }}</label>
                    <div class="flex-nowrap align-items-stretch">
                      <input
                        type="text"
                        class
                        v-model.trim="new_source_name"
                        required
                        autofocus
                      />
                      <input
                        type="submit"
                        style="flex: 0 1 0"
                        :disabled="!new_source_name"
                        :value="$t('add')"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="m_corpus--presentation--displayOptions">
              <label>{{ $t("display_options") }}</label>
              <div>
                <div class="input-checkbox">
                  <input
                    type="checkbox"
                    class="switch"
                    id="display_in_tabs"
                    v-model="display_in_tabs"
                  />
                  <label class="no-style" for="display_in_tabs">
                    {{ $t("display_in_tabs") }}
                  </label>
                </div>
                <div class="flex-nowrap">
                  <span>{{ $t("sort_fragments_by") }}&nbsp;</span>
                  <div class="custom-select custom-select_tiny">
                    <select v-model="sort_fragments_by">
                      <option
                        v-for="mode in ['date_created', 'title']"
                        :key="mode"
                        :value="mode"
                      >
                        {{ $t(mode) }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div> -->
          </div>

          <div v-if="previewURL" class="m_corpus--presentation--vignette">
            <img :src="previewURL" class draggable="false" />
          </div>
        </div>

        <FragmentsList
          v-if="fragments"
          :corpus="corpus"
          :all_keywords="all_keywords"
          :all_tags="all_tags"
          :medias="medias"
          :fragments="fragments"
        />
      </div>
    </template>
  </div>
</template>
<script>
import Infos from "../components/Infos.vue";
import CorpusPwd from "../components/modals/CorpusPwd.vue";
import WelcomeModal from "../components/modals/WelcomeModal.vue";
import CollectMode from "../components/subcomponents/CollectMode.vue";
import EditCorpus from "../components/modals/EditCorpus.vue";
import FragmentsList from "../components/subcomponents/FragmentsList.vue";

export default {
  props: {},
  components: {
    Infos,
    CorpusPwd,
    WelcomeModal,
    CollectMode,
    EditCorpus,
    FragmentsList,
  },
  data() {
    return {
      sort_fragments_by: "date_created",

      show_create_time_modal: false,
      new_source_name: "",

      show_edit_corpus_for: false,

      // show_fragments_for: {},
    };
  },
  created() {},
  mounted() {
    if (this.$root.state.connected) this.loadCorpus();
    this.$eventHub.$on("socketio.authentificated", this.loadCorpus);
    this.$eventHub.$on("socketio.reconnect", this.loadCorpus);
  },
  beforeDestroy() {
    this.$eventHub.$off("socketio.authentificated", this.loadCorpus);
    this.$eventHub.$off("socketio.reconnect", this.loadCorpus);
  },
  destroyed() {},
  watch: {},
  computed: {
    corpus() {
      // not convenient : loading corpus can be after listfolders has executed
      // if (
      //   !this.$root.store.hasOwnProperty("corpus") ||
      //   Object.keys(this.$root.store.corpus).length === 0
      // ) {
      //   this.$router.push("/");
      //   return {};
      // }

      // if (
      //   this.$root.store.corpus.hasOwnProperty(
      //     this.$route.params.slugFolderName
      //   )
      // ) {
      return this.$root.store.corpus[this.$route.params.slugFolderName];
      // } else {
      //   this.$router.push("/");
      //   return {};
      // }
    },
    opened_fragment() {
      if (!this.$route.params.fragmentId || !this.fragments) return false;

      return this.fragments.find(
        (f) => f.media_filename === this.$route.params.fragmentId
      );
    },
    can_access_corpus() {
      return this.$root.canAccessFolder({
        type: "corpus",
        slugFolderName: this.$route.params.slugFolderName,
      });
    },
    previewURL() {
      if (
        !this.corpus.hasOwnProperty("preview") ||
        this.corpus.preview === ""
      ) {
        return false;
      }
      const thumb = this.corpus.preview.filter((p) => p.size === 640);
      if (thumb.length > 0) {
        return `/${thumb[0].path}`;
      }
      return false;
    },

    medias() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      // return Object.values(this.corpus.medias);
      return Object.values(this.corpus.medias);
    },
    fragments() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;

      let fragments = Object.values(this.corpus.medias).filter(
        (m) => m.type === "fragment"
      );

      if (this.sort_fragments_by === "date_created") {
        fragments = this.$_.sortBy(fragments, "date_created");
        fragments.reverse();
      } else if (this.sort_fragments_by === "title") {
        fragments.sort((a, b) => a.title.localeCompare(b.title));
      }

      return fragments;
    },
    all_tags() {
      if (!this.sorted_fragments) return [];

      let all_tags = this.sorted_fragments.reduce((acc, f) => {
        if (!!f.tags && Array.isArray(f.tags) && f.tags.length > 0)
          acc = acc.concat(f.tags.map((t) => t.title));
        return acc;
      }, []);

      all_tags = all_tags.filter(function (item, pos) {
        return all_tags.indexOf(item) == pos;
      });

      all_tags.sort((a, b) => a.localeCompare(b));
      return all_tags;
    },
    all_keywords() {
      if (!this.sorted_fragments) return [];

      let all_keywords = this.sorted_fragments.reduce((acc, f) => {
        if (!!f.keywords && Array.isArray(f.keywords) && f.keywords.length > 0)
          acc = acc.concat(f.keywords.map((t) => t.title));
        return acc;
      }, []);

      all_keywords = all_keywords.filter(function (item, pos) {
        return all_keywords.indexOf(item) == pos;
      });

      all_keywords.sort((a, b) => a.localeCompare(b));
      return all_keywords;
    },
  },
  methods: {
    loadCorpus() {
      this.$nextTick(() => {
        this.$socketio.listMedias({
          type: "corpus",
          slugFolderName: this.$route.params.slugFolderName,
        });
      });
    },
    createNewMoment() {
      let contribution_moments =
        this.corpus.hasOwnProperty("contribution_moments") &&
        Array.isArray(this.corpus.contribution_moments)
          ? JSON.parse(JSON.stringify(this.corpus.contribution_moments))
          : [];

      // check if moment already exists
      if (contribution_moments.some((m) => m.name === this.new_source_name)) {
        this.$alertify
          .closeLogOnClick(true)
          .delay(4000)
          .success(this.$t("moment_already_exists") + this.author.name);
      }

      contribution_moments.push({
        name: this.new_source_name,
      });

      this.$root.editFolder({
        type: "corpus",
        slugFolderName: this.corpus.slugFolderName,
        data: {
          contribution_moments,
        },
      });

      this.show_create_time_modal = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.m_corpus {
  scroll-behavior: smooth;

  > * {
    flex: 0 0 auto;
  }

  &::after {
    content: "";
    display: block;
    flex: 0 0 100px;
    height: 100%;
  }
}

.m_corpus--presentation {
  // position: absolute;
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 2);
  // margin-right: calc(var(--spacing) * 2);
  z-index: 1;
  // in case of very small height of viewport
  // max-height: 100vh;
  // max-width: 52ch;
  overflow-y: auto;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  > * {
    margin-bottom: calc(var(--spacing));
  }

  .m_corpus--presentation--content {
  }
}

.m_corpus--presentation--name {
  h1 + h3 {
    margin-top: calc(-1 * var(--spacing));
  }
}
.m_corpus--presentation--description,
.m_corpus--presentation--contributionModes,
.m_corpus--presentation--displayOptions {
  margin-bottom: calc(var(--spacing) * 1.5);
}

.m_corpus--presentation--contributionModes,
.m_corpus--presentation--displayOptions {
  padding: calc(var(--spacing) / 2);
  background-color: #c0d1d5;
  border-radius: 4px;

  button,
  .button {
    background-color: var(--color-white);
  }

  > div {
    // border-left: 2px solid var(--body-bg);
    // padding-left: calc(var(--spacing) / 2);

    > *:last-child {
      margin-bottom: 0;
    }

    .custom-select {
      margin: 0;
    }
  }
}

.m_corpus--presentation--vignette {
  max-width: 240px;
  margin-bottom: 0;
  flex: 0 0 140px;

  img {
    object-fit: scale-down;
  }
}

.m_feedbacks {
  position: fixed;
  bottom: var(--spacing);
  right: 50px;
  background-color: var(--color-black);
  color: white;
  margin: 0;
  padding: calc(var(--spacing) / 2) var(--spacing);
  border-radius: 24px;
  z-index: 10000;

  a {
    color: inherit;
  }
}

.m_topBar {
  width: 100%;
  padding: 0 calc(var(--spacing) * 2);
}
.m_topBar--content {
  padding: calc(var(--spacing) * 2) 0;
  border-bottom: 2px solid var(--color-bluegreen);

  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 3);

  h1,
  h2 {
    margin-top: 0;
    margin-bottom: 0;
  }

  hgroup {
    // padding-right: calc(var(--spacing) * 2);
  }

  button {
    background: inherit;
    font-family: inherit;
    font-size: 1.5rem;
    line-height: 1.09;
  }

  > *:last-child {
    margin-right: 0;
    flex: 1;
    text-align: right;
  }
}
</style>
