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

          <div class="_comments">
            {{ $t("comment") }}

            <div>
              <small v-if="!opened_fragment.comments" class="text-gray">
                {{ $t("no_comment_yet") }}
              </small>

              <TextField
                :field_name="'comments'"
                :content="opened_fragment.comments"
                type2="media"
                :metaFileName="opened_fragment.metaFileName"
                :slugFolderName="corpus.slugFolderName"
                :allow_editing="true"
              />
            </div>
          </div>
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
              <div class="_collectionsList">
                <h2>
                  {{ $t("collections") }}

                  <button
                    type="button"
                    @click="edit_coll = !edit_coll"
                    :class="{
                      'is--active': edit_coll,
                    }"
                  >
                    {{ $t("edit") }}
                  </button>
                </h2>
                <div
                  v-if="collections_fragment_is_in.length > 0"
                  v-html="$t('fragment_included_in_collections')"
                />
                <div
                  v-else-if="!edit_coll"
                  v-html="$t('fragment_included_in_no_collections')"
                />

                <div class="">
                  <div
                    v-for="collection in collections_fragment_is_in"
                    :key="collection.metaFileName"
                    class="collList"
                  >
                    <div class="_title">
                      {{ collection.title }}
                    </div>
                    <template
                      v-if="
                        collection.fragments_slugs &&
                        Array.isArray(collection.fragments_slugs)
                      "
                    >
                      {{ collection.fragments_slugs.length }}
                    </template>
                    <template v-else>0</template>
                    {{ $t("fragments") }}
                    <button
                      type="button"
                      v-if="edit_coll"
                      @click="removeFromColl(collection.metaFileName)"
                    >
                      {{ $t("remove_from_coll") }}
                    </button>
                  </div>
                </div>

                <div v-if="edit_coll">
                  <template v-if="sorted_collections.length === 0">
                    {{ $t("create_collection_first") }}
                  </template>

                  <template v-else>
                    {{ $t("add_story_to_collection") }}
                    <div v-if="collections_fragment_isnt_in.length === 0">
                      <small>
                        {{ $t("fragment_in_all_collections_already") }}
                      </small>
                    </div>

                    <div v-else class="custom-select _collSelect">
                      <select v-model="collection_to_add_fragment_to">
                        <option
                          v-for="collection in collections_fragment_isnt_in"
                          :value="collection.metaFileName"
                          :key="collection.media_filename"
                        >
                          {{ collection.title }}
                        </option>
                      </select>
                      <button type="button" @click="addFragmentToColl">
                        {{ $t("add") }}
                      </button>
                    </div>
                  </template>
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
      edit_coll: false,

      collection_to_add_fragment_to: false,
    };
  },
  created() {},
  mounted() {
    document.addEventListener("keydown", this.escClose);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.escClose);
  },
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
    collections_fragment_is_in() {
      return this.sorted_collections.filter(
        (c) =>
          c.fragments_slugs &&
          c.fragments_slugs.find(
            (fs) => fs.metaFileName === this.opened_fragment.metaFileName
          )
      );
    },
    collections_fragment_isnt_in() {
      return this.sorted_collections.filter(
        (c) =>
          !c.fragments_slugs ||
          !c.fragments_slugs.find(
            (fs) => fs.metaFileName === this.opened_fragment.metaFileName
          )
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
    escClose(e) {
      if (e.keyCode == 27) this.closeModal();
    },
    addFragmentToColl() {
      if (!this.collection_to_add_fragment_to) return;

      const coll = this.sorted_collections.find(
        (c) => c.metaFileName === this.collection_to_add_fragment_to
      );
      let fs = coll.fragments_slugs || [];

      fs.push({
        metaFileName: this.opened_fragment.metaFileName,
      });

      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.corpus.slugFolderName,
        slugMediaName: coll.metaFileName,
        data: {
          fragments_slugs: fs,
        },
      });
      // .then((mdata) => {
      //   // setTimeout(() => {
      //   this.is_sending_content_to_server = false;
      //   // }, 300);
      // });
    },
    removeFromColl(metaFileName) {
      const coll = this.sorted_collections.find(
        (c) => c.metaFileName === metaFileName
      );
      let fs = coll.fragments_slugs || [];

      fs = fs.filter(
        (i) => i.metaFileName !== this.opened_fragment.metaFileName
      );

      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.corpus.slugFolderName,
        slugMediaName: coll.metaFileName,
        data: {
          fragments_slugs: fs,
        },
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
    padding-top: calc(var(--spacing) / 2);
    padding-bottom: calc(var(--spacing) / 2);
  }
  ._fragmentListAndReactions {
    // padding: calc(var(--spacing) / 2);
  }

  .app:not(.mobile_view) & {
    display: flex;
    flex-flow: row nowrap;
    gap: calc(var(--spacing));
    > * {
      max-height: 100vh;
      overflow: auto;
      // padding: clamp(2vmin, 4vw, calc(var(--spacing) * 4));
      // padding: calc(var(--spacing));
    }

    ._singleFragment {
      flex: 1 1 auto;

      // padding-top: calc(var(--spacing)  1);
      // padding-bottom: calc(var(--spacing) * 1);
      // padding: calc(var(--spacing) * 2) 0;
      // padding-right: 0;
    }
    ._fragmentListAndReactions {
      flex: 0 0 260px;
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

._comments {
  background: white;
}

._lang {
  select {
    color: black;
  }
}

._collSelect {
  display: flex;
  flex-flow: row nowrap;
  max-width: none;

  select {
    max-width: none;
    flex: 1;
  }
  button {
    margin: 0 calc(var(--spacing) / 4);
    background-color: var(--color-blue);
    color: white;
  }
}
</style>
<style lang="scss"></style>
