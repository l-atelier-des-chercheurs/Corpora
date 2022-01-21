<template>
  <div
    class="m_collaborativeEditor quillWrapper"
    :class="{
      'is--focused': is_focused,
      'is--receptiveToDrop': !!$root.settings.media_being_dragged,
      'is--dragover': is_being_dragover,
      'is--disabled': editor_not_enabled,
    }"
    autofocus="autofocus"
    @dragover="ondragover($event)"
    @drop="ondrop($event)"
  >
    <!-- connection_state : {{ connection_state }}
    <br />-->
    <div ref="editor" class="mediaTextContent" />
    <!-- <div class="_customCaret" :style="_customCaret_style" /> -->
  </div>
</template>
<script>
import ReconnectingWebSocket from "reconnectingwebsocket";
import ShareDB from "sharedb/lib/client";
import Quill from "quill";
// import QuillCursors from "quill-cursors";
import debounce from "debounce";

let Inline = Quill.import("blots/inline");
let Block = Quill.import("blots/block");
let BlockEmbed = Quill.import("blots/block/embed");
const Module = Quill.import("core/module");

class MediaBlot extends BlockEmbed {
  static blotName = "media";
  static tagName = "figure";
  static className = "ql-mediacard";

  static create({ type, src, caption, metaFileName }) {
    let node = super.create();
    console.log(`CollaborativeEditor • MediaBlot : create for type = ${type}`);

    node.setAttribute("contenteditable", false);

    let bg = window.document.createElement("div");
    bg.setAttribute("class", "ql-mediacard--background");
    node.appendChild(bg);

    let tag;

    if (!type || !metaFileName) {
      alert(
        `Missing type or metaFileName : type = ${type} and metaFileName = ${metaFileName}`
      );
      return;
    }

    if (type === "image") {
      tag = window.document.createElement("img");
    } else if (type === "video") {
      tag = window.document.createElement("video");
      tag.setAttribute("controls", true);
    }

    if (src) {
      tag.setAttribute("src", src);
    }
    tag.setAttribute("draggable", false);
    node.appendChild(tag);
    if (caption) {
      let caption_tag = window.document.createElement("figcaption");
      caption_tag.innerHTML = caption;
      node.appendChild(caption_tag);
    }
    node.dataset.type = type;
    node.dataset.metaFileName = metaFileName;
    node.setAttribute("draggable", false);

    // todo for later: allow drag from cards in quill
    // to move inside document or to composition
    node.addEventListener("dragstart", ($event) => {
      $event.dataTransfer.setData("text/plain", "media_in_quill");
      $event.dataTransfer.effectAllowed = "move";
      // this.is_dragged = true;
      // this.$root.settings.media_being_dragged = media.metaFileName;
    });

    node.style.animation = "scale-in 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
    node.addEventListener("animationend", () => {
      node.style.animation = "";
    });

    return node;
  }

  constructor(node) {
    super(node);

    let removeButton;
    let caption;
    let captionInput;

    node.__onSelect = () => {
      const quill = Quill.find(node.parentElement.parentElement);
      const _block = Quill.find(node);

      // quill.setSelection(quill.getIndex(_block), 0, Quill.sources.USER);
      node.classList.add("is--focused");

      removeButton = window.document.createElement("button");
      removeButton.innerHTML = "×";
      removeButton.setAttribute("type", "button");
      removeButton.classList.add("_button_removeMedia");
      removeButton.addEventListener("click", () => {
        node.__onDeselect();
        quill.enable(true);
        node.style.animation = "scale-out 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
        node.addEventListener("animationend", () => {
          super.remove();
          // node.remove();
          // supprimer du bloc proprement
        });
      });
      node.appendChild(removeButton);

      caption = node.querySelector("figcaption");
      captionInput = window.document.createElement("input");
      captionInput.setAttribute("type", "text");
      captionInput.placeholder = "Légende…";

      if (caption) {
        captionInput.value = caption.innerText;
        caption.innerHTML = "";
        caption.appendChild(captionInput);
      } else {
        caption = window.document.createElement("figcaption");
        caption.appendChild(captionInput);
        node.appendChild(caption);
      }

      captionInput.focus();
    };
    node.__onDeselect = () => {
      let value = captionInput.value;
      if (!value || value === "") {
        caption.remove();
      } else {
        captionInput.remove();
        caption.innerText = value;
      }
      node.classList.remove("is--focused");
      removeButton.remove();
    };
  }

  // deleteAt() {
  //   console.log("deleteAt for custom mediablock: prevented");

  //   return false;
  //   // prevent removing on backspace after block
  // }

  static value(node) {
    if (node.dataset.type === "image") {
      let img = node.querySelector("img");
      let figcaption = node.querySelector("figcaption");
      if (!img) return false;
      return {
        alt: img.getAttribute("alt"),
        src: img.getAttribute("src"),
        metaFileName: node.dataset.metaFileName,
        type: node.dataset.type,
        caption: figcaption ? figcaption.innerText : null,
      };
    } else if (node.dataset.type === "video") {
      let video = node.querySelector("video");
      let figcaption = node.querySelector("figcaption");
      if (!video) return false;
      return {
        alt: video.getAttribute("alt"),
        src: video.getAttribute("src"),
        metaFileName: node.dataset.metaFileName,
        type: node.dataset.type,
        caption: figcaption ? figcaption.innerText : null,
      };
    }
  }
}

