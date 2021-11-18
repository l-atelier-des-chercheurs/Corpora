<template>
  <div
    class="mediaContainer"
    :key="slugFolderName + media.media_filename"
    :class="`type-${media.type}`"
    :data-context="context"
  >
    <template v-if="media.type === 'image'">
      <img
        :srcset="imageSrcSetAttr"
        :sizes="imageSizesAttr"
        :src="linkToImageThumb"
        draggable="false"
      />
    </template>

    <template v-else-if="media.type === 'video'">
      <template v-if="context === 'preview'">
        <img
          :srcset="videostillSrcSetAttr"
          :sizes="imageSizesAttr"
          :src="linkToVideoThumb"
          draggable="false"
        />
        <div class="play_picto">
          <svg
            class
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="169px"
            height="169px"
            viewBox="0 0 169 169"
            style="enable-background: new 0 0 169 169"
            xml:space="preserve"
          >
            <path
              d="M53.2,138.4c-4.6,3-8.4,0.9-8.4-4.6V30.4c0-5.5,3.8-7.6,8.4-4.6l78.5,50.9c4.6,3,4.6,7.9,0,10.9L53.2,138.4z"
            />
          </svg>

          <div v-if="media_duration" class="_duration">
            {{ $root.formatDurationToMinuteHours(media_duration * 1000) }}
          </div>
        </div>
      </template>
      <template v-else>
        <vue-plyr
          :options="plyr_options"
          ref="plyr"
          :emit="['volumechange']"
          @volumechange="volumeChanged"
        >
          <video
            :poster="linkToVideoThumb"
            :src="mediaURL"
            preload="none"
            :autoplay="autoplay"
          />
        </vue-plyr>
      </template>
    </template>

    <template v-else-if="media.type === 'audio'">
      <template v-if="context === 'preview'">
        <div class="play_picto">
          <svg
            class
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="169px"
            height="169px"
            viewBox="0 0 169 169"
            style="enable-background: new 0 0 169 169"
            xml:space="preserve"
          >
            <path
              d="M53.2,138.4c-4.6,3-8.4,0.9-8.4-4.6V30.4c0-5.5,3.8-7.6,8.4-4.6l78.5,50.9c4.6,3,4.6,7.9,0,10.9L53.2,138.4z"
            />
          </svg>
        </div>
      </template>
      <template v-else>
        <vue-plyr :options="plyr_options">
          <audio :src="mediaURL" preload="none" :autoplay="autoplay" />
        </vue-plyr>
      </template>
    </template>

    <template v-else-if="media.type === 'text'">
      <CollaborativeEditor
        v-if="context === 'edit'"
        v-model="htmlForEditor"
        :media="media"
        :enable_collaboration="true"
        :slugFolderName="slugFolderName"
        ref="textField"
      />
      <div v-else class="mediaTextContent">
        <div v-if="value.length !== 0" v-html="value" />
        <p v-else v-html="'…'" />
      </div>
      <!-- <textarea
        placeholder="…"
        class="mediaTextContent border-none bg-transparent"
        :value="value"
        @input="$emit('input', $event.target.value)"
        ref="textField"
        autocorrect="on"
        :readonly="read_only"
      />-->
    </template>

    <template v-else-if="media.type === 'marker'">
      <div v-if="context !== 'edit'" class="padding-small">
        <template v-if="value.length > 0">{{ value }}</template>
        <template v-else>…</template>
      </div>

      <input
        v-else
        type="text"
        class="border-none bg-transparent"
        placeholder="Étiquette"
        name="label"
        :value="value"
        @input="$emit('input', $event.target.value)"
        ref="textField"
        :readonly="read_only"
      />
    </template>

    <template v-else-if="media.type === 'link' || media.type === 'embed'">
      <template v-if="!should_load_embed">
        <div class="_linkCaption">
          <a :href="link_url" target="_blank">
            {{ link_url }}
          </a>
        </div>
        <div class="_siteCard">
          <template
            v-if="
              siteOG &&
              (siteOG.local_image || siteOG.title || siteOG.description)
            "
          >
            <div v-if="siteOG_image" class="_siteCard--image">
              <a :href="link_url" target="_blank">
                <img :src="siteOG_image" />
              </a>
            </div>
            <div class="_siteCard--text">
              <div v-if="siteOG.title" class="_siteCard--text--title">
                {{ siteOG.title }}
              </div>
              <div
                v-if="siteOG.description"
                class="_siteCard--text--description"
              >
                {{ siteOG.description }}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="padding-verysmall">
              {{ $t("no_preview_available") }}
            </div>
          </template>

          <div
            v-if="!should_load_embed && embedURL && context !== 'preview'"
            class="_siteCard--embed"
          >
            <label class="margin-bottom-verysmall">{{ $t("embed") }}</label>
            <!-- <div
              class="margin-bottom-verysmall"
              style="
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              "
            >
              <a :href="media.content" target="_blank">{{ media.content }}</a>
            </div> -->
            <div class="margin-bottom-verysmall">
              <button
                type="button"
                class="_load"
                @click="load_this_embed = true"
              >
                {{ $t("load_player") }}
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <template>
          <iframe
            v-if="embedURL.type !== 'tweet'"
            :src="embedURL.src"
            frameborder="0"
            allowfullscreen
          />
          <Tweet
            v-else
            :id="embedURL.id"
            :options="{ cards: 'hidden', theme: 'light' }"
          />
        </template>
      </template>
    </template>
    <template v-else-if="media.type === 'document'">
      <div v-if="context !== 'full'" class="padding-vert-small font-verysmall">
        <a :href="mediaURL" :download="media.media_filename">
          <pre>{{ media.media_filename }}</pre>
        </a>
      </div>
      <iframe v-else :src="mediaURL" />
    </template>

    <template v-else-if="media.type === 'other'">
      <div class="font-verysmall">
        <a :href="mediaURL" :download="media.media_filename">
          <pre>{{ media.media_filename }}</pre>
        </a>
      </div>
    </template>
  </div>
