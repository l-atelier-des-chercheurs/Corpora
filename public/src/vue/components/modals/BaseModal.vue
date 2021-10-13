<template>
  <portal to="modal_container">
    <div
      class="m_modal--mask"
      :class="[
        'typeOfModal-' + typeOfModal,
        { is_invisible: !showModal },
        { is_minimized: is_minimized },
        ,
      ]"
      @mousedown.self="closeModal"
      :style="`height: ${$root.settings.windowHeight}px`"
    >
      <div
        class="m_modal--container"
        :class="[
          'color-' + backgroundColor,
          { is_invisible: !showModal },
          { is_minimized: is_minimized },
        ]"
        @keyup.ctrl.enter="$emit('submit')"
      >
        <div class="m_modal--container--content" ref="modalContent">
          <div v-if="!!this.$slots['preview']" class="m_modal--preview">
            <!-- if there is no sidebar, output header here -->
            <template v-if="!this.$slots['sidebar']">
              <div class="m_modal--header">
                <h3 class="margin-none">
                  <slot name="header">default header</slot>
                </h3>
              </div>
            </template>

            <slot name="preview">default preview</slot>
          </div>

          <form
            class="m_modal--sidebar"
            :class="{ is_collapsed: !show_sidebar }"
            @submit.prevent="$emit('submit')"
            v-if="!!this.$slots['sidebar'] && !is_minimized"
            ref="form"
          >
            <button
              type="button"
              class="m_modal--sidebar--toggle"
              @click="toggleSidebar"
              v-if="can_minimize"
            >
              &#x2630;
            </button>

            <template
              v-if="!!this.$slots['sidebar'] && show_sidebar && !is_minimized"
            >
              <div class="m_modal--header">
                <h3 class="margin-none">
                  <slot name="header">default header</slot>
                </h3>
              </div>

              <div class="m_modal--metaOptions">
                <slot name="sidebar">default sidebar</slot>
              </div>

              <div
                v-if="!!this.$slots['submit_button']"
                class="m_modal--buttons"
              >
                <button
                  type="submit"
                  :disabled="read_only || is_loading"
                  class="button button-bg_rounded"
                >
                  <span class="text-cap font-verysmall">
                    <slot name="submit_button">{{ $t("save") }}</slot>
                  </span>
                </button>
              </div>
            </template>
          </form>

          <form
            v-if="!!this.$slots['buttons']"
            class="m_modal--buttons"
            v-on:submit.prevent="$emit('submit')"
            ref="form"
          >
            <button
              type="button"
              @click="closeModal"
              class="button button-bg_rounded bg-orange"
            >
              <img src="/images/i_clear.svg" draggable="false" />
              <span class="text-cap font-verysmall">
                <slot name="cancel_button">{{ $t("cancel") }}</slot>
              </span>
            </button>

            <button
              type="submit"
              :disabled="read_only"
              class="button button-bg_rounded bg-bleuvert"
            >
              <span class="text-cap font-verysmall">
                <slot name="submit_button">{{ $t("save") }}</slot>
              </span>
            </button>
          </form>

          <div v-if="!!this.$slots['body']">
            <slot name="body">default body</slot>
          </div>

          <div class="m_modal--loader" v-if="is_loading">
            <span class="loader" />
          </div>
        </div>
      </div>

      <transition name="fade" :duration="600">
        <button
          class="button-round m_modal--close_button padding-verysmall"
          @click="closeModal"
          v-if="showModal && !is_minimized && !prevent_close"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            style="enable-background: new 0 0 24 24; transform: rotate(-45deg)"
            xml:space="preserve"
          >
            <path
              style="fill: currentColor"
              d="M0,10.5h10.5V0h2.9v10.5H24v2.9H13.5V24h-2.9V13.5H0V10.5z"
            />
          </svg>
        </button>
      </transition>

      <transition name="fade" :duration="600">
        <button
          class="
            button-round
            bg-blanc
            m_modal--minimize_button
            padding-verysmall
          "
          @click="toggleMinimize"
          v-if="showModal && can_minimize"
          :class="{ is_minimized: is_minimized }"
          :content="$t('minimize_media')"
          v-tippy="{
            placement: 'right',
            delay: [600, 0],
          }"
        >
          <img src="/images/i_minimize.svg" draggable="false" />
        </button>
      </transition>

      <transition name="fade" :duration="600">
        <button
          class="button-round bg-blanc m_modal--nav_left padding-verysmall"
          @click="prevMedia()"
          v-if="showModal && media_navigation && !is_minimized"
          :content="$t('previous_media')"
          v-tippy="{
            placement: 'left',
            delay: [600, 0],
          }"
        >
          <img src="/images/i_arrow_left.svg" draggable="false" />
        </button>
      </transition>

      <transition name="fade" :duration="600">
        <button
          class="button-round bg-blanc m_modal--nav_right padding-verysmall"
          @click="nextMedia()"
          v-if="showModal && media_navigation && !is_minimized"
          :content="$t('next_media')"
          v-tippy="{
            placement: 'right',
            delay: [600, 0],
          }"
        >
          <img src="/images/i_arrow_right.svg" draggable="false" />
        </button>
      </transition>
    </div>
  </portal>
</template>

