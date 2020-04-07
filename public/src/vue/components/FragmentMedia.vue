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

      <input
        v-else-if="media.type === 'link' && is_being_edited"
        type="url"
        class="border-none bg-transparent"
        placeholder="Étiquette"
        v-model="mediadata.content"
        ref="textField"
      />

      <MediaContent
        v-else
        v-model="media.content"
        :context="!is_being_edited ? 'full' : 'edit'"
        :slugFolderName="slugFolderName"
        :media="media"
        :preview_size="360"
        :read_only="false"
      />
    </div>
    <div class="m_advancedMenu">
      <button type="button" v-if="is_being_edited" @click="setBlocToEdit(false)">save</button>

      <template v-else>
        <button type="button" @click="setBlocToEdit(media.metaFileName)">edit</button>

        <button
          type="button"
          @click="show_advanced_menu_for_media = !show_advanced_menu_for_media"
          class="m_advancedMenu--toggleButton"
          :class="{
            'is--active': show_advanced_menu_for_media
          }"
        >
          <svg class="svg-icon" viewBox="0 0 20 20">
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
          </svg>
        </button>
        <div class="m_advancedMenu--menu" v-if="show_advanced_menu_for_media">
          <button
            type="button"
            v-if="index > 0"
            @click="
              $emit('moveMedia', { metaFileName: media.metaFileName, dir: -1 });
              show_advanced_menu_for_media = false;
            "
          >{{ $t("moveup") }}</button>
          <button
            type="button"
            v-if="index < linked_medias.length - 1"
            @click="
              $emit('moveMedia', { metaFileName: media.metaFileName, dir: +1 });
              show_advanced_menu_for_media = false;
            "
          >{{ $t("movedown") }}</button>
          <button
            type="button"
            @click="
              $emit('removeMedia', { metaFileName: media.metaFileName });
              show_advanced_menu_for_media = false;
            "
          >{{ $t("remove") }}</button>
        </div>
      </template>
    </div>

    <div class="m_fragmentMedia--infos">
      <div class="m_fragmentMedia--infos--caption" v-if="is_being_edited || media.caption">
        <template v-if="!is_being_edited">{{ media.caption }}</template>
        <template v-else>
          <input type="text" v-model="mediadata.caption" @keyup.enter="setBlocToEdit(false)" />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import MediaContent from "./subcomponents/MediaContent.vue";
import CollaborativeEditor from "./subcomponents/CollaborativeEditor.vue";

export default {
  props: {
    slugFolderName: String,
    media: Object,
    index: Number,
    linked_medias: Array
  },
  components: {
    MediaContent,
    CollaborativeEditor
  },
  data() {
    return {
      show_advanced_menu_for_media: false,
      mediadata: {
        caption: this.media.caption,
        content: this.media.content
      },
      is_being_edited: false
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    "$root.settings.text_media_being_edited": function() {
      console.log(
        "$root.settings.text_media_being_edited ===" +
          this.$root.settings.text_media_being_edited
      );
      if (this.is_being_edited) {
        this.saveMedia();
      } else if (
        this.$root.settings.text_media_being_edited === this.media.metaFileName
      ) {
        this.is_being_edited = true;
        this.mediadata = {
          caption: this.media.caption,
          content: this.media.content
        };
      }
    }
  },
  computed: {},
  methods: {
    setBlocToEdit(metaFileName) {
      if (window.state.dev_mode === "debug")
        console.log(`Fragment • METHODS: setBlocToEdit for ${metaFileName}`);

      if (this.$root.settings.text_media_being_edited !== metaFileName) {
        this.$root.settings.text_media_being_edited = metaFileName;
      }
    },
    saveMedia() {
      this.is_being_edited = false;
      this.$root.editMedia({
        type: "corpus",
        slugFolderName: this.slugFolderName,
        slugMediaName: this.media.metaFileName,
        data: this.mediadata
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.m_fragmentMedia {
  position: relative;
  border-radius: 4px;

  .m_fragmentMedia--content {
    min-height: 3em;
  }

  &:not([data-type="text"]) {
    .m_fragmentMedia--content {
      border-radius: 4px;
      overflow: hidden;
    }
  }

  box-shadow: 0px 0px 4px 0px rgba(204, 208, 218, 0);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

  &.is--beingEdited {
    box-shadow: 0px 4px 4px 0px #ccd0da;
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
  margin-top: calc(var(--spacing) / 2);
}
.m_fragmentMedia--infos--caption {
  // background-color: var(--active-color);
  border-radius: 4px;
  padding: 2px;
  color: #999;

  input {
    font-family: inherit;
    background-color: transparent;
    border: 2px solid white;
    border: none;
    background-color: #fff4db;
    outline: 0;
    padding: 2px;
    width: 260px;
  }
}
.m_fragmentMedia--infos--type {
  text-transform: uppercase;
  font-size: 70%;
  padding: 4px;
}
</style>
