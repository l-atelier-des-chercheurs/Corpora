<template>
  <div class="app">
    <List
      v-if="
        $root.do_navigation.view === 'ListView' &&
        !$root.settings.is_loading_corpus
      "
      :corpuses="Object.values($root.store.corpus)"
    />

    <Corpus
      v-else-if="$root.do_navigation.view === 'CorpusView'"
      :corpus="$root.current_corpus"
    />

    <portal-target name="modal_container" />
  </div>
</template>

<script>
import List from "./views/List.vue";
import Corpus from "./views/Corpus.vue";

export default {
  name: "app",
  components: {
    List,
    Corpus,
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  beforeDestroy() {},
  computed: {},
  methods: {},
};
</script>
<style src="../../node_modules/vue-plyr/dist/vue-plyr.css"></style>
<style lang="scss">
:root {
  --spacing: 1rem;
  --color-black: #3c3541;
  --color-orange: #ffd675;
  --color-white: #fff;
  --body-bg: #e2edef;
  --active-color: #ccd0da;
  --color-bluegreen: #c0d8dd;
  --panel-width: 320px;
}

body {
  background-color: var(--body-bg);
  color: var(--color-black);
  margin: 0;
  font-family: "base12", sans-serif;
  font-size: 90%;
  line-height: 1.25;
}
::selection {
  background-color: var(--active-color);
}

* {
  box-sizing: border-box;
}

h1,
h2 {
  font-family: "base9";
  font-weight: bold;
}

h1 {
  font-size: 2rem;
  line-height: 1.09;
}

h2 {
  font-size: 1.3rem;
  line-height: 1.125;
}

h3 {
  font-weight: normal;
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.15;
}

label {
  display: block;
  margin-bottom: calc(var(--spacing) / 4);
  font-size: 0.7rem;
  text-transform: lowercase;
  color: inherit;
  // padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2)
  //   calc(var(--spacing) / 4) 0;

  font-family: "base9";
  font-weight: bold;
  // font-family: "base12";
  // font-style: italic;

  // margin: calc(var(--spacing) / 4);
}

.margin-bottom-small {
  margin-bottom: var(--spacing);
}
.margin-bottom-verysmall {
  margin-bottom: calc(var(--spacing) / 2);
}

.svg-icon {
  width: 1em;
  height: 1em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: var(--color-black);
}

.svg-icon circle {
  fill: var(--color-black);
  stroke-width: 1;
}

.custom_scrollbar {
  --scrollbarBG: #e2edef;
  --thumbBG: #90a4ae;

  &::-webkit-scrollbar {
    width: 12px;
  }
  & {
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  }
  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    // border-radius: 2px;
    border: 4px solid var(--scrollbarBG);
    border-top-width: calc(var(--spacing) * 2);
    border-bottom-width: calc(var(--spacing) * 2);

    &:hover {
      background-color: #ccd0da;
    }
  }
}

.m_advancedMenu {
  position: relative;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  align-items: flex-end;
  align-content: flex-end;
  z-index: 10;
  color: var(--color-black);

  &.is--open {
    z-index: 11;
  }

  button,
  .button {
    color: inherit;
    background-color: var(--color-black);

    &:hover,
    &:focus,
    &.is--active {
      color: white;
      background-color: var(--color-black);
    }
  }

  .m_advancedMenu--toggleButton {
    margin-bottom: 0;
    // background-color: transparent;
    width: auto;
    height: auto;
    line-height: 1;
    border-radius: 4px;
    margin: 4px;
    margin-bottom: 1px;

    // background-color: rgba(0, 0, 0, 0.3);
    background-color: rgba(226, 237, 239, 0.4);

    svg {
      display: block;
      width: 12px;
      height: 26px;
      padding: 4px;
      fill: currentColor;
      // filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
      filter: drop-shadow(0px 0px 2px rgba(226, 237, 239, 0.8));
      filter: drop-shadow(0px 0px 3px rgba(110, 110, 110, 0.4));

      circle {
        // filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 1));
        // filter: drop-shadow(10px 0 5px red);
      }
    }
  }

  .m_advancedMenu--menu {
    position: relative;
    z-index: 2;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-end;
    align-content: flex-end;
    align-items: flex-end;
    margin: 0 4px 0;
    color: var(--color-white);
    // padding: 2px;

    button,
    .button {
      margin-bottom: 1px;
      box-shadow: 0px 0px 4px rgba(60, 53, 65, 0.4);
    }

    > * {
      display: block;
    }
  }
}

