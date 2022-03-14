<template>
  <div>
    <transition-group class="m_fragments" name="list-complete" tag="div">
      <div
        v-if="show_create_button"
        class="m_fragments--createFragment"
        key="createFragment"
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
          :collection_to_add_to="part_of_collection"
          @createdFragment="
            (metaFileName) => $emit('addToCollection', { metaFileName })
          "
          @close="show_create_fragment = false"
        />
        <!-- :current_contribution_mode="current_contribution_mode" -->
      </div>

      <template v-if="fragments">
        <div
          v-for="fragment in fragments"
          class="m_fragments--fragment"
          :key="fragment.metaFileName"
        >
          <button
            v-if="show_add_button"
            type="button"
            class="_addToColl"
            @click="
              $emit('addToCollection', {
                metaFileName: fragment.metaFileName,
              })
            "
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
                transform: rotate(0deg);
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
        </div>
      </template>
      <div v-for="index in 3" :key="index" />
    </transition-group>
  </div>
</template>
<script>
import CreateFragment from "../modals/CreateFragment.vue";
import FragmentContent from "../FragmentContent.vue";

export default {
  props: {
    corpus: Object,
    all_tags: Array,
    all_keywords: Array,
    medias: [Boolean, Array],
    fragments: [Boolean, Array],
    part_of_collection: {
      type: String,
      default: "",
    },
    show_create_button: {
      type: Boolean,
      default: true,
    },
    show_add_button: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CreateFragment,
    FragmentContent,
  },
  data() {
    return {
      current_contribution_mode: "",
      show_create_fragment: false,
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
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_fragments--fragment {
  transform-origin: 50% 100%;

  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  &.is--opened {
    // opacity: 0;
    transform: scale(1.1);
  }
}

._addToColl {
  width: 2.5em;
  height: 2.5em;
  margin-left: auto;
  padding: 0.5em;
  margin-right: -0.5em;
}
</style>
