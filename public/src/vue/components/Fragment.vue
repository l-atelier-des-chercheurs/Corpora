<template>
  <div
    class="m_fragment custom_scrollbar"
    :style="`--fragment-width: ${fragment_width}px`"
  >
    <div class="m_fragment--content">
      <div class="m_fragment--content--top">
        <h2>{{ fragment.title }}</h2>
      </div>
      <div class="m_fragment--content--top">
        <label>
          {{ $t("created") }}&nbsp;{{
            $root.formatDateToHuman(fragment.date_created)
          }}
        </label>
      </div>

      <div class="m_advancedMenu">
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
          </svg> -->
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
            style="enable-background: new 0 0 4 16.2;"
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

      <div class="m_fragment--medias">
        <AddMedias
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
              @removeMedia="(d) => removeMedia(d)"
              @moveMedia="(d) => moveMedia(d)"
            />
            <AddMedias
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
    </div>
  </div>
</template>
<script>
import AddMedias from "./AddMedias.vue";
import FragmentMedia from "./FragmentMedia.vue";
import EditFragment from "./modals/EditFragment.vue";

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

export default {
  props: {
    corpus: Object,
    fragment: Object,
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
  },
  data() {
    return {
      show_advanced_menu: false,
      show_edit_fragment: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    linked_medias() {
      if (
        typeof this.fragment.medias_slugs !== "object" ||
        this.fragment.medias_slugs.length === 0
      )
        return [];

      return this.fragment.medias_slugs.reduce((acc, item) => {
        const linked_media = this.medias.find(
          (m) => m.metaFileName === item.metaFileName
        );
        if (linked_media) acc.push(linked_media);
        return acc;
      }, []);
    },
  },
  methods: {
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

      // this.fragment.medias_slugs = medias_slugs;

      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.slugFolderName,
        slugMediaName: this.fragment.metaFileName,
        data: {
          medias_slugs,
        },
      });

      // set created media(s) to edit mode
      this.$root.settings.text_media_being_edited = metaFileNames[0];
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
.m_fragment {
  // margin: 0 var(--spacing);
  // width: 100%;
  // max-width: 400px;
  // flex: 1 0 100vw;
  // width: 95vw;

  flex: 0 0 var(--fragment-width);
  overflow-y: auto;
  // padding-right: calc(var(--spacing) / 4);
  // columns: 50ch;
  // column-gap: 1em;
  // column-fill: auto;
  // height: 90vh;
  // padding-top: 100px;

  .m_fragment--content {
    position: relative;
    margin-top: calc(var(--spacing) * 2);
    margin-bottom: 50vh;
    margin-right: 4px;
    margin-left: 4px;

    padding: calc(var(--spacing) / 2);

    // background-color: #fff;
    // background-color: #f9f3db;
    background: linear-gradient(
      180deg,
      #fff 0%,
      #f9f3db calc(100% - 1px),
      #000 100%
    );

    border-radius: 2px;

    > *:first-child {
      margin-top: 0;
    }
  }

  .m_fragment--content--top {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing);
    padding-right: var(--spacing);
    h2 {
      margin: 0;
    }
  }

  .m_fragment--medias {
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
</style>