p,
ul,
ol,
pre,
table,
blockquote {
  margin-top: 0em;
  margin-bottom: 0em;
}
ul ul,
ol ol,
ul ol,
ol ul {
  margin-top: 0em;
  margin-bottom: 0em;
}

/* Let's make sure all's aligned */
hr,
.hr {
  border: 1px solid;
  margin: -1px 0;
}
a,
b,
i,
strong,
em,
small,
code {
  // line-height: 0;
}
sub,
sup {
  // line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sup {
  top: -0.5em;
}
sub {
  bottom: -0.25em;
}
// gridlover end

h1,
h2 {
  & + h2 {
    margin-top: 0;
  }
}

ol,
ul {
  padding-left: calc(var(--spacing) / 2);

  > li {
    list-style-type: none;
  }
}
ul > li::before {
  content: "\2022";
}

li::before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
}

ol li {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  counter-increment: list-0;
}
ol li:before {
  content: counter(list-0, decimal) ". ";
}

strong,
b {
  font-weight: bold;
}

a {
  text-decoration: underline;
  text-decoration-style: solid;
  color: var(--active-color);
  // font-weight: 600;
}

h1,
h2 {
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}

blockquote {
  border-left: 4px solid var(--active-color);
  padding-left: calc(var(--spacing) * 2);
  margin-top: var(--spacing);
  margin-bottom: var(--spacing);

  + blockquote {
    margin-top: calc(-1 * var(--spacing));
  }
}

code,
pre {
  background-color: #f0f0f0;
  border-radius: 3px;
}
pre {
  white-space: pre-wrap;
  margin-bottom: var(--spacing);
  margin-top: var(--spacing);
  padding: var(--spacing) calc(var(--spacing) * 2);
}
code {
  font-size: 85%;
  padding: 2px 4px;
}

textarea,
input,
select,
button,
.button {
  font-family: inherit;

  &.bold {
    font-family: "base9";
    font-weight: bold;
  }
}

textarea,
input,
select,
button,
.button {
  color: var(--color-black);
}

input[type="checkbox"] {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(255, 255, 255, 2), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  border: 0px !important;
  outline: 0 !important;
  margin-left: 0;
  background-position: center center;
  background-repeat: no-repeat;

  &:checked {
    // background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAG0lEQVQImWNgYGD4z4AK/qMz0BVgAgyVGGYCAJbgB/la+vz5AAAAAElFTkSuQmCC);
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAKUlEQVQYlWNgYGD4z4Af/Mdg4FKASwCnDf8JKSBoAtEmEXQTQd8RDCcA6+4Q8DuoBAIAAAAASUVORK5CYII=);
    // background-size: 100% 100%;
    color: var(--color-orange);
    background-color: currentColor;
  }

  &:active {
  }

  &.disabled {
    background-color: var(--color-black);
    cursor: not-allowed;
  }
}
.input-checkbox {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  label {
    margin-bottom: 0;
  }
}

input,
textarea {
  font-size: 1.2em;
  padding: 0.4em 0.4em;
  border: none;
  border-radius: 2px;
  width: 100%;
  max-width: 320px;
  -webkit-appearance: none;
  // border-bottom: 2px solid white;

  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);

  &:active,
  &:focus {
    outline: 0px;
    border-left: 2px solid var(--color-orange);
  }
}

textarea {
  min-height: 12em;
}

/* IE11 hide native button (thanks Matt!) */
select::-ms-expand {
  display: none;
}