class CardEditableModule extends Module {
  constructor(quill, options) {
    super(quill, options);
    let is_selected = false;

    let listener = (e) => {
      if (!document.body.contains(quill.root)) {
        return document.body.removeEventListener("click", listener);
      }
      let elm = e.target.closest(".ql-mediacard");

      let deselectCard = () => {
        console.log("deselectCard");
        is_selected = false;
        if (elm.__onDeselect) {
          elm.__onDeselect(quill);
        } else {
          quill.setSelection(
            quill.getIndex(elm.__blot.blot) + 1,
            0,
            Quill.sources.USER
          );
        }
      };
      if (elm && elm.__blot && elm.__onSelect && !is_selected) {
        quill.disable();
        is_selected = true;
        console.log("selectCard");

        elm.__onSelect(quill);
        let handleKeyPress = (e) => {
          if (e.keyCode === 27 || e.keyCode === 13) {
            window.removeEventListener("keypress", handleKeyPress);
            quill.enable(true);
            deselectCard();
          }
        };
        let handleClick = (e) => {
          const path = e.path || (e.composedPath && e.composedPath());
          if (e.which === 1 && !path.includes(elm)) {
            window.removeEventListener("click", handleClick);
            quill.enable(true);
            deselectCard();
          }
        };
        let handleDrag = (e) => {
          window.removeEventListener("dragover", handleDrag);
          quill.enable(true);
          deselectCard();
        };
        window.addEventListener("keypress", handleKeyPress);
        window.addEventListener("click", handleClick);
        window.addEventListener("dragover", handleDrag);
      }
    };
    quill.emitter.listenDOM("click", document.body, listener);
  }
}

Quill.register(
  {
    // Other formats or modules
    "formats/media": MediaBlot,
    "modules/cardEditable": CardEditableModule,
  },
  true
);

// Quill.register("modules/cursors", QuillCursors);
ShareDB.types.register(require("rich-text").type);

var quill_kb_bindings = {
  // This will overwrite the default binding also named 'tab'
  // tab: {
  //   key: 9,
  //   handler: function() {
  //     // Handle tab
  //   }
  // },

  // There is no default binding named 'custom'
  // so this will be added without overwriting anything
  backspace: {
    key: 8,
    handler: function (range, context) {
      if (
        range.index &&
        this.quill.getLine(range.index) &&
        this.quill.getLine(range.index)[0].domNode.dataset &&
        this.quill.getLine(range.index)[0].domNode.dataset.metaFileName
      ) {
      }
      return true;
    },
  },

  // list: {
  //   key: "backspace",
  //   format: ["list"],
  //   handler: function(range, context) {
  //     if (context.offset === 0) {
  //       // When backspace on the first character of a list,
  //       // remove the list instead
  //       this.quill.format("list", false, Quill.sources.USER);
  //     } else {
  //       // Otherwise propogate to Quill's default
  //       return true;
  //     }
  //   }
  // }
};

