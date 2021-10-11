<template>
  <div
    class="m_fragmentContent custom_scrollbar"
    :style="`--fragment-width: ${fragment_width}px`"
    :class="{
      'is--highlighted': highlight_corpus,
      'is--preview': context === 'preview',
    }"
  >
    <div class="m_fragmentContent--content">
      <div class="m_fragmentContent--content--top">
        <h2>{{ fragment.title }}</h2>

        <div
          class="motscles"
          v-if="fragment.keywords && fragment.keywords.length > 0"
        >
          <div v-for="kw in fragment.keywords" :key="kw.title">
            #{{ kw.title }}
          </div>
        </div>
        <!-- <label>
          {{ $t("created") }}&nbsp;{{
            $root.formatDateToHuman(fragment.date_created)
          }}
        </label> -->
      </div>

      <div
        class="m_advancedMenu"
        v-if="context === 'edit' && $root.can_admin_corpora"
      >
        <button
          type="button"
          @click="show_advanced_menu = !show_advanced_menu"
          class="m_advancedMenu--toggleButton"
          :class="{ 'is--active': show_advanced_menu }"
        >
          <!-- <svg class="svg-icon" viewBox="0 0 20 20">
            <path
              fill="none"
              d="M3.936,7.979c-1.116,0-2.021,0.905-2.021,2.021s0.905,2.021,2.021,2.021S5.957,11.116,5.957,10
                  S5.052,7.979,3.936,7.979z M3.936,11.011c-0.558,0-1.011-0.452-1.011-1.011s0.453-1.011,1.011-1.011S4.946,9.441,4.946,10
                  S4.494,11.011,3.936,11.011z M16.064,7.979c-1.116,0-2.021,0.905-2.021,2.021s0.905,2.021,2.021,2.021s2.021-0.905,2.021-2.021
                  S17.181,7.979,16.064,7.979z M16.064,11.011c-0.559,0-1.011-0.452-1.011-1.011s0.452-1.011,1.011-1.011S17.075,9.441,17.075,10
                  S16.623,11.011,16.064,11.011z M10,7.979c-1.116,0-2.021,0.905-2.021,2.021S8.884,12.021,10,12.021s2.021-0.905,2.021-2.021
                  S11.116,7.979,10,7.979z M10,11.011c-0.558,0-1.011-0.452-1.011-1.011S9.442,8.989,10,8.989S11.011,9.441,11.011,10
                  S10.558,11.011,10,11.011z"
            />
          </svg>-->
          <!-- Generator: Adobe Illustrator 24.1.0, SVG Export Plug-In  -->
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="4px"
            height="16.2px"
            viewBox="0 0 4 16.2"
            style="enable-background: new 0 0 4 16.2"
            xml:space="preserve"
          >
            <path
              d="M0,14.1c0,1.1,0.9,2,2,2s2-0.9,2-2s-0.9-2-2-2S0,13,0,14.1z M0,2c0,1.1,0.9,2,2,2s2-0.9,2-2S3.1,0,2,0
	S0,0.9,0,2z M0,8.1c0,1.1,0.9,2,2,2s2-0.9,2-2s-0.9-2-2-2S0,7,0,8.1z"
            />
          </svg>
        </button>
        <div class="m_advancedMenu--menu" v-if="show_advanced_menu">
          <button
            type="button"
            class="button-small"
            @click="show_edit_fragment = true"
          >
            {{ $t("edit") }}
          </button>

          <button type="button" class="button-small" @click="removeFragment">
            {{ $t("remove") }}
          </button>
        </div>
      </div>

      <EditFragment
        v-if="show_edit_fragment"
        :corpus="corpus"
        :fragment="fragment"
        :all_tags="all_tags"
        :all_keywords="all_keywords"
        @close="show_edit_fragment = false"
      />

      <div
        class="m_fragmentContent--medias"
        :tabindex="context === 'preview' ? '-1' : ''"
      >
        <AddMedias
          v-if="context === 'edit'"
          :slugFolderName="slugFolderName"
          :key="'addmedia_start'"
          :collapsed="linked_medias.length > 0"
          @addMediasToFragment="
            (metaFileNames) =>
              addMediasToFragment({
                metaFileNames,
              })
          "
        />
        <transition-group name="module-switch" :duration="1000">
          <template v-for="(media, index) in linked_medias">
            <FragmentMedia
              :key="media.metaFileName"
              :media="media"
              :slugFolderName="slugFolderName"
              :index="index"
              :linked_medias="linked_medias"
              :context="context"
              @removeMedia="(d) => removeMedia(d)"
              @moveMedia="(d) => moveMedia(d)"
            />
            <AddMedias
              v-if="context === 'edit'"
              :slugFolderName="slugFolderName"
              :key="'addmedia_' + media.metaFileName"
              :collapsed="index < linked_medias.length - 1"
              @addMediasToFragment="
                (metaFileNames) =>
                  addMediasToFragment({
                    metaFileNames,
                    after_metaFileName: media.metaFileName,
                  })
              "
            />
          </template>
        </transition-group>
      </div>

      <template v-if="context === 'preview'">
        <router-link
          class="m_fragmentContent--open"
          :to="{
            name: 'Fragment',
            params: { fragmentId: fragment.media_filename },
            query: this.$route.query ? this.$route.query : {},
          }"
        >
          <span
            v-if="already_visited"
            class="m_fragmentContent--open--alreadyVisited"
          >
            {{ $t("alreay_read") }}
          </span>

          <span class="m_fragmentContent--open--open">
            {{ $t("open") }}
          </span>
        </router-link>
      </template>
    </div>
  </div>
