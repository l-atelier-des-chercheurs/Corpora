<template>
  <div style="" v-if="corpus">
    <CorpusPwd v-if="!can_access_corpus" :corpus="corpus" />
    <template v-else>
      <WelcomeModal v-if="$root.settings.show_welcome_modal" />

      <div class="m_topBar">
        <div class="m_topBar--content">
          <router-link
            :to="{
              name: 'Corpus',
              params: { slugFolderName: corpus.slugFolderName },
            }"
          >
            <hgroup>
              <h1 v-if="!!corpus.name">{{ corpus.name }}</h1>
              <h2 v-if="!!corpus.subtitle">{{ corpus.subtitle }}</h2>
            </hgroup>
          </router-link>

          <a href="https://plurality-university.org" target="_blank">
            <img
              class="_logo"
              src="/images/U+_LogoLabels-1_Blue.png"
              draggable="false"
            />
          </a>
          <button type="button">{{ $t("guide") }}</button>
          <!-- <button type="button">{{ $t("about_corpus") }}</button> -->
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

      <div class="m_corpus" ref="corpus" v-if="$route.name !== 'Informations'">
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

              <router-link
                :to="{
                  name: 'Informations',
                }"
                class="button"
                v-html="$t('more_infos')"
              />
            </div>

            <div class="m_corpus--tags" v-if="all_tags && all_tags.length > 0">
              <label>{{ $t("tags") }}</label>
              <div class="m_keywordField m_keywordField_tags">
                <button
                  type="button"
                  class="tag"
                  v-for="tag in all_tags"
                  :key="tag"
                  @click="setTagFilter(tag)"
                  :class="{
                    'is--active': tag === tag_search,
                  }"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <div class="m_corpus--collections">
              <label for="fragments-search">{{ $t("collections") }}</label>

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
              <button
                type="button"
                @click="show_create_collection_modal = true"
              >
                {{ $t("create_a_collection") }}
              </button>
            </div>

            <div class="m_corpus--search">
              <label for="fragments-search">{{
                $t("search_in_fragments")
              }}</label>
              <form
                class="flex-nowrap align-items-stretch"
                @submit.prevent="text_search = text_search_in_field"
              >
                <input
                  type="search"
                  id="fragments-search"
                  v-model="text_search_in_field"
                  :aria-label="$t('search_in_fragments')"
                />

                <span class="input-addon">
                  <button
                    type="submit"
                    :disabled="text_search === text_search_in_field"
                  >
                    √
                  </button>
                </span>
              </form>
            </div>

            <div
              class="m_corpus--keywords"
              v-if="all_keywords && all_keywords.length > 0"
            >
              <label>{{ $t("keywords") }}</label>

              <div class="m_keywordField m_keywordField_keywords">
                <button
                  type="button"
                  class="tag"
                  v-for="keyword in all_keywords"
                  :key="keyword"
                  @click="setKeywordFilter(keyword)"
                  :class="{
                    'is--active': keyword === keyword_search,
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
              :collection_fragments="current_collection_fragments"
            />

            <div>
              <div class="m_corpus--fragments--sort">
                <div>
                  <small>
                    {{ $t("stories") }} • {{ filtered_fragments.length
                    }}<template
                      v-if="
                        filtered_fragments.length !== sorted_fragments.length
                      "
                      >/{{ sorted_fragments.length }}</template
                    >
                  </small>
                  <div class="custom-select custom-select_tiny">
                    <select v-model="sort_fragments_by">
                      <option value="date_created">
                        {{ $t("by_creation_date") }}
                      </option>
                      <option value="title">{{ $t("by_title") }}</option>
                    </select>
                  </div>
                </div>
                <div
                  v-if="text_search || keyword_search || tag_search"
                  class="m_corpus--fragments--sort--filterList"
                >
                  <div>
                    <small>{{ $t("filters") }}</small>

                    <button
                      type="button"
                      v-if="text_search"
                      @click="text_search = ''"
                    >
                      {{ $t("text") }} = {{ text_search }}
                      ×
                    </button>
                    <button
                      type="button"
                      v-if="keyword_search"
                      @click="keyword_search = ''"
                    >
                      {{ $t("keywords") }} = {{ keyword_search }}
                      ×
                    </button>
                    <button
                      type="button"
                      v-if="tag_search"
                      @click="tag_search = ''"
                    >
                      {{ $t("tags") }} = {{ tag_search }}
                      ×
                    </button>
                  </div>
                </div>
                <!-- <div class="m_corpus--fragments--sort--pagination">
                  {{ fragments_paginated }}
                </div> -->
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
              />
            </div>
          </div>
        </transition>
      </div>

      <footer class="_bottomFooter">
        <button
          type="button"
          class="button-nostyle a"
          @click="
            $root.settings.show_welcome_modal = true;
            $root.settings.unfold_legal_pane = true;
          "
          :class="{ 'is--active': $root.settings.show_welcome_modal }"
        >
          {{ $t("personal_data_and_legal_notices") }}
        </button>

        <div>
          <div class="margin-sides-medium">
            <div class="flex-nowrap">
              Corpora v{{ $root.state.appVersion }}
              &nbsp;
              <Admin />
            </div>
          </div>
        </div>
      </footer>

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

      pagination: {
        current_page: 1,
        number_of_fragments_per_page: 50,
      },

      text_search: "",
      text_search_in_field: "",

      keyword_search: false,
      tag_search: false,

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
    new_lang() {
      this.$root.updateLocalLang(this.new_lang);
    },
    text_search() {
      this.setQueryURLFromFilters();
    },
    keyword_search() {
      this.setQueryURLFromFilters();
    },
    tag_search() {
      this.setQueryURLFromFilters();
    },
    show_collection_meta() {
      this.setQueryURLFromFilters();
    },
    $route: {
      handler(to) {
        if (this.$route.query) {
          this.text_search = this.text_search_in_field =
            this.$route.query.text_search || "";
          this.keyword_search = this.$route.query.keyword_search || false;
          this.tag_search = this.$route.query.tag_search || false;
          this.show_collection_meta = this.$route.query.collection || false;
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

    fragments_paginated() {
      return this.filtered_fragments.slice(
        (this.pagination.current_page - 1) *
          this.pagination.number_of_fragments_per_page,
        this.pagination.current_page *
          this.pagination.number_of_fragments_per_page
      );
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
    current_collection_fragments() {
      if (!this.show_collection_meta) return [];
      if (
        !this.shown_collection.fragments_slugs ||
        !Array.isArray(this.shown_collection.fragments_slugs)
      )
        return false;

      return this.shown_collection.fragments_slugs.reduce((acc, fs) => {
        const metaFileName = fs.metaFileName;
        const fragment = this.sorted_fragments.find(
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
        if (
          this.text_search &&
          !f.title.toLowerCase().includes(this.text_search.toLowerCase()) &&
          !this.doFragmentMediasIncludeText({
            fragment_media: f,
            text: this.text_search.toLowerCase(),
          })
        )
          return false;

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
          !this.current_collection_fragments
            .map((_f) => _f.metaFileName)
            .includes(f.metaFileName)
        )
          return false;

        return true;
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
      this.keyword_search = this.keyword_search === kw ? false : kw;
    },
    setTagFilter(tag) {
      this.tag_search = this.tag_search === tag ? false : tag;
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
    setQueryURLFromFilters() {
      let query = Object.assign({}, this.$route.query) || {};

      if (this.text_search === "") delete query.text_search;
      else query.text_search = this.text_search;

      if (!this.keyword_search) delete query.keyword_search;
      else query.keyword_search = this.keyword_search;

      if (!this.tag_search) delete query.tag_search;
      else query.tag_search = this.tag_search;

      if (!this.show_collection_meta) delete query.collection;
      else query.collection = this.show_collection_meta;

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
      background: var(--color-blue);
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
  border-left: 2px dotted var(--color-blue);
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
  border-bottom: 2px dotted var(--color-blue);

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: calc(var(--spacing) * 3);

  a {
    text-decoration: none;
    color: inherit;
  }

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
  // background-color: var(--color-lightgray);

  // border-radius: 8px;
  width: 100%;
  display: block;
  padding: calc(var(--spacing) / 2);
  margin: 0 0 calc(var(--spacing) / 2) 0;

  text-align: left;
  text-transform: inherit;
  font-family: "base9";
  font-weight: bold;

  &::before {
    // content: ">";
  }
}

._logo {
  position: absolute;
  top: 5px;
  right: 0px;
  max-width: 317px;
  width: 40vw;
  transform: rotate(4deg);
  image-rendering: crisp-edges;
}

._bottomFooter {
  border-top: 2px dotted var(--color-blue);
  padding: calc(var(--spacing)) 0;
  margin: 0 calc(var(--spacing) * 2);

  display: flex;
  flex-flow: row wrap;
  gap: var(--spacing);
  justify-content: space-between;

  .a {
    text-transform: inherit;
  }

  img {
    width: 100%;
    max-width: 340px;
  }
}
</style>
