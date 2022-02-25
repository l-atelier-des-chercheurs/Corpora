<template>
  <div
    class="m_fragmentMedia"
    :data-type="media.type"
    :class="{
      'is--beingEdited': is_being_edited,
      'is--savingMedia': is_saving_media,
    }"
    @mouseenter="is_touch ? '' : (is_hovered = true)"
    @mouseleave="is_touch ? '' : (is_hovered = false)"
  >
    <div class="m_fragmentMedia--content">
      <CollaborativeEditor
        v-if="media.type === 'text' && is_being_edited"
        v-model="mediadata.content"
        :media="media"
        :enable_collaboration="true"
        :slugFolderName="slugFolderName"
        ref="textField"
      />

      <!-- <template v-else-if="media.type === 'embed' && is_being_edited">
        <select v-model="expected_embed_format">
          <option>Vimeo</option>
          <option>YouTube</option>
          <option>Twitter</option>
        </select>
        <input
          type="url"
          class="border-none bg-transparent"
          placeholder="URL"
          v-model="mediadata.content"
          ref="textField"
        />
        <small
          v-html="
            $t('embed_instructions_' + expected_embed_format.toLowerCase())
          "
        />
      </template> -->
      <template
        v-else-if="
          (media.type === 'link' || media.type === 'embed') && is_being_edited
        "
      >
        <!-- <div v-if="!!media.content && media.content.length > 0">
          {{ mediadata.content }}
        </div>
        <template v-else> -->
        <label>{{ $t("link") }}</label>
        <div>
          <input
            type="url"
            class="border-none bg-transparent"
            placeholder="URL"
            v-model="mediadata.content"
            ref="textField"
          />
        </div>
        <div>
          <small v-html="$t('link_instructions')" />
        </div>
        <!-- </template> -->
        <template v-if="should_be_embed">
          <div>
            <small>
              <i>
                {{ $t("embed") }}
              </i>
            </small>
          </div>
        </template>
      </template>

      <MediaContent
        v-else
        ref="mediaContent"
        v-model="media.content"
        :context="media_context"
        :slugFolderName="slugFolderName"
        :media="media"
        :read_only="false"
        :preview_size="600"
      />
      <button
        type="button"
        class="plyr__controls__item plyr__control _open_fullscreen"
        @click="openMedia"
        v-if="
          media_context !== 'preview' &&
          (media.type === 'image' || media.type === 'document')
        "
      >
        <svg class="icon--pressed" role="presentation" focusable="false">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="/images/plyr.svg#plyr-exit-fullscreen"
          />
        </svg>
        <svg class="icon--not-pressed" role="presentation" focusable="false">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="/images/plyr.svg#plyr-enter-fullscreen"
          />
        </svg>
        <span class="label--pressed plyr__sr-only">Exit fullscreen</span>
        <span class="label--not-pressed plyr__sr-only">Enter fullscreen</span>
      </button>
      <!-- <button
        type="button"
        class="plyr__controls__item plyr__control _open_fullscreen"
        @click="loadEmbed"
        v-if="
          media_context !== 'preview' &&
          (media.type === 'link' || should_be_embed)
        "
      >
        {{ $t("load") }}
      </button> -->
    </div>
    <div class="m_fragmentMedia--infos">
      <div
        class="m_fragmentMedia--infos--caption"
        v-if="is_being_edited || media.caption"
      >
        <label v-if="is_being_edited">{{ $t("description_source") }}</label>
        <div>
          <template v-if="!is_being_edited">
            <span
              :content="$t('caption')"
              v-tippy="{
                placement: 'bottom',
                delay: [600, 0],
              }"
              >{{ media.caption }}</span
            >
          </template>
          <template v-else>
            <input type="text" v-model="mediadata.caption" placeholder="…" />
          </template>
        </div>
      </div>
      <div
        class="m_fragmentMedia--infos--source"
        :class="{
          'is--beingEdited': is_being_edited,
        }"
        v-if="
          (is_being_edited || media.source) &&
          media.type !== 'link' &&
          media.type !== 'embed'
        "
      >
        <label v-if="is_being_edited">{{ $t("link") }}</label>
        <div>
          <component
            v-if="!is_being_edited"
            :is="media_source_is_link ? 'a' : 'span'"
            target="_blank"
            rel="noopener noreferrer"
            :href="media.source"
            :title="media.source"
            v-html="media.source"
          />
          <input
            v-else
            type="url"
            v-model="mediadata.source"
            placeholder="www."
          />
        </div>
      </div>
    </div>

    <div
      class="m_advancedMenu"
      :class="{
        'is--open': show_advanced_menu_for_media,
      }"
      v-if="can_be_edited"
    >
      <template v-if="!(is_being_edited && !is_saving_media)">
        <button
          type="button"
          @click="show_advanced_menu_for_media = !show_advanced_menu_for_media"
          class="m_advancedMenu--toggleButton"
          :class="{
            'is--active': show_advanced_menu_for_media,
          }"
        >
          <template v-if="!show_advanced_menu_for_media">
            {{ $t("edit") }}
          </template>
          <template v-else>×</template>
        </button>
        <div class="m_advancedMenu--menu" v-if="show_advanced_menu_for_media">
          <button
            type="button"
            v-if="!is_being_edited"
            @click="enableEdition(media.metaFileName)"
          >
            {{ $t("edit") }}
          </button>
          <button
            type="button"
            v-if="index > 0"
            @click="
              $emit('moveMedia', { metaFileName: media.metaFileName, dir: -1 })
            "
          >
            {{ $t("moveup") }}
          </button>
          <button
            type="button"
            v-if="index < linked_medias.length - 1"
            @click="
              $emit('moveMedia', { metaFileName: media.metaFileName, dir: +1 })
            "
          >
            {{ $t("movedown") }}
          </button>
          <a
            class="button"
            v-if="!['link', 'embed'].includes(media.type)"
            :download="media.media_filename"
            :href="mediaURL"
            target="_blank"
            >{{ $t("download") }}</a
          >
          <button
            type="button"
            @click="
              $emit('removeMedia', { metaFileName: media.metaFileName });
              show_advanced_menu_for_media = false;
            "
          >
            {{ $t("remove") }}
          </button>
        </div>
      </template>
    </div>

    <div class="_editingMenu" v-if="is_being_edited && !is_saving_media">
      <button
        type="button"
        v-if="is_empty"
        @click="
          $emit('removeMedia', { metaFileName: media.metaFileName });
          show_advanced_menu_for_media = false;
        "
      >
        {{ $t("remove") }}
      </button>
      <button type="button" v-else @click="is_being_edited = false">
        {{ $t("cancel") }}
      </button>
      <button type="button" @click="saveMedia">
        {{ $t("save") }}
      </button>
    </div>

    <ShowMedia
      v-if="show_in_modal"
      :media="media"
      :slugFolderName="slugFolderName"
      @close="show_in_modal = false"
    />

    <transition name="fade" :duration="600">
      <Loader v-if="is_saving_media" />
    </transition>
  </div>