export default {
  props: {
    value: {
      type: String,
      default: "…",
    },
    enable_collaboration: {
      type: Boolean,
      default: false,
    },
    media: Object,
    slugFolderName: String,
    spellcheck: {
      type: Boolean,
      default: true,
    },
    folder_type: {
      type: String,
      default: "corpus",
    },
  },

  components: {},
  data() {
    return {
      editor: null,
      doc: undefined,
      editor_id: (Math.random().toString(36) + "00000000000000000").slice(
        2,
        3 + 5
      ),

      is_focused: false,
      is_being_dragover: false,

      debounce_textUpdate: undefined,
      caret_position: {
        top: undefined,
        left: undefined,
      },
      focused_lines: [],

      custom_toolbar: {
        container: [
          // [{ header: [false, 1, 2, 3] }],
          [{ header: 1 }, { header: 2 }],
          ["bold", "italic", "link", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },

      socket: null,
      connection_state: !this.enable_collaboration ? "disabled" : "connecting…",
      requested_resource_url: undefined,
    };
  },

  created() {},
  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      modules: {
        cardEditable: true,
        toolbar: this.custom_toolbar,
        //         cursors: {
        //           template: `
        //     <span class="ql-cursor-caret-container">
        //     <span class="ql-cursor-selections"></span>
        //       <span class="ql-cursor-caret"></span>
        //     </span>
        //     <div class="ql-cursor-flag">
        //       <small class="ql-cursor-name"></small>
        //       <span class="ql-cursor-flag-flap"></span>
        //     </div>
        // `,
        //           hideDelayMs: 5000,
        //           hideSpeedMs: 0,
        //           selectionChangeSource: null
        //         },
        keyboard: {
          bindings: quill_kb_bindings,
        },
      },
      bounds: this.$refs.editor,

      theme: "bubble",
      formats: [
        "bold",
        "italic",
        "underline",
        "link",
        "header",
        "blockquote",
        "indent",
        "list",
        "media",
      ],
      placeholder:
        this.$root.lang.current === "fr"
          ? "Écrire le texte ici…"
          : "Write text here",
    });

    this.$refs.editor.dataset.quill = this.editor;

    this.cancelDragOver = debounce(this.cancelDragOver, 300);

    this.setSpellCheck();

    this.$el
      .querySelector(".ql-tooltip-editor input")
      .setAttribute("data-link", this.$t("full_url"));

    if (this.$root.preview_mode) {
      this.editor.disable();
    }

    // const cursorsOne = this.editor.getModule("cursors");
    // cursorsOne.createCursor(1, "User 1", "#0a997f");

    this.$nextTick(() => {
      if (this.$root.state.mode === "live" && this.enable_collaboration) {
        this.initWebsocketMode();
        this.editor.focus();
      } else {
        this.editor.root.innerHTML = this.value;
      }

      this.editor.on("text-change", (delta, oldDelta, source) => {
        this.$emit(
          "input",
          this.editor.getText() ? this.editor.root.innerHTML : ""
        );

        this.$nextTick(() => {
          this.updateFocusedLines();
        });

        // cursorsOne.moveCursor(1, range);
      });

      this.editor.on("selection-change", (range, oldRange, source) => {
        console.log("selection changed");
        if (range === null && oldRange !== null) this.is_focused = false;
        else if (range !== null && oldRange === null) this.is_focused = true;

        // cursorsOne.moveCursor(1, range);
        if (!!range && range.length == 0) {
          console.log("User cursor is on", range.index);
          this.updateCaretPosition();
        }

        this.updateFocusedLines();
      });
    });

    this.$eventHub.$on("writeup.addMedia", this.addMediaAtCaretPosition);
  },
  beforeDestroy() {
    if (!!this.socket) {
      this.socket.close();
    }

    this.$root.settings.medias_present_in_writeup = [];
  },
  watch: {
    "$root.preview_mode": function () {
      if (this.$root.preview_mode) {
        this.editor.disable();
      } else {
        this.editor.enable();
      }
    },
    spellcheck: function () {
      this.setSpellCheck();
    },
    value: function () {
      this.broadcastMediasPresentInWriteup();
    },
    editor_not_enabled: function () {
      if (this.editor_not_enabled) {
        this.editor.disable();
      } else {
        this.editor.enable();
      }
    },
  },
  computed: {
    _customCaret_style() {
      return {
        transform: `translate3d(${this.caret_position.left}px, ${this.caret_position.top}px, 0px)`,
      };
    },
    editor_not_enabled() {
      return this.enable_collaboration && this.connection_state !== "connected";
    },
  },
  methods: {
    initWebsocketMode() {
      console.log(`CollaborativeEditor / initWebsocketMode`);
      const params = new URLSearchParams({
        type: this.folder_type,
        slugFolderName: this.slugFolderName,
        metaFileName: this.media.metaFileName,
      });

      const requested_querystring = "?" + params.toString();
      this.requested_resource_url =
        (location.protocol === "https:" ? "wss" : "ws") +
        "://" +
        window.location.host +
        "/sharedb" +
        requested_querystring;

      console.log(
        `CollaborativeEditor / initWebsocketMode : will connect to ws server with ${this.requested_resource_url}`
      );

      this.socket = new ReconnectingWebSocket(this.requested_resource_url);
      const connection = new ShareDB.Connection(this.socket);
      connection.on("state", this.wsState);

      const doc = connection.get("textMedias", requested_querystring);
      doc.subscribe((err) => {
        if (err) {
          console.error(`ON • CollaborativeEditor: err ${err}`);
        }
        console.log(`ON • CollaborativeEditor: subscribe`);

        if (!doc.type) {
          console.log(
            `ON • CollaborativeEditor: no type found on doc, creating a new one with content ${JSON.stringify(
              this.editor.getContents()
            )}`
          );
          this.editor.root.innerHTML = this.value;
          doc.create(this.editor.getContents(), "rich-text");
        } else {
          console.log(
            `ON • CollaborativeEditor: doc already exists and doc.data = ${JSON.stringify(
              doc.data,
              null,
              4
            )}`
          );
          this.editor.setContents(doc.data);
        }

        this.$emit(
          "input",
          this.editor.getText() ? this.editor.root.innerHTML : ""
        );

        this.editor.on("text-change", (delta, oldDelta, source) => {
          if (source == "user") {
            console.log(`ON • CollaborativeEditor: text-change by user`);
            doc.submitOp(delta, { source: this.editor_id });

            this.updateTextMedia();
          } else {
            console.log(`ON • CollaborativeEditor: text-change by API`);
          }
        });

        this.broadcastMediasPresentInWriteup();

        doc.on("op", (op, source) => {
          if (source === this.editor_id) return;
          console.log(`ON • CollaborativeEditor: operation applied to quill`);
          this.editor.updateContents(op);
        });
      });

      doc.on("error", (err) => {
        // soucis : les situations ou le serveur a été fermé et en le rouvrant il ne possède plus d’instance du doc dans sharedb…

        this.$forceUpdate();
      });
    },
    updateCaretPosition() {
      console.log(`CollaborativeEditor • METHODS: updateCaretPosition`);
      var selection = this.editor.getSelection(true);
      const caretPos = this.editor.getBounds(selection);
      this.caret_position = { top: caretPos.top, left: caretPos.left };
    },
    updateFocusedLines() {
      console.log(`CollaborativeEditor • METHODS: updateFocusedLines`);

      // if (oldRange && oldRange.index) {
      //   const line = this.editor.getLine(oldRange.index);
      //   if (line) {
      //     line[0].domNode.classList.remove("is--focused");
      //   }
      // }

      this.editor
        .getLines()
        .map((b) => b.domNode.classList.remove("is--focused"));

      const range = this.editor.getSelection();

      if (range && range.index) {
        const line = this.editor.getLine(range.index);
        if (line) {
          line[0].domNode.classList.add("is--focused");
        }
      }
    },
    wsState(state, reason) {
      console.log(
        `METHODS • CollaborativeEditor: wsState with state = ${state} and reason = ${reason}`
      );
      this.connection_state = state.toString();
      // 'connecting' 'connected' 'disconnected' 'closed' 'stopped'
    },
    updateTextMedia(event) {
      if (this.debounce_textUpdate) clearTimeout(this.debounce_textUpdate);
      this.debounce_textUpdate = setTimeout(() => {
        console.log(
          `CollaborativeEditor • updateTextMedia: saving new snapshop`
        );

        this.broadcastMediasPresentInWriteup();

        this.$root.editMedia({
          type: this.folder_type,
          slugFolderName: this.slugFolderName,
          slugMediaName: this.media.metaFileName,
          data: {
            content: this.editor.getText() ? this.editor.root.innerHTML : "",
          },
        });
      }, 1000);
    },
    broadcastMediasPresentInWriteup() {
      console.log(`CollaborativeEditor • broadcastMediasPresentInWriteup`);

      // var t0 = performance.now();

      const _medias_present = this.editor.getLines().reduce((acc, _blot) => {
        if (_blot.domNode.dataset && _blot.domNode.dataset.metaFileName) {
          if (!acc.includes(_blot.domNode.dataset.metaFileName)) {
            acc.push(_blot.domNode.dataset.metaFileName);
          }
        }
        return acc;
      }, []);

      // var t1 = performance.now();
      // console.log(
      //   "L'appel à faire quelqueChose a pris " + (t1 - t0) + " millisecondes."
      // );

      this.$root.settings.medias_present_in_writeup = _medias_present;
    },
    setSpellCheck() {
      console.log(
        `CollaborativeEditor • setSpellCheck: set to ${this.spellcheck}`
      );
      this.editor.root.spellcheck = this.spellcheck;
    },
    addMediaAtCaretPosition(media) {
      var selection = this.editor.getSelection(true);
      this.addMediaAtIndex(selection.index, media);
    },
    addMediaAtIndex(index, media) {
      console.log(`CollaborativeEditor • addMediaAtIndex ${index}`);
      const mediaURL =
        this.$root.state.mode === "export_publication"
          ? `./${this.slugFolderName}/${media.media_filename}`
          : `/${this.slugFolderName}/${media.media_filename}`;

      this.editor.focus();
      this.editor.setSelection(index, Quill.sources.SILENT);

      if (media.type === "image") {
        const thumb = media.thumbs.find((m) => m.size === 1600);
        if (!!thumb) {
          // this.editor.insertText(index, "\n", Quill.sources.USER);
          this.editor.insertEmbed(
            index,
            "media",
            {
              type: media.type,
              src: thumb.path,
              metaFileName: media.metaFileName,
            },
            Quill.sources.USER
          );
          this.editor.setSelection(index + 1, Quill.sources.SILENT);
        }
      } else if (media.type === "video") {
        // this.editor.insertText(index, "\n", Quill.sources.USER);
        this.editor.insertEmbed(
          index,
          "media",
          {
            type: media.type,
            src: mediaURL,
            metaFileName: media.metaFileName,
          },
          Quill.sources.USER
        );
        this.editor.setSelection(index + 1, Quill.sources.SILENT);
      } else {
        this.$alertify
          .closeLogOnClick(true)
          .delay(4000)
          .error(this.$t("notifications.media_type_not_handled"));
      }
    },
    ondragover($event) {
      console.log(
        `METHODS • CollaborativeEditor / dragover on ${$event.currentTarget.className}`
      );
      this.is_being_dragover = true;
      this.removeDragoverFromBlots();

      const _blot = this.getBlockFromElement($event.target);
      if (_blot) _blot.domNode.classList.add("is--dragover");

      this.cancelDragOver();
    },
    cancelDragOver() {
      if (this.$root.state.dev_mode === "debug") {
        console.log(`METHODS • CollaborativeEditor / cancelDragOver`);
      }
      this.removeDragoverFromBlots();
      this.is_being_dragover = false;
    },

    ondrop($event) {
      console.log(`METHODS • CollaborativeEditor / ondrop`);

      // Prevent default behavior (Prevent file from being opened)
      $event.preventDefault();
      $event.dataTransfer.dropEffect = "move";

      this.removeDragoverFromBlots();

      if ($event.dataTransfer.getData("text/plain") === "media_in_quill") {
        console.log(
          `METHODS • CollaborativeEditor / ondrop: drag and dropped a media from quill`
        );
        let _blot = this.getBlockFromElement($event.target);
        const index = this.editor.getIndex(_blot);

        // find which blot was dragged (A)

        // find where it was dropped (B)

        // move delta from A to B

        console.log(`_blot is currently at index ${index}`);
      } else if ($event.dataTransfer.getData("text/plain")) {
        console.log(
          `METHODS • CollaborativeEditor / ondrop: dropped a media from the library`
        );

        const data = JSON.parse($event.dataTransfer.getData("text/plain"));
        console.log(data);

        if (data.media_filename) {
          // drop sur l’éditor et pas sur une ligne
          if ($event.target.classList.contains("ql-editor")) {
            console.log(
              "dropped on editor and not on line, will insert at the end of doc"
            );
            this.addMediaAtIndex(this.editor.getLength() - 1, data);
            return;
          }

          let _blot = this.getBlockFromElement($event.target);

          if (!_blot) {
            this.$alertify
              .closeLogOnClick(true)
              .delay(4000)
              .error(this.$t("notifications.failed_to_find_block_line"));
            return;
          }

          _blot = _blot.next ? _blot.next : _blot;

          const index = this.editor.getIndex(_blot);
          this.addMediaAtIndex(index, data);
        }
      }
    },
    removeDragoverFromBlots() {
      this.editor.getLines().map((b) => {
        while (b.parent !== b.scroll) {
          b = b.parent;
          if (b === b.scroll) {
            break;
          }
        }
        if (b !== b.scroll && b.domNode) {
          b.domNode.classList.remove("is--dragover");
        }
      });
    },
    getBlockFromElement(_target) {
      while (!_target.parentElement.classList.contains("ql-editor")) {
        _target = _target.parentElement;
        if (_target === null || !_target.parentElement) break;
      }
      let _blot = Quill.find(_target);
      if (_blot) {
        return _blot;
      }
      return false;
    },
  },
};
</script>
<style>
/*!
 * Quill Editor v1.3.7
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
.ql-container {
  box-sizing: border-box;
  height: 100%;
  margin: 0px;
  position: relative;
}
.ql-container.ql-disabled .ql-tooltip {
  visibility: hidden;
}
.ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
  pointer-events: none;
}
.ql-clipboard {
  left: -100000px;
  height: 1px;
  overflow-y: hidden;
  position: absolute;
  top: 50%;
}
.ql-clipboard p {
  margin: 0;
  padding: 0;
}
.ql-editor {
  box-sizing: border-box;
  height: 100%;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  min-height: 1.5em;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.ql-editor > * {
  cursor: text;
}

.ql-editor ol,
.ql-editor ul {
  padding-left: 1.5em;
}
.ql-editor ol > li,
.ql-editor ul > li {
  list-style-type: none;
}
.ql-editor ul > li::before {
  content: "\2022";
}
.ql-editor ul[data-checked="true"],
.ql-editor ul[data-checked="false"] {
  pointer-events: none;
}
.ql-editor ul[data-checked="true"] > li *,
.ql-editor ul[data-checked="false"] > li * {
  pointer-events: all;
}
.ql-editor ul[data-checked="true"] > li::before,
.ql-editor ul[data-checked="false"] > li::before {
  color: #777;
  cursor: pointer;
  pointer-events: all;
}
.ql-editor ul[data-checked="true"] > li::before {
  content: "\2611";
}
.ql-editor ul[data-checked="false"] > li::before {
  content: "\2610";
}
.ql-editor li::before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
}
.ql-editor li:not(.ql-direction-rtl)::before {
  margin-left: -1.5em;
  margin-right: 0.3em;
  text-align: right;
}
.ql-editor li.ql-direction-rtl::before {
  margin-left: 0.3em;
  margin-right: -1.5em;
}
.ql-editor ol li:not(.ql-direction-rtl),
.ql-editor ul li:not(.ql-direction-rtl) {
  padding-left: 1.5em;
}
.ql-editor ol li.ql-direction-rtl,
.ql-editor ul li.ql-direction-rtl {
  padding-right: 1.5em;
}
.ql-editor ol li {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  counter-increment: list-0;
}
.ql-editor ol li:before {
  content: counter(list-0, decimal) ". ";
}
.ql-editor ol li.ql-indent-1 {
  counter-increment: list-1;
}
.ql-editor ol li.ql-indent-1:before {
  content: counter(list-1, lower-alpha) ". ";
}
.ql-editor ol li.ql-indent-1 {
  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-2 {
  counter-increment: list-2;
}
.ql-editor ol li.ql-indent-2:before {
  content: counter(list-2, lower-roman) ". ";
}
.ql-editor ol li.ql-indent-2 {
  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-3 {
  counter-increment: list-3;
}
.ql-editor ol li.ql-indent-3:before {
  content: counter(list-3, decimal) ". ";
}
.ql-editor ol li.ql-indent-3 {
  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-4 {
  counter-increment: list-4;
}
.ql-editor ol li.ql-indent-4:before {
  content: counter(list-4, lower-alpha) ". ";
}
.ql-editor ol li.ql-indent-4 {
  counter-reset: list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-5 {
  counter-increment: list-5;
}
.ql-editor ol li.ql-indent-5:before {
  content: counter(list-5, lower-roman) ". ";
}
.ql-editor ol li.ql-indent-5 {
  counter-reset: list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-6 {
  counter-increment: list-6;
}
.ql-editor ol li.ql-indent-6:before {
  content: counter(list-6, decimal) ". ";
}
.ql-editor ol li.ql-indent-6 {
  counter-reset: list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-7 {
  counter-increment: list-7;
}
.ql-editor ol li.ql-indent-7:before {
  content: counter(list-7, lower-alpha) ". ";
}
.ql-editor ol li.ql-indent-7 {
  counter-reset: list-8 list-9;
}
.ql-editor ol li.ql-indent-8 {
  counter-increment: list-8;
}
.ql-editor ol li.ql-indent-8:before {
  content: counter(list-8, lower-roman) ". ";
}
.ql-editor ol li.ql-indent-8 {
  counter-reset: list-9;
}
.ql-editor ol li.ql-indent-9 {
  counter-increment: list-9;
}
.ql-editor ol li.ql-indent-9:before {
  content: counter(list-9, decimal) ". ";
}
.ql-editor .ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 3em;
}
.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 4.5em;
}
.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
  padding-right: 3em;
}
.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
  padding-right: 4.5em;
}
.ql-editor .ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 6em;
}
.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 7.5em;
}
.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
  padding-right: 6em;
}
.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
  padding-right: 7.5em;
}
.ql-editor .ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 9em;
}
.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 10.5em;
}
.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
  padding-right: 9em;
}
.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
  padding-right: 10.5em;
}
.ql-editor .ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 12em;
}
.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 13.5em;
}
.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
  padding-right: 12em;
}
.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
  padding-right: 13.5em;
}
.ql-editor .ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 15em;
}
.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 16.5em;
}
.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
  padding-right: 15em;
}
.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
  padding-right: 16.5em;
}
.ql-editor .ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 18em;
}
.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 19.5em;
}
.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
  padding-right: 18em;
}
.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
  padding-right: 19.5em;
}
.ql-editor .ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 21em;
}
.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 22.5em;
}
.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
  padding-right: 21em;
}
.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
  padding-right: 22.5em;
}
.ql-editor .ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 24em;
}
.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 25.5em;
}
.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
  padding-right: 24em;
}
.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
  padding-right: 25.5em;
}
.ql-editor .ql-indent-9:not(.ql-direction-rtl) {
  padding-left: 27em;
}
.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
  padding-left: 28.5em;
}
.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
  padding-right: 27em;
}
.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
  padding-right: 28.5em;
}
.ql-editor .ql-video {
  display: block;
  max-width: 100%;
}
.ql-editor .ql-video.ql-align-center {
  margin: 0 auto;
}
.ql-editor .ql-video.ql-align-right {
  margin: 0 0 0 auto;
}
.ql-editor .ql-bg-black {
  background-color: #000;
}
.ql-editor .ql-bg-red {
  background-color: #e60000;
}
.ql-editor .ql-bg-orange {
  background-color: #f90;
}
.ql-editor .ql-bg-yellow {
  background-color: #ff0;
}
.ql-editor .ql-bg-green {
  background-color: #008a00;
}
.ql-editor .ql-bg-blue {
  background-color: #06c;
}
.ql-editor .ql-bg-purple {
  background-color: #93f;
}
.ql-editor .ql-color-white {
  color: #fff;
}
.ql-editor .ql-color-red {
  color: #e60000;
}
.ql-editor .ql-color-orange {
  color: #f90;
}
.ql-editor .ql-color-yellow {
  color: #ff0;
}
.ql-editor .ql-color-green {
  color: #008a00;
}
.ql-editor .ql-color-blue {
  color: #06c;
}
.ql-editor .ql-color-purple {
  color: #93f;
}
.ql-editor .ql-font-serif {
  font-family: Georgia, Times New Roman, serif;
}
.ql-editor .ql-font-monospace {
  font-family: Monaco, Courier New, monospace;
}
.ql-editor .ql-size-small {
  font-size: 0.75em;
}
.ql-editor .ql-size-large {
  font-size: 1.5em;
}
.ql-editor .ql-size-huge {
  font-size: 2.5em;
}
.ql-editor .ql-direction-rtl {
  direction: rtl;
  text-align: inherit;
}
.ql-editor .ql-align-center {
  text-align: center;
}
.ql-editor .ql-align-justify {
  text-align: justify;
}
.ql-editor .ql-align-right {
  text-align: right;
}
.ql-editor.ql-blank::before {
  color: rgba(0, 0, 0, 0.6);
  content: attr(data-placeholder);
  font-style: italic;
  left: 15px;
  pointer-events: none;
  position: absolute;
  right: 15px;
  padding: calc(var(--spacing) / 4);
}
.ql-bubble.ql-toolbar:after,
.ql-bubble .ql-toolbar:after {
  clear: both;
  content: "";
  display: table;
}
.ql-bubble.ql-toolbar button,
.ql-bubble .ql-toolbar button {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-block;
  float: left;
  height: 24px;
  padding: 3px 5px;
  width: 28px;
}
.ql-bubble.ql-toolbar button svg,
.ql-bubble .ql-toolbar button svg {
  float: left;
  height: 100%;
}
.ql-bubble.ql-toolbar button:active:hover,
.ql-bubble .ql-toolbar button:active:hover {
  outline: none;
}
.ql-bubble.ql-toolbar input.ql-image[type="file"],
.ql-bubble .ql-toolbar input.ql-image[type="file"] {
  display: none;
}
.ql-bubble.ql-toolbar button:hover,
.ql-bubble .ql-toolbar button:hover,
.ql-bubble.ql-toolbar button:focus,
.ql-bubble .ql-toolbar button:focus,
.ql-bubble.ql-toolbar button.ql-active,
.ql-bubble .ql-toolbar button.ql-active,
.ql-bubble.ql-toolbar .ql-picker-label:hover,
.ql-bubble .ql-toolbar .ql-picker-label:hover,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active,
.ql-bubble.ql-toolbar .ql-picker-item:hover,
.ql-bubble .ql-toolbar .ql-picker-item:hover,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected {
  color: #fff;
}
.ql-bubble.ql-toolbar button:hover .ql-fill,
.ql-bubble .ql-toolbar button:hover .ql-fill,
.ql-bubble.ql-toolbar button:focus .ql-fill,
.ql-bubble .ql-toolbar button:focus .ql-fill,
.ql-bubble.ql-toolbar button.ql-active .ql-fill,
.ql-bubble .ql-toolbar button.ql-active .ql-fill,
.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-bubble.ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-bubble.ql-toolbar button:focus .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar button:focus .ql-stroke.ql-fill,
.ql-bubble.ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
  fill: #fff;
}
.ql-bubble.ql-toolbar button:hover .ql-stroke,
.ql-bubble .ql-toolbar button:hover .ql-stroke,
.ql-bubble.ql-toolbar button:focus .ql-stroke,
.ql-bubble .ql-toolbar button:focus .ql-stroke,
.ql-bubble.ql-toolbar button.ql-active .ql-stroke,
.ql-bubble .ql-toolbar button.ql-active .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-bubble.ql-toolbar button:hover .ql-stroke-miter,
.ql-bubble .ql-toolbar button:hover .ql-stroke-miter,
.ql-bubble.ql-toolbar button:focus .ql-stroke-miter,
.ql-bubble .ql-toolbar button:focus .ql-stroke-miter,
.ql-bubble.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-bubble .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
  stroke: #fff;
}
@media (pointer: coarse) {
  .ql-bubble.ql-toolbar button:hover:not(.ql-active),
  .ql-bubble .ql-toolbar button:hover:not(.ql-active) {
    color: #ccc;
  }
  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-fill,
  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-fill,
  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
    fill: #ccc;
  }
  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
    stroke: #ccc;
  }
}
.ql-bubble {
  box-sizing: border-box;
}
.ql-bubble * {
  box-sizing: border-box;
}
.ql-bubble .ql-hidden {
  display: none;
}
.ql-bubble .ql-out-bottom,
.ql-bubble .ql-out-top {
  visibility: hidden;
}
.ql-bubble .ql-tooltip {
  position: absolute;
  transform: translateY(10px);
}
.ql-bubble .ql-tooltip a {
  cursor: pointer;
  text-decoration: none;
}
.ql-bubble .ql-tooltip.ql-flip {
  transform: translateY(-10px);
}
.ql-bubble .ql-formats {
  display: inline-block;
  vertical-align: middle;
}
.ql-bubble .ql-formats:after {
  clear: both;
  content: "";
  display: table;
}
.ql-bubble .ql-stroke {
  fill: none;
  stroke: #ccc;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
.ql-bubble .ql-stroke-miter {
  fill: none;
  stroke: #ccc;
  stroke-miterlimit: 10;
  stroke-width: 2;
}
.ql-bubble .ql-fill,
.ql-bubble .ql-stroke.ql-fill {
  fill: #ccc;
}
.ql-bubble .ql-empty {
  fill: none;
}
.ql-bubble .ql-even {
  fill-rule: evenodd;
}
.ql-bubble .ql-thin,
.ql-bubble .ql-stroke.ql-thin {
  stroke-width: 1;
}
.ql-bubble .ql-transparent {
  opacity: 0.4;
}
.ql-bubble .ql-direction svg:last-child {
  display: none;
}
.ql-bubble .ql-direction.ql-active svg:last-child {
  display: inline;
}
.ql-bubble .ql-direction.ql-active svg:first-child {
  display: none;
}
.ql-bubble .ql-editor blockquote {
  border-left: 4px solid #ccc;
  margin-bottom: 5px;
  margin-top: 5px;
  padding-left: 16px;
}
.ql-bubble .ql-editor code,
.ql-bubble .ql-editor pre {
  background-color: #f0f0f0;
  border-radius: 3px;
}
.ql-bubble .ql-editor pre {
  white-space: pre-wrap;
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 5px 10px;
}
.ql-bubble .ql-editor pre.ql-syntax {
  background-color: #23241f;
  color: #f8f8f2;
  overflow: visible;
}
.ql-bubble .ql-editor img {
  max-width: 100%;
}
.ql-bubble .ql-picker {
  color: #ccc;
  display: inline-block;
  float: left;
  font-size: 14px;
  font-weight: 500;
  height: 24px;
  position: relative;
  vertical-align: middle;
}
.ql-bubble .ql-picker-label {
  cursor: pointer;
  display: inline-block;
  height: 100%;
  padding-left: 8px;
  padding-right: 2px;
  position: relative;
  width: 100%;
}
.ql-bubble .ql-picker-label::before {
  display: inline-block;
  line-height: 22px;
}
.ql-bubble .ql-picker-options {
  background-color: #444;
  display: none;
  min-width: 100%;
  padding: 4px 8px;
  position: absolute;
  white-space: nowrap;
}
.ql-bubble .ql-picker-options .ql-picker-item {
  cursor: pointer;
  display: block;
  padding-bottom: 5px;
  padding-top: 5px;
}
.ql-bubble .ql-picker.ql-expanded .ql-picker-label {
  color: #777;
  z-index: 2;
}
.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-fill {
  fill: #777;
}
.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
  stroke: #777;
}
.ql-bubble .ql-picker.ql-expanded .ql-picker-options {
  display: block;
  margin-top: -1px;
  top: 100%;
  z-index: 1;
}
.ql-bubble .ql-color-picker,
.ql-bubble .ql-icon-picker {
  width: 28px;
}
.ql-bubble .ql-color-picker .ql-picker-label,
.ql-bubble .ql-icon-picker .ql-picker-label {
  padding: 2px 4px;
}
.ql-bubble .ql-color-picker .ql-picker-label svg,
.ql-bubble .ql-icon-picker .ql-picker-label svg {
  right: 4px;
}
.ql-bubble .ql-icon-picker .ql-picker-options {
  padding: 4px 0px;
}
.ql-bubble .ql-icon-picker .ql-picker-item {
  height: 24px;
  width: 24px;
  padding: 2px 4px;
}
.ql-bubble .ql-color-picker .ql-picker-options {
  padding: 3px 5px;
  width: 152px;
}
.ql-bubble .ql-color-picker .ql-picker-item {
  border: 1px solid transparent;
  float: left;
  height: 16px;
  margin: 2px;
  padding: 0px;
  width: 16px;
}
.ql-bubble .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
  position: absolute;
  margin-top: -9px;
  right: 0;
  top: 50%;
  width: 18px;
}
.ql-bubble
  .ql-picker.ql-header
  .ql-picker-label[data-label]:not([data-label=""])::before,
.ql-bubble
  .ql-picker.ql-font
  .ql-picker-label[data-label]:not([data-label=""])::before,
.ql-bubble
  .ql-picker.ql-size
  .ql-picker-label[data-label]:not([data-label=""])::before,
.ql-bubble
  .ql-picker.ql-header
  .ql-picker-item[data-label]:not([data-label=""])::before,
.ql-bubble
  .ql-picker.ql-font
  .ql-picker-item[data-label]:not([data-label=""])::before,
.ql-bubble
  .ql-picker.ql-size
  .ql-picker-item[data-label]:not([data-label=""])::before {
  content: attr(data-label);
}
.ql-bubble .ql-picker.ql-header {
  width: 98px;
}
.ql-bubble .ql-picker.ql-header .ql-picker-label::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item::before {
  content: "Normal";
}
.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "Heading 1";
}
.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "Heading 2";
}
.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "Heading 3";
}
.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "Heading 4";
}
.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "Heading 5";
}
.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "Heading 6";
}
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  font-size: 2em;
}
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  font-size: 1.5em;
}
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  font-size: 1.17em;
}
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  font-size: 1em;
}
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  font-size: 0.83em;
}
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  font-size: 0.67em;
}
.ql-bubble .ql-picker.ql-font {
  width: 108px;
}
.ql-bubble .ql-picker.ql-font .ql-picker-label::before,
.ql-bubble .ql-picker.ql-font .ql-picker-item::before {
  content: "Sans Serif";
}
.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "Serif";
}
.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "Monospace";
}
.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  font-family: Georgia, Times New Roman, serif;
}
.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  font-family: Monaco, Courier New, monospace;
}
.ql-bubble .ql-picker.ql-size {
  width: 98px;
}
.ql-bubble .ql-picker.ql-size .ql-picker-label::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item::before {
  content: "Normal";
}
.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "Small";
}
.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "Large";
}
.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "Huge";
}
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  font-size: 10px;
}
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  font-size: 18px;
}
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  font-size: 32px;
}
.ql-bubble .ql-color-picker.ql-background .ql-picker-item {
  background-color: #fff;
}
.ql-bubble .ql-color-picker.ql-color .ql-picker-item {
  background-color: #000;
}
.ql-bubble .ql-toolbar .ql-formats {
  margin: 8px 12px 8px 0px;
}
.ql-bubble .ql-toolbar .ql-formats:first-child {
  margin-left: 12px;
}
.ql-bubble .ql-color-picker svg {
  margin: 1px;
}
.ql-bubble .ql-color-picker .ql-picker-item.ql-selected,
.ql-bubble .ql-color-picker .ql-picker-item:hover {
  border-color: #fff;
}
.ql-bubble .ql-tooltip {
  background-color: #444;
  border-radius: 25px;
  color: #fff;
}
.ql-bubble .ql-tooltip-arrow {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  content: " ";
  display: block;
  left: 50%;
  margin-left: -6px;
  position: absolute;
}
.ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
  border-bottom: 6px solid #444;
  top: -6px;
}
.ql-bubble .ql-tooltip.ql-flip .ql-tooltip-arrow {
  border-top: 6px solid #444;
  bottom: -6px;
}
.ql-bubble .ql-tooltip.ql-editing .ql-tooltip-editor {
  display: block;
}
.ql-bubble .ql-tooltip.ql-editing .ql-formats {
  visibility: hidden;
}
.ql-bubble .ql-tooltip-editor {
  display: none;
}
.ql-bubble .ql-tooltip-editor input[type="text"] {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 13px;
  height: 100%;
  outline: none;
  padding: 10px 20px;
  position: absolute;
  width: 100%;
}
.ql-bubble .ql-tooltip-editor a {
  top: 10px;
  position: absolute;
  right: 20px;
}
.ql-bubble .ql-tooltip-editor a:before {
  color: #ccc;
  content: "\D7";
  font-size: 16px;
  font-weight: bold;
}
.ql-container.ql-bubble:not(.ql-disabled) a {
  position: relative;
  white-space: nowrap;
}
.ql-container.ql-bubble:not(.ql-disabled) a::before {
  background-color: #444;
  border-radius: 15px;
  top: -5px;
  font-size: 12px;
  color: #fff;
  content: attr(href);
  font-weight: normal;
  overflow: hidden;
  padding: 5px 15px;
  text-decoration: none;
  z-index: 1;
}
.ql-container.ql-bubble:not(.ql-disabled) a::after {
  border-top: 6px solid #444;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  top: 0;
  content: " ";
  height: 0;
  width: 0;
}
.ql-container.ql-bubble:not(.ql-disabled) a::before,
.ql-container.ql-bubble:not(.ql-disabled) a::after {
  left: 0;
  margin-left: 50%;
  position: absolute;
  transform: translate(-50%, -100%);
  transition: visibility 0s ease 200ms;
  visibility: hidden;
}
.ql-container.ql-bubble:not(.ql-disabled) a:hover::before,
.ql-container.ql-bubble:not(.ql-disabled) a:hover::after {
  visibility: visible;
}
</style>
<style lang="scss">
.m_collaborativeEditor {
  .ql-toolbar .ql-formats:first-child::before {
    /* content: "options :"; */
    position: relative;
    display: inline-block;
    float: left;
    font-size: 1rem;
    vertical-align: middle;
    font-weight: 400;
    /* background-color: #333; */
    /* left: -8px; */
    margin: 0;
    margin-top: 4px;
    font-weight: 400;
    /* padding: 11px; */
    /* margin-bottom: 10px; */
    /* text-decoration: underline; */
    font-size: 0.8rem;
    /* text-transform: uppercase; */
    /* margin-right: 15px; */
    /* font-style: italic; */
  }

  html[lang="fr"] .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  html[lang="fr"] .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "Titre 1";
  }
  html[lang="fr"] .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  html[lang="fr"] .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "Titre 2";
  }
  html[lang="fr"] .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  html[lang="fr"] .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "Titre 3";
  }
  html[lang="fr"] .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  html[lang="fr"] .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "Titre 4";
  }

  .ql-container.ql-bubble:not(.ql-disabled) a::before {
    line-height: 1.2;
  }

  .ql-tooltip {
    border-radius: 4px;
    // transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .ql-editor {
    padding-left: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: visible;

    &::after {
      // content: ".";
      color: #ccc;
    }
  }

  &.quillWrapper {
  }

  &.quillWrapper.is--focused {
    // color: rgba(40, 152, 217, 1);

    .ql-tooltip.ql-hidden {
      position: absolute;
      top: 100% !important;
      left: 0 !important;
      margin-top: var(--spacing);
      display: block;
      z-index: 10;
      transform: translateY(0px);

      .ql-tooltip-arrow {
        display: none;
      }
    }

    &::after {
      // content: "•";
      // display: block;
      // color: var(--active-color);
    }
  }

  .ql-editor.ql-blank::before {
    left: 0;
    color: currentColor;
    opacity: 0.4;
    font-style: normal;
  }
}
</style>
