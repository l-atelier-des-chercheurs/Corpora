<template>
  <div>
    <transition-group tag="div" name="fileupload_list">
      <div
        v-for="(f, index) in files_to_upload"
        :key="f.name"
        class="m_uploadFile"
        :class="cssStatus(f)"
        :style="`--progress-percent: ${
          files_to_upload_meta.hasOwnProperty(f.name)
            ? files_to_upload_meta[f.name].upload_percentages / 100
            : 0
        }`"
      >
        <div class="m_uploadFile--progressBar"></div>

        <img
          v-if="!!f.type && f.type.includes('image') && index < 5"
          class="m_uploadFile--image"
          :src="getImgPreview(f)"
        />
        <div v-else class="m_uploadFile--image" />

        <div :title="f.name" class="m_uploadFile--filename">{{ f.name }}</div>
        <div class="m_uploadFile--size">{{ formatBytes(f.size) }}</div>
        <div class="m_uploadFile--action" v-if="files_to_upload_meta.hasOwnProperty(f.name)">
          <button
            type="button"
            class="buttonLink"
            @click="sendThisFile(f)"
            :disabled="
              read_only ||
              (files_to_upload_meta.hasOwnProperty(f.name) &&
                files_to_upload_meta[f.name].status === 'success')
            "
          >
            <template v-if="!files_to_upload_meta.hasOwnProperty(f.name)">{{ $t("import") }}</template>
            <template v-else-if="files_to_upload_meta[f.name].status === 'success'">{{ $t("sent") }}</template>
            <template v-else-if="files_to_upload_meta[f.name].status === 'failed'">{{ $t("retry") }}</template>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import * as axios from "axios";
import { setTimeout } from "timers";
// import UAparser from "ua-parser-js";

export default {
  props: {
    slugFolderName: String,
    type: String,
    selected_files: Array
  },
  components: {},
  data() {
    return {
      files_to_upload: this.selected_files,
      files_to_upload_meta: {},
      upload_percentages: 0,

      list_of_medias_to_add_to_fragment: []
    };
  },
  watch: {},
  mounted() {
    console.log("MOUNTED • TimeLineView: onScroll");
    this.sendAllFiles();
  },
  beforeDestroy() {},
  computed: {
    uriToUploadMedia: function() {
      return `_file-upload/${this.type}/${this.slugFolderName}`;
    }
  },
  methods: {
    sendThisFile(f) {
      return new Promise((resolve, reject) => {
        if (this.$root.state.dev_mode === "debug") {
          console.log(`METHODS • UploadFile / sendThisFile : name = ${f.name}`);
        }

        const filename = f.name;
        const modified = f.lastModified;

        this.$set(this.files_to_upload_meta, filename, {
          upload_percentages: 0,
          status: "sending"
        });

        let formData = new FormData();
        formData.append("files", f, filename);

        let meta = {
          fileCreationDate: modified
          // setDateTimelineToDateCreated: this.$root.settings
          //   .setDateTimelineToDateCreated,
          // authors: this.$root.settings.current_author_name
          //   ? [{ name: this.$root.settings.current_author_name }]
          //   : "",
          // w: 4,
          // h: 3
        };

        // const parser = new UAparser();
        // const result = parser.getResult();
        // if (result) {
        //   meta.device_infos = [];
        //   const browser = Object.assign(result.browser, { type: "browser" });
        //   const device = Object.assign(result.device, { type: "device" });
        //   const os = Object.assign(result.os, { type: "os" });
        //   meta.device_infos.push(browser, device, os);
        // }

        formData.append(filename, JSON.stringify(meta));

        const socketid = this.$socketio.socket.id;
        if (socketid !== undefined) {
          formData.append("socketid", socketid);
        }

        console.log(
          `METHODS • sendThisFile: name = ${filename} / formData is ready / sending to ${this.uriToUploadMedia}`
        );

        // TODO : possibilité de cancel
        axios
          .post(this.uriToUploadMedia, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: function(progressEvent) {
              this.files_to_upload_meta[filename].upload_percentages = parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }.bind(this)
          })
          .then(x => {
            console.log(`METHODS • sendThisFile: got answer, x ${x}`);
            return x.data;
          })
          .then(x => {
            if (this.$root.state.dev_mode === "debug") {
              console.log(
                `METHODS • sendThisFile: name = ${filename} / success uploading`
              );
            }

            this.files_to_upload_meta[filename].status = "success";
            this.files_to_upload_meta[filename].upload_percentages = 100;

            const catchMediaCreation = d => {
              if (this.$root.state.dev_mode === "debug") {
                console.log(`METHODS • sendThisFile: catchMediaCreation`);
              }

              if (
                d.hasOwnProperty("corpus") &&
                d.corpus.hasOwnProperty(this.slugFolderName)
              ) {
                const new_media = Object.values(
                  d.corpus[this.slugFolderName].medias
                ).filter(m => m.media_filename === x.medias_filenames[0]);

                if (new_media.length > 0) {
                  console.log(
                    `UploadFile • METHODS: sendThisFile. Will emit insertMedia for = ${new_media[0].metaFileName}`
                  );

                  this.list_of_medias_to_add_to_fragment.push(
                    new_media[0].metaFileName
                  );

                  return resolve();
                }
              }
              this.$eventHub.$once(
                "socketio.corpus.listMedia",
                catchMediaCreation
              );
            };
            this.$eventHub.$once(
              "socketio.corpus.listMedia",
              catchMediaCreation
            );
            // resolve(x.map(img => Object.assign({}, img, { url: `${BASE_URL}/images/${img.id}` })));
          })
          .catch(err => {
            console.log(
              `METHODS • sendThisFile: name = ${filename} / failed uploading`
            );

            this.files_to_upload_meta[filename].status = "failed";
            this.files_to_upload_meta[filename].upload_percentages = 0;
            reject();
          });
      });
    },
    sendAllFiles() {
      const executeSequentially = array => {
        return this.sendThisFile(this.files_to_upload[array.shift()]).then(x =>
          array.length == 0 ? x : executeSequentially(array)
        );
      };

      executeSequentially(
        Array.from(Array(this.files_to_upload.length).keys())
      ).then(x => {
        this.$emit("insertMedias", this.list_of_medias_to_add_to_fragment);
        this.$emit("close");
      });

      // const test = async () => {
      //   for (let task of Array.from(Array(this.files_to_upload.length).keys()).map()) {
      //     await sendThisFile(task);
      //   }
      // }
    },
    formatBytes(a, b) {
      if (0 == a) return `0 ${this.$t("bytes")}`;

      var e = [
        this.$t("bytes"),
        this.$t("kb"),
        this.$t("mb"),
        this.$t("gb"),
        "TB",
        "PB",
        "EB",
        "ZB",
        "YB"
      ];

      var c = 1024,
        d = b || 2,
        f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
    getImgPreview(file) {
      return URL.createObjectURL(file);
    },
    cssStatus(f) {
      if (this.files_to_upload_meta.hasOwnProperty(f.name)) {
        return "is--" + this.files_to_upload_meta[f.name].status;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.m_uploadFile {
  position: relative;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  font-size: 75%;
  height: 60px;

  margin-bottom: calc(var(--spacing) / 2);
  background-color: var(--body-bg);

  border-radius: 4px;
  overflow: hidden;

  .m_uploadFile--progressBar {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;

    transform: scale(var(--progress-percent), 1);
    transform-origin: left center;

    transition: all 0.1s;
    background-color: var(--active-color);
  }

  > * {
    flex: 1 1 auto;
    position: relative;
    z-index: 1;
  }

  &.is--success {
  }
  &.is--failed {
    &::before {
      background-color: var(--color-black);
    }
  }

  .m_uploadFile--image {
    display: block;
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
    object-fit: contain;
    object-position: center;
    background-color: fade(white, 35%);
  }

  .m_uploadFile--filename {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    font-size: 75%;
    color: var(--color-black);
    padding: calc(var(--spacing) / 4);
  }
  .m_uploadFile--size {
    flex: 0 0 70px;
  }
  .m_uploadFile--action {
    flex: 0 0 70px;

    button {
      // .bg-bleuvert;
      background-color: transparent;
      color: inherit;
    }
  }
}
</style>