.custom-select {
  max-width: 220px;
  margin: 4px 0;
  position: relative;
  color: var(--color-black);
}

.custom-select::after {
  content: "<>";
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  left: 5px;
  /*Adjust for position however you want*/

  top: 6px;
  padding: 0 0 2px;
  color: currentColor;
  // border-top: 1px solid #999;
  /*left line */

  position: absolute;
  pointer-events: none;
}

.custom-select select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /* Add some styling */

  display: block;
  height: 2em;
  padding: 0px 12px 0 24px;
  font-size: 1rem;
  line-height: 1.75;
  max-width: 220px;
  border: 1px solid var(--active-color);

  background-color: var(--body-bg);
  background-image: none;
  // border: 1px solid #cccccc;
  -ms-word-break: normal;
  word-break: normal;

  &:hover,
  &:active,
  &:focus {
    outline: 0;
    background-color: var(--active-color);
  }
}

.custom-select_tiny {
  &::after {
    top: 3px;
  }
  select {
    font-size: 0.8rem;
  }
}

.bordered {
  border: 1px solid var(--active-color);
}

.bg-orange {
  background-color: var(--color-orange);
}

.padding-small {
  padding: calc(var(--spacing) / 2);
}
.margin-small {
  margin: calc(var(--spacing) / 2);
}

.flex-nowrap {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  > label {
    margin-bottom: 0;
  }
}
.align-items-stretch {
  align-items: stretch;
}

html,
body,
.app {
  height: 100%;
}

button,
.button,
input[type="submit"] {
  border: none;
  color: var(--color-black);
  background: #ccd0da;
  cursor: pointer;
  text-transform: lowercase;
  font-size: 1rem;
  padding: 0.2em 0.4em;
  text-decoration: none;
  border-radius: 2px;

  transition: background 0.4s cubic-bezier(0.19, 1, 0.22, 1);

  &:hover,
  &:active,
  &:focus {
    background: #f4f4f2;
    outline: 0;
  }

  &.button-small {
    font-size: 0.8rem;
  }

  &.is--active {
    background: #fff4db;
  }

  &.button-bg_rounded {
    border-radius: 0.5em;
    padding: 0.4em 0.8em;
  }

  span {
    display: flex;
    align-items: center;
  }

  svg + span {
    margin-left: var(--spacing);
  }

  &[type="submit"] {
    background-color: var(--color-orange);
  }
}

img,
video,
audio {
  max-width: 100%;
  height: auto;
  display: block;
}

.m_metaField {
  position: relative;

  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-end;

  border-bottom: 1px dashed var(--color-black);
  margin-bottom: var(--spacing);
}

.mediaContainer {
  img,
  iframe,
  video {
    display: block;
    width: 100%;
    background-color: var(--color-black);

    max-height: var(--fragment-width);
    object-fit: scale-down;
  }

  iframe {
    min-height: 202px;
  }
}

// .m_keywordField {
//   button {
//     margin: 0 4px 4px 0;
//     background-color: var(--color-orange);
//     color: var(--color-black);
//     font-size: 1.2em;
//   }
// }