</template>
<script>
import MediaContent from "./subcomponents/MediaContent.vue";
import ShowMedia from "./modals/ShowMedia.vue";
import CollaborativeEditor from "./subcomponents/CollaborativeEditor.vue";

export default {
  props: {
    slugFolderName: String,
    media: Object,
    index: Number,
    linked_medias: Array,
    context: String,
    can_be_edited: Boolean,
  },
  components: {
    MediaContent,
    ShowMedia,
    CollaborativeEditor,
  },
  data() {
    return {
      show_advanced_menu_for_media: false,

      mediadata: {
        caption: this.media.caption,
        source: this.media.source,
        content: this.media.content,
      },

      is_hovered: false,

      show_in_modal: false,
      expected_embed_format: "Vimeo",

      mediaURL: `/${this.slugFolderName}/${this.media.media_filename}`,

      is_being_edited: false,
      is_saving_media: false,
    };
  },
  created() {},
  mounted() {
    this.$eventHub.$on("fragmentMedia.enableEdition", this.enableEdition);
  },
  beforeDestroy() {
    this.$eventHub.$off("fragmentMedia.enableEdition", this.enableEdition);
  },
  watch: {
    // "$root.settings.text_media_being_edited": function () {
    //   console.log(
    //     `FragmentMedia • WATCH: $root.settings.text_media_being_edited. Is self ? ${
    //       this.$root.settings.text_media_being_edited ===
    //       this.media.metaFileName
    //     }`
    //   );
    //   if (this.is_being_edited) {
    //     this.saveMedia();
    //   } else if (
    //     this.$root.settings.text_media_being_edited === this.media.metaFileName
    //   ) {
    //     this.is_being_edited = true;
    //     this.mediadata = {
    //       caption: this.media.caption,
    //       source: this.media.source,
    //       content: this.media.content,
    //     };
    //   }
    // },
    is_touch: function () {
      // if (!this.is_touch && !this.is_hovered)
      //   this.show_advanced_menu_for_media = false;
    },
    is_hovered: function () {
      // if (!this.is_touch && !this.is_hovered)
      //   this.show_advanced_menu_for_media = false;
    },
  },
  computed: {
    is_touch() {
      return Modernizr.touchevents;
    },
    media_source_is_link() {
      return true;
      return ["http", "www"].some((s) => this.media.source.startsWith(s));
    },
    should_be_embed() {
      if (
        this.mediadata.content.includes("vimeo.com") ||
        this.mediadata.content.includes("youtube.com") ||
        this.mediadata.content.includes("youtu.be") ||
        this.mediadata.content.includes("soundcloud.com") ||
        this.mediadata.content.includes("twitter.com")
      )
        return true;
      return false;
    },
    is_empty() {
      if (
        this.media.type === "text" ||
        this.media.type === "embed" ||
        this.media.type === "link"
      ) {
        if (
          !this.mediadata.content &&
          !this.mediadata.caption &&
          !this.mediadata.source
        ) {
          return true;
        }
      }

      return false;
    },
    media_context() {
      if (this.context === "preview") return "preview";
      // if (this.media.type === "image") return "preview";
      if (this.is_being_edited) return "edit";
      return "";
    },
  },
  methods: {
    enableEdition(metaFileName) {
      if (
        this.media.metaFileName === metaFileName &&
        this.context !== "preview"
      ) {
        this.is_being_edited = true;
      }
    },
    saveMedia() {
      this.is_saving_media = true;

      // if (this.media.type === "link" && this.should_be_embed)
      //   this.mediadata.type = "embed";
      // if (this.media.type === "embed" && !this.should_be_embed)
      //   this.mediadata.type = "link";

      if (this.media.type === "link" && this.should_be_embed)
        this.mediadata.content = this.mediadata.content.trim();

      this.$root
        .editMedia({
          type: "corpus",
          slugFolderName: this.slugFolderName,
          slugMediaName: this.media.metaFileName,
          data: this.mediadata,
        })
        .then(() => {
          setTimeout(() => {
            this.is_being_edited = false;
            this.is_saving_media = false;
            // this.$alertify
            //   .closeLogOnClick(true)
            //   .delay(4000)
            //   .success(this.$t("saved_media"));
          }, 250);
        })
        .catch(() => {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t("failed_to_save_media"));

          this.is_saving_media = false;
        });
      this.show_advanced_menu_for_media = false;
    },
    openMedia() {
      this.show_in_modal = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.m_fragmentMedia {
  position: relative;
  // border-radius: 8px;
  padding: calc(var(--spacing) / 2) calc(var(--spacing));

  &[data-type="text"] {
    padding: calc(var(--spacing) / 2) calc(var(--spacing) / 4 * 3);
  }
  &:not([data-type="text"]) {
    .m_fragmentMedia--infos--caption,
    .m_fragmentMedia--infos--source {
      // padding: 0 calc(var(--spacing));
    }
  }
  &[data-type="text"] {
    .m_fragmentMedia--infos--caption,
    .m_fragmentMedia--infos--source {
      padding: calc(var(--spacing) / 2) calc(var(--spacing) / 4);
    }
  }
  .m_fragmentMedia--content {
    min-height: 3em;
    position: relative;

    input {
      background-color: var(--body-bg);
    }
  }

  &:not([data-type="text"]):not([data-type="embed"]):not([data-type="link"]) {
    .m_fragmentMedia--content {
      // border-radius: 8px;
      overflow: hidden;
    }
  }

  // box-shadow: 0px 0px 4px 0px rgba(204, 208, 218, 0);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

  &.is--beingEdited {
    // background-color: var(--active-color);
    // box-shadow: 0px 4px 4px 0px #ccd0da;
    // transform: translateY(-5px);
  }

  &.is--savingMedia {
    // opacity: 0.7;
  }
}
.m_advancedMenu {
  position: absolute;
  top: 0;
  right: 0;

  // &:hover {
  //   background-color: #eee;
  // }
}
._editingMenu {
  display: flex;
  justify-content: center;
  padding: calc(var(--spacing) / 2);
  // position: absolute;
  // bottom: 100%;
}

.m_fragmentMedia--infos {
  display: flex;
  flex-flow: row nowrap;
  gap: calc(var(--spacing) / 2);

  > * {
    flex: 1 1 50%;
  }
}
.m_fragmentMedia--infos--caption,
.m_fragmentMedia--infos--source {
  margin-top: calc(var(--spacing) / 2);
  font-size: 0.8rem;

  input {
    background-color: var(--body-bg);
    font-size: inherit;
    padding: 0.2em 0.4em;
    // width: 260px;
  }

  label {
    margin-bottom: 0;
    font-size: 0.7rem;
  }

  a {
    color: inherit;
  }

  span,
  a {
  }
}

.m_fragmentMedia--infos--source {
  text-align: left;
  // margin: 0 auto;
  // margin-top: calc(var(--spacing) / 2);
  // max-width: 50ch;

  &.is--beingEdited {
    margin-left: 0;
  }

  a,
  span {
    display: block;
    margin-right: 0;
    margin-left: auto;
    text-align: right;
    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    /* These are technically the same, but use both */
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a {
    text-decoration: underline;
  }
}

._open_fullscreen {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(226, 237, 239, 0.4);
  margin: 4px;

  svg {
    // width: 16px;
    // height: 16px;
    // padding: 4px;
    fill: var(--color-black);
    // filter: drop-shadow(0px 0px 2px rgba(226, 237, 239, 0.8));
    // filter: drop-shadow(0px 0px 3px rgba(110, 110, 110, 0.4));
  }

  &:hover {
    background: var(--color-black);

    svg {
      fill: white;
    }
  }
}
</style>
<style lang="scss">
.m_fragmentMedia {
  &[data-type="audio"] {
    .m_fragmentMedia--content {
      .plyr__controls {
        padding-right: 35px;
      }
    }
  }

  &[data-type="text"].is--beingEdited {
    .ql-editor {
      background-color: var(--color-lightgray);
    }
  }

  ._loader {
    background: rgba(255, 255, 255, 0.9);
  }

  ._linkCaption {
    font-size: 0.7rem;
    max-width: 60ch;
    text-decoration: underline;
    padding-bottom: 4px;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    a {
      text-decoration: underline;
    }
  }
}
</style>
