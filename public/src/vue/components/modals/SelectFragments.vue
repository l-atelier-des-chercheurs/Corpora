<template>
  <Modal
    @close="$emit('close')"
    :read_only="false"
    :typeOfModal="'LargeAndScroll'"
    :askBeforeClosingModal="askBeforeClosingModal"
  >
    <!-- <template slot="header">
      <span class>{{ $t("create_a_collection") }}</span>
    </template> -->

    <template slot="body">
      <div class="m_selectFragments">
        <div class="m_selectFragments--coll">
          <label>{{ $t("collection") }}</label>
          <h2>
            {{ collection.title }}
          </h2>
        </div>

        <div>
          {{ $t("create_add_remove_fragments") }}
        </div>

        <h2>
          {{ $t("fragments_in_collection") }}
        </h2>

        <div v-if="!collection_fragments">
          <small>{{ $t("none") }}</small>
        </div>
        <transition-group
          v-else
          class="m_fragments"
          name="list-complete"
          tag="div"
        >
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
              @createdFragment="
                (metaFileName) => $emit('addToCollection', { metaFileName })
              "
              @close="show_create_fragment = false"
            />
            <!-- :current_contribution_mode="current_contribution_mode" -->
          </div>

          <div
            v-for="(fragment, index) in collection_fragments"
            :key="fragment.metaFileName"
          >
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

            <div class="_buttonRow">
              <div class="_pos">
                {{ $t("position") }}
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

              <button
                type="button"
                class="_removeFromColl"
                @click="$emit('removeFromCollection', fragment.metaFileName)"
              >
                {{ $t("remove") }}
              </button>
            </div>
          </div>
          <div v-for="index in 3" :key="index" />
        </transition-group>
        <h2>
          {{ $t("fragments_not_in_collection") }}
        </h2>
        <div v-if="!other_fragments">
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
    </template>
  </Modal>
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
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_selectFragments {
  // background-color: var(--color-lightgray);
  // margin: calc(var(--spacing) * 2);
  // padding: calc(var(--spacing) * 1);

  // .app.mobile_view & {
  //   margin: 0;
  // }
}

.m_selectFragments--coll {
  // background-color: var(--color-lightgray);
  margin: calc(var(--spacing) * 2) 0;
  // padding: calc(var(--spacing) * 1);
}

h2,
small,
label {
  color: var(--color-lightgray);
  padding: 0 calc(var(--spacing) * 2);
  margin: 0;
}

._buttonRow {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  gap: calc(var(--spacing) / 2);
}

._pos {
  color: var(--color-lightgray);
}

._fsLoader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