.m_keywordField,
.vue-tags-input {
  position: relative;
  margin-bottom: 0;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  text-transform: initial;

  > .input {
    // border: none !important;
    // padding: 0 !important;
  }
  > .autocomplete {
    position: relative !important;
    background-color: transparent;
    // border: 4px solid #000 !important;
    // padding: 4px;
    margin-top: calc(var(--spacing) / 4);
    margin-bottom: calc(var(--spacing) / 4);
    padding-bottom: 0;
    flex: 1 0 100%;

    // &::before {
    //   content: "suggestion";
    //   margin-bottom: var(--spacing) / 8;
    //   text-transform: uppercase;
    //   .label;
    //   display: block;
    //   flex: 1 1 100%;
    // }

    > div {
      display: flex;
      flex-flow: row wrap;
    }
  }

  .m_keywordField--show_all_keywords {
    display: block;
    text-transform: uppercase;
    background-color: transparent !important;
    border: 2px solid #ccc;
    font-size: 80% !important;
    font-weight: bold;
    color: #999 !important;

    &::before {
      display: none;
    }
  }

  .item {
    border-radius: 4px;
    &.selected-item {
      background-color: var(--color-orange) !important;
    }
  }
  .tags {
    flex-flow: row wrap !important;
  }

  ._existing_button {
    margin-bottom: 0.2em;
  }

  .new-tag-input-wrapper {
    position: relative;

    width: 100%;
    margin: calc(var(--spacing) / 4);
    margin-left: 0;
    padding: 0 !important;
    background-color: transparent;

    display: flex !important;
    flex-flow: row nowrap;
    transform: all 1s cubic-bezier(0.19, 1, 0.22, 1);

    color: var(--color-black);
    input {
      position: relative;
      z-index: 1;
      // padding: var(--spacing) / 4 !important;
      // margin: 0 !important;
      // border-radius: 4px;
      min-width: 15ch !important;
      flex: 1 1 auto;
      // font-size: inherit !important;
      // line-height: 1;

      // height: auto !important;
    }

    button {
      display: block;
      // font-size: 2em;
      background-color: var(--color-orange);

      // color: white;
      flex: 0 0 1em;
      min-height: 0;
      width: 1em;
      overflow: hidden;
      font-size: 2em;
      line-height: 1;
      padding: 0;
      padding-bottom: 0.2em;
      margin-left: -4px;
      padding-left: 4px;
      border-radius: 0 4px 4px 0;

      &[disabled] {
        background-color: #999;
      }
    }
  }

  > span,
  > button,
  .tag,
  .item {
    flex-basis: auto;
    display: flex;
    align-items: center;
    min-height: 0;
    // border-radius: 4px !important;
    background-color: var(--color-orange);
    // color: white !important;
    color: var(--color-black);
    font-size: inherit;
    // .padding-sides-verysmall !important;
    // .padding-vert-verysmall !important;
    padding: 0.2rem 0.2rem;

    text-transform: initial;
    font-weight: inherit;
    font-weight: 400;

    // margin: 0 !important;
    margin-right: calc(var(--spacing) / 4);
    margin-bottom: calc(var(--spacing) / 4);

    &.is--active {
      font-weight: 700;
      &::before {
        color: black;
        // background-color: black !important;
      }
    }

    &::before {
      content: "•";
      flex-shrink: 0;
      margin: 0 8px;
      margin-left: 6px;
      padding-bottom: 2px;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
      color: inherit;
      font-size: 1em;
      border-radius: 50%;
      transform: scale(1.5);
      padding-top: 0.15em;

      transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &.can_be_removed {
      &::before {
        content: "×";
        transform: scale(1.2);
        transition: transform 0.15s ease;
        padding-top: 0.1em;
      }
      &:hover {
        &::before {
          color: #000;
          // transform: scale(2);
        }
      }
    }

    .actions {
      margin-left: 4px;
      margin-right: 0;
    }
  }

  &.m_keywordField_tabs {
    .tag,
    > button {
      background-color: var(--body-bg) !important;
      font-family: "base9";
      font-weight: bold;
      border-radius: 1em;
      padding: 0.2em 1em;
      padding-left: 0em;
      border: 2px solid var(--color-bluegreen);

      &::before {
        // display: none !important;
        padding-left: 0.7em;
        padding-right: 0.5em;
        margin: 0;
      }
      &.can_be_removed {
        &::before {
          font-size: 0.8rem;
        }
      }
    }
    .new-tag-input-wrapper {
      button {
        border-radius: 0;
        padding-left: 0.5em;
      }
    }
  }

  .item > div {
    margin: 0;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.list-complete-move {
  position: relative;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1),
    opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute !important;
  z-index: -1;
}

.width_collapse-enter-active,
.width_collapse-leave-active {
  // transform: scale(1, 1);
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}
.width_collapse-enter,
.width_collapse-leave-to {
  // transform: scale(0, 1);
  width: 0 !important;
}

.module-switch-move {
  position: relative;
  // background-color: white;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}
.module-switch-enter,
.module-switch-leave-to {
  height: 0;
  padding: 0;
  opacity: 0;
}
.module-switch-leave-active {
  height: 0;
  padding: 0;
  margin: 0;
  position: absolute;

  // position: absolute;
  z-index: 0 !important;
}

.alertify,
.alertify-logs {
  z-index: 20000;
}

.ql-editor {
  background-color: rgba(141, 141, 141, 0.05);
}

.m_modal--mask {
  position: fixed;
  z-index: 10000;
  min-height: 100%;
  top: 0;
  width: 100%;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  background-color: rgba(255, 255, 255, 0.9);
  // cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease-out;

  #app:not(.is--wide) & {
    align-items: flex-start;
    overflow: scroll !important;
    padding: 0 !important;
    height: 100% !important;
    background-color: #fff;
  }

  &.is_invisible {
    // background-color: transparent;
    opacity: 0;
    pointer-events: none;
  }

  &.is_minimized {
    background: transparent;
    // background: linear-gradient(45deg, fade(#fff, 92%) 150px, transparent 200px, transparent 100%);
    pointer-events: none;
    align-items: flex-end;
  }
}

.m_modal--wrapper {
}

.m_modal--container {
  position: relative;
  transition: all 0.3s ease;

  width: 100%;
  cursor: auto;

  max-width: var(--panel-width);
  // margin: 5vmin 5vmin;
  pointer-events: all;
  z-index: 1000;

  transition: all 0.15s ease-out;

  &.is_invisible {
    opacity: 0;
    transform: translate3d(0, 15px, 0) scale(0.98);
  }

  &.is_minimized {
    transform: scale(0.25);
    transform-origin: bottom left;
    margin-left: 5px !important;
    margin-bottom: 5px !important;
    margin-right: auto !important;

    .m_modal--container--content {
      border: 30px solid var(--color-white);
      border-radius: 20px;
    }
  }
  .m_modal--container--content {
    height: auto;

    // background-color: #fff;
    border-radius: 2px;
    // border: 1px solid #f4f4f2;

    display: flex;
    flex-flow: row wrap;

    transition: background-color 0.4s ease-out;

    > * {
      flex: 1 1 200px;
      // transition: all .5s ease-out;

      &.m_modal--sidebar {
        flex: 0 1 var(--panel-width);
        max-height: 90vh;
        width: 0px;

        // transition: all .8s ease-out;

        #app:not(.is--wide) & {
          max-height: none;
          flex: 1 1 400px;
        }

        &.is_collapsed {
          flex-basis: 0px;
        }
      }

      &.m_modal--preview {
        position: relative;
        width: 100%;
        height: 90vh;
        overflow: hidden;
        // border-right: 1px solid #f4f4f2;
      }
    }
  }
}

.m_modal--mask {
  &.typeOfModal-LargeAndScroll {
    padding: var(--spacing) 0;
    overflow-y: auto;
    .m_modal--container {
      max-width: calc(var(--panel-width) * 4);
      align-self: flex-start;
      .m_modal--preview {
        height: auto;
        #app:not(.is--wide) & {
          position: relative;
        }
      }
      #app.is--wide & {
        width: 90vw;
      }

      .m_modal--sidebar {
        margin-top: 0;
      }
    }
  }
  &.typeOfModal-ExportVideo {
    .m_modal--container {
      // max-width: var(--panel-width) * 4;
    }
  }

  &.typeOfModal-LargeAndNoScroll {
    overflow: hidden;

    .m_modal--container {
      margin: 0;
      max-width: calc(var(--panel-width) * 4);
      // align-self: flex-start;
      .m_modal--preview {
        #app.is--wide & {
          min-height: 70vh;
        }
        #app:not(.is--wide) & {
          position: fixed;
          height: 50vh;
        }
      }
      .m_modal--sidebar {
        #app:not(.is--wide) & {
          margin-top: 50vh;
          margin-bottom: 3em;
        }
      }

      #app.is--wide & {
        width: 90vw;
        margin-bottom: 20px;
      }
    }
  }
  &.typeOfModal-SmallAndScroll {
    overflow-y: auto;

    // if it is large, then it might be long as well. Let’s make sure it sticks to the top and scrolls to the bottom
    .m_modal--container {
      padding: 5vh 0;
      align-self: flex-start;
      .m_modal--preview {
        display: flex;
        flex-flow: column nowrap;
        min-height: 10vh;
        height: auto;
      }
    }
  }
  &.typeOfModal-LargeAndNoScrollWithButtons {
    .m_modal--container {
      max-width: none;
      height: 80vmin;
      width: 80vmin;

      .m_modal--container--content {
        flex-flow: column wrap;
        // background-color: transparent;
        // box-shadow: none;
        // border: none;
        height: 100%;

        .m_modal--sidebar {
          position: relative;
          // .bg-noir;
          flex-grow: 1;

          .m_modal--metaOptions {
            padding: 0;
            display: flex;
            flex-flow: column wrap;

            > .m_modal--metaOptions--media {
              flex: 1 1 auto;
            }
            > .m_modal--metaOptions--fav {
              flex: 0 0 auto;
            }
          }
        }
        .m_modal--buttons {
          flex: 0 0 auto;
        }
      }
    }
  }
}

