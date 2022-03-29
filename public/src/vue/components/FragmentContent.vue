<template>
  <div
    class="m_fragmentContent custom_scrollbar"
    :class="{
      'is--preview': context === 'preview',
      'was--read': already_read,
    }"
  >
    <div
      class="m_fragmentContent--content"
      :class="{
        'is--opened':
          $route.params.fragmentId &&
          fragment.media_filename === $route.params.fragmentId,
      }"
      @mouseenter="updateMouseCoords"
    >
      <div
        class="m_fragmentContent--content--inner"
        :style="`
            --random_angle : ${random_angle};
            //--slide_on_hover: ${slide_on_hover}rem;
          `"
      >
        <div class="m_fragmentContent--content--inner--top">
          <div class="_meta" @click="show_advanced_meta = !show_advanced_meta">
            <div v-if="!show_advanced_meta" class="_meta--oneLine">
              <div class="_date">
                {{
                  $root.formatDate({ date: fragment.date_created, format: "L" })
                }}
              </div>
              <!-- <div class="ta-ce" v-if="already_read">
                {{ $t("already_read") }}
              </div> -->
              <div class="_time">
                {{
                  $root.formatDate({
                    date: fragment.date_created,
                    format: "LT",
                  })
                }}
              </div>
            </div>
            <div v-else>
              {{ $t("created") }}
              <div class="_meta--oneLine">
                <div class="_date">
                  {{
                    $root.formatDate({
                      date: fragment.date_created,
                      format: "L",
                    })
                  }}
                </div>
                <div class="_time">
                  {{
                    $root.formatDate({
                      date: fragment.date_created,
                      format: "LT",
                    })
                  }}
                </div>
              </div>
              {{ $t("edited") }}
              <div class="_meta--oneLine">
                <div class="_date">
                  {{
                    $root.formatDate({
                      date: fragment.date_modified,
                      format: "L",
                    })
                  }}
                </div>
                <div class="_time">
                  {{
                    $root.formatDate({
                      date: fragment.date_modified,
                      format: "LT",
                    })
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="_title">
            <h2>{{ fragment.title }}</h2>
          </div>
        </div>

        <div class="_editFragmentOptions" v-if="fragment_can_be_edited">
          <button
            type="button"
            class="button-small"
            @click="show_edit_fragment = true"
          >
            {{ $t("edit") }}
          </button>
          <button type="button" class="button-small" @click="removeFragment">
            {{ $t("remove_this_story") }}
          </button>

          <div
            v-if="
              !$root.can_admin_corpora &&
              fragment_was_created_x_minutes_ago < 30
            "
            class="_editingNotice"
          >
            <small
              v-html="
                $t('available_30_minutes_after_creation,still') +
                ' ' +
                (30 - fragment_was_created_x_minutes_ago) +
                ')'
              "
            />
          </div>
        </div>

        <div class="m_fragmentContent--content--inner--kw">
          <div
            class="m_keywordField m_keywordField--inline margin-bottom-verysmall"
            v-if="
              context !== 'preview' && fragment.tags && fragment.tags.length > 0
            "
          >
            <span v-for="tag in fragment.tags" :key="tag.title" class="tag">
              {{ tag.title }}
            </span>
          </div>
          <div
            class="m_keywordField m_keywordField--inline margin-bottom-verysmall"
            v-if="
              context !== 'preview' &&
              fragment.keywords &&
              fragment.keywords.length > 0
            "
          >
            <span
              v-for="kw in fragment.keywords"
              class="keyword"
              :key="kw.title"
            >
              {{ kw.title }}
            </span>
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
          class="_fragmentPreview"
          v-if="context === 'preview'"
          tabindex="-1"
        >
          <template v-if="preview_media">
            <FragmentMedia
              class="_fragmentPreview--media"
              :media="preview_media"
              :slugFolderName="slugFolderName"
              context="preview"
              :data-mediatype="preview_media.type"
            />
            <div
              class="_fragmentPreview--overlay"
              v-if="preview_media.type === 'image'"
            />
          </template>
          <template v-else>
            <div class="_fragmentPreview--media ta-ce lowerc">
              <small
                ><i>{{ $t("no_preview") }}</i></small
              >
            </div>
          </template>
        </div>

        <div v-else class="m_fragmentContent--medias">
          <transition-group name="module-switch" :duration="1000">
            <template v-for="(media, index) in linked_medias">
              <FragmentMedia
                :key="media.metaFileName"
                :media="media"
                :slugFolderName="slugFolderName"
                :index="index"
                :can_be_edited="fragment_can_be_edited"
                :linked_medias="linked_medias"
                :context="context"
                @removeMedia="(d) => removeMedia(d)"
                @moveMedia="(d) => moveMedia(d)"
              />
              <!-- <AddMedias
                v-if="
                  fragment_can_be_edited && index === linked_medias.length - 1
                "
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
              /> -->
            </template>
          </transition-group>
          <AddMedias
            v-if="fragment_can_be_edited"
            :slugFolderName="slugFolderName"
            :key="'addmedia_start'"
            @addMediasToFragment="
              (metaFileNames) =>
                addMediasToFragment({
                  metaFileNames,
                  index: linked_medias.length,
                })
            "
          />
        </div>

        <template v-if="context === 'preview'">
          <router-link
            class="m_fragmentContent--open"
            :to="{
              name: 'Fragment',
              params: { fragmentId: fragment.media_filename },
              query: $route.query ? $route.query : {},
            }"
          >
          </router-link>
        </template>
      </div>
      <div class="_comments">
        {{ $t("comment") }}
        <div>
          <small v-if="!fragment.comments" class="text-gray">
            {{ $t("no_comment_yet") }}
          </small>
          <TextField
            :field_name="'comments'"
            :content="fragment.comments"
            type2="media"
            :metaFileName="fragment.metaFileName"
            :slugFolderName="slugFolderName"
            :allow_editing="true"
          />
        </div>
      </div>
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
      show_advanced_meta: false,
      show_edit_fragment: false,

      random_angle: (Math.random() - 0.5) * 4,
      slide_on_hover: 1,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    fragment_can_be_edited() {
      return (
        this.context === "edit" &&
        (this.$root.can_admin_corpora ||
          this.fragment_was_created_x_minutes_ago < 30)
      );
    },
    fragment_was_created_x_minutes_ago() {
      const ellapsed = this.$moment
        .duration(
          this.$moment(this.$root.currentTime)
            .utc()
            .add(1, "hours")
            .diff(this.$moment.utc(this.fragment.date_created))
        )
        .asMinutes();
      return Math.floor(ellapsed);
    },
    already_read() {
      return (
        this.$root.alreadyVisited({
          slugFolderName: this.slugFolderName,
          fragmentId: this.fragment.media_filename,
        }) && this.context === "preview"
      );
    },

    preview_media() {
      if (this.linked_medias.length === 0) return false;

      let preview = undefined;

      // find first image
      preview = this.linked_medias.find((m) => m.type === "image");

      // if none, get first text
      if (!preview) preview = this.linked_medias.find((m) => m.type === "text");

      // if none, then too bad
      return preview;
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

      return fragment_medias;
    },
  },
  methods: {
    updateMouseCoords(event) {
      // const percent_hover_x = event.offsetX / event.target.offsetWidth;
      // this.random_angle = (percent_hover_x - 0.5) * 6;
      // const percent_hover_y = event.offsetY / event.target.offsetHeight;
      // this.slide_on_hover = Math.min(1, percent_hover_y * 1);
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

          this.$router.push({
            name: "Corpus",
            query: this.$route.query ? this.$route.query : {},
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
  position: relative;
  width: 100%;

  .m_fragmentContent--content {
    position: relative;
  }

  &.is--preview .m_fragmentContent--content {
    --slide_on_hover: 1rem;
    --move_top_for_slide: calc(-1.8 * var(--slide_on_hover));
    --preview_height: 260px;

    height: var(--preview_height);
    overflow: hidden;
    padding: 0;
    pointer-events: none;

    margin-top: var(--move_top_for_slide);
    padding-top: calc(-1 * var(--move_top_for_slide));

    width: calc(100% + var(--slide_on_hover));
    margin-left: calc(-0.5 * var(--slide_on_hover));
    margin-right: calc(-0.5 * var(--slide_on_hover));
    padding-left: calc(0.5 * var(--slide_on_hover));
    padding-right: calc(0.5 * var(--slide_on_hover));

    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    // box-shadow: 0px 0px 4px 0px rgba(204, 208, 218, 0.8);

    &::after {
      content: "";
      display: block;

      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0px;
      // z-index: 10;
      pointer-events: none;

      // background: linear-gradient(
      //   180deg,
      //   hsla(48, 71%, 92%, 0) 0%,
      //   hsla(48, 71%, 92%, 0.25) 35%,
      //   hsla(48, 71%, 92%, 0.5) 65%,
      //   hsla(48, 71%, 92%, 1) 100%
      // );

      // background: hsla(48, 71%, 92%, 1);
      // background: black;
      box-shadow: 0 0 0.5rem 0.75rem var(--color-lightgray);
      background: var(--color-lightgray);
      // box-shadow: inset 0.5rem 0.5rem red;

      transition: all 1.5s cubic-bezier(0.19, 1, 0.22, 1);
    }

    .m_fragmentContent--content--inner {
      margin: 0;
      box-shadow: 0 0 0.5rem 0rem var(--color-lightgray);
      pointer-events: auto;
      height: var(--preview_height);
      overflow: hidden;

      transform-origin: 50% 100px;
    }

    .m_fragmentContent--content--inner--top {
      ._title {
        height: 5.5em;
        min-height: 0;
      }

      h2 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;

        font-size: 1.3rem;
      }
    }

    &:hover,
    &.is--opened {
      .m_fragmentContent--content--inner {
        transform: translateY(calc(-1 * var(--slide_on_hover)));
        // transform: translateY(calc(-1 * var(--slide_on_hover)))
        //   rotate(calc(var(--random_angle) * 1deg)) scale(1);
        color: var(--color-blue);
      }

      ._fragmentPreview {
      }
    }
  }

  &.is--preview.was--read {
    .m_fragmentContent--content--inner--top {
      color: var(--color-blue);
    }
  }

  .m_fragmentContent--content--inner {
    position: relative;
    pointer-events: auto;
    padding: calc(var(--spacing) / 2) 0 calc(var(--spacing));
    margin: calc(var(--spacing) * 1) 0;
    border-top: 1px solid var(--color-blue);
    border-bottom: 1px solid var(--color-blue);
    background: white;

    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }
}

.m_fragmentContent--content--inner--top {
  margin: 0 0;
  padding: 0 calc(var(--spacing));
  text-align: center;

  ._title {
    margin: calc(var(--spacing) / 1) 0;
    padding: 0 calc(var(--spacing) / 2);
    min-height: 10em;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;

    h2 {
      display: block;
      margin: 0;
    }
  }

  ._meta {
    font-family: var(--ff-top-level);
    font-size: var(--font-size-small);

    text-transform: lowercase;
    text-align: left;
    // margin-left: calc(var(--spacing) / -2);
    // margin-right: calc(var(--spacing) / -2);
  }

  ._meta--oneLine {
    display: flex;
    justify-content: space-between;

    > * {
      flex: 1 1 50px;

      &:last-child {
        text-align: right;
      }
    }
  }
}

.m_fragmentContent--content--inner--kw {
  margin: 0 0;
  padding: 0 calc(var(--spacing));
}

.m_fragmentContent--medias {
  margin-top: calc(var(--spacing) * 1);
  // display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  // grid-gap: var(--spacing);

  // > * {
  //   display: inline-block;
  //   margin: 0;
  //   width: 25%;
  // }
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
  z-index: 11;
  text-decoration: none;
  pointer-events: auto;

  min-height: var(--preview_height);
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

  // &:visited {
  //   color: blue;
  //   span {
  //     color: red;
  //   }
  // }

  &:hover {
    // background-color: rgba(255, 255, 255, 0.45);

    .m_fragmentContent--open--open {
      transform: translateY(0px);
    }
  }
}

._fragmentPreview {
  // filter: brightness(80%) sepia(100%) hue-rotate(201deg) saturate(1260%);
  position: relative;
  ._fragmentPreview--media {
    color: var(--color-blue);

    &[data-mediatype="image"] {
      filter: grayscale(100%) brightness(125%) contrast(100%);
    }
    &[data-mediatype="text"] {
      margin-top: calc(var(--spacing) / -4);
    }
  }
}
._fragmentPreview--overlay {
  background-color: rgba(84, 68, 255, 0.9);
  mix-blend-mode: multiply;
  position: absolute;
  top: 0;
  width: calc(100% - var(--spacing) * 2);
  height: 100%;
  margin: calc(var(--spacing) / 2) calc(var(--spacing));
}

.m_advancedMenu {
  position: sticky;
  top: 0;
  margin: 0 auto;
  z-index: 150;
  background: transparent;
  max-width: 230px;

  justify-content: center;
  text-align: center;

  .m_advancedMenu--toggleButton {
    position: relative;
  }
}

._editFragmentOptions {
  background: white;
  padding: 0 calc(var(--spacing) * 1);
  margin-left: calc(var(--spacing) / -4);
  margin-bottom: calc(var(--spacing));
  text-align: center;

  ._editingNotice {
    margin-left: calc(var(--spacing) / 4);
    margin-bottom: calc(var(--spacing) / 2);
  }
}

._comments {
  margin: calc(var(--spacing) * 1) 0;
  background: white;
  padding: calc(var(--spacing)) calc(var(--spacing));
  border-top: 1px solid var(--color-blue);
  border-bottom: 1px solid var(--color-blue);

  ::v-deep .mediaTextContent {
    margin-left: calc(var(--spacing) / -4);
    // padding-left: 0;
  }
}
</style>
<style lang="scss">
._fragmentPreview--media {
  .mediaTextContent {
    font-size: 1em;
  }
}
</style>
