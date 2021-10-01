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

          <button type="button">guide d’utilisation</button>
          <button type="button">à propos</button>
          <button type="button">mon compte</button>
        </div>
      </div>

      <router-view></router-view>

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
            <div class="m_corpus--presentation--name">
              <h1 v-if="!!corpus.name">{{ corpus.name }}</h1>
              <h3 v-if="!!corpus.subtitle">{{ corpus.subtitle }}</h3>
            </div>

            <div
              class="m_corpus--presentation--description mediaTextContent"
              v-html="corpus.description"
            />

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

            <div class="m_corpus--presentation--contributionModes">
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
            </div>
          </div>

          <div v-if="previewURL" class="m_corpus--presentation--vignette">
            <img :src="previewURL" class draggable="false" />
          </div>
        </div>

        <transition-group class="m_corpuses" name="list-complete" tag="div">
          <div class="m_corpuses--createFragment" key="createFragment">
            <button
              type="button"
              class="m_corpuses--createFragment--addFragmentButton"
              @click="show_create_fragment = !show_create_fragment"
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                style="enable-background: new 0 0 24 24"
                xml:space="preserve"
              >
                <path
                  style="fill: currentColor"
                  d="M0,10.5h10.5V0h2.9v10.5H24v2.9H13.5V24h-2.9V13.5H0V10.5z"
                />
              </svg>
              <label>{{ $t("create_a_story") }}</label>
            </button>
            <CreateFragment
              v-if="show_create_fragment"
              :corpus="corpus"
              :all_keywords="all_keywords"
              :all_tags="all_tags"
              :current_contribution_mode="current_contribution_mode"
              @close="show_create_fragment = false"
            />
          </div>

          <FragmentContent
            v-for="fragment in filtered_fragments"
            :key="fragment.metaFileName"
            :context="'preview'"
            :corpus="corpus"
            :all_keywords="all_keywords"
            :all_tags="all_tags"
            :medias="medias"
            :fragment="fragment"
            :fragment_width="fragment_width"
            :slugFolderName="corpus.slugFolderName"
          />
        </transition-group>
      </div>
    </template>
  </div>
</template>
<script>
import Infos from "../components/Infos.vue";
import CorpusPwd from "../components/modals/CorpusPwd.vue";
import WelcomeModal from "../components/modals/WelcomeModal.vue";
import FragmentContent from "../components/FragmentContent.vue";
import CreateFragment from "../components/modals/CreateFragment.vue";
import CollectMode from "../components/subcomponents/CollectMode.vue";
import EditCorpus from "../components/modals/EditCorpus.vue";

export default {
  props: {},
  components: {
    Infos,
    CorpusPwd,
    WelcomeModal,
    FragmentContent,
    CreateFragment,
    CollectMode,
    EditCorpus,
  },
  data() {
    return {
      sort_fragments_by: "date_created",

      show_create_fragment: false,
      new_fragment_name: "",
      new_fragment_tag: "",
      new_fragment_tag_custom: "",
      corpus_scroll_left: 0,

      show_create_time_modal: false,
      new_source_name: "",
      current_contribution_mode: "",

      show_edit_corpus_for: false,

      // show_fragments_for: {},
    };
  },
  created() {},
  mounted() {
    if (this.$root.state.connected) this.loadCorpus();
    this.$eventHub.$on("socketio.authentificated", this.loadCorpus);
    this.$eventHub.$on("socketio.reconnect", this.loadCorpus);
    this.$eventHub.$on("scrollCorpus", this.scrollCorpus);
  },
  beforeDestroy() {
    this.$eventHub.$off("socketio.authentificated", this.loadCorpus);
    this.$eventHub.$off("socketio.reconnect", this.loadCorpus);
    this.$eventHub.$off("scrollCorpus", this.scrollCorpus);
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
    fragment_width() {
      return Math.min(325, this.$root.settings.windowWidth * 0.9);
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
    sorted_fragments() {
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
    filtered_fragments() {
      let fragments = this.sorted_fragments;

      // if current_contribution_mode is set
      // if current_contribution_mode === online, then we retrieve only fragments that don’t have contribution_moment
      if (this.current_contribution_mode !== "") {
        fragments = fragments.filter((f) => {
          if (
            this.current_contribution_mode === "online" ||
            this.current_contribution_mode === ""
          )
            return (
              !f.hasOwnProperty("contribution_moment") ||
              f.contribution_moment === "online" ||
              f.contribution_moment === ""
            );
          return f.contribution_moment === this.current_contribution_mode;
        });
      }

      return fragments;
    },
    tags_with_fragments() {
      // get all tags from fragments
      if (!this.sorted_fragments) return [];

      // get all tags
      let fragments_by_tag = this.all_tags.map((tag) => {
        const fragments_for_tag = this.filtered_fragments.filter(
          (f) =>
            !!f.tags &&
            Array.isArray(f.tags) &&
            f.tags.some((t) => t.title === tag)
        );

        return {
          tag,
          fragments: fragments_for_tag,
        };
      });

      // append all fragments
      const fragments_with_no_tags = this.filtered_fragments.filter(
        (f) => !f.tags || !Array.isArray(f.tags) || f.tags.length === 0
      );

      if (fragments_with_no_tags.length > 0) {
        fragments_by_tag.push({
          tag: "",
          fragments: fragments_with_no_tags,
        });
      }

      // fragments_by_tag.sort((a, b) => a.tag.localeCompare(b.tag));
      // fragments_by_tag = this.$_.sortBy(fragments_by_tag, "tag");

      return fragments_by_tag;
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
      debugger;
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

.m_corpuses {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  /* grid-auto-rows: max-content; */
  grid-gap: calc(var(--spacing) * 2.5) calc(var(--spacing) * 2);
  padding: 0 calc(var(--spacing) * 2) calc(var(--spacing) * 2);
}

.m_corpuses--createFragment {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  margin: calc(var(--spacing) * 1.9) 0;

  .m_corpuses--createFragment--addFragmentButton {
    color: black;
    background: transparent;
    text-align: center;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;

    svg {
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      padding: 0.5em;
      font-size: 2em;
      width: 2em;
      height: 2em;
      border-radius: 50%;
    }

    label {
      padding: 1em;
    }
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
  gap: calc(var(--spacing) * 4);

  h1,
  h2 {
    margin-top: 0;
    margin-bottom: 0;
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
