<template>
  <div style="" v-if="corpus">
    <CorpusPwd v-if="!can_access_corpus" :corpus="corpus" />
    <template v-else>
      <Bandeau v-if="$root.settings.show_bandeau" />
      <div class="_corpusContainer">
        <main
          class="_corpusContainer--leftCont"
          ref="fragmentPane"
          @scroll="onScroll"
        >
          <NavMenu :corpus="corpus" />
          <h1 v-if="!!corpus.name">
            <router-link
              :to="{
                name: 'Corpus',
                params: { slugFolderName: corpus.slugFolderName },
              }"
              @click.native.prevent="resetFiltersAndScrollTop()"
              event
            >
              {{ corpus.name }}
            </router-link>
          </h1>
          <h2 v-if="!show_collection_meta">
            <template v-if="$root.lang.current === 'fr'">
              {{ corpus.subtitle }}
            </template>
            <template v-else-if="$root.lang.current === 'en'">
              {{ corpus.subtitle_en }}
            </template>
          </h2>

          <div
            class="m_corpus--description margin-bottom-small mediaTextContent"
            v-if="
              ['Corpus', 'Fragment'].includes($route.name) &&
              !show_collection_meta
            "
            v-html="
              $root.lang.current === 'fr'
                ? corpus.description
                : corpus.description_en
            "
          />

          <router-view
            :fragments="sorted_fragments"
            :context="'edit'"
            :corpus="corpus"
            :all_keywords="all_keywords"
            :all_tags="all_tags"
            :medias="medias"
            :opened_fragment="opened_fragment"
            :slugFolderName="corpus.slugFolderName"
            @openCollection="openCollection"
          />

          <div
            class="m_corpus"
            ref="corpus"
            v-if="['Corpus', 'Fragment'].includes($route.name)"
          >
            <transition name="fade" :duration="200" mode="out-in">
              <Loader
                v-if="is_loading_medias"
                class="m_corpus--fragments _localLoader"
              />
              <div
                v-else
                class="m_corpus--fragments"
                :class="{
                  'in--collection': show_collection_meta,
                }"
                :key="show_collection_meta"
              >
                <Collection
                  v-if="shown_collection"
                  :corpus="corpus"
                  :collection="shown_collection"
                  :fragments="sorted_fragments"
                  :all_keywords="all_keywords"
                  :all_tags="all_tags"
                  :medias="medias"
                  :collection_fragments="current_collection_fragments"
                  @close="show_collection_meta = false"
                />

                <div class="">
                  <div class="_indicator m_fragments">
                    <!-- @click="resetFiltersAndScrollTop" -->
                    <div
                      :class="{
                        'text-blue':
                          filtered_fragments.length !== sorted_fragments.length,
                      }"
                    >
                      <template
                        v-if="
                          filtered_fragments.length === sorted_fragments.length
                        "
                      >
                        {{ $t("fragments") }}&nbsp;:
                        {{ filtered_fragments.length }}
                      </template>
                      <template v-else>
                        {{ $t("your_search") }}
                        {{ filtered_fragments.length }}&nbsp;/&nbsp;{{
                          sorted_fragments.length
                        }}
                      </template>
                    </div>

                    <div class="_sortMode" v-if="filtered_fragments.length > 1">
                      <button
                        type="button"
                        :class="{
                          'is--active': sort_fragments_by === 'date_created',
                        }"
                        @click="sort_fragments_by = 'date_created'"
                      >
                        {{ $t("by_creation_date") }}
                      </button>
                      <button
                        type="button"
                        :class="{
                          'is--active': sort_fragments_by === 'title',
                        }"
                        @click="sort_fragments_by = 'title'"
                      >
                        {{ $t("by_title") }}
                      </button>
                    </div>
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
                <div
                  v-if="text_search !== '' && filtered_fragments.length === 0"
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
                  :show_create_button="!shown_collection"
                />
              </div>
            </transition>
          </div>

          <div class="_scrollTop">
            <transition name="slide-up">
              <button
                type="button"
                :title="$t('scroll_to_top')"
                @click="scrollToTop"
                v-if="fragments_pane_scrolled > 150"
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 56.6 50.1"
                  style="enable-background: new 0 0 56.6 50.1"
                  xml:space="preserve"
                  aria-hidden="true"
                  stroke="currentColor"
                  fill="transparent"
                >
                  <g>
                    <path
                      vector-effect="non-scaling-stroke"
                      d="M24.8,49c0,0,5-23.9-22.7-23.9V25C29.9,25,24.8,1.1,24.8,1.1"
                    ></path>
                    <line
                      vector-effect="non-scaling-stroke"
                      x1="1.3"
                      y1="25.1"
                      x2="55.3"
                      y2="25.1"
                    ></line>
                  </g>
                </svg>
              </button>
            </transition>
          </div>

          <footer class="_bottomFooter">
            <small>
              <router-link
                :to="{
                  name: 'Mentions légales',
                }"
                class="button"
                v-html="$t('personal_data_and_legal_notices')"
              />
              <div>
                <div class="margin-sides-medium">
                  <div class="flex-nowrap">
                    Corpora v{{ $root.state.appVersion }}
                    &nbsp;
                    <Admin />
                  </div>
                </div>
              </div>
            </small>
          </footer>
        </main>
        <aside
          class="_corpusContainer--rightCont"
          @click.self="sidebar_is_collapsed = false"
          :class="{
            'is--collapsed': sidebar_is_collapsed && $root.mobile_view,
          }"
        >
          <button
            type="button"
            class="_uncollapseButton"
            v-if="$root.mobile_view"
            @click="sidebar_is_collapsed = !sidebar_is_collapsed"
          >
            <svg
              width="50"
              height="50"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              fill="none"
              stroke-linecap="square"
            >
              <line x1="0" y1="50%" x2="100%" y2="50%" />
              <line x1="75%" y1="25%" x2="100%" y2="50%" />
              <line x1="75%" y1="75%" x2="100%" y2="50%" />
            </svg>
          </button>

          <div class="_corpusContainer--rightCont--container">
            <button
              type="button"
              class="_collapseButton"
              v-if="$root.mobile_view"
              @click="sidebar_is_collapsed = !sidebar_is_collapsed"
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="35"
                height="35"
                style="
                  enable-background: new 0 0 56.6 50.1;
                  transform: rotate(45deg);
                "
                xml:space="preserve"
                aria-hidden="true"
                stroke="currentColor"
                stroke-width="1px"
                fill="transparent"
              >
                <line
                  vector-effect="non-scaling-stroke"
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                />
                <line
                  vector-effect="non-scaling-stroke"
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                />
              </svg>
            </button>
            <Sidebar
              :fragments="fragments"
              :all_keywords="all_keywords"
              :all_tags="all_tags"
              :sorted_collections="sorted_collections"
              :keyword_search.sync="keyword_search"
              :tag_search.sync="tag_search"
              :text_search.sync="text_search"
              :text_search_mode.sync="text_search_mode"
              :show_collection_meta.sync="show_collection_meta"
              @scrollTop="scrollToTop"
              @showCreateCollection="show_create_collection_modal = true"
            />
            <CreateCollection
              v-if="show_create_collection_modal"
              :collections="sorted_collections"
              :slugFolderName="corpus.slugFolderName"
              @close="show_create_collection_modal = false"
              @openCollection="openCollection"
            />
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
<script>
import CorpusPwd from "../components/modals/CorpusPwd.vue";
import Bandeau from "../components/subcomponents/Bandeau.vue";
import CollectMode from "../components/subcomponents/CollectMode.vue";
import FragmentsList from "../components/subcomponents/FragmentsList.vue";
import Collection from "../components/subcomponents/Collection.vue";
import CSS from "../components/subcomponents/CSS.vue";
import NavMenu from "../components/subcomponents/NavMenu.vue";
import Sidebar from "../components/subcomponents/Sidebar.vue";
import CreateCollection from "../components/modals/CreateCollection.vue";