</template>
<script>
import CollaborativeEditor from "./CollaborativeEditor.vue";
import { Tweet } from "vue-tweet-embed";

export default {
  props: {
    slugFolderName: String,
    media: Object,
    subfolder: {
      type: String,
      default: "",
    },
    context: {
      type: String,
      default: "preview",
      // preview, edit, publication
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "…",
    },
    is_hovered: Boolean,
    read_only: {
      type: Boolean,
      default: true,
    },
    preview_size: {
      type: Number,
      default: 180,
    },
    element_width_for_sizes: {
      type: Number,
      default: 0,
    },
    element_height: {
      type: Number,
      default: 0,
    },
    audio_volume: {
      type: Number,
      default: 100,
    },
  },
  components: {
    CollaborativeEditor,
    Tweet,
  },
  data() {
    return {
      available_resolutions: {
        preview_hovered: 360,
        default: 1600,
      },
      htmlForEditor: this.value,

      load_this_embed: false,

      plyr_options: {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen",
        ],
        iconUrl:
          this.$root.state.mode === "export_publication"
            ? `./_images/plyr.svg`
            : `/images/plyr.svg`,
      },
    };
  },
  mounted() {
    if (this.context === "edit") {
      if (Modernizr !== undefined && !Modernizr.touchevents) {
        if (this.$refs.textField !== undefined) {
          // this.$refs.textField.focus();
        }
      }
    }
    this.setVolume(this.audio_volume);
  },
  beforeDestroy() {},
  watch: {
    htmlForEditor: function () {
      this.$emit("input", this.htmlForEditor);
    },
  },
  computed: {
    mediaURL: function () {
      return this.$root.state.mode === "export_publication"
        ? `./${this.subfolder}${this.slugFolderName}/${this.media.media_filename}`
        : `/${this.subfolder}${this.slugFolderName}/${this.media.media_filename}`;
    },
    siteOG: function () {
      if (
        !this.media["thumbs"] ||
        (typeof this.media.thumbs === "object" &&
          this.media.thumbs.length === 0)
      ) {
        return false;
      }
      const siteData = this.media.thumbs.find(
        (m) => !!m && m.hasOwnProperty("siteData")
      );
      if (!siteData) return false;

      return siteData.siteData;
      // return this.media.thumbs.find(t => t.)
    },
    siteOG_image() {
      if (!this.siteOG || !this.siteOG.local_image) return false;
      return this.$root.state.mode === "export_publication"
        ? `./${this.siteOG.local_image}`
        : `/${this.siteOG.local_image}`;
    },
    embedURL: function () {
      if (!this.media.content) return false;
      if (this.media.content.includes("twitter.com"))
        return {
          type: "tweet",
          id: this.getTweetIdFromURL(this.media.content),
        };
      else if (
        this.media.content.includes("youtube.com") ||
        this.media.content.includes("youtu.be")
      )
        return {
          type: "youtube",
          src: this.getYoutubeEmbedURLFromURL(this.media.content),
        };
      else if (this.media.content.includes("vimeo.com"))
        return {
          type: "vimeo",
          src: this.getVimeoEmbedURLFromURL(this.media.content),
        };
      else if (this.media.content.includes("soundcloud.com"))
        return {
          type: "soundcloud",
          src: this.getSoundcloudEmbedURLFromURL(this.media.content),
        };
      return false;
    },
    link_url() {
      function addhttp(url) {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
          url = "http://" + url;
        }
        return url;
      }
      return addhttp(this.media.content);
    },
    should_load_embed() {
      // if (this.$root.settings.load_all_embeds) return true;
      return this.load_this_embed;
    },
    thumbRes: function () {
      return this.context === "preview"
        ? this.preview_size
        : this.available_resolutions.default;
    },
    media_duration: function () {
      if (
        !this.media.hasOwnProperty("duration") &&
        !(
          this.media.hasOwnProperty("file_meta") &&
          this.media.file_meta.some((f) => f.hasOwnProperty("duration"))
        )
      )
        return false;

      const duration = this.media.hasOwnProperty("duration")
        ? this.media.duration
        : this.media.file_meta.find((f) => f.hasOwnProperty("duration"))
            .duration;
      return duration;
    },
    thumbResHovered: function () {
      return this.available_resolutions.preview_hovered;
    },
    linkToImageThumb: function () {
      if (!this.media.hasOwnProperty("thumbs")) {
        return this.mediaURL;
      }

      if (
        // if image is gif and context is not 'preview', let’s show the original gif
        // this.context !== "preview" &&
        this.mediaURL.toLowerCase().endsWith(".gif")
      ) {
        return this.mediaURL;
      }

      const small_thumb = this.media.thumbs.filter(
        (m) => !!m && m.hasOwnProperty("size") && m.size === this.thumbRes
      );
      if (small_thumb.length == 0) {
        return this.mediaURL;
      }

      let pathToSmallestThumb = small_thumb[0].path;

      let url =
        this.$root.state.mode === "export_publication"
          ? `./${pathToSmallestThumb}`
          : `/${pathToSmallestThumb}`;
      return url;
    },
    imageSrcSetAttr: function () {
      if (
        this.element_width_for_sizes === 0 ||
        this.mediaURL.toLowerCase().endsWith(".gif") ||
        this.context === "full"
      ) {
        return;
      }

      // get all available sizes
      const img_srcset = this.media.thumbs.reduce((acc, t) => {
        if (t.hasOwnProperty("path")) {
          // acc.push(encodeURIComponent(t.path) + ' ' + t.size + 'w');
          acc.push(t.path + " " + t.size + "w");
        }
        return acc;
      }, []);
      return img_srcset.join(", ");
    },
    videostillSrcSetAttr: function () {
      if (this.element_width_for_sizes === 0) {
        return;
      }

      let timeMark = 0;
      let timeMarkThumbs = this.media.thumbs.filter(
        (t) => !!t && t.timeMark === 0
      );

      if (!timeMarkThumbs || timeMarkThumbs.length === 0) {
        return;
      }

      // get all available sizes
      const img_srcset = timeMarkThumbs[0].thumbsData.reduce((acc, t) => {
        if (t.hasOwnProperty("path")) {
          acc.push(t.path + " " + t.size + "w");
        }
        return acc;
      }, []);

      return img_srcset.join(", ");
    },
    imageSizesAttr: function () {
      if (this.element_width_for_sizes === 0) {
        return;
      }
      return this.element_width_for_sizes + "px";
    },
    linkToHoveredThumb: function () {
      let pathToSmallestThumb = this.media.thumbs.filter(
        (m) => m.size === this.thumbResHovered
      )[0].path;

      const url =
        this.$root.state.mode === "export_publication"
          ? "./" + pathToSmallestThumb
          : "/" + pathToSmallestThumb;
      return pathToSmallestThumb !== undefined ? url : this.mediaURL;
    },
    linkToVideoThumb: function () {
      if (
        !this.media["thumbs"] ||
        (typeof this.media.thumbs === "object" &&
          this.media.thumbs.length === 0)
      ) {
        return this.mediaURL;
      }

      let timeMark = 0;
      let timeMarkThumbs = this.media.thumbs.filter(
        (t) => !!t && t.timeMark === 0
      );

      if (!timeMarkThumbs || timeMarkThumbs.length === 0) {
        return this.mediaURL;
      }

      let pathToSmallestThumb = timeMarkThumbs[0].thumbsData.filter(
        (m) => m.size === this.thumbRes
      )[0].path;

      let url =
        this.$root.state.mode === "export_publication"
          ? "./" + pathToSmallestThumb
          : "/" + pathToSmallestThumb;
      return pathToSmallestThumb !== undefined ? url : this.mediaURL;
    },
  },
  methods: {
    volumeChanged(event) {
      const vol = Math.round(Number(event.detail.plyr.volume) * 100);
      this.$emit("volumeChanged", vol);
    },
    setVolume(val) {
      if (this.$refs.hasOwnProperty("plyr")) {
        this.$refs.plyr.player.volume = val / 100;
      }
    },
    getTweetIdFromURL(url) {
      let tweetRegex =
        /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})/;
      return url.match(tweetRegex)[3];
    },
    getYoutubeEmbedURLFromURL(url) {
      function getId(url) {
        const regExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return match && match[2].length === 11 ? match[2] : null;
      }

      const videoId = getId(url);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    },
    getVimeoEmbedURLFromURL(url) {
      function getId(url) {
        const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
        const match = url.match(regExp);
        return match ? match[1] : null;
      }

      const videoId = getId(url);
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    },
    getSoundcloudEmbedURLFromURL(url) {
      return `https://w.soundcloud.com/player/?url=${url}&color=0066cc`;
    },
    linkToComplexMediaThumb: function ({ type, option }) {
      if (
        !this.media["thumbs"] ||
        (typeof this.media.thumbs === "object" &&
          this.media.thumbs.length === 0)
      ) {
        return this.mediaURL;
      }

      let firstThumbs = this.media.thumbs.find(
        (t) => !!t && t[type] === option
      );

      const small_thumb = firstThumbs.thumbsData.find(
        (m) => m && m.size === this.thumbRes
      );
      if (!small_thumb) return this.mediaURL;

      let pathToSmallestThumb = small_thumb.path;

      let url =
        this.$root.state.mode === "export_publication"
          ? "./" + pathToSmallestThumb
          : "/" + pathToSmallestThumb;
      return pathToSmallestThumb !== undefined ? url : this.mediaURL;
    },
    complexMediaSrcSetAttr: function ({ type, option }) {
      if (this.element_width_for_sizes === 0) {
        return;
      }

      let firstThumbs = this.media.thumbs.filter(
        (t) => !!t && t[type] === option
      );
      if (!firstThumbs || firstThumbs.length === 0) return;

      // get all available sizes
      const img_srcset = firstThumbs[0].thumbsData.reduce((acc, t) => {
        if (t.hasOwnProperty("path")) {
          const path =
            this.$root.state.mode === "export_publication"
              ? "./" + t.path
              : "/" + t.path;

          acc.push(path + " " + t.size + "w");
        }
        return acc;
      }, []);

      return img_srcset.join(", ");
    },
  },
};
</script>
