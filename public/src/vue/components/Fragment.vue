<template>
  <div class="m_fragment">
    <div class="m_fragment--content">
      <div class="m_fragment--content--top">
        <h2>{{ fragment.title }}</h2>

        <button type="button" @click="show_edit_fragment = true">
          edit
        </button>

        <button type="button" @click="removeFragment">
          remove
        </button>

        <EditFragment
          v-if="show_edit_fragment"
          :corpus="corpus"
          :fragment="fragment"
          :all_tags="all_tags"
          @close="show_edit_fragment = false"
        />
      </div>
      <!-- {{ linked_medias }} -->
      <div class="m_fragment--medias">
        <transition-group name="module-switch" :duration="1000">
          <div
            class="m_fragment--medias--media"
            v-for="media in linked_medias"
            :key="media.metaFileName"
          >
            <CollaborativeEditor
              v-if="
                media.type === 'text' &&
                  $root.settings.text_media_being_edited === media.metaFileName
              "
              v-model="media.content"
              :media="media"
              :enable_collaboration="true"
              :slugFolderName="slugFolderName"
              ref="textField"
            />
            <MediaContent
              v-else
              v-model="media.content"
              :slugFolderName="slugFolderName"
              :media="media"
              :preview_size="360"
            />

            <button
              type="button"
              class="_edit_text_button"
              v-if="
                media.type === 'text' &&
                  $root.settings.text_media_being_edited !== media.metaFileName
              "
              @click="setTextBlocToEdit(media.metaFileName)"
            >
              <svg
                version="1.1"
                class="inline-svg inline-svg-larger"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="100.7px"
                height="101px"
                viewBox="0 0 100.7 101"
                style="enable-background:new 0 0 100.7 101;"
                xml:space="preserve"
              >
                <path
                  class=""
                  d="M100.7,23.2L77.5,0l-66,66.2l0,0L0,101l34.7-11.6l0,0L100.7,23.2z M19.1,91.5l-9.4-9.7l4-12.4l18,17.8
              L19.1,91.5z"
                />
              </svg>
            </button>

            <button
              type="button"
              class="_remove_media"
              @click="removeMedia(media.metaFileName)"
            >
              ×
            </button>
          </div>
        </transition-group>
      </div>

      <AddMedias
        :slugFolderName="slugFolderName"
        @newMediaCreated="newMediaCreated"
      />
    </div>
  </div>
</template>
<script>
import AddMedias from "./AddMedias.vue";
import EditFragment from "./modals/EditFragment.vue";
import MediaContent from "./MediaContent.vue";
import CollaborativeEditor from "./CollaborativeEditor.vue";

export default {
  props: {
    corpus: Object,
    fragment: Object,
    all_tags: Array,
    medias: Array,
    slugFolderName: String
  },
  components: {
    AddMedias,
    EditFragment,
    MediaContent,
    CollaborativeEditor
  },
  data() {
    return {
      context: "preview",
      show_edit_fragment: false
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
          m => m.metaFileName === item.metaFileName
        );
        if (linked_media) acc.push(linked_media);
        return acc;
      }, []);
    }
  },
  methods: {
    removeFragment() {
      this.removeMedia(this.fragment.metaFileName);
    },
    newMediaCreated(metaFileName) {
      if (window.state.dev_mode === "debug")
        console.log("Fragment • METHODS: newMediaCreated");

      let medias_slugs =
        typeof this.fragment.medias_slugs === "object"
          ? JSON.parse(JSON.stringify(this.fragment.medias_slugs))
          : [];

      medias_slugs.push({
        metaFileName: metaFileName
      });

      this.fragment.medias_slugs = medias_slugs;

      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.slugFolderName,
        slugMediaName: this.fragment.metaFileName,
        data: {
          medias_slugs
        }
      });
    },
    setTextBlocToEdit(metaFileName) {
      if (window.state.dev_mode === "debug")
        console.log(
          `Fragment • METHODS: setTextBlocToEdit for ${metaFileName}`
        );

      this.$root.settings.text_media_being_edited = metaFileName;
    },
    removeMedia(metaFileName) {
      if (this.$root.state.dev_mode === "debug")
        console.log(
          `Fragment • METHODS: removeMedia / metaFileName = ${metaFileName}`
        );

      this.$alertify
        .okBtn(this.$t("yes"))
        .cancelBtn(this.$t("cancel"))
        .confirm(
          this.$t("sure_to_remove"),
          () => {
            this.$root.removeMedia({
              type: "corpus",
              slugFolderName: this.slugFolderName,
              slugMediaName: metaFileName
            });

            if (this.fragment.medias_slugs.length > 0) {
              let new_medias_slugs = this.fragment.medias_slugs.filter(
                m => m.metaFileName !== metaFileName
              );

              this.$root.editFolder({
                type: "corpus",
                slugFolderName: this.slugFolderName,
                data: {
                  medias_slugs: new_medias_slugs
                }
              });
            }
          },
          () => {}
        );
    }
  }
};
</script>
<style lang="scss" scoped>
.m_fragment {
  // margin: 0 var(--spacing);
  // width: 100%;
  max-width: 400px;
  flex: 0 1 100vw;

  overflow-y: auto;
  // columns: 50ch;
  // column-gap: 1em;
  // column-fill: auto;
  // height: 90vh;
  // padding-top: 100px;

  --scrollbarBG: #e2edef;
  --thumbBG: #90a4ae;

  &::-webkit-scrollbar {
    width: 11px;
  }
  & {
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  }
  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 6px;
    border: 3px solid var(--scrollbarBG);

    &:hover {
      background-color: #ccd0da;
    }
  }

  .m_fragment--content {
    padding: var(--spacing);
    margin: calc(var(--spacing) * 1) calc(var(--spacing) * 1);

    background-color: #f9f3db;
    background: linear-gradient(
      180deg,
      #fff 50%,
      #f9f3db calc(100% - 1px),
      #000 100%
    );
    // border: 0.5px solid black;

    border-radius: 2px;

    > *:first-child {
      margin-top: 0;
    }
  }

  .m_fragment--content--top {
    h2 {
      margin: 0;
    }
  }

  .m_fragment--medias {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    // grid-gap: var(--spacing);

    .m_fragment--medias--media {
      position: relative;
      margin-top: calc(var(--spacing) * 2);
      // border-right: 2px solid #eee;

      // border: 2px solid gray;

      background-color: #fff;
      // background: linear-gradient(-90deg, #e8f4eb, transparent);

      // &::before {
      //   content: "•";
      //   position: absolute;
      //   bottom: 100%;
      //   right: 100%;
      //   // width: 100%;

      //   display: block;
      //   height: 1em;
      //   // margin-bottom: calc(var(--spacing) * 0.5);
      //   // text-align: center;
      // }

      border-right: 2px solid transparent;
      &:hover {
        border-right: 2px solid var(--active-color);
      }

      ._edit_text_button {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        cursor: pointer;

        background: transparent;

        transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

        &:hover {
          background-color: rgba(204, 208, 218, 0.1);
        }

        svg {
          width: 12px;
          height: 12px;
        }
      }

      ._remove_media {
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
        font-size: 1.5em;
        line-height: 1;

        &:hover {
          background-color: #eee;
        }
      }
    }

    // > * {
    //   display: inline-block;
    //   margin: 0;
    //   width: 25%;
    // }
  }
}
</style>
