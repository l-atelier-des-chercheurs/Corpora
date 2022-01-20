<template>
  <Modal
    @close="closeModal"
    :read_only="false"
    :typeOfModal="'LargeAndScroll'"
    :is_loading="is_sending_content_to_server"
    ref="body"
  >
    <template slot="body">
      <div class="_sideBySide">
        <div
          class="_singleFragment custom_scrollbar custom_scrollbar_dark"
          ref="singleFragmentContainer"
        >
          <transition name="fade" :duration="200" mode="out-in" appear>
            <Loader v-if="!opened_fragment" />
            <FragmentContent
              v-else
              :key="opened_fragment.metaFileName"
              :context="'edit'"
              :fragment="opened_fragment"
              :corpus="corpus"
              :all_keywords="all_keywords"
              :all_tags="all_tags"
              :medias="medias"
              :fragment_width="800"
              :slugFolderName="slugFolderName"
            />
          </transition>
        </div>
        <aside
          class="_fragmentListAndReactions custom_scrollbar custom_scrollbar_dark"
        >
          <transition name="fade" :duration="200" mode="out-in">
            <Loader
              v-if="is_loading_fragment_sidebar"
              class="_fragmentListAndReactions--loader"
            />
            <div class="_fragmentListAndReactions--content" v-else>
              <div class="margin-vert-small _lang">
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

              <div class="_reactions">
                <h2>
                  {{ $t("reason_for_sharing") }}
                </h2>

                <div>
                  <template v-if="$root.lang.current === 'fr'">
                    <TextField
                      :field_name="'reason_for_sharing'"
                      :content="opened_fragment.reason_for_sharing"
                      type2="media"
                      :metaFileName="opened_fragment.metaFileName"
                      :slugFolderName="corpus.slugFolderName"
                      :allow_editing="true"
                    />
                    <small
                      v-if="!opened_fragment.reason_for_sharing"
                      class="text-gray"
                    >
                      {{ $t("none_yet") }}
                    </small>
                  </template>
                  <template v-else-if="$root.lang.current === 'en'">
                    <TextField
                      :field_name="'reason_for_sharing_en'"
                      :content="opened_fragment.reason_for_sharing_en"
                      type2="media"
                      :metaFileName="opened_fragment.metaFileName"
                      :slugFolderName="corpus.slugFolderName"
                      :allow_editing="true"
                    />
                    <small
                      v-if="!opened_fragment.reason_for_sharing_en"
                      class="text-gray"
                    >
                      {{ $t("none_yet") }}
                    </small>
                  </template>
                </div>
                <!-- <br />
                <h2>
                  {{ $t("reactions") }}
                </h2>
                <div>
                  <h3>Liste de réponses/réactions d’autres personnes</h3>
                  <ul>
                    <li>
                      <a href="">Réaction #1</a>
                    </li>
                    <li>
                      <a href="">Réaction #2</a>
                    </li>
                    <li>
                      <a href="">Réaction #3</a>
                    </li>
                  </ul>
                </div> -->
              </div>

              <div class="_collections">
                <i>todo</i>
                <h2>
                  {{ $t("collections") }}
                  <i>todo</i>
                </h2>
                <div>Ce récit figure dans les collections suivantes :</div>
                <br />
                <div>
                  Ajouter ce récit à une collection :
                  <select>
                    <option
                      v-for="collection in sorted_collections"
                      :key="collection.media_filename"
                    >
                      {{ collection.title }}
                    </option>
                  </select>
                </div>
              </div>

              <template v-if="linked_fragments.length === 0">
                <hr />
                <h2>
                  {{ $t("no_with_similar_keywords") }}
                </h2>
              </template>
              <template v-else>
                <hr />
                <h2>
                  {{
                    linked_fragments.length + " " + $t("with_similar_keywords")
                  }}
                </h2>

                <transition-group
                  class="_fragmentListAndReactions--content--list"
                  name="list-complete"
                  tag="div"
                >
                  <FragmentContent
                    v-for="(fragment, index) in linked_fragments"
                    :key="fragment.metaFileName + '.' + index"
                    class="_fragmentListAndReactions--content--list--item"
                    :context="'preview'"
                    :corpus="corpus"
                    :all_keywords="all_keywords"
                    :all_tags="all_tags"
                    :medias="medias"
                    :fragment="fragment"
                    :fragment_width="300"
                    :slugFolderName="corpus.slugFolderName"
                  />
                </transition-group>
              </template>
              <template
                v-if="
                  not_linked_fragments &&
                  not_linked_fragments.length > 0 &&
                  false
                "
              >
                <hr />
                <h2>
                  {{
                    not_linked_fragments.length + " " + $t("other_fragments")
                  }}
                </h2>

                <button
                  type="button"
                  v-if="!show_not_linked_fragments"
                  @click="show_not_linked_fragments = true"
                >
                  {{ $t("show") }}
                </button>

                <transition-group
                  v-if="show_not_linked_fragments"
                  class="_fragmentListAndReactions--content--list"
                  name="list-complete"
                  tag="div"
                  :key="
                    not_linked_fragments.map((f) => f.metaFileName).join(',')
                  "
                >
                  <FragmentContent
                    v-for="(fragment, index) in not_linked_fragments"
                    class="_fragmentListAndReactions--content--list--item"
                    :key="fragment.metaFileName + '_' + index"
                    :context="'preview'"
                    :corpus="corpus"
                    :all_keywords="all_keywords"
                    :all_tags="all_tags"
                    :medias="medias"
                    :fragment="fragment"
                    :fragment_width="300"
                    :slugFolderName="corpus.slugFolderName"
                  />
                </transition-group>
              </template>
            </div>
          </transition>
        </aside>
      </div>
    </template>
  </Modal>