export default {
  props: {},
  components: {
    CorpusPwd,
    Bandeau,
    CollectMode,
    FragmentsList,
    Collection,
    CSS,
    Sidebar,
    CreateCollection,
    NavMenu,
  },
  data() {
    return {
      sort_fragments_by: "date_created",

      show_create_time_modal: false,
      new_source_name: "",

      is_loading_medias: false,

      show_create_collection_modal: false,
      fragments_pane_scrolled: 0,

      text_search: "",
      text_search_mode: "titles_only",
      keyword_search: false,
      tag_search: false,

      sidebar_is_collapsed: true,

      show_collection_meta: false,

      // show_fragments_for: {},
    };
  },
  created() {},
  mounted() {
    if (this.$root.state.connected) this.loadCorpus();
    this.$eventHub.$on("socketio.authentificated", this.loadCorpus);
    this.$eventHub.$on("socketio.reconnect", this.loadCorpus);
    this.$eventHub.$on("openCollection", this.openCollection);
  },
  beforeDestroy() {
    this.$eventHub.$off("socketio.authentificated", this.loadCorpus);
    this.$eventHub.$off("socketio.reconnect", this.loadCorpus);
    this.$eventHub.$off("openCollection", this.openCollection);
  },
  destroyed() {},
  watch: {
    show_collection_meta() {},
    $route: {
      handler() {
        this.$nextTick(() => {
          // this.scrollToTop();
        });
      },
      deep: true,
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
      if (!this.$route.params.fragmentId || !this.fragments) return false;

      return this.fragments.find(
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
    current_collection_fragments() {
      if (!this.show_collection_meta) return false;
      if (
        !this.shown_collection ||
        !this.shown_collection.fragments_slugs ||
        !Array.isArray(this.shown_collection.fragments_slugs)
      )
        return false;

      return this.shown_collection.fragments_slugs.reduce((acc, fs) => {
        const metaFileName = fs.metaFileName;
        const fragment = this.fragments.find(
          (f) => f.metaFileName === metaFileName
        );
        if (fragment) acc.push(fragment);
        return acc;
      }, []);
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
      if (!this.medias) return false;

      let collections = this.medias.filter((m) => m.type === "collection");
      // collections = this.$_.sortBy(collections, "fragments_slugs");
      // collections.reverse();
      collections = collections.sort(function (a, b) {
        const _bc =
          b.fragments_slugs && b.fragments_slugs.length
            ? b.fragments_slugs.length
            : 0;
        const _ac =
          a.fragments_slugs && a.fragments_slugs.length
            ? a.fragments_slugs.length
            : 0;
        return _bc - _ac;
      });

      return collections;
    },

    fragments() {
      if (!this.medias) return false;
      return this.medias.filter((m) => m.type === "fragment");
    },

    sorted_fragments() {
      if (!this.fragments) return false;

      if (this.sort_fragments_by === "date_created")
        return this.$_.sortBy(this.fragments, "date_created").reverse();
      else if (this.sort_fragments_by === "title")
        return this.fragments.sort((a, b) => a.title.localeCompare(b.title));
    },
    filtered_fragments() {
      if (!this.sorted_fragments) return false;

      const searchIsInTitle = (title) =>
        title.toLowerCase().includes(this.text_search.toLowerCase());
      const searchIsInMedias = (f) =>
        this.doFragmentMediasIncludeText({
          fragment_media: f,
          text: this.text_search.toLowerCase(),
        });

      return this.sorted_fragments.filter((f) => {
        if (this.text_search) {
          if (this.text_search_mode === "titles_only")
            if (!searchIsInTitle(f.title)) return false;
          if (this.text_search_mode === "titles_and_contents") {
            if (!searchIsInTitle(f.title) && !searchIsInMedias(f)) return false;
          }
        }

        // if has has keywords search, but no keywords or no keywords match
        if (
          this.keyword_search &&
          (!f.keywords ||
            !f.keywords.some((k) => k.title === this.keyword_search))
        )
          return false;

        if (
          this.tag_search &&
          (!f.tags || !f.tags.some((k) => k.title === this.tag_search))
        )
          return false;

        if (
          this.show_collection_meta &&
          (!this.current_collection_fragments ||
            !this.current_collection_fragments
              .map((_f) => _f.metaFileName)
              .includes(f.metaFileName))
        )
          return false;

        return true;
      });
    },
    all_tags() {
      if (!this.fragments) return [];

      let all_tags = this.fragments.reduce((acc, f) => {
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
      if (!this.fragments) return [];

      let all_keywords = this.fragments.reduce((acc, f) => {
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
      this.is_loading_medias = true;
      this.$nextTick(() => {
        this.$socketio.listMedias({
          type: "corpus",
          slugFolderName: this.$route.params.slugFolderName,
        });
        this.$eventHub.$once(`socketio.corpus.medias_listed`, () => {
          if (this.corpus.corpus_default_view) {
            // only redirect if homepage
            if (
              // this.$route.name === "Corpus" &&
              Object.keys(this.$route.query).length === 0
            )
              this.$router.push({ path: this.corpus.corpus_default_view });
          }
          this.is_loading_medias = false;
        });
      });
    },

    doFragmentMediasIncludeText({ fragment_media, text }) {
      if (
        typeof fragment_media.medias_slugs !== "object" ||
        fragment_media.medias_slugs.length === 0
      )
        return false;

      const fragment_medias = fragment_media.medias_slugs.reduce(
        (acc, item) => {
          const linked_media = this.medias.find(
            (m) => m.metaFileName === item.metaFileName
          );
          if (linked_media) acc.push(linked_media);
          return acc;
        },
        []
      );

      function extractContent(html) {
        return new DOMParser().parseFromString(html, "text/html")
          .documentElement.textContent;
      }

      const all_text_content = fragment_medias.reduce((acc, fm) => {
        if (fm.content) acc += extractContent(fm.content).toLowerCase() + " ";
        if (fm.caption) acc += fm.caption.toLowerCase() + " ";
        if (fm.source) acc += fm.source.toLowerCase() + " ";
        if (fm.description) acc += fm.description.toLowerCase() + " ";

        if (
          Array.isArray(fm.thumbs) &&
          fm.thumbs[0] &&
          fm.thumbs[0].hasOwnProperty("siteData")
        ) {
          if (fm.thumbs[0].siteData.title)
            acc += fm.thumbs[0].siteData.title.toLowerCase() + " ";
          if (fm.thumbs[0].siteData.description)
            acc += fm.thumbs[0].siteData.description.toLowerCase() + " ";
        }

        return acc;
      }, "");

      return all_text_content.includes(text);
    },

    openCollection(media_filename) {
      this.resetFiltersAndScrollTop();
      this.show_collection_meta =
        this.show_collection_meta === media_filename ? false : media_filename;
    },

    scrollToTop() {
      console.log(`Corpus / scrollToTop`);
      this.$refs.fragmentPane.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    resetFiltersAndScrollTop() {
      this.text_search = "";
      this.keyword_search = false;
      this.tag_search = false;
      this.show_collection_meta = false;
      this.scrollToTop();
    },
    onScroll() {
      this.fragments_pane_scrolled = this.$refs.fragmentPane.scrollTop;
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
  min-height: 50vh;

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

.m_corpus--fragments {
  &.in--collection {
    padding: calc(var(--spacing));
    border: 1px solid var(--color-blue);
    border-bottom: 0px solid #000;
  }
}

.m_corpus--fragments--notice {
  padding: calc(var(--spacing) * 2);
  text-align: center;
  color: var(--color-gray);
}

.m_corpus--fragments--sort {
  margin: 0 calc(var(--spacing) * 2);
  padding: calc(var(--spacing) / 2) 0 0;
  // border-bottom: 2px solid var(--color-blue);

  > * {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: calc(var(--spacing));
  }
}

.m_corpus--fragments--sort--filterList {
  > * {
    display: flex;
    gap: calc(var(--spacing) / 2);

    > button {
      // background: var(--color-blue);
      padding: 0 calc(var(--spacing) / 4);
      text-transform: inherit;

      &:hover,
      &:active,
      &:focus {
        background: #f4f4f2;
      }
    }
  }
}

.m_corpus--fragments--collection {
  padding: calc(var(--spacing) * 2);
}

._logo {
  position: absolute;
  top: 5px;
  right: 0px;
  max-width: 317px;
  width: 40vw;
  transform: rotate(4deg);
  // image-rendering: crisp-edges;
}

._bottomFooter {
  border-top: 1px solid var(--color-blue);
  padding: calc(var(--spacing)) 0;
  // margin: 0 calc(var(--spacing));

  display: flex;
  flex-flow: row wrap;
  gap: var(--spacing);
  justify-content: space-between;

  .a,
  .button {
    padding-left: 0;
    text-transform: inherit;
  }

  img {
    width: 100%;
    max-width: 340px;
  }
}

._localLoader {
  position: relative;
  height: 50vh;
}

._corpusContainer {
  height: 100vh;
  width: 100%;

  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;

  > * {
    height: 100%;
  }

  ._corpusContainer--leftCont {
    flex: 1 1 auto;
    padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2);
    overflow-y: auto;

    .app.mobile_view & {
      padding-right: calc(var(--spacing) * 3);
    }
  }

  ._corpusContainer--rightCont {
    flex: 0 0 260px;
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);

    &.is--collapsed {
      transform: translateX(calc(100% - calc(var(--spacing) * 3.5)));
    }

    ._corpusContainer--rightCont--container {
      height: 100%;
      background: var(--body-bg);
      border-left: 1px solid var(--color-blue);
    }

    .app.mobile_view & {
      position: absolute;
      z-index: 10000;
      right: 0;
      width: 100%;
      padding-left: calc(var(--spacing) * 2);
      // padding-top: calc(var(--spacing) * 2);
      // padding-bottom: calc(var(--spacing) * 2);

      ._corpusContainer--rightCont--container {
        // padding-top: 0;

        > * {
          // margin-top: calc(var(--spacing) * -2);
        }
      }
    }
  }
}

._topBar {
  display: block;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
  overflow: visible;
}

h1,
h2 {
  margin-top: calc(var(--spacing) * 1);
  margin-bottom: calc(var(--spacing) * 2);
  pointer-events: none;

  > a {
    pointer-events: auto;
  }
}

h1 {
  position: sticky;
  top: 0;
  z-index: 1001;
}

._indicator {
  font-family: var(--ff-top-level);

  text-align: left;

  > * {
    display: block;
  }
}
._sortMode {
  button {
    display: block;
    padding: 0;
  }
}

._scrollTop {
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;

  button {
    width: 4em;
    height: 4em;
    background-color: var(--color-lightgray);

    box-shadow: 0 0 1rem 1rem var(--color-lightgray),
      0 0 1rem 1rem var(--color-lightgray) inset;
    // padding: calc(var(--spacing) * 1);
    border-radius: 100%;
    margin-bottom: calc(var(--spacing) * 0.5);
    pointer-events: auto;

    svg {
      transform: rotate(90deg);
    }
  }
}

.m_corpus--description {
  padding-left: 0;
}

._uncollapseButton {
  position: absolute;
  right: 100%;
  top: calc(var(--spacing) * 2);
  color: var(--active-color);
}
._collapseButton {
  position: absolute;
  right: calc(var(--spacing) * 1);
  top: calc(var(--spacing) * 1);
}
</style>
