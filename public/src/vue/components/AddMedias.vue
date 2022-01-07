<template>
  <div class="m_addMedias" :class="{ 'is--collapsed': collapsed }">
    <div
      class="menu_encart"
      :class="{ 'is--showing_options': show_addmedia_options }"
      :style="addMediaStyles"
      v-if="selected_files.length === 0"
    >
      <transition name="slide-fade">
        <!-- @mouseenter="!is_touch && show_drop_container === false ? show_addmedia_options = true : ''" -->
        <div class="menu_encart--options" v-if="show_addmedia_options">
          <div class="menu_encart--options--buttonRow">
            <button
              key="add_text"
              type="button"
              class="
                button button-round button-round-small
                margin-bottom-small
                padding-none
                bg-noir
                c-blanc
              "
              @click="createMedia({ type: 'text' })"
              :disabled="read_only"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <path
                  d="M26.51,12V28h-13V12h13m1-1h-15V29h15V11Z"
                  style="fill: currentColor"
                />
                <line
                  x1="15.21"
                  y1="14.41"
                  x2="24.71"
                  y2="14.41"
                  style="
                    fill: none;
                    stroke: currentColor;
                    stroke-miterlimit: 10;
                  "
                />
                <line
                  x1="15.21"
                  y1="17.88"
                  x2="24.71"
                  y2="17.88"
                  style="
                    fill: none;
                    stroke: currentColor;
                    stroke-miterlimit: 10;
                  "
                />
                <line
                  x1="15.21"
                  y1="21.26"
                  x2="24.71"
                  y2="21.26"
                  style="
                    fill: none;
                    stroke: currentColor;
                    stroke-miterlimit: 10;
                  "
                />
                <line
                  x1="15.21"
                  y1="24.62"
                  x2="22.88"
                  y2="24.62"
                  style="
                    fill: none;
                    stroke: currentColor;
                    stroke-miterlimit: 10;
                  "
                />
              </svg>
              <span class="text_label">{{ $t("text") }}</span>
            </button>

            <button
              key="add_link"
              type="button"
              class="
                button button-round button-round-small
                margin-bottom-small
                padding-none
                bg-noir
                c-blanc
              "
              @click="createMedia({ type: 'link' })"
              :disabled="read_only"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -70 250 250">
                <path
                  stroke="none"
                  fill="currentColor"
                  d="M8.9,104.6c11.8,11.8,31,11.8,42.8,0l16.9-16.9c-1.3,0.1-2.7,0.2-4,0.2c-4.3,0-8.4-0.7-12.4-2l-9.6,9.6
		c-3.3,3.3-7.7,5.1-12.3,5.1c-4.6,0-9-1.8-12.3-5.1c-3.3-3.3-5.1-7.6-5.1-12.3c0-4.6,1.8-9,5.1-12.3l18.7-18.7
		c3.3-3.3,7.7-5.1,12.3-5.1c4.7,0,9,1.8,12.3,5.1c1.6,1.6,2.8,3.4,3.7,5.5c2.1-0.1,10.6-7.5,10.6-7.5c-1.4-2.5-3.1-4.9-5.3-7.1
		c-11.8-11.8-31-11.8-42.8,0L8.9,61.8C-3,73.6-3,92.8,8.9,104.6z"
                />
                <path
                  stroke="none"
                  fill="currentColor"
                  d="M48.8,25.5c4.3,0,8.5,0.7,12.5,2.1l9.6-9.6c3.3-3.3,7.7-5.1,12.3-5.1s9,1.8,12.3,5.1c3.3,3.3,5.1,7.7,5.1,12.3
		s-1.8,9-5.1,12.3L76.8,61.3c-3.3,3.3-7.7,5.1-12.3,5.1c-4.7,0-9-1.8-12.3-5.1c-1.6-1.6-2.9-3.5-3.7-5.5c-2.1,0.1-4.1,1-5.7,2.5
		l-5,5c1.4,2.5,3.1,4.9,5.3,7.1c11.8,11.8,31,11.8,42.8,0l18.7-18.7c11.8-11.8,11.8-31,0-42.8C92.8-3,73.7-3,61.8,8.9L45,25.7
		C46.2,25.6,47.5,25.5,48.8,25.5L48.8,25.5L48.8,25.5z"
                />
              </svg>
              <span class="text_label">{{ $t("link") }}</span>
            </button>

            <label
              :key="`add_${field.key}`"
              class="
                button button-round button-round-small
                margin-bottom-small
                bg-noir
                c-blanc
                padding-none
              "
              v-for="field in input_file_fields"
              :disabled="read_only"
              :for="`add_${field.key + unique_id}`"
            >
              <div class="svg" v-html="field.svg" />
              <span class="text_label">{{ $t(field.label) }}</span>
              <input
                type="file"
                :id="`add_${field.key + unique_id}`"
                :name="field.key"
                @change="updateInputFiles($event)"
                :accept="field.accept"
                :capture="field.capture"
                multiple
                style="width: 1px; height: 1px; overflow: hidden"
              />
            </label>

            <!-- <button
              key="add_embed"
              type="button"
              class="button button-round button-round-small margin-bottom-small padding-none bg-noir c-blanc"
              @click="createMedia({ type: 'embed' })"
              :disabled="read_only"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="-10 -10 100 125"
              >
                <path
                  d="M378,370 c-25,-24,-25,-24,-49,1 l-195,205 c-20,23,-20,23,0,46 l195,205 c24,25,24,25,49,1 l38,-40 c23,-22,23,-22,0,-46 l-114,-120 c-22,-23,-22,-23,0,-47 l114,-119 c23,-24,23,-24,0,-48 Z M494,240 c-45,0,-46,0,-36,44 l161,651 c6,25,5,25,30,25 l57,0 c45,0,46,0,36,-44 l-161,-651 c-6,-25,-5,-25,-30,-25 Z M822,370 l-38,38 c-23,24,-23,24,0,48 l114,119 c22,24,22,24,0,47 l-114,120 c-23,24,-23,24,0,46 l38,40 c25,24,25,24,49,-1 l195,-205 c20,-23,20,-23,0,-46 l-195,-205 c-24,-25,-24,-25,-49,-1 Z M125,0 l950,0 c75,0,125,25,125,125 l0,950 c0,75,-50,125,-125,125 l-950,0 c-100,0,-125,-50,-125,-125 l0,-950 c0,-100,25,-125,125,-125 Z M125,0 "
                  fill="white"
                  transform="matrix(0.05,0.0,0.0,-0.05,20.0,80.0)"
                />
              </svg>
              <span class="text_label">{{ $t("embed") }}</span>
            </button> -->
          </div>
          <div>
            <small>{{ $t("file_max_size") }}: 20mo</small>
          </div>
        </div>
      </transition>

      <button
        type="button"
        class="
          menu_encart--button
          button button-round
          margin-bottom-small
          padding-none
          bg-noir
          c-blanc
          button_addMedia
          m_addMedias--buttons--openHideButton
        "
        :class="{
          'is--active': show_addmedia_options,
          'is--shown': show_addmedia_options,
          'is--dragover': show_drop_container,
        }"
        :style="addMediaStyles"
        @click="show_addmedia_options = !show_addmedia_options"
        @drop="dropHandler($event)"
      >
        <span class="text_label always_show" v-if="show_drop_container">{{
          $t("drop_files_here")
        }}</span>
        <!-- TODO scroll to now au click -->
        <svg
          v-if="!show_drop_container"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          style="enable-background: new 0 0 24 24"
          xml:space="preserve"
        >
          <path
            style="fill: currentColor"
            d="M0,10.5h10.5V0h2.9v10.5H24v2.9H13.5V24h-2.9V13.5H0V10.5z"
          />
        </svg>
      </button>
    </div>
    <UploadFile
      v-if="selected_files.length > 0"
      @close="selected_files = []"
      :slugFolderName="slugFolderName"
      :type="'corpus'"
      :selected_files="selected_files"
      @insertMedias="(metaFileNames) => newMediaCreated({ metaFileNames })"
    />
  </div>