.m_modal--sidebar {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  background-color: var(--color-black);
  border-radius: 2px;
  color: white;

  > * {
    flex: 0 0 auto;
  }

  .m_modal--sidebar--toggle {
    position: absolute;
    top: calc(var(--spacing) * 0.6);
    right: 100%;
    padding: calc(var(--spacing) * 0.5);
    font-weight: 700;
    font-size: 2em;
    // .bg-noir;
    // color: white;

    border-radius: 50% 0 0 50%;
    line-height: 1;
  }

  .m_modal--metaOptions {
    flex: 1 1 auto;
    margin: calc(var(--spacing) / 2) calc(var(--spacing));
    overflow-y: auto;

    > * {
      margin-bottom: calc(var(--spacing));

      &.m_modal--buttonrow {
        margin: 0;
        // .margin-vert-small;
        padding: 0 var(--spacing);
        text-align: center;

        #app:not(.is--wide) & {
          > a,
          > button {
            font-size: 0.7rem;
            padding: 0;
          }
        }
      }

      .plyr .plyr__video-wrapper {
        background-color: transparent;
      }

      &:first-child {
        margin-top: 0;
      }
    }

    hr {
      margin: var(--spacing);
    }
    table {
      margin: 0;
    }

    > *:last-child {
      margin-bottom: 0;
    }
  }
}
// if no preview, then sidebar takes the whole width

