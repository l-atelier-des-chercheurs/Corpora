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
          <transition name="fade" :duration="200" mode="out-in">
            <FragmentContent
              v-if="opened_fragment"
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
          class="
            _fragmentListAndReactions
            custom_scrollbar custom_scrollbar_dark
          "
        >
          <Loader
            v-if="!show_fragmentListAndReactions"
            class="_fragmentListAndReactions--loader"
          />

          <transition name="fade" :duration="200" mode="out-in">
            <div
              class="_fragmentListAndReactions--content"
              v-if="show_fragmentListAndReactions && linked_fragments"
            >
              <div class="_reactions">
                <i>todo</i>
                <h2>
                  {{ $t("reason_for_sharing") }}
                </h2>

                <div>
                  <i>
                    Ici un texte personnalisable par la personne qui a créé le
                    récit pour indiquer la raison d’être du fragment.
                  </i>
                </div>
                <br />
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
                </div>
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
                <h2>
                  {{ $t("no_with_similar_keywords") }}
                </h2>
              </template>
              <template v-else>
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
          <div
            class="_fragmentListAndReactions--content"
            v-if="
              show_fragmentListAndReactions &&
              not_linked_fragments &&
              not_linked_fragments.length > 0
            "
          >
            <h2>
              {{ not_linked_fragments.length + " " + $t("other_fragments") }}
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
            >
              <FragmentContent
                v-for="(fragment, index) in not_linked_fragments"
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
          </div>
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
      show_fragmentListAndReactions: false,
      show_not_linked_fragments: false,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.show_fragmentListAndReactions = true;
    }, 600);
  },
  beforeDestroy() {},
  watch: {
    "opened_fragment.metaFileName"() {
      const single_fragment_container =
        document.querySelector("._singleFragment");
      if (single_fragment_container) single_fragment_container.scrollTop = 0;
    },
  },
  computed: {
    all_fragments_except_current() {
      return (
        this.fragments &&
        this.fragments.filter(
          (f) => f.metaFileName !== this.opened_fragment.metaFileName
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
  // grid-gap: calc(var(--spacing) * 2);
  ._fragmentListAndReactions {
    padding: calc(var(--spacing) / 2);
  }

  .app:not(.mobile_view) & {
    display: flex;
    flex-flow: row nowrap;
    > * {
      max-height: 100vh;
      overflow: auto;
      // padding: clamp(2vmin, 4vw, calc(var(--spacing) * 4));
      // padding: calc(var(--spacing));
    }

    ._singleFragment {
      flex: 1 1 600px;
      // padding: calc(var(--spacing) / 2);
      // padding-right: 0;
    }
    ._fragmentListAndReactions {
      flex: 0 1 320px;
    }
  }
}

._singleFragment {
  scroll-behavior: smooth;
}

._fragmentListAndReactions {
  position: relative;

  h2 {
    color: var(--color-lightgray);

    &:first-child() {
      margin-top: 0;
    }
  }
}

._fragmentListAndReactions {
}

._fragmentListAndReactions--content {
  margin-bottom: calc(var(--spacing) * 1);
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
  background-color: var(--color-lightgray);
  padding: calc(var(--spacing) / 2);
  padding-bottom: calc(var(--spacing));
  margin-bottom: calc(var(--spacing));

  h2 {
    margin-top: 0;
    color: inherit;
  }
}
</style>
