<template>
  <div>
    <transition-group class="m_fragments" name="list-complete" tag="div">
      <div class="m_fragments--createFragment" key="createFragment">
        <button
          type="button"
          class="m_fragments--createFragment--addFragmentButton"
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
          @close="show_create_fragment = false"
        />
        <!-- :current_contribution_mode="current_contribution_mode" -->
      </div>

      <template v-if="fragments">
        <FragmentContent
          v-for="fragment in fragments"
          class="m_fragments--fragment"
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
      </template>
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
.m_fragments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  /* grid-auto-rows: max-content; */
  grid-gap: calc(var(--spacing) * 1);
  padding: calc(var(--spacing) * 2);

  // overflow: hidden;
}

.m_fragments--createFragment {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  margin: calc(var(--spacing) * 1.9) 0;

  .m_fragments--createFragment--addFragmentButton {
    color: var(--color-black);
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

.m_fragments--fragment {
  max-width: 320px;
}
</style>
