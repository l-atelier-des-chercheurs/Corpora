<template>
  <section>
    <div class="_inCollection">
      <div class="_addRemoveBtn">
        <button
          type="button"
          @click="edit_fragments_list = !edit_fragments_list"
        >
          {{ $t("add_remove_fragments") }}
        </button>
      </div>

      <div :class="{}">
        {{ $t("fragments") }}&nbsp;:
        {{ collection_fragments.length }}
      </div>

      <br />

      <div v-if="edit_fragments_list">
        {{ $t("remove_stories") }}
      </div>

      <div v-if="!collection_fragments">
        <small>{{ $t("none") }}</small>
      </div>

      <transition-group
        v-else
        class="m_fragments"
        name="list-complete"
        tag="div"
      >
        <!-- <div
          class="m_fragments--createFragment"
          key="createFragment"
          v-if="false"
        >
          <button
            type="button"
            class="m_fragments--createFragment--addFragmentButton"
            @click="show_create_fragment = !show_create_fragment"
          >
            + {{ $t("create_a_story") }}
          </button>
          <CreateFragment
            v-if="show_create_fragment"
            :corpus="corpus"
            :all_keywords="all_keywords"
            :all_tags="all_tags"
            @createdFragment="
              (metaFileName) => $emit('addToCollection', { metaFileName })
            "
            @close="show_create_fragment = false"
          />
        </div> -->

        <div
          v-for="(fragment, index) in collection_fragments"
          :key="fragment.metaFileName"
        >
          <button
            v-if="edit_fragments_list"
            type="button"
            class="_removeFromColl"
            @click="removeColl(fragment.metaFileName)"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
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
                y1="25"
                x2="50"
                y2="25"
              />
              <line
                vector-effect="non-scaling-stroke"
                x1="25"
                y1="0"
                x2="25"
                y2="50"
              />
            </svg>
          </button>

          <FragmentContent
            :context="'preview'"
            :corpus="corpus"
            :all_keywords="all_keywords"
            :all_tags="all_tags"
            :medias="medias"
            :fragment="fragment"
            :fragment_width="fragment_width"
            :slugFolderName="corpus.slugFolderName"
          />

          <div class="_buttonRow" v-if="edit_fragments_list">
            <div class="_pos">
              <transition name="fade" duration="200" mode="out-in">
                <div
                  class="custom-select custom-select_xs custom-select_pos"
                  :key="index + 1"
                >
                  <select
                    :value="index + 1"
                    @change="
                      $emit('changePos', {
                        metaFileName: fragment.metaFileName,
                        $event,
                      })
                    "
                  >
                    <option
                      v-for="index in collection_fragments.length"
                      :key="index"
                      :value="index"
                      v-html="index"
                    />
                  </select>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div v-for="index in 3" :key="index" />
      </transition-group>
    </div>

    <div class="_notInCollection" v-if="edit_fragments_list">
      <h3>{{ $t("add_stories_to") }}&#32;{{ collection.title }}</h3>

      <div v-if="!other_fragments || other_fragments.length === 0">
        <small>{{ $t("none") }}</small>
      </div>
      <FragmentsList
        v-else
        :corpus="corpus"
        :all_keywords="all_keywords"
        :all_tags="all_tags"
        :medias="medias"
        :fragments="other_fragments"
        :show_create_button="false"
        :show_add_button="true"
        @addToCollection="$emit('addToCollection', $event)"
      />
    </div>
    <Loader v-if="is_sending_content_to_server" class="_fsLoader" />
  </section>
</template>
<script>
import CreateFragment from "../modals/CreateFragment.vue";
import FragmentContent from "../FragmentContent.vue";
import FragmentsList from "../subcomponents/FragmentsList.vue";

export default {
  props: {
    collection: Object,
    corpus: Object,
    all_tags: Array,
    all_keywords: Array,
    medias: [Boolean, Array],
    collection_fragments: [Boolean, Array],
    fragments: [Boolean, Array],
  },
  components: {
    FragmentContent,
    CreateFragment,
    FragmentsList,
  },
  data() {
    return {
      edit_fragments_list: false,
      show_create_fragment: false,
      askBeforeClosingModal: false,
      is_sending_content_to_server: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    fragment_width() {
      return Math.min(325, this.$root.settings.windowWidth * 0.9);
    },
    other_fragments() {
      if (!this.collection_fragments) return this.fragments;
      const fss = this.collection.fragments_slugs.map((fs) => fs.metaFileName);
      return this.fragments.filter((f) => !fss.includes(f.metaFileName));
    },
  },
  methods: {
    removeColl(metaFileName) {
      this.$alertify
        .okBtn(this.$t("yes"))
        .cancelBtn(this.$t("cancel"))
        .confirm(this.$t("sure_to_remove_fragment_from_coll"), () => {
          this.$emit("removeFromCollection", metaFileName);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
._inCollection {
  border: 1px solid var(--color-blue);
  border-top: 0;
  border-bottom: 0;
  padding: calc(var(--spacing) * 1);
  padding-bottom: 0;
}

._notInCollection {
  border-top: 1px solid var(--color-blue);
  padding: calc(var(--spacing) * 1) 0;

  h3 {
    padding: calc(var(--spacing) * 1) 0;
  }
}

h2,
small,
label {
  // color: var(--color-lightgray);
  // padding: 0 calc(var(--spacing) * 2);
  margin: 0;
}

._buttonRow {
  position: absolute;
  z-index: 100;
  bottom: calc(var(--spacing) * 2);
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  gap: calc(var(--spacing) / 2);

  // pointer-events: none;
}

._pos {
  pointer-events: auto;
}

._fsLoader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

._removeFromColl {
  width: 2.5em;
  height: 2.5em;
  margin-left: auto;

  padding: 0.5em;
  margin-right: -0.75em;
}

._addRemoveBtn {
  text-align: right;

  button {
    font-size: var(--font-size-small);
  }
}
</style>
