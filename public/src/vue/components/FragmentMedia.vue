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
        <input
          type="url"
          class="border-none bg-transparent"
          placeholder="URL"
          v-model="mediadata.content"
          ref="textField"
        />
        <small v-html="$t('link_instructions')" />
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
    </div>
    <div
      class="m_advancedMenu"
      :class="{
        'is--open': show_advanced_menu_for_media,
      }"
    >
      <div
        class="m_advancedMenu--editingMenu"
        v-if="is_being_edited && !is_saving_media"
      >
        <button type="button" class="button-small bg-orange" @click="saveMedia">
          {{ $t("save") }}
        </button>
        <button
          type="button"
          class="button-small bg-orange"
          v-if="is_empty"
          @click="
            $emit('removeMedia', { metaFileName: media.metaFileName });
            show_advanced_menu_for_media = false;
          "
        >
          {{ $t("remove") }}
        </button>
      </div>

      <template v-else>
        <button
          type="button"
          @click="show_advanced_menu_for_media = !show_advanced_menu_for_media"
          class="button-small m_advancedMenu--toggleButton"
          :class="{
            'is--active': show_advanced_menu_for_media,
          }"
          v-if="is_touch || is_hovered"
        >
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
        <div class="m_advancedMenu--menu" v-if="show_advanced_menu_for_media">
          <button
            type="button"
            class="button-small"
            v-if="can_be_edited && !is_being_edited"
            @click="enableEdition(media.metaFileName)"
          >
            {{ $t("edit") }}
          </button>
          <button
            type="button"
            class="button-small"
            v-if="index > 0"
            @click="
              $emit('moveMedia', { metaFileName: media.metaFileName, dir: -1 });
              show_advanced_menu_for_media = false;
            "
          >
            {{ $t("moveup") }}
          </button>
          <button
            type="button"
            class="button-small"
            v-if="index < linked_medias.length - 1"
            @click="
              $emit('moveMedia', { metaFileName: media.metaFileName, dir: +1 });
              show_advanced_menu_for_media = false;
            "
          >
            {{ $t("movedown") }}
          </button>
          <a
            class="button button-small"
            v-if="!['link', 'embed'].includes(media.type)"
            :download="media.media_filename"
            :href="mediaURL"
            target="_blank"
            >{{ $t("download") }}</a
          >
          <button
            type="button"
            class="button-small"
            v-if="can_be_edited || $root.can_admin_corpora"
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
        v-if="
          (is_being_edited || media.source) &&
          media.type !== 'link' &&
          media.type !== 'embed'
        "
      >
        <label v-if="is_being_edited">{{ $t("source") }}</label>
        <div>
          <template v-if="!is_being_edited">
            <a
              target="_blank"
              rel="noopener noreferrer"
              :href="media.source"
              :title="media.source"
              >{{ media.source }}</a
            >
          </template>
          <template v-else>
            <input type="url" v-model="mediadata.source" placeholder="www." />
          </template>
        </div>
      </div>
    </div>
    <small
      v-if="
        can_be_edited &&
        media_was_created_x_hours_ago !== false &&
        !$root.can_admin_corpora
      "
      class="ta-ce tt-lc padding-small font-verysmall"
      style="width: 100%; display: block"
    >
      {{ $t("editable_for") }}
      {{ editable_delay_in_hours - media_was_created_x_hours_ago }}
      {{ $t("hours") }}
    </small>
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

      editable_delay_in_hours: 24,

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
  },
  computed: {
    media_was_created_x_hours_ago() {
      if (this.media.hasOwnProperty("date_uploaded")) {
        const media_uploaded_on = this.$moment(this.media.date_uploaded);
        if (media_uploaded_on.isValid()) {
          const ellapsed = this.$moment
            .duration(media_uploaded_on.diff(this.$moment()))
            .asHours();
          return Math.floor(Math.abs(ellapsed));
        }
      }
      return false;
    },
    is_touch() {
      return Modernizr.touchevents;
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
    can_be_edited() {
      if (this.$root.can_admin_corpora) return true;
      if (
        this.media_was_created_x_hours_ago !== false &&
        this.media_was_created_x_hours_ago < this.editable_delay_in_hours
      ) {
        return true;
      }
      return false;
    },
    media_context() {
      if (this.context === "preview") return "preview";
      if (this.media.type === "image") return "preview";
      if (this.is_being_edited) return "edit";
      return "";
    },
  },
  methods: {
    enableEdition(metaFileName) {
      if (this.media.metaFileName === metaFileName) {
        this.is_being_edited = true;
      }
    },
    saveMedia() {
      this.is_saving_media = true;

      if (this.media.type === "link" && this.should_be_embed)
        this.mediadata.type = "embed";
      if (this.media.type === "embed" && !this.should_be_embed)
        this.mediadata.type = "link";

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

  &[data-type="text"] {
    padding: calc(var(--spacing) / 2) calc(var(--spacing));
  }
  &:not([data-type="text"]) {
    .m_fragmentMedia--infos--caption,
    .m_fragmentMedia--infos--source {
      padding: 0 calc(var(--spacing));
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

  box-shadow: 0px 0px 4px 0px rgba(204, 208, 218, 0);
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
  top: -0.1em;
  right: 0;
  // background: transparent;
  font-size: 1.5em;
  line-height: 1;

  // &:hover {
  //   background-color: #eee;
  // }
}
.m_advancedMenu--editingMenu {
  position: absolute;
  bottom: 100%;
}

.m_fragmentMedia--infos {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin-left: -2px;
  margin-right: -2px;

  > * {
    flex: 1 1 0;
  }
}
.m_fragmentMedia--infos--caption,
.m_fragmentMedia--infos--source {
  margin-top: calc(var(--spacing) / 4);
  // background-color: var(--active-color);
  border-radius: 4px;
  padding: 2px;
  color: var(--color-gray);
  input {
    background-color: var(--body-bg);
    font-size: inherit;
    padding: 0.2em 0.4em;
    // width: 260px;
  }

  label {
    margin-bottom: 0;
  }

  a {
    color: inherit;
  }

  span,
  a {
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
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.m_fragmentMedia--infos--source {
  a {
    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
  }
}

.m_fragmentMedia--infos--type {
  text-transform: uppercase;
  font-size: 70%;
  padding: 4px;
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
    fill: white;
    filter: drop-shadow(0px 0px 2px rgba(226, 237, 239, 0.8));
    filter: drop-shadow(0px 0px 3px rgba(110, 110, 110, 0.4));
  }

  &:hover {
    background: var(--color-black);
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

  ._linkCaption {
    // position: absolute;
    // bottom: 0;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    // background: linear-gradient(
    //   to top,
    //   white,
    //   white 20%,
    //   rgba(255, 255, 255, 0.1) 100%
    // );

    a {
      // display: inline-block;
      color: var(--color-black);
      font-size: 0.8em;
      // padding: 0 calc(var(--spacing) / 2);

      // --c-shadowOutline: rgba(0, 0, 0, 0.4);
      // text-shadow: 1px 1px var(--c-shadowOutline),
      //   -1px 1px var(--c-shadowOutline), -1px -1px var(--c-shadowOutline),
      //   1px -1px var(--c-shadowOutline);
    }
  }
}
</style>
