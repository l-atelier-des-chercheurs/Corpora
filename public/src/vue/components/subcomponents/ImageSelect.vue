<template>
  <div class="m_imageselect">
    <div class="m_imageselect--upload" v-if="!image">
      <input
        type="file"
        accept="image/*"
        :id="id"
        class="inputfile-2"
        @change="onFileChange"
      />
      <label :for="id">
        <svg width="20" height="17" viewBox="0 0 20 17">
          <path
            d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
          />
        </svg>
        {{ _instructions }}
      </label>
    </div>
    <!-- <div class="m_imageselect--or" v-if="!image && load_from_corpus_medias">OU</div> -->

    <div class="m_imageselect--image" v-if="!!image">
      <img v-if="typeof image === 'string'" :src="image" draggable="false" />
      <button class="buttonLink" type="button" @click="removeImage">
        {{ $t("remove_image") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    previewURL: String,

    instructions: String,

    slugCorpusName: {
      type: String,
      default: ""
    },
    load_from_corpus_medias: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      image: this.previewURL,
      id: `image_select_${(
        Math.random().toString(36) + "00000000000000000"
      ).slice(2, 3 + 2)}`,

      show_medias_from_corpus: ""
    };
  },

  created() {},
  mounted() {
    this.show_medias_from_corpus = this.slugCorpusName
      ? this.slugCorpusName
      : "";
  },
  beforeDestroy() {},

  watch: {
    show_medias_from_corpus: function() {
      this.$socketio.listMedias({
        type: "corpus",
        slugFolderName: this.show_medias_from_corpus
      });
    }
  },
  computed: {
    _instructions() {
      return this.instructions !== undefined
        ? this.instructions
        : this.$t("upload_from_device");
    }
  },
  methods: {
    getProjectsImages({ slugCorpusName }) {
      if (
        !slugCorpusName ||
        !this.$root.store.corpus.hasOwnProperty(slugCorpusName)
      ) {
        return false;
      }

      const medias = this.$root.store.corpus[slugCorpusName].medias;
      if (medias.length === 0) return false;

      const images = Object.values(
        this.$root.store.corpus[slugCorpusName].medias
      ).filter(m => m.type === "image");

      return images;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();

      reader.onload = e => {
        let result = e.target.result;
        this.image = result;
        this.$emit("newPreview", result);
      };
      reader.readAsDataURL(file);
    },
    removeImage: function(e) {
      this.image = "";
      this.$emit("newPreview", "");
    },

    mediasImagesPreviewURL({ thumbs, size }) {
      const small_thumb = thumbs.filter(m => m.size === size);
      if (small_thumb.length == 0) {
        return false;
      }

      let pathToSmallestThumb = small_thumb[0].path;

      let url = `/${pathToSmallestThumb}`;
      return url;
    },
    selectThisImageForPreview({ image }) {
      this.image = {
        metaFileName: image.metaFileName,
        slugFolderName: this.show_medias_from_corpus,
        type: "corpus"
      };
      this.$emit("newPreview", this.image);
    },
    getPreviewFromMedias(image) {
      const slugFolderName = image.slugFolderName;
      const media = this.getProjectsImages({
        slugCorpusName: slugFolderName
      }).find(m => m.metaFileName === image.metaFileName);
      const url = this.mediasImagesPreviewURL({
        thumbs: media.thumbs,
        size: 1600
      });
      return url;
    }
  }
};
</script>
<style scoped>
img {
  width: 200px;
}
</style>