</template>
<script>
import AddMedias from "./AddMedias.vue";
import FragmentMedia from "./FragmentMedia.vue";
import EditFragment from "./modals/EditFragment.vue";
import TagsInput from "./subcomponents/TagsInput.vue";

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

export default {
  props: {
    corpus: Object,
    fragment: Object,
    context: {
      type: String,
      default: "edit",
    },
    all_tags: Array,
    all_keywords: Array,
    medias: Array,
    slugFolderName: String,
    fragment_width: Number,
  },
  components: {
    AddMedias,
    FragmentMedia,
    EditFragment,
    TagsInput,
  },
  data() {
    return {
      show_advanced_menu: false,
      show_edit_fragment: false,
      highlight_corpus: false,
    };
  },
  created() {},
  mounted() {
    this.$eventHub.$on("scrollToFragment", this.scrollToFragment);
  },
  beforeDestroy() {
    this.$eventHub.$off("scrollToFragment", this.scrollToFragment);
  },
  watch: {},
  computed: {
    already_visited() {
      const fullPath = `/${this.slugFolderName}/${this.fragment.media_filename}`;
      return this.$root.fragments_read.includes(fullPath);
    },
    linked_medias() {
      if (
        typeof this.fragment.medias_slugs !== "object" ||
        this.fragment.medias_slugs.length === 0
      )
        return [];

      const fragment_medias = this.fragment.medias_slugs.reduce((acc, item) => {
        const linked_media = this.medias.find(
          (m) => m.metaFileName === item.metaFileName
        );
        if (linked_media) acc.push(linked_media);
        return acc;
      }, []);

      if (this.context === "preview") return fragment_medias.slice(0, 2);
      return fragment_medias;
    },
  },
  methods: {
    scrollToFragment(metaFileName) {
      if (this.fragment.metaFileName === metaFileName) {
        this.$eventHub.$emit(
          "scrollCorpus",
          this.$el.getBoundingClientRect().x
        );

        this.highlight_corpus = true;
        setTimeout(() => {
          this.highlight_corpus = false;
        }, 2000);
      }
    },
    removeFragment() {
      this.$alertify
        .okBtn(this.$t("yes"))
        .cancelBtn(this.$t("cancel"))
        .confirm(this.$t("sure_to_remove_fragment"), () => {
          this.$root.removeMedia({
            type: "corpus",
            slugFolderName: this.slugFolderName,
            slugMediaName: this.fragment.metaFileName,
          });
        });
    },
    moveMedia({ metaFileName, dir }) {
      const _medias_slugs = JSON.parse(
        JSON.stringify(this.fragment.medias_slugs)
      );

      const idx = _medias_slugs.findIndex(
        (m) => m.metaFileName === metaFileName
      );

      console.log(`METHODS • Fragment: move idx = ${idx} and dir = ${dir}`);

      if (dir < 0) {
        _medias_slugs.move(idx, idx + dir);
      } else if (dir > 0) {
        _medias_slugs.move(idx + dir, idx);
      }

      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.slugFolderName,
        slugMediaName: this.fragment.metaFileName,
        data: {
          medias_slugs: _medias_slugs,
        },
      });
    },
    addMediasToFragment({ metaFileNames, index = 0, after_metaFileName }) {
      console.log(
        `Fragment • METHODS: addMediasToFragment after_metaFileName ${after_metaFileName} or if missing at index ${index}`
      );

      let medias_slugs =
        typeof this.fragment.medias_slugs === "object"
          ? JSON.parse(JSON.stringify(this.fragment.medias_slugs))
          : [];

      if (after_metaFileName)
        index =
          medias_slugs.findIndex((m) => m.metaFileName === after_metaFileName) +
          1;

      medias_slugs.splice(
        index,
        0,
        ...metaFileNames.map((metaFileName) => ({ metaFileName }))
      );

      this.$root
        .editMedia({
          type: "corpus",
          slugFolderName: this.slugFolderName,
          slugMediaName: this.fragment.metaFileName,
          data: {
            medias_slugs,
          },
        })
        .then(() => {
          this.$nextTick(() => {
            const last_metaFileName = metaFileNames[metaFileNames.length - 1];
            this.$eventHub.$emit(
              "fragmentMedia.enableEdition",
              last_metaFileName
            );
          });
          // set media to edit mode
        });
    },
    removeMedia({ metaFileName }) {
      if (this.$root.state.dev_mode === "debug")
        console.log(
          `Fragment • METHODS: removeMedia / metaFileName = ${metaFileName}`
        );

      this.$alertify
        .okBtn(this.$t("yes"))
        .cancelBtn(this.$t("cancel"))
        .confirm(
          this.$t("sure_to_remove_media"),
          () => {
            this.$root.removeMedia({
              type: "corpus",
              slugFolderName: this.slugFolderName,
              slugMediaName: metaFileName,
            });

            if (this.fragment.medias_slugs.length > 0) {
              let new_medias_slugs = this.fragment.medias_slugs.filter(
                (m) => m.metaFileName !== metaFileName
              );
              this.$root.editMedia({
                type: "corpus",
                slugFolderName: this.slugFolderName,
                slugMediaName: this.fragment.metaFileName,
                data: {
                  medias_slugs: new_medias_slugs,
                },
              });
            }
          },
          () => {}
        );
    },
  },
};
</script>
<style lang="scss" scoped>
.m_fragmentContent {
  // margin: 0 var(--spacing);
  // width: 100%;
  // max-width: 400px;
  // flex: 1 0 100vw;
  // width: 95vw;

  // padding-right: calc(var(--spacing) / 4);
  // columns: 50ch;
  // column-gap: 1em;
  // column-fill: auto;
  // height: 90vh;
  // padding-top: 100px;

  &.is--preview .m_fragmentContent--content {
    height: 320px;
    overflow: hidden;

    &::after {
      content: "";
      display: block;

      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 15px;
      z-index: 1000;
      pointer-events: none;

      background: linear-gradient(
        180deg,
        hsla(48, 71%, 92%, 0) 0%,
        hsla(48, 71%, 92%, 15) calc(100%)
      );
    }
  }

  .m_fragmentContent--content {
    position: relative;
    // margin-top: calc(var(--spacing) * 2);
    // margin-bottom: 33vh;
    // margin-right: 4px;
    // margin-left: 4px;

    padding: calc(var(--spacing)) 0;

    // background-color: #fff;
    // background-color: #f9f3db;
    // background: linear-gradient(
    //   180deg,
    //   #fff 0%,
    //   #f9f3db calc(100% - 1px),
    //   var(--color-black) 100%
    // );
    background: var(--color-beige);
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(41, 41, 41, 0.8);

    transition: opacity 4s cubic-bezier(0.19, 1, 0.22, 1);

    > *:first-child {
      margin-top: 0;
    }
  }

  &.is--preview .m_fragmentContent--content {
    box-shadow: 0px 0px 4px 0px rgba(204, 208, 218, 0.8);
  }

  &.is--highlighted {
    .m_fragmentContent--content {
      opacity: 0;
      transition: all 0s cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  .m_fragmentContent--content--top {
    margin: calc(var(--spacing)) 0;
    padding: 0 var(--spacing);
    h2 {
      margin: 0;
      text-align: center;
    }
  }
  &.is--preview .m_fragmentContent--content--top {
    h2 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .m_fragmentContent--medias {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    // grid-gap: var(--spacing);

    // > * {
    //   display: inline-block;
    //   margin: 0;
    //   width: 25%;
    // }
  }
}

.m_advancedMenu {
  position: absolute;
  top: 0;
  right: 0;
}

.m_fragmentContent--open {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  text-decoration: none;
  // background-color: rgba(255, 255, 255, 0.1);

  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: var(--spacing);

  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

  span {
    position: absolute;
    background-color: var(--color-black);
    color: white;
    padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);
    border-radius: 0.5em;
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    text-transform: lowercase;
  }

  .m_fragmentContent--open--open {
    transform: translateY(50px);
  }
  .m_fragmentContent--open--alreadyVisited {
    background-color: var(--color-gray);
    // background-color: var(--color-bluegreen);
  }

  // &:visited {
  //   color: blue;
  //   span {
  //     color: red;
  //   }
  // }

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);

    .m_fragmentContent--open--open {
      transform: translateY(0px);
    }
    .m_fragmentContent--open--alreadyVisited {
      opacity: 0;
    }
  }
  .m_fragmentContent--open--alreadyVisited {
  }
}
</style>