.m_modal--preview {
  .mediaContainer {
    height: 100%;
    overflow: hidden;
    position: relative;
    // background-color: #fff;
    background-color: #ccd0da;
    // .bg-noir;

    &[data-context="edit"] {
      > * {
        width: 100%;
        height: 100%;
      }
    }

    img {
      position: absolute;
      top: 0;
      right: 0;
      width: auto;
      height: auto;
      object-fit: contain;
      object-position: center;
    }

    .plyr--video,
    .plyr__video-wrapper,
    .plyr__poster {
      background-color: transparent;
    }
    .plyr--video .plyr__controls {
      // background: linear-gradient(fade(#ccc, 0%),fade(#ccc, 100%));
    }
    .plyr__controls {
      color: white !important;
    }

    .plyr--audio {
      display: flex;
      justify-content: center;
      align-items: center;

      .plyr__controls {
        // background-color: --color-black;
        // background: transparent;
        // color: --color-black;
        width: 80%;
        margin: 0 auto;
      }
    }

    &.type-text {
      // font-size: 2em;
      .ql-container {
        height: 100%;

        .ql-editor {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
        }
      }
    }

    &.type-audio {
      audio {
        width: 500px;
        margin: auto;
        height: 50%;
      }
    }
    &.type-other {
      color: --color-black;

      pre {
        display: inline-block;
        background-color: #fff;
        margin: calc(var(--spacing) / 4);
        padding: calc(var(--spacing) / 4);
      }
    }
  }

  input[type="text"] {
  }

  .m_modal--preview--media {
    width: 100%;
    height: 100%;

    > * {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}

twitter-widget.twitter-tweet {
  margin: 0 !important;
}

.m_modal--close_button {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1500;

  line {
    fill: none;
    stroke: #4d4d4d;
    stroke-miterlimit: 10;
    stroke-width: 3px;
  }

  html.touchevents & {
    top: 0;
    right: 0;
  }
}

.m_modal--loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.9);

  display: flex;
  justify-content: center;
  align-items: center;
}

