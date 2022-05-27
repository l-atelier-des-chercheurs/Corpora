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
                query: $route.query ? $route.query : {},
                params: { slugFolderName: corpus.slugFolderName },
              }"
              @click.native.prevent="resetFiltersAndScrollTop()"
              event
            >
              <svg
                class="_logo"
                viewBox="0 0 939.15 126.77"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <linearGradient
                  id="a"
                  gradientUnits="userSpaceOnUse"
                  x1="922.09"
                  x2="152.72"
                  y1="-119"
                  y2="41.19"
                >
                  <stop offset="0" stop-color="#dab9d7" />
                  <stop offset=".09" stop-color="#ddb1c7" />
                  <stop offset=".72" stop-color="#f57a53" />
                  <stop offset="1" stop-color="#ff6426" />
                </linearGradient>
                <linearGradient
                  id="b"
                  x1="926.97"
                  x2="157.61"
                  xlink:href="#a"
                  y1="-95.53"
                  y2="64.66"
                />
                <linearGradient
                  id="c"
                  x1="935.46"
                  x2="166.09"
                  xlink:href="#a"
                  y1="-54.79"
                  y2="105.41"
                />
                <linearGradient
                  id="d"
                  x1="935.21"
                  x2="165.85"
                  xlink:href="#a"
                  y1="-55.97"
                  y2="104.23"
                />
                <linearGradient
                  id="e"
                  x1="943.46"
                  x2="174.09"
                  xlink:href="#a"
                  y1="-16.37"
                  y2="143.82"
                />
                <linearGradient
                  id="f"
                  x1="948.75"
                  x2="179.38"
                  xlink:href="#a"
                  y1="9.04"
                  y2="169.23"
                />
                <linearGradient
                  id="g"
                  x1="939.91"
                  x2="170.55"
                  xlink:href="#a"
                  y1="-33.38"
                  y2="126.81"
                />
                <linearGradient
                  id="h"
                  x1="958.57"
                  x2="189.21"
                  xlink:href="#a"
                  y1="56.23"
                  y2="216.42"
                />
                <linearGradient
                  id="i"
                  x1="956.4"
                  x2="187.04"
                  xlink:href="#a"
                  y1="45.81"
                  y2="206"
                />
                <linearGradient
                  id="j"
                  x1="935.3"
                  x2="165.94"
                  xlink:href="#a"
                  y1="-55.53"
                  y2="104.67"
                />
                <linearGradient
                  id="k"
                  x1="932.8"
                  x2="163.43"
                  xlink:href="#a"
                  y1="-67.56"
                  y2="92.63"
                />
                <path
                  d="m19.88 34.7v5.75c0 12.38 7.67 17.26 23.36 19.35l19.53 2.09c25.11 2.96 33.65 11.68 33.65 29.29 0 22.49-19.18 34.7-47.95 34.7-30.51 0-48.47-12.2-48.47-36.96v-6.45h17.96v6.45c0 15.69 9.42 23.02 30.51 23.02s29.64-7.67 29.64-20.75v-7.5c0-11.33-5.4-17.96-21.97-20.23l-20.75-2.44c-23.88-2.96-33.82-9.41-33.82-27.54 0-19.71 16.04-33.48 46.03-33.48s46.03 12.03 46.03 36.96v5.4h-17.78v-5.93c0-14.99-9.41-22.67-28.25-22.67s-27.72 7.15-27.72 20.92z"
                  fill="url(#a)"
                />
                <path
                  d="m117.3 1.92h17.43v59.62c0 1.05.52 2.62 2.62 2.62h57.01c2.09 0 2.62-1.57 2.62-2.62v-59.62h17.43v122.04h-17.43v-52.08c0-.87-.52-2.62-2.62-2.62h-57.01c-2.09 0-2.62 1.74-2.62 2.62v52.08h-17.43z"
                  fill="url(#b)"
                />
                <path
                  d="m308.42 81.06c-.07-.13-.15-.26-.23-.38.13.16.23.35.32.54-.03-.06-.06-.1-.09-.16zm-44.77-1.44h41.31c.16 0 .32-.01.47-.04l-41.77.04z"
                  fill="url(#c)"
                />
                <path
                  d="m355.41 1.92h54.57c22.49 0 35.57 15.52 35.57 39.58s-13.43 38.12-36.96 38.12h-33.13c-2.09 0-2.62 1.74-2.62 2.62v41.73h-17.44v-122.05zm17.44 13.95v56.02c0 1.05.52 2.62 2.62 2.62h30.86c14.82 0 21.27-7.15 21.27-20.75v-16.96c0-12.73-6.97-20.92-20.57-20.92h-34.17z"
                  fill="url(#d)"
                />
                <path
                  d="m599.98 91.36c1.39 1.74 1.92 2.09 2.96 2.09s1.74-.7 1.74-2.27v-89.26h6.39v121.97h-8.02l-72.3-102.27v102.34h-16.39v-122.04h23.02l62.59 89.44z"
                  fill="url(#e)"
                />
                <path
                  d="m734.76 64.06v18.78c0 27.9-19 43.94-49.34 43.94-35.57 0-55.45-20.05-55.45-62.94 0-40.62 20.57-62.94 55.45-62.94 30.51 0 49.34 16.74 49.34 43.41v2.79h-17.09v-2.62c0-18.31-12.21-29.47-32.26-29.47-21.8 0-36.96 13.42-36.96 38.71v19.88c0 25.28 13.77 39.06 36.96 39.06 18.83 0 32.26-8.72 32.26-29.47v-11.45c0-1.92-.7-2.62-2.62-2.62h-43.76v-5.06h63.46z"
                  fill="url(#f)"
                />
                <path d="m468.57 1.92h17.44v122.04h-17.44z" fill="url(#g)" />
                <path
                  d="m939.15 64.15v59.69h-17.44v-59.69h-8.71v-62h17.43v62z"
                  fill="url(#h)"
                />
                <path
                  d="m883.6 59.36v.04l-20.02-57.42h-22.01l-42.57 121.99 1.05.06h16.07l12.09-35.66.16-.46c.44-1.02 1.35-1.6 2.46-1.6h26.78v5.1h16.35c1.15-.03 2.09.55 2.54 1.6 0 .01.19.48.19.48l9.69 24.77v.04l1.99 5.71h17.78l-22.54-64.66zm-12.48 20.27h-13.53v-5.11h-23.48c-1.1-.01-1.73-.89-1.25-2.27l.44-1.35 20.47-55.49 3.82 11v8.89l14.27 40.47.13.38.39 1.22c.48 1.39-.16 2.25-1.26 2.27z"
                  fill="url(#i)"
                />
                <path
                  d="m305.42 79.58-41.77.04h42.43c.49-.03.93.09 1.29.29-.36-.22-.81-.33-1.37-.33z"
                  fill="url(#j)"
                />
                <path
                  d="m297.29 1.92h-25.11l-42.18 122.05h16.74l13.24-42.25c.33-1.35 1.39-2.11 2.7-2.06l42.28-.03h-41.31l41.77-.04h.58c.55 0 1 .12 1.37.33.01.01.04.03.06.04.1.04.2.12.29.2.1.07.19.17.28.28.07.07.15.16.19.25.13.16.23.35.32.54.04.09.09.17.12.28l13.43 42.47h17.78zm5.94 72.64h-37.85c-1.12 0-1.76-.87-1.28-2.27l.52-1.6 19.76-55.34 19.67 55.23c.06.2.13.42.22.64.49 1.45 1.22 3.25-1.05 3.34z"
                  fill="url(#k)"
                />
              </svg>
              <span>{{ corpus.name }}</span>
            </router-link>
          </h1>
          <transition name="fade">
            <template v-if="!show_collection_meta">
              <h2>
                <template v-if="$root.lang.current === 'fr'">
                  {{ corpus.subtitle }}
                </template>
                <template v-else-if="$root.lang.current === 'en'">
                  {{ corpus.subtitle_en }}
                </template>
              </h2>
            </template>
          </transition>

          <transition-page>
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
          </transition-page>

          <div
            class="m_corpus"
            ref="corpus"
            v-if="['Corpus', 'Fragment'].includes($route.name)"
          >
            <transition name="pagetransition" mode="out-in">
              <Loader
                v-if="is_loading_medias"
                key="loader"
                class="m_corpus--fragments _localLoader"
              />

              <Collection
                v-else-if="shown_collection"
                :key="'collection-' + show_collection_meta"
                :corpus="corpus"
                :collection="shown_collection"
                :fragments="sorted_fragments"
                :all_keywords="all_keywords"
                :all_tags="all_tags"
                :medias="medias"
                :collection_fragments="current_collection_fragments"
                @close="show_collection_meta = false"
              />

              <div
                v-else
                class="m_corpus--fragments"
                key="fragments"
                :class="{
                  'in--collection': show_collection_meta,
                }"
              >
                <template v-if="!show_collection_meta">
                  <div
                    class="m_corpus--description mediaTextContent"
                    v-if="['Corpus', 'Fragment'].includes($route.name)"
                    v-html="
                      $root.lang.current === 'fr'
                        ? corpus.description
                        : corpus.description_en
                    "
                  />
                </template>

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
                </div>

                <div
                  v-if="text_search !== '' && filtered_fragments.length === 0"
                  class="m_corpus--fragments--notice"
                >
                  {{ $t("no_results") }}
                </div>

                <FragmentsList
                  :corpus="corpus"
                  :all_keywords="all_keywords"
                  :all_tags="all_tags"
                  :medias="medias"
                  :fragments="filtered_fragments"
                  :show_create_button="!shown_collection"
                />
              </div>
            </transition>

            <div class="_scrollTop">
              <transition name="slide-up">
                <button
                  type="button"
                  :title="$t('scroll_to_top')"
                  @click="scrollToTop"
                  v-if="fragments_pane_scrolled > 150"
                >
                  <svg
                    width="30"
                    height="30"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="square"
                    style="transform: rotate(-90deg)"
                  >
                    <line x1="0" y1="50%" x2="100%" y2="50%" />
                    <line x1="75%" y1="25%" x2="100%" y2="50%" />
                    <line x1="75%" y1="75%" x2="100%" y2="50%" />
                  </svg>
                </button>
              </transition>
            </div>
          </div>

          <footer class="_bottomFooter">
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
                  &nbsp;/
                  <Admin />
                </div>
              </div>
            </div>
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

            <transition name="pagetransition" mode="out-in">
              <Loader
                v-if="is_loading_medias"
                key="loader"
                class="_localLoader"
              />
              <Sidebar
                v-else
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
            </transition>
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
import TransitionPage from "../transitions/TransitionPage.vue";

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
    TransitionPage,
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

      is_loading_medias: true,

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
    corpus: {
      handler() {
        if (this.corpus) this.setPageTitle();
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
      if (!this.show_collection_meta) return [];
      if (
        !this.shown_collection ||
        !this.shown_collection.fragments_slugs ||
        !Array.isArray(this.shown_collection.fragments_slugs)
      )
        return [];

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
          (this.current_collection_fragments.length === 0 ||
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
          if (this.corpus && this.corpus.corpus_default_view) {
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
    setPageTitle() {
      if (this.corpus.name) document.title = this.corpus.name;
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
        if (fm.type_of_document) acc += fm.type_of_document.toLowerCase() + " ";
        if (fm.date_of_document) acc += fm.date_of_document.toLowerCase() + " ";
        if (fm.origin_of_document)
          acc += fm.origin_of_document.toLowerCase() + " ";
        if (fm.authors_of_document)
          acc += fm.authors_of_document.toLowerCase() + " ";

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
      if (
        this.$route.name === "Informations" ||
        this.$route.name === "Mentions légales"
      ) {
        this.$router.push({
          name: "Corpus",
          query: this.$route.query ? this.$route.query : {},
        });
      }

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
  position: relative;
  scroll-behavior: smooth;
  // min-height: 50vh;

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
}

.m_corpus--fragments--notice {
  padding: calc(var(--spacing) * 2);
  text-align: center;
  color: var(--color-gray);
}

.m_corpus--fragments--sort {
  margin: 0 calc(var(--spacing) * 2);
  padding: calc(var(--spacing) / 2) 0 0;
  // border-bottom: 2px solid var(--color-eggplant);

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
      // background: var(--color-eggplant);
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
  width: 15ch;
  // image-rendering: crisp-edges;
}

._bottomFooter {
  border-top: 1px solid var(--color-eggplant);
  padding: calc(var(--spacing)) 0 0;
  font-size: var(--font-size-small);

  // margin: 0 calc(var(--spacing));

  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  .a,
  .button {
    padding-left: 0;
    text-transform: inherit;
  }

  > a {
    text-decoration: underline;
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
  height: calc(var(--vh, 1vh) * 100);

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

    background-size: 100vw auto;
    // background-attachment: local, scroll;

    .app.mobile_view & {
      padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2)
        calc(var(--spacing) * 1) calc(var(--spacing) * 1);

      h1 {
        margin-top: 0;
      }
    }
  }

  ._corpusContainer--rightCont {
    flex: 0 0 380px;
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);

    &.is--collapsed {
      transform: translateX(calc(100% - calc(var(--spacing) * 2)));
    }

    ._corpusContainer--rightCont--container {
      height: 100%;
      background: var(--body-bg);
      border-left: 1px solid var(--color-eggplant);

      background-size: 100vw auto;
      // background-attachment: local, scroll;

      .app:not(.mobile_view) & {
        background-position: calc(-100vw + 260px) 0;
      }
    }

    .app.mobile_view & {
      position: absolute;
      z-index: 10000;
      right: 0;
      width: 100%;
      padding-left: calc(var(--spacing) * 1);
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
  span {
    font-size: 0;
  }
}

h1 {
  position: sticky;
  top: 0;
  z-index: 1001;
}

._indicator {
  font-family: var(--ff-top-level);
  margin-bottom: calc(var(--spacing) * 2);

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
  position: sticky;
  z-index: 10;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;

  button {
    // width: 4em;
    // height: 4em;
    // background-color: var(--color-purple);
    background: var(--color-purple);
    // border: 1px solid currentColor;

    // box-shadow: 0 0 0.5rem 0.5rem var(--color-lightgray),
    //   0 0 1rem 1rem var(--color-lightgray) inset;
    padding: calc(var(--spacing) / 2);
    border-radius: 100%;
    margin-bottom: calc(var(--spacing) / 2);
    pointer-events: auto;

    svg {
      display: block;
      transform: rotate(-90deg);
      transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      stroke-width: 1px;
      stroke: white;
    }

    @media (hover: hover) {
      &:hover {
        svg {
          transform: translateY(-5px) rotate(-90deg) !important;
        }
      }
    }
  }
}

.m_corpus--description {
  padding-left: 0;
  margin-bottom: calc(var(--spacing) * 2);
}

._uncollapseButton {
  position: absolute;
  right: 100%;
  top: calc(var(--spacing) * 0.7);
  color: var(--active-color);
  margin-right: calc(var(--spacing) / -4);
}
._collapseButton {
  position: absolute;
  right: calc(var(--spacing) * 1);
  top: calc(var(--spacing) * 1);
}
</style>
