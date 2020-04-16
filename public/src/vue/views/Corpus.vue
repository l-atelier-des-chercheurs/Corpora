<template>
  <div style="width: 100%; height: 100%;">
    <CorpusPwd v-if="!can_access_corpus" :corpus="corpus" />
    <div v-else class="m_corpus" ref="corpus" @scroll="onScroll">
      <div class="m_corpus--presentation custom_scrollbar">
        <!-- <div class>
          <button type="button" @click="$root.closeCorpus()">back</button>
        </div>-->
        <Infos />

        <div class="m_corpus--presentation--content">
          <div class="m_corpus--presentation--name">
            <h1 v-if="!!corpus.name">{{ corpus.name }}</h1>
            <h3 v-if="!!corpus.subtitle">{{ corpus.subtitle }}</h3>
          </div>

          <div class="m_corpus--presentation--description">
            <!-- <label>{{ $t('description') }}</label> -->
            <p>{{ corpus.description }}</p>
          </div>
          <!-- <div class="m_corpus--presentation--tags">
          <label>{{ $t('keywords') }}</label>
          <button type="button" v-for="(tag, index) in all_tags" :key="index">{{ tag }}</button>
          </div>-->

          <div class="m_corpus--presentation--contributionModes">
            <label>{{ $t("filter_by_moments_of_contribution") }}</label>

            <CollectMode
              v-model="current_contribution_mode"
              :is_filter="true"
            />

            <div>
              <button
                type="button"
                class="button-small"
                @click="show_create_time_modal = !show_create_time_modal"
              >
                <template v-if="!show_create_time_modal">
                  {{ $t("create_a_moment") }}
                </template>
                <template v-else>{{ $t("close") }}</template>
              </button>

              <form
                class="bordered padding-small"
                v-if="show_create_time_modal"
                @submit.prevent="createNewMoment"
              >
                <div class>
                  <label>{{ $t("moments_name") }}</label>
                  <div class="flex-nowrap">
                    <input
                      type="text"
                      class
                      v-model.trim="new_moments_name"
                      required
                      autofocus
                    />
                    <input
                      type="submit"
                      style="flex: 0 1 0;"
                      :disabled="!new_moments_name"
                      :value="$t('add')"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="m_corpus--presentation--displayOptions">
            <label>{{ $t("display_options") }}</label>
            <div>
              <div class="input-checkbox">
                <input
                  type="checkbox"
                  class="switch"
                  id="display_in_tags"
                  v-model="display_in_tags"
                />
                <label for="display_in_tags">{{ $t("display_in_tags") }}</label>
              </div>
              <div class="flex-nowrap">
                <label>{{ $t("sort_fragments_by") }}&nbsp;</label>
                <div class="custom-select custom-select_tiny">
                  <select v-model="sort_fragments_by">
                    <option
                      v-for="mode in ['date_created', 'title']"
                      :key="mode"
                      :value="mode"
                      >{{ $t(mode) }}</option
                    >
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="previewURL" class="m_corpus--presentation--vignette">
          <img :src="previewURL" class draggable="false" />
        </div>
      </div>

      <div
        class="m_tags"
        ref="corpus_content"
        @wheel="/* onMousewheel */"
        @scroll="/* onTimelineScroll */"
      >
        <div class="m_tags--options">
          <button
            type="button"
            class="m_tags--options--addFragmentButton"
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
              style="enable-background: new 0 0 24 24;"
              xml:space="preserve"
            >
              <path
                style="fill: currentColor;"
                d="M0,10.5h10.5V0h2.9v10.5H24v2.9H13.5V24h-2.9V13.5H0V10.5z"
              />
            </svg>
          </button>
          <CreateFragment
            v-if="show_create_fragment"
            :corpus="corpus"
            :all_keywords="all_keywords"
            :all_tags="all_tags"
            :current_contribution_mode="current_contribution_mode"
            @close="show_create_fragment = false"
          />
        </div>

        <transition-group
          name="list-complete"
          tag="div"
          class="m_tags--allfragments"
        >
          <template v-if="display_in_tags">
            <Tag
              v-for="{ tag, fragments } in tags_with_fragments"
              :key="tag"
              :tag="tag"
              :medias="medias"
              :all_keywords="all_keywords"
              :all_tags="all_tags"
              :corpus="corpus"
              :slugFolderName="corpus.slugFolderName"
              :fragments="fragments"
              :fragment_width="fragment_width"
              :corpus_scroll_left="corpus_scroll_left"
            />
          </template>
          <template v-else>
            <Fragment
              v-for="fragment in fragments"
              :key="fragment.metaFileName"
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
    </div>
  </div>
</template>
<script>
import Infos from "../components/Infos.vue";
import CorpusPwd from "../components/modals/CorpusPwd.vue";
import Tag from "../components/Tag.vue";
import Fragment from "../components/Fragment.vue";
import CreateFragment from "../components/modals/CreateFragment.vue";
import CollectMode from "../components/subcomponents/CollectMode.vue";