.m_modal--minimize_button {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1500;

  pointer-events: auto;

  transition: transform 0.2s ease-out;

  &.is_minimized {
    // transform: ;
    transform: scale(-1) rotate(-360deg);
  }

  #app:not(.is--wide) & {
    display: none;
  }
}
.m_modal--nav_left,
.m_modal--nav_right {
  position: fixed;
  // top: ~"calc(50% - 40px)";
  top: auto;
  bottom: 0;
  z-index: 1500;

  #app:not(.is--wide) & {
    top: auto;
    bottom: 0;
    border: none;
  }
}
.m_modal--nav_left {
  left: auto;
  right: 50%;
  #app:not(.is--wide) & {
    left: 0;
    right: auto;
  }
}
.m_modal--nav_right {
  left: 50%;
  #app:not(.is--wide) & {
    left: auto;
    right: 0;
  }
}

.m_modal--header {
  margin: calc(var(--spacing) / 1) calc(var(--spacing));
  // border-bottom: 2px solid #f4f4f2;
  h3 {
    margin: 0;
    // font-weight: 700;
    // font-size: 2em;
  }
}

.m_modal--buttons {
  padding: calc(var(--spacing) / 4);
  // border-top: 2px solid #f4f4f2;

  display: flex;
  justify-content: center;

  min-height: 3em;

  #app:not(.is--wide) & {
    position: fixed;
    z-index: 1000;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
  }
  button {
    margin: calc(var(--spacing) / 4);
    background-color: #fff;
    color: var(--color-black);
  }

  button[type="submit"] {
    #app:not(.is--wide) & {
      // left: 50%;
      width: 10em;
      margin: 0 auto;
      // transform: translateX(-50%);
      text-align: center;
      min-height: 0;
    }
  }
}

.plyr {
  width: 100%;
  height: 100%;
  min-width: 100px;
  font-family: inherit;
  font-weight: 300;
  border-radius: 8px;

  button {
    min-height: 0;
  }

  video,
  .plyr__video-wrapper,
  .plyr__poster {
    width: 100%;
    height: 100%;
    object-fit: cover;

    > video {
      object-fit: contain;
      height: 100%;
    }
  }
  .plyr__video-wrapper {
    background-color: var(--color-black);
  }
  &.plyr--audio {
    // .bg-noir;

    .plyr__controls {
      // background: @c-noir;
      // background: transparent;
      // color: var(--color-black);
    }
  }
  .plyr__controls {
    background: var(--color-black);
    color: white;
    padding: 5px;

    @media (min-width: 480px) {
      .plyr--video .plyr__controls {
        padding: 10px;
      }
    }
  }

  .plyr__control--overlaid {
    background-color: var(--color-orange);
  }
  input[type="range"] {
    color: var(--color-orange);
  }

  .plyr__control.plyr__tab-focus,
  .plyr__control:hover,
  .plyr__control[aria-expanded="true"] {
    background-color: var(--color-orange);
  }

  .plyr__progress__container {
    flex: 1;
  }
}
</style>
