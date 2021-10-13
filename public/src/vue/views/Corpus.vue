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
          <div class="margin-sides-medium">
            <div class="margin-vert-small">
              <div class="custom-select">
                <select v-model="new_lang">
                  <option
                    v-for="lang in this.$root.lang.available"
                    :key="lang.key"
                    :value="lang.key"
                  >
                    {{ lang.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
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

            <div class="m_corpus--description margin-bottom-small">
              <label>{{ $t("description") }}</label>

              <p v-html="corpus.description" />
            </div>

            <div class="m_corpus--collections">
              <label for="fragments-search">{{ $t("collections") }}</label>

              <button
                type="button"
                @click="show_create_collection_modal = true"
              >
                {{ $t("create_a_collection") }}
              </button>
              <button
                type="button"
                v-for="collection in sorted_collections"
                :key="collection.media_filename"
                class="m_corpus--collections--coll"
                :class="{
                  'is--active':
                    show_collection_meta === collection.media_filename,
                }"
                @click="openCollection(collection.media_filename)"
              >
                {{ collection.title }}
              </button>
            </div>

            <div class="m_corpus--search">
              <label for="fragments-search">{{
                $t("search_in_fragments")
              }}</label>
              <div class="flex-nowrap">
                <input
                  type="search"
                  id="fragments-search"
                  v-model="debounce_search_filter"
                  :aria-label="$t('search_in_fragments')"
                />

                <span
                  class="input-addon"
                  v-if="debounce_search_filter.length > 0"
                >
                  <button
                    type="button"
                    :disabled="debounce_search_filter.length === 0"
                    @click="debounce_search_filter = ''"
                  >
                    ×
                  </button>
                </span>
              </div>

              <div class="custom-select custom-select_tiny">
                <select v-model="search_type">
                  <option
                    v-for="st in search_type_available"
                    :key="st"
                    :value="st"
                  >
                    {{ $t(st) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="m_corpus--keywords">
              <label for="fragments-search">{{ $t("keywords") }}</label>

              <div class="m_keywordField m_keywordField_keywords">
                <button
                  type="button"
                  class="tag"
                  v-for="keyword in all_keywords"
                  :key="keyword"
                  @click="setKeywordFilter(keyword)"
                  :class="{
                    'is--active':
                      search_type === 'keywords' && keyword === search_filter,
                  }"
                >
                  {{ keyword }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="previewURL" class="m_corpus--presentation--vignette">
            <img :src="previewURL" class draggable="false" />
          </div>

          <hr />
          <Infos />
        </div>

        <transition name="fade" :duration="200" mode="out-in">
          <div class="m_corpus--fragments" :key="show_collection_meta">
            <Collection
              v-if="shown_collection"
              :corpus="corpus"
              :collection="shown_collection"
              :fragments="filtered_fragments"
              :all_keywords="all_keywords"
              :all_tags="all_tags"
              :medias="medias"
            />

            <template v-else>
              <div
                v-if="search_filter !== '' && filtered_fragments.length === 0"
                class="m_corpus--fragments--notice"
              >
                {{ $t("no_results") }}
              </div>
              <FragmentsList
                v-else
                :corpus="corpus"
                :all_keywords="all_keywords"
                :all_tags="all_tags"
                :medias="medias"
                :fragments="filtered_fragments"
              />
            </template>
          </div>
        </transition>
      </div>

      <CreateCollection
        v-if="show_create_collection_modal"
        :collections="collections"
        :slugFolderName="corpus.slugFolderName"
        @close="show_create_collection_modal = false"
        @openCollection="openCollection"
      />
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
import CreateCollection from "../components/modals/CreateCollection.vue";
import Collection from "../components/subcomponents/Collection.vue";

export default {
  props: {},
  components: {
    Infos,
    CorpusPwd,
    WelcomeModal,
    CollectMode,
    EditCorpus,
    FragmentsList,
    CreateCollection,
    Collection,
  },
  data() {
    return {
      sort_fragments_by: "date_created",

      show_create_time_modal: false,
      new_source_name: "",

      show_edit_corpus_for: false,

      new_lang: this.$root.lang.current,

      search_filter: "",
      debounce_search_filter: "",
      debounce_search_filter_function: undefined,

      search_type: "title",
      search_type_available: ["title", "keywords"],

      show_create_collection_modal: false,
      show_collection_meta: false,

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
  watch: {
    debounce_search_filter: function () {
      if (this.debounce_search_filter_function)
        clearTimeout(this.debounce_search_filter_function);
      this.debounce_search_filter_function = setTimeout(() => {
        this.search_filter = this.debounce_search_filter;
      }, 500);
    },
    new_lang() {
      this.$root.updateLocalLang(this.new_lang);
    },
    search_filter() {
      this.setQueryURLFromSearch();
    },
    search_type() {
      this.setQueryURLFromSearch();
    },
    show_collection_meta() {
      this.setQueryURLFromCollection();
    },

    $route: {
      handler(to) {
        if (this.$route.query) {
          this.debounce_search_filter = this.search_filter =
            this.$route.query.search_for || "";
          if (this.$route.query.search_in)
            this.search_type = this.$route.query.search_in;
          if (this.$route.query.collection)
            this.show_collection_meta = this.$route.query.collection;
        }
      },
      immediate: true,
    },
  },
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
      if (!this.$route.params.fragmentId || !this.sorted_fragments)
        return false;

      return this.sorted_fragments.find(
        (f) => f.media_filename === this.$route.params.fragmentId
      );
    },

    shown_collection() {
      return (
        this.sorted_collections &&
        this.sorted_collections.find(
          (c) => c.media_filename === this.show_collection_meta
        )
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
    sorted_collections() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;

      let collections = Object.values(this.corpus.medias).filter(
        (m) => m.type === "collection"
      );
      collections = this.$_.sortBy(collections, "date_created");
      collections.reverse();

      return collections;
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
      if (!this.sorted_fragments) return false;

      return this.sorted_fragments.filter((f) => {
        const sf = this.search_filter.toLowerCase();

        if (sf === "") return true;
        else if (this.search_type === "title")
          return f.title.toLowerCase().includes(sf);
        else if (this.search_type === "keywords")
          return (
            f.keywords && f.keywords.find((k) => k.title.toLowerCase() === sf)
          );

        return false;
      });
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
    openCollection(media_filename) {
      this.show_collection_meta =
        this.show_collection_meta === media_filename ? false : media_filename;
    },
    setKeywordFilter(kw) {
      if (this.search_filter === kw && this.search_type === "keywords")
        return (this.debounce_search_filter = this.search_filter = "");
      this.search_type = "keywords";
      this.debounce_search_filter = this.search_filter = kw;
    },
    setQueryURLFromSearch() {
      if (
        this.$route.query.search_for === this.search_filter &&
        this.$route.query.search_in === this.search_type
      )
        return;

      let query = this.$route.query || {};
      if (this.search_filter !== "") {
        query.search_for = this.search_filter;
        query.search_in = this.search_type;
      }
      this.$router.push({
        query,
      });
    },
    setQueryURLFromCollection() {
      if (this.$route.query.collection === this.show_collection_meta) return;

      let query = this.$route.query || {};

      if (this.show_collection_meta)
        (query.collection = this.show_collection_meta),
          this.$router.push({
            query,
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

  display: flex;
  flex-flow: row nowrap;
  > * {
    flex: 0 0 auto;

    &.m_corpus--presentation {
      flex: 0 1 380px;
      order: 2;
    }

    &.m_corpus--fragments {
      flex: 1 1 600px;
    }
  }
}

.m_corpus--fragments--notice {
  padding: calc(var(--spacing) * 2);
  text-align: center;
  color: var(--color-gray);
}

.m_corpus--fragments--collection {
  padding: calc(var(--spacing) * 2);
}

.m_corpus--presentation {
  // position: absolute;
  // margin-right: calc(var(--spacing) * 2);
  z-index: 1;
  // in case of very small height of viewport
  // max-height: 100vh;
  // max-width: 52ch;
  overflow-y: auto;
  padding: 0 calc(var(--spacing) * 2);
  // padding: 0;
  margin: calc(var(--spacing) * 2) 0;
  border-left: 2px solid var(--color-bluegreen);
  // text-align: right;

  // display: flex;
  // flex-flow: column nowrap;
  // justify-content: space-between;
  .m_corpus--presentation--content {
    // text-align: right;
    > * {
      margin-bottom: calc(var(--spacing));
    }
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

  .custom-select {
    margin-right: 0;
    margin-left: auto;
    width: 90px;
    select {
      margin-left: auto;
      margin-right: 0;
    }
  }
}

.m_corpus--search {
  select {
    margin: calc(var(--spacing) / 4) 0;
  }
}

.m_corpus--collections--coll {
  // background-color: transparent;
  // background-color: var(--color-beige);

  border-radius: 8px;
  display: block;
  padding: calc(var(--spacing) / 2) calc(var(--spacing));
  margin: calc(var(--spacing) / 2) 0;

  &::before {
    content: ">";
  }
}
</style>