<script>
export default {
  name: "BaseModal",
  props: {
    backgroundColor: {
      type: String,
      default: "white",
    },
    read_only: {
      type: Boolean,
      default: true,
    },
    typeOfModal: {
      type: String,
      default: "EditMeta",
    },
    askBeforeClosingModal: {
      type: Boolean,
      default: false,
    },
    isFile: {
      type: Boolean,
      default: false,
    },
    show_sidebar: {
      type: Boolean,
      default: true,
    },
    can_minimize: {
      type: Boolean,
      default: false,
    },
    media_navigation: {
      type: Boolean,
      default: false,
    },
    is_minimized: {
      type: Boolean,
      default: false,
    },
    prevent_close: {
      type: Boolean,
      default: false,
    },
    is_loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      windowHeight: window.innerHeight,
      has_confirm_close_modal_open: false,
    };
  },
  mounted: function () {
    console.log(`MOUNTED • BaseModal`);

    setTimeout(() => {
      this.showModal = true;

      if (Modernizr !== undefined && !Modernizr.touchevents) {
        if (
          this.$refs.modalContent &&
          this.$refs.modalContent.querySelector("[autofocus]")
        ) {
          const el = this.$refs.modalContent.querySelector("[autofocus]");
          if (el.classList.contains("quillWrapper")) {
            el.querySelector(".ql-editor").focus();
          } else {
            el.focus();
          }

          if (el.hasAttribute("autoselect")) {
            el.select();
          }
        }

        if (this.isFile && this.$refs.form) {
          this.$refs.form.setAttribute("enctype", "multipart/form-data");
        }
      }
    }, 100);
  },
  computed: {},
  methods: {
    modalKeyListener: function (event) {
      if (window.state.dev_mode === "debug") {
        console.log("METHODS • BaseModal: modalKeyListener");
      }

      if (event.key === "Escape") {
        event.stopPropagation();
        if (!this.has_confirm_close_modal_open) {
          this.closeModal();
        }
        return false;
      }

      if (
        event.target.tagName.toLowerCase() === "input" ||
        event.target.tagName.toLowerCase() === "textarea" ||
        event.target.className.includes("ql-editor")
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        this.nextMedia();
        return;
      }
      if (event.key === "ArrowLeft") {
        this.prevMedia();
        return;
      }
    },
    closeModal: function () {
      console.log(
        `METHODS • BaseModal: closeModal with askBeforeClosingModal = ${this.askBeforeClosingModal}`
      );

      if (this.prevent_close) return;

      if (this.askBeforeClosingModal) {
        this.has_confirm_close_modal_open = true;
        this.$alertify
          .okBtn(this.$t("save_changes"))
          .cancelBtn(this.$t("close_the_window"))
          .confirm(
            this.$t("changes_not_saved_sureToCloseModal"),
            () => {
              this.$emit("submit");
              this.showModal = false;
              setTimeout(() => {
                this.$emit("close");
              }, 400);
            },
            () => {
              this.showModal = false;
              setTimeout(() => {
                this.$emit("close");
              }, 400);
            }
          );
      } else {
        this.showModal = false;
        setTimeout(() => {
          this.$emit("close");
        }, 400);
      }
    },
    prevMedia: function () {
      console.log(
        `METHODS • BaseModal: prevMedia with askBeforeClosingModal = ${this.askBeforeClosingModal}`
      );
      if (this.$root.app_is_fullscreen) {
        return;
      }

      if (this.askBeforeClosingModal) {
        this.has_confirm_close_modal_open = true;
        this.$alertify
          .okBtn(this.$t("save_changes"))
          .cancelBtn(this.$t("close_the_window"))
          .confirm(
            this.$t("changes_not_saved_sureToCloseModal"),
            () => {
              this.$emit("submit");
              this.$eventHub.$emit("modal.prev_media");
            },
            () => {
              this.$eventHub.$emit("modal.prev_media");
            }
          );
      } else {
        this.$eventHub.$emit("modal.prev_media");
      }
    },
    nextMedia: function () {
      console.log(
        `METHODS • BaseModal: nextMedia with askBeforeClosingModal = ${this.askBeforeClosingModal}`
      );

      if (this.$root.app_is_fullscreen) {
        return;
      }

      if (this.askBeforeClosingModal) {
        this.has_confirm_close_modal_open = true;
        this.$alertify
          .okBtn(this.$t("save_changes"))
          .cancelBtn(this.$t("close_the_window"))
          .confirm(
            this.$t("changes_not_saved_sureToCloseModal"),
            () => {
              this.$emit("submit");
              this.$eventHub.$emit("modal.next_media");
            },
            () => {
              this.$eventHub.$emit("modal.next_media");
            }
          );
      } else {
        this.$eventHub.$emit("modal.next_media");
      }
    },
  },
  created: function () {
    // TODO : buggy with multiple modals
    // document.addEventListener("keyup", this.modalKeyListener);
    document.body.classList.add("has_modal_opened");
    this.$root.settings.has_modal_opened = true;
  },
  destroyed: function () {
    // document.removeEventListener("keyup", this.modalKeyListener);
    document.body.classList.remove("has_modal_opened");
    this.$root.settings.has_modal_opened = false;
  },
};
</script>
<style scoped lang="scss">
.m_modal--mask.typeOfModal-LargeAndScroll {
  background: rgba(60, 53, 65, 0.95);
  padding: 0;

  .m_modal--close_button {
    color: var(--color-beige);

    svg {
      filter: drop-shadow(0px 0px 4px rgba(41, 41, 41, 0.8));
    }
  }
}

.m_modal--close_button {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1500;
  background-color: transparent;
  padding: 1em;

  svg {
    width: 2em;
    height: 2em;
  }
}
</style>
