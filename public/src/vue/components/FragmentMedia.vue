<template>
  <div
    class="m_fragmentMedia"
    :data-type="media.type"
    :class="{ 'is--beingEdited': is_being_edited }"
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

      <template v-else-if="media.type === 'embed' && is_being_edited">
        <input
          type="url"
          class="border-none bg-transparent"
          placeholder="URL"
          v-model="mediadata.content"
          ref="textField"
        />
        <small v-html="$t('embed_instructions')" />
      </template>

      <MediaContent
        v-else
        ref="mediaContent"
        v-model="media.content"
        :context="media_context"
        :slugFolderName="slugFolderName"
        :media="media"
        :read_only="false"
      />
      <button
        type="button"
        class="plyr__controls__item plyr__control _open_fullscreen"
        @click="openMedia"
        v-if="media.type === 'image' || media.type === 'document'"
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
      <button
        type="button"
        class="button-small bg-orange"
        v-if="is_being_edited"
        @click="setBlocToEdit(false)"
      >
        {{ $t("save") }}
      </button>

      <template v-else>
        <button
          type="button"
          @click="show_advanced_menu_for_media = !show_advanced_menu_for_media"
          class="button-small m_advancedMenu--toggleButton"
          :class="{
            'is--active': show_advanced_menu_for_media,
          }"
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
            style="enable-background: new 0 0 4 16.2;"
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
            v-if="can_be_edited"
            @click="setBlocToEdit(media.metaFileName)"
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
        <label>{{ $t("caption") }}</label>
        <div>
          <template v-if="!is_being_edited">
            <span>{{ media.caption }}</span>
          </template>
          <template v-else>
            <input
              type="text"
              v-model="mediadata.caption"
              :placeholder="$t('caption')"
              @keyup.enter="setBlocToEdit(false)"
            />
          </template>
        </div>
      </div>
      <div
        class="m_fragmentMedia--infos--source"
        v-if="is_being_edited || media.source"
      >
        <label>{{ $t("source") }} (URL)</label>
        <div>
          <template v-if="!is_being_edited">
            <a
              target="_blank"
              rel="noopener noreferrer"
              :title="media.source"
              :href="media.source"
              >{{ media.source }}</a
            >
          </template>
          <template v-else>
            <input
              type="url"
              v-model="mediadata.source"
              :placeholder="$t('source')"
              @keyup.enter="setBlocToEdit(false)"
            />
          </template>
        </div>
      </div>
    </div>
    <small
      v-if="
        can_be_edited &&
        media_was_created_x_minutes_ago !== false &&
        !$root.can_admin_corpora
      "
      class="ta-ce tt-lc padding-small font-verysmall"
      style="width: 100%; display: block;"
      >{{ $t("editable_for") }}
      {{ editable_delay_in_minutes - media_was_created_x_minutes_ago }}
      {{ $t("minutes") }}</small
    >
    <ShowMedia
      v-if="show_in_modal"
      :media="media"
      :slugFolderName="slugFolderName"
      @close="show_in_modal = false"
    />
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

      show_in_modal: false,

      editable_delay_in_minutes: 30,

      mediaURL: `/${this.slugFolderName}/${this.media.media_filename}`,
      is_being_edited:
        this.$root.settings.text_media_being_edited === this.media.metaFileName,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    "$root.settings.text_media_being_edited": function () {
      console.log(
        `FragmentMedia • WATCH: $root.settings.text_media_being_edited. Is self ? ${
          this.$root.settings.text_media_being_edited ===
          this.media.metaFileName
        }`
      );
      if (this.is_being_edited) {
        this.saveMedia();
      } else if (
        this.$root.settings.text_media_being_edited === this.media.metaFileName
      ) {
        this.is_being_edited = true;
        this.mediadata = {
          caption: this.media.caption,
          source: this.media.source,
          content: this.media.content,
        };
      }
    },
  },
  computed: {
    media_was_created_x_minutes_ago() {
      if (this.media.hasOwnProperty("date_uploaded")) {
        const media_uploaded_on = this.$moment(this.media.date_uploaded);
        if (media_uploaded_on.isValid()) {
          const ellapsed = this.$moment
            .duration(media_uploaded_on.diff(this.$moment()))
            .asMinutes();
          return Math.floor(Math.abs(ellapsed));
        }
      }
      return false;
    },
    can_be_edited() {
      if (this.$root.can_admin_corpora) return true;
      if (
        this.media_was_created_x_minutes_ago !== false &&
        this.media_was_created_x_minutes_ago < this.editable_delay_in_minutes
      ) {
        return true;
      }
      return false;
    },
    media_context() {
      if (this.is_being_edited) return "edit";
      // if (this.media.type === "document") return "edit";
      return "";
    },
  },
  methods: {
    setBlocToEdit(metaFileName) {
      if (window.state.dev_mode === "debug")
        console.log(
          `FragmentMedia • METHODS: setBlocToEdit for ${metaFileName}`
        );

      if (this.$root.settings.text_media_being_edited !== metaFileName) {
        this.$root.settings.text_media_being_edited = metaFileName;
      } else {
      }
    },
    saveMedia() {
      this.is_being_edited = false;
      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.slugFolderName,
        slugMediaName: this.media.metaFileName,
        data: this.mediadata,
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
  border-radius: 8px;

  .m_fragmentMedia--content {
    min-height: 3em;
    position: relative;

    input {
      background-color: var(--body-bg);
    }
  }

  &:not([data-type="text"]):not([data-type="embed"]) {
    .m_fragmentMedia--content {
      border-radius: 8px;
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
}
.m_advancedMenu {
  position: absolute;
  top: 0;
  right: 0;
  // background: transparent;
  font-size: 1.5em;
  line-height: 1;

  // &:hover {
  //   background-color: #eee;
  // }
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
  margin-top: calc(var(--spacing) / 2);
  // background-color: var(--active-color);
  border-radius: 4px;
  padding: 2px;
  color: #666;

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

  input {
    background-color: var(--body-bg);
    font-size: inherit;
    // width: 260px;
  }

  a {
    color: inherit;
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
}
</style>