export default {
  props: {
    corpus: Object,
  },
  components: {
    Infos,
    CorpusPwd,
    Tag,
    Fragment,
    CreateFragment,
    CollectMode,
  },
  data() {
    return {
      display_in_tags: true,
      sort_fragments_by: "date_created",

      show_create_fragment: false,
      new_fragment_name: "",
      new_fragment_tag: "",
      new_fragment_tag_custom: "",
      corpus_scroll_left: 0,

      show_create_time_modal: false,
      new_moments_name: "",
      current_contribution_mode: "",

      // show_fragments_for: {},
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  computed: {
    fragment_width() {
      return Math.min(325, this.$root.settings.windowWidth * 0.9);
    },
    can_access_corpus() {
      return this.$root.canAccessFolder({
        type: "corpus",
        slugFolderName: this.corpus.slugFolderName,
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
        return `${thumb[0].path}`;
      }
      return false;
    },

    medias() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      return Object.values(this.corpus.medias);
    },
    fragments() {
      if (
        typeof this.corpus.medias !== "object" ||
        Object.values(this.corpus.medias).length === 0
      )
        return false;
      let fragments = Object.values(this.corpus.medias).filter(
        (m) => m.type === "fragment"
      );

      // if current_contribution_mode is set
      // if current_contribution_mode === online, then we retrieve only fragments that don’t have contribution_moment
      if (this.current_contribution_mode !== "") {
        fragments = fragments.filter((f) => {
          if (
            this.current_contribution_mode === "online" ||
            this.current_contribution_mode === ""
          )
            return (
              !f.hasOwnProperty("contribution_moment") ||
              f.contribution_moment === "online" ||
              f.contribution_moment === ""
            );
          return f.contribution_moment === this.current_contribution_mode;
        });
      }

      if (this.sort_fragments_by === "date_created") {
        fragments = this.$_.sortBy(fragments, "date_created");
        fragments.reverse();
      } else if (this.sort_fragments_by === "title") {
        fragments.sort((a, b) => a.title.localeCompare(b.title));
      }

      return fragments;
    },
    tags_with_fragments() {
      // get all tags from fragments
      if (!this.fragments) return [];

      // get all tags
      let fragments_by_tag = this.all_tags.map((tag) => {
        const fragments_for_tag = this.fragments.filter(
          (f) =>
            !!f.tags &&
            Array.isArray(f.tags) &&
            f.tags.some((t) => t.title === tag)
        );

        return {
          tag,
          fragments: fragments_for_tag,
        };
      });

      // append all fragments
      const fragments_with_no_tags = this.fragments.filter(
        (f) => !f.tags || !Array.isArray(f.tags) || f.tags.length === 0
      );
      if (fragments_with_no_tags.length > 0) {
        fragments_by_tag.push({
          tag: "",
          fragments: fragments_with_no_tags,
        });
      }

      // fragments_by_tag.sort((a, b) => a.tag.localeCompare(b.tag));
      // fragments_by_tag = this.$_.sortBy(fragments_by_tag, "tag");

      return fragments_by_tag;
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
    onScroll() {
      this.corpus_scroll_left = this.$refs.corpus.scrollLeft;
    },
    createNewMoment() {
      let contribution_moments =
        this.corpus.hasOwnProperty("contribution_moment") &&
        Array.isArray(this.corpus.contribution_moments)
          ? JSON.parse(JSON.stringify(this.corpus.contribution_moments))
          : [];

      // check if moment already exists
      if (contribution_moments.some((m) => m.name === this.new_moments_name)) {
        this.$alertify
          .closeLogOnClick(true)
          .delay(4000)
          .success(this.$t("moment_already_exists") + this.author.name);
      }

      contribution_moments.push({
        name: this.new_moments_name,
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  overflow-x: auto;

  > * {
    flex: 0 0 auto;
  }

  &::after {
    content: "";
    display: block;
    flex: 0 0 100px;
    height: 100%;
  }
}

.m_corpus--presentation {
  // position: absolute;
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 2);
  margin-right: calc(var(--spacing) * 2);
  z-index: 1;
  // in case of very small height of viewport
  max-height: 100vh;
  max-width: 66ch;
  overflow-y: auto;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  > * {
    margin-bottom: calc(var(--spacing));
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

.m_corpus--presentation--displayOptions {
  > div {
    border-left: 2px solid var(--color-bluegreen);
    padding-left: calc(var(--spacing) / 2);

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
}

.m_tags {
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;

  height: 100%;

  &::after {
    display: block;
    content: "";
    // background-color: red;
    width: calc(var(--spacing) * 2);
    height: 100%;
  }
}

.m_tags--options {
  display: flex;
  flex-flow: column wrap;
  margin: calc(var(--spacing) * 1.9) 0;

  .m_tags--options--addFragmentButton {
    background-color: white;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    padding: 0;
    font-size: 4em;
    width: 1em;
    height: 1em;
    border-radius: 50%;
  }
}

.m_tags--alltags {
  position: fixed;
  // position: relative;
  width: 100%;

  h2 {
    display: inline-block;
    background-color: #fff;
    padding: var(--spacing);
    border: 2px solid currentColor;
    margin-right: var(--spacing);
  }
}

.m_tags--allfragments {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  min-width: max-content;
  overflow-y: auto;

  padding-left: var(--spacing);
}
</style>