</template>
<script>
import UploadFile from "./UploadFile.vue";
import debounce from "debounce";

export default {
  props: {
    slugFolderName: String,
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    UploadFile,
  },
  data() {
    return {
      selected_files: [],
      show_addmedia_options: false,

      show_drop_container: false,

      input_file_fields: [
        // {
        //   key: "audio",
        //   label: "Audio",
        //   accept: "audio/*",
        //   capture: true,
        //   svg: `
        //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        //     <line x1="5.83" y1="21.69" x2="5.83" y2="18.31" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="8.41" y1="16.52" x2="8.41" y2="23.48" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="10.99" y1="17.83" x2="10.99" y2="22.17" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="13.56" y1="24.94" x2="13.56" y2="15.06" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="16.14" y1="22.53" x2="16.14" y2="17.47" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="18.71" y1="16.9" x2="18.71" y2="23.1" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="21.29" y1="18.06" x2="21.29" y2="21.94" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="23.86" y1="22.67" x2="23.86" y2="17.33" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="26.44" y1="26.02" x2="26.44" y2="13.98" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="29.01" y1="22.73" x2="29.01" y2="17.27" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="31.59" y1="23.73" x2="31.59" y2="16.27" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     <line x1="34.17" y1="21.43" x2="34.17" y2="18.57" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     </svg>
        //   `
        // },
        {
          key: "file",
          label: "files",
          accept: "",
          capture: false,
          svg: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
              <path d="M20.89,12v4.63a1,1,0,0,0,1,1h4.63V28h-13V12h7.4m1-1H12.5V29h15V16.62H21.88V11Z" style="fill: currentColor"/>
              <line x1="27" y1="17.12" x2="21.38" y2="11.5" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round;stroke-width: 0.9900837817656861px"/>
            </svg>
          `,
        },
        // {
        //   key: "video",
        //   label: "Vidéo",
        //   accept: "video/*",
        //   capture: true,
        //   svg: `
        //     <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px"
        //       height="40px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
        //       <rect style="fill:none;stroke:currentColor" x="12.3" y="11" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 40 3.552714e-15)" style="fill:none;stroke:currentColor" width="15.3" height="18"/>
        //       <polygon  style="fill:none;stroke:currentColor" style="fill:none;stroke:currentColor" points="23.8,20 17.4,23.6 17.4,16.4 "/>
        //     </svg>
        //   `
        // },
        // {
        //   key: "image",
        //   label: "Image",
        //   accept: "image/*",
        //   capture: true,
        //   svg: `
        //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        //       <path d="M28,13.35v13.3H12V13.35H28m1-1H11v15.3H29V12.35Z" style="fill: currentColor"/>
        //       <line x1="13.85" y1="14.99" x2="26.48" y2="25.12" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //       <line x1="13.85" y1="25.12" x2="26.48" y2="14.99" style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round"/>
        //     </svg>
        //   `
        // }
      ],
    };
  },
  mounted: function () {
    document.addEventListener("keyup", this.boitierPressed);
    document.addEventListener("dragover", this.ondragover);
    this.cancelDragOver = debounce(this.cancelDragOver, 300);
  },
  destroyed: function () {
    document.removeEventListener("keyup", this.boitierPressed);
    document.removeEventListener("dragover", this.ondragover);
  },
  watch: {
    file: function () {},
    show_addmedia_options() {
      if (this.show_addmedia_options) {
        this.$eventHub.$emit("showingAddmediaOptions");
      } else {
        this.$eventHub.$emit("hidingAddmediaOptions");
      }
    },
  },
  computed: {
    is_touch() {
      return Modernizr.touchevents;
    },
    unique_id() {
      return (Math.random().toString(36) + "00000000000000000").slice(2, 3 + 5);
    },
  },
  methods: {
    createMedia({ type }) {
      if (window.state.dev_mode === "debug")
        console.log("METHODS • AddMediaButton: createMedia");

      this.$root
        .createMedia({
          slugFolderName: this.slugFolderName,
          type: "corpus",
          additionalMeta: {
            type,
          },
        })
        .then((mdata) => {
          this.newMediaCreated({ metaFileNames: [mdata.metaFileName] });
        });
    },
    newMediaCreated({ metaFileNames }) {
      console.log(
        `AddMedias • METHODS: newMediaCreated metaFileNames = ${metaFileNames.join(
          ","
        )}`
      );

      this.show_addmedia_options = false;
      this.$emit("addMediasToFragment", metaFileNames);
    },
    updateInputFiles($event) {
      if (this.$root.state.dev_mode === "debug") {
        console.log(`METHODS • AddMedia / updateSelectedFiles`);
      }
      this.selected_files = Array.from($event.target.files);
      $event.target.value = "";
    },
    ondragover(e) {
      if (this.$root.state.dev_mode === "debug") {
        console.log(`METHODS • AddMedia / ondragover`);
      }

      var dt = e.dataTransfer;
      if (
        dt.types &&
        (dt.types.indexOf
          ? dt.types.indexOf("Files") != -1
          : dt.types.contains("Files"))
      ) {
        console.log(`is file`);
        this.show_drop_container = true;
        this.cancelDragOver();
      }
    },
    cancelDragOver() {
      if (this.$root.state.dev_mode === "debug") {
        console.log(`METHODS • AddMedia / cancelDragOver`);
      }
      this.show_drop_container = false;
    },
    dropHandler($event) {
      if (this.$root.state.dev_mode === "debug") {
        console.log(`METHODS • AddMedia / dropHandler`);
      }

      // Prevent default behavior (Prevent file from being opened)
      $event.preventDefault();

      if ($event.dataTransfer.items) {
        let files = [];
        for (var i = 0; i < $event.dataTransfer.items.length; i++) {
          if ($event.dataTransfer.items[i].kind === "file") {
            files.push($event.dataTransfer.items[i].getAsFile());
          }
        }
        this.selected_files = files;
      } else {
        for (var i = 0; i < $event.dataTransfer.files.length; i++) {
          this.selected_files = Array.from($event.dataTransfer.files);
        }
      }
    },
  },
};
</script>
<style lang="scss">
.m_addMedias {
  position: relative;
  // width: 100px;
  height: auto;
  text-align: center;
  margin: calc(var(--spacing) / 4);
  // background-color: rgba(255, 255, 255, 0.4);
  // color: var(--color-white);

  .menu_encart {
    display: flex;
    justify-content: center;

    .menu_encart--options {
      padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);

      flex: 0 1 auto;

      .menu_encart--options--buttonRow {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;

        > button,
        > label {
          display: block;
          position: relative;
          cursor: pointer;
          opacity: 0;
          padding: 0;
          transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
          background-color: transparent;

          display: flex;
          align-items: center;
          background-color: var(--color-black);
          color: var(--color-white);
          border-radius: 20px;
          // padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);
          margin: calc(var(--spacing) / 8);

          &:hover {
            // background-color: var(--active-color);
            color: var(--color-purple);
          }

          .text_label {
            font-size: 0.8rem;
            font-weight: normal;
            cursor: inherit;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            align-content: center;
            border-radius: 10px;
            text-transform: lowercase;
            padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2)
              calc(var(--spacing) / 4) 0;
            margin-left: 0;

            font-family: "base12";
            font-style: italic;

            color: currentColor;

            // margin: calc(var(--spacing) / 4);
          }
          svg,
          .svg {
            width: 30px;
            height: 30px;
            color: currentColor;
            // padding-left: calc(var(--spacing) / 4);
          }

          .text_label {
          }
        }
      }
    }
    &.is--showing_options {
      pointer-events: auto;
      margin: var(--spacing) 0;
      // background-color: rgba(150, 150, 150, 0.1);

      .menu_encart--options .menu_encart--options--buttonRow > * {
        opacity: 1;
        transform: translateY(0px) scale(1);

        &[disabled] {
          // opacity: 0.4;
          cursor: not-allowed;
          background-color: #999;
        }
      }
    }

    .menu_encart--button {
      // height: 2em;
      flex: 0 1 auto;

      display: block;
      text-transform: initial;
      pointer-events: auto;
      // background-color: var(--color-black);
      background-color: transparent;
      // color: var(--color-white);
      color: var(--color-black);
      padding: calc(var(--spacing) / 4);
      border-radius: 14px;
      margin-bottom: 0;

      transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.4s;
      // transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

      &:hover {
      }

      svg {
        display: block;
        width: 14px;
        height: 14px;
        margin: 0 auto;
        transition: transform cubic-bezier(0.19, 1, 0.22, 1) 0.8s;
        transform: rotate(0);
        fill: currentColor;

        path {
          transition: opacity 0.2s ease-out;
        }
      }
      &.is--dragover {
        width: 120px;
        // height: 64px;
        padding: calc(var(--spacing) / 4);
        margin: 0;
      }

      &.is--shown {
        border-radius: 0;
      }
    }

    &.is--showing_options {
      // background-color: #999;

      .menu_encart--button svg {
        transform: rotate(225deg);
      }
    }
  }

  &.is--collapsed
    .menu_encart--button:not(:hover):not(.is--shown):not(.is--dragover) {
    background-color: var(--color-black);
    // padding: 2px;
    transform: scale(0.2);

    svg path {
      opacity: 0;
    }
    // width: 0px;
    // height: 0px;
    // transform: scale(0.4);
  }

  .menu_encart--button:not(.is--shown) {
    background-color: var(--color-black);
    > * {
      color: var(--color-lightgray);
      svg {
      }
    }
  }

  .m_addMedias--dropContainer {
    position: absolute;
    z-index: 0;
    bottom: 0;
    right: 0;

    border-radius: 6px;

    width: 120px;
    // height: 120px;
    background-color: var(--color-black);
  }

  input[type="file"] {
    padding: 0;
  }
}

.m_addMedias--buttons--openHideButton:not(.is--active) {
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    // background-color: rgba(255, 0, 0, 0.2);
    left: 0px;
    top: 0px;
    width: 20px;
    height: 20px;
    transform: scale(2);
  }
}

.m_addMedias.is--collapsed {
  .m_addMedias--buttons--openHideButton:not(.is--active) {
    &::before {
      transform: scale(6);
    }
  }
}
</style>