</template>
<script>
import FragmentContent from "../components/FragmentContent.vue";

export default {
  props: {
    corpus: Object,
    fragments: [Boolean, Array],
    opened_fragment: [Boolean, Object],
    all_tags: Array,
    all_keywords: Array,
    medias: [Boolean, Array],
    slugFolderName: String,
    fragment_width: Number,
  },
  components: {
    FragmentContent,
  },
  data() {
    return {
      is_loading_fragment_sidebar: true,
      show_not_linked_fragments: false,
      new_lang: this.$root.lang.current,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    "opened_fragment.metaFileName": {
      handler: function () {
        if (this.opened_fragment.metaFileName) this.loadFragment();

        const single_fragment_container =
          document.querySelector("._singleFragment");
        if (single_fragment_container) single_fragment_container.scrollTop = 0;
      },
      immediate: true,
    },
    new_lang() {
      this.$root.updateLocalLang(this.new_lang);
    },
  },

  computed: {
    all_fragments_except_current() {
      return (
        this.fragments &&
        this.fragments.filter(
          (f) =>
            this.opened_fragment &&
            f.metaFileName !== this.opened_fragment.metaFileName
        )
      );
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
    linked_fragments() {
      if (!this.all_fragments_except_current) return false;
      return this.all_fragments_except_current.filter(
        (f) => f.keywords && this.hasCommonKeywordWithOpened(f)
      );
    },
    not_linked_fragments() {
      if (!this.linked_fragments) return false;
      const linked_fragments_meta = this.linked_fragments.map(
        (lf) => lf.metaFileName
      );
      return this.all_fragments_except_current.filter(
        (f) => !linked_fragments_meta.includes(f.metaFileName)
      );
    },
  },
  methods: {
    closeModal() {
      this.$router.push({
        name: "Corpus",
        query: this.$route.query ? this.$route.query : {},
      });
    },

    loadFragment() {
      this.is_loading_fragment_sidebar = true;
      setTimeout(() => {
        this.is_loading_fragment_sidebar = false;
      }, 600);
    },
    hasCommonKeywordWithOpened(f) {
      if (
        !this.opened_fragment.keywords ||
        !Array.isArray(this.opened_fragment.keywords) ||
        !Array.isArray(f.keywords)
      )
        return false;
      const kws = this.opened_fragment.keywords.map((kw) => kw.title);
      return kws.find((kw) => f.keywords.map((k) => k.title).includes(kw));
    },
  },
};
</script>
<style lang="scss" scoped>
._sideBySide {
  > * {
    padding-top: calc(var(--spacing) * 1);
    padding-bottom: calc(var(--spacing) * 1);
  }
  ._fragmentListAndReactions {
    // padding: calc(var(--spacing) / 2);
  }

  .app:not(.mobile_view) & {
    display: flex;
    flex-flow: row nowrap;
    // gap: calc(var(--spacing) / 2);
    > * {
      max-height: 100vh;
      overflow: auto;
      // padding: clamp(2vmin, 4vw, calc(var(--spacing) * 4));
      // padding: calc(var(--spacing));
    }

    ._singleFragment {
      flex: 1 1 600px;

      padding-top: calc(var(--spacing) * 1);
      padding-bottom: calc(var(--spacing) * 1);
      padding: calc(var(--spacing) / 1);
      // padding-right: 0;
    }
    ._fragmentListAndReactions {
      flex: 0 1 320px;
    }
  }
}

._singleFragment {
  position: relative;
  scroll-behavior: smooth;
}

._fragmentListAndReactions {
  position: relative;

  h2 {
    // color: var(--color-lightgray);

    &:first-child() {
      margin-top: 0;
    }
  }
}

._fragmentListAndReactions {
}

._fragmentListAndReactions--content {
  margin-bottom: calc(var(--spacing) * 1);
  padding: calc(var(--spacing));
}
._fragmentListAndReactions--content:last-child {
  padding-bottom: calc(var(--spacing) * 4) !important;
}
._fragmentListAndReactions--content > h2 {
  margin: calc(var(--spacing) / 2) 0;
}
._fragmentListAndReactions--content--list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* grid-auto-rows: max-content; */
  grid-gap: calc(var(--spacing) / 2);

  // padding: 0 calc(var(--spacing) * 2) calc(var(--spacing) * 2);
}

._fragmentListAndReactions--loader {
  // max-height: 500px;
  align-items: flex-start;
}

._reactions,
._collections {
  // background-color: var(--color-lightgray);
  padding-bottom: calc(var(--spacing));
  margin-bottom: calc(var(--spacing));

  h2 {
    margin-top: 0;
    margin-bottom: 0;
    color: inherit;
  }
}

._lang {
  select {
    color: black;
  }
}
</style>
<style lang="scss">
._reactions {
  .mediaTextContent {
    margin-left: calc(-1 * var(--spacing) / 4);
  }
}
</style>
