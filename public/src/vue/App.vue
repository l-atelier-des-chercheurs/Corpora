<template>
  <div class="app">
    <transition-page>
      <router-view />
    </transition-page>

    <portal-target name="modal_container" multiple />
  </div>
</template>

<script>
import TransitionPage from "./transitions/TransitionPage.vue";

export default {
  name: "app",
  components: {
    TransitionPage,
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
  --color-gray: #a297aa;
  --color-white: #fff;
  --color-lightgray: #ededed;
  --active-color: var(--color-gray);
  --color-blue: #5444ff;
  --color-purple: #c53efe;
  --body-bg: var(--color-lightgray);
  --panel-width: 320px;

  // --ff-top-level: "Old Standard TT", "Times", "Times New Roman", serif;
  // --ff-body: "Open Sauce", "Helvetica", "Arial", sans-serif;

  --ff-body: "Old Standard TT", "Times", "Times New Roman", serif;
  --ff-top-level: "Open Sauce", "Helvetica", "Arial", sans-serif;

  // --body-bg: var(--color-lightgray);
}

body {
  background-color: var(--body-bg);
  color: var(--color-black);
  margin: 0;
  font-family: var(--ff-body);

  font-size: 90%;
  line-height: 1.25;

  &.has_modal_opened {
    overflow-y: hidden;
  }
}

::selection {
  background-color: var(--active-color);
}

* {
  box-sizing: border-box;
}

.t-indent {
  text-indent: 2em;
}

h1,
h2 {
  font-family: var(--ff-top-level);
}

h1 {
  font-size: 2.8rem;
  line-height: 1.09;
  font-weight: 300;
}

h2 {
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.25;
}

h3 {
  font-weight: normal;
  font-size: 1.25rem;
  line-height: 1.15;
}

label:not(.no-style) {
  display: block;
  margin-bottom: calc(var(--spacing) / 4);
  color: inherit;

  font-family: var(--ff-top-level);
  font-size: 1rem;
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

._load {
  border-radius: 4px;
  // font-size: 100%;
  // padding: 0.1em 0.2em;
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

.m_fragments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-gap: calc(var(--spacing)) calc(var(--spacing) * 1);

  padding: calc(var(--spacing) * 1) 0;

  > * {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    position: relative;
    z-index: 0;
    // padding: calc(var(--spacing) / 2);
  }
}

.m_fragments--createFragment {
  padding: calc(var(--spacing) / 2) 0;
  justify-content: flex-start;
  align-items: flex-start;
  border-top: 1px solid var(--color-blue);

  .m_fragments--createFragment--addFragmentButton {
    // color: var(--color-black);
    // background: transparent;
    padding: 0;
  }
}

.custom_scrollbar {
  --scrollbarBG: #e2edef;
  --thumbBG: var(--color-blue);

  &::-webkit-scrollbar {
    width: 16px;
  }
  & {
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  }
  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
    width: 14px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);

    border-radius: 2px;
    background-clip: padding-box;
    border: 6px solid var(--scrollbarBG);
    border-top-width: calc(var(--spacing) / 2);
    border-bottom-width: calc(var(--spacing) / 2);

    &:hover {
      background-color: #ccd0da;
    }
  }
}

.custom_scrollbar_dark {
  --scrollbarBG: transparent;
  --thumbBG: var(--color-lightgray);
}

.text-gray {
  color: var(--color-gray);
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

  // button,
  // .button {
  //   color: white;
  //   background-color: var(--color-black);

  //   &:hover,
  //   &:focus,
  //   &.is--active {
  //     color: white;
  //     background-color: var(--color-black);
  //   }
  // }

  .m_advancedMenu--toggleButton {
    margin-bottom: 0;
    // background-color: transparent;
    width: auto;
    height: auto;
    line-height: 1;
    // border-radius: 4px;
    margin: 0px;
    padding: 2px;
    margin-bottom: 1px;

    // background-color: rgba(0, 0, 0, 0.3);
    // border: 1px solid currentColor;
    color: var(--color-black);
    background-color: rgba(226, 237, 239, 0.4);

    svg {
      display: block;
      width: 22px;
      height: 14px;
      padding: 0px;
      fill: currentColor;
      transform: rotate(90deg);
      // filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
      // filter: drop-shadow(0px 0px 2px rgba(226, 237, 239, 0.8));
      // filter: drop-shadow(0px 0px 2px rgba(110, 110, 110, 1));

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
    margin: 0 0 0;
    color: var(--color-white);
    // padding: 2px;

    button,
    .button {
      margin-bottom: 1px;
      // box-shadow: 0px 0px 4px rgba(60, 53, 65, 0.4);
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
  border: none;
  border-top: 1px solid var(--color-blue);
  margin: var(--spacing) 0;
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

a,
.a {
  text-decoration: none;
  color: inherit;

  &:hover,
  &:active,
  &:focus {
    color: var(--color-blue);
    outline: 0;
  }
}

h1,
h2 {
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}

.ta-ce {
  text-align: center;
}
.ta-ri {
  text-align: right;
}
.tt-lc {
  text-transform: lowercase;
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
  padding: var(--spacing) calc(var(--spacing) * 1);
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
  font-family: var(--ff-top-level);
  background: transparent;
  color: inherit;
}

label {
  cursor: inherit;
}

input {
  &[type="text"],
  &[type="url"] {
    &[readonly] {
      cursor: not-allowed;
      background-color: rgb(226, 226, 226) !important;
    }
  }
}

input[type="checkbox"] {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  // box-shadow: 0 1px 3px rgba(255, 255, 255, 2), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  border: 0px !important;
  outline: 0 !important;
  margin-left: 0;
  margin-bottom: 0;
  background-position: center center;
  background-repeat: no-repeat;

  &:checked {
    // background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAG0lEQVQImWNgYGD4z4AK/qMz0BVgAgyVGGYCAJbgB/la+vz5AAAAAElFTkSuQmCC);
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAKUlEQVQYlWNgYGD4z4Af/Mdg4FKASwCnDf8JKSBoAtEmEXQTQd8RDCcA6+4Q8DuoBAIAAAAASUVORK5CYII=);
    // background-size: 100% 100%;
    color: var(--color-purple);
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
  padding: 0.4em calc(0.4em - 2px) 0.4em 0.4em;
  border: none;
  border-radius: 2px;
  width: 100%;
  max-width: 320px;
  -webkit-appearance: none;

  background: white;
  color: var(--color-black);

  border-left: 2px solid transparent;

  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);

  &:active,
  &:focus {
    outline: 0px;
    border-left: 2px solid var(--color-purple);
  }
}

.ql-editor {
  max-width: none;
}

.input-addon {
  font-size: 1.2em;
  // height: 100%;

  > * {
    padding: 0.4em 0.8em;
    height: 100%;
    border: none;

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

input[type="radio"] {
  width: auto;
}

textarea {
  min-height: 12em;
}

/* IE11 hide native button (thanks Matt!) */
select::-ms-expand {
  display: none;
}

.custom-select {
  max-width: 120px;
  margin: 4px 0;
  position: relative;
  color: var(--color-black);
}

.custom-select_xs {
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
  max-width: 150px;
  &::after {
    top: 3px;
  }
  select {
    font-size: 0.8rem;
  }
}

select {
  &:focus,
  &:active {
    outline: 1px solid var(--color-black);
  }
}

.bordered {
  border: 1px solid var(--active-color);
}

.bg-orange {
  background-color: var(--color-purple);
}

.padding-small {
  padding: calc(var(--spacing) / 2);
}
.padding-verysmall {
  padding: calc(var(--spacing) / 4);
}
.padding-vert-small {
  padding-top: calc(var(--spacing) / 2);
  padding-bottom: calc(var(--spacing) / 2);
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
}

button,
.button,
input[type="submit"] {
  border: none;
  cursor: pointer;

  padding: calc(var(--spacing) / 4) calc(var(--spacing) / 4);
  text-decoration: none;
  font-size: inherit;

  transition: background 0.2s cubic-bezier(0.19, 1, 0.22, 1);

  &:hover,
  &:active,
  &:focus {
    color: var(--color-blue);
    outline: 0;
  }

  &.is--active {
    color: var(--color-blue);
    outline: 0;
  }

  span {
    display: flex;
    align-items: center;
  }

  svg + span {
    margin-left: var(--spacing);
  }

  &.button-triangle {
    &::after {
      content: "◄";
      display: inline-block;
      margin-left: 0.5em;
      transition: transform 0.5s, color 0.5s;
    }

    &:hover {
      background-color: transparent;

      &::after {
        color: var(--color-purple);
      }
    }

    &.is--active {
      color: var(--color-purple);
      &::after {
        transform: rotate(-90deg);
      }

      &:hover {
        background-color: transparent;
      }
    }

    &.bg-rouge {
      &:hover {
        &::after {
          color: var(--color-black);
        }
      }
      &.is--active {
        color: var(--color-black);
      }
    }
  }

  &[disabled] {
    background: var(--active-color);
    cursor: default;
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
    max-width: 100%;
    background-color: var(--color-black);

    object-fit: scale-down;
    object-fit: cover;
  }

  iframe,
  video {
    width: 100%;
  }

  iframe {
    min-height: 480px;
    background-color: transparent;
  }

  pre {
    margin: 0;
  }

  &.type-link,
  &.type-embed {
    background-color: rgba(141, 141, 141, 0.1);
  }
}

// .m_keywordField {
//   button {
//     margin: 0 4px 4px 0;
//     background-color: var(--color-purple);
//     color: var(--color-black);
//     font-size: 1.2em;
//   }
// }

._siteCard {
  display: flex;
  flex-flow: row wrap;
  // background-color: rgba(141, 141, 141, 0.1);
  overflow: hidden;
  // padding: calc(var(--spacing) / 2);

  // font-size: 0.7em;

  ._siteCard--image {
    position: relative;
    flex: 1 0 25%;
    min-width: 200px;
    max-width: 260px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: white;
    }

    ._siteCard--image--playButton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      &:hover {
        background-color: rgba(255, 255, 255, 0.25);
      }
    }
  }

  ._siteCard--text,
  ._siteCard--embed {
    flex: 1 1 100px;
    padding: calc(var(--spacing) / 2);
  }
  ._siteCard--text--title {
    font-family: var(--ff-top-level);
    font-weight: bold;
  }
  ._siteCard--text--description {
  }
}

._playButton {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;

  svg {
    width: 24px;
    height: 24px;
  }
  circle {
    fill: var(--color-blue);
  }
  polygon {
    fill: white;
  }
}

.collList {
  background-color: transparent;
  // background-color: var(--color-lightgray);

  // border-radius: 8px;
  width: 100%;
  display: block;
  padding: calc(var(--spacing) / 4);
  margin: 0 0 calc(var(--spacing) / 2) 0;
  // margin: 0 calc(-1 * var(--spacing) / 4) calc(var(--spacing) / 2);

  text-align: left;
  text-transform: inherit;

  border-left: 2px solid var(--color-purple);

  &.is--active {
    background: var(--color-purple);
  }

  ._title {
    font-family: var(--ff-top-level);
    font-weight: bold;
  }

  &::before {
    // content: ">";
  }
}

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
      background-color: var(--color-purple) !important;
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
      background-color: var(--color-purple);

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
    background-color: var(--color-purple);
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

    &:hover,
    &:active,
    &:focus {
      background: #f4f4f2;
    }

    &.is--active {
      color: white;
      background-color: var(--color-black);

      &::before {
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

  &.m_keywordField_tags {
    .tag,
    > button {
      // background-color: var(--body-bg) !important;
      // font-weight: bold;
      border-radius: 1em;
      padding: 0.3em 0em;
      padding-right: 1em;
      // border: 1px solid var(--color-blue);
      background: white;

      &.is--active {
        color: white;
        border-color: var(--color-black);
        background-color: var(--color-black) !important;
      }

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

  &.m_keywordField_keywords {
    .tag,
    > button {
      &::before {
        content: "#";
        font-weight: 400;
        transform: none;
        margin-right: 2px;
        padding: 0;
        padding-top: 0.2em;
      }
    }
  }

  .item > div {
    margin: 0;
  }
}

.motsclestags {
  display: flex;
  flex-flow: row wrap;
  color: var(--color-gray);
  gap: calc(var(--spacing) / 4);
  // max-height: 100px;
  justify-content: center;
  line-height: 1;

  margin-top: calc(var(--spacing) / 4);
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

.slide-up {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: center bottom;
  }
  &-enter,
  &-leave-active {
    opacity: 0;
    transform: translateY(2em) scale(0.6);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list-complete-move {
  position: relative;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1),
    opacity 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute !important;
  z-index: -1;
  transition: none !important;
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

.m_modal--mask {
  position: fixed;
  z-index: 10000;
  min-height: 100%;
  top: 0;
  left: 0;
  width: 100%;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  background-color: rgba(255, 255, 255, 0.9);
  // cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);

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

  width: 100%;
  cursor: auto;

  max-width: var(--panel-width);
  // margin: 5vmin 5vmin;
  pointer-events: all;
  z-index: 1000;

  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);

  &.is_invisible {
    opacity: 0;
    transform: translateY(50px);
    pointer-events: none;
    // transform: translate3d(0, 5px, 0);
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

    transition: background-color 0.2s ease-out;

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
    padding: calc(var(--spacing) * 2);
    overflow-y: auto;

    @media (max-width: 480px) {
      padding-left: 0;
      padding-right: 0;
    }

    .m_modal--container {
      max-width: calc(var(--panel-width) * 2.5);
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

      &[data-originComponent] {
        max-width: calc(var(--panel-width) * 3.5);
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

        display: flex;
        flex-flow: column nowrap;
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
          // background-color: var(--color-black);
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
    // background-color: var(--color-black);
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
    // background-color: var(--color-black);

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
      height: 100%;
      width: 100%;
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
      color: var(--color-black);

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
  min-height: 2em;

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

.admin_cat {
  border: 2px solid white;
  padding: 0 calc(var(--spacing) / 3);
}

.plyr {
  width: 100%;
  height: 100%;
  min-width: 100px;
  font-family: inherit;
  font-weight: 300;
  // border-radius: 8px;

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
    // background-color: var(--color-black);

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
    background-color: var(--color-purple);
  }
  input[type="range"] {
    color: var(--color-purple);
  }

  .plyr__control.plyr__tab-focus,
  .plyr__control:hover,
  .plyr__control[aria-expanded="true"] {
    background-color: var(--color-purple);
  }

  .plyr__progress__container {
    flex: 1;
  }
}
</style>
<style lang="less">
.mediaTextContent {
  position: relative;
  color: inherit;
  padding: ~"calc(var(--spacing) / 4)";

  > * {
    &:first-child {
      margin-top: 0;

      > *:first-child {
        margin-top: 0;
      }
    }
  }

  ._no_textcontent {
    font-style: italic;
    color: #999;
  }

  // https://www.gridlover.net/try
  // fz : 16px
  // lh : 1.41
  // scale : 1.31

  font-size: 1em;
  line-height: 1.2375;
  // max-width: 773px;
  // margin: auto;

  h1,
  .h1 {
    font-size: 2.25em;
    line-height: 1.27777778em;
    margin-top: 0.63888889em;
    margin-bottom: 0em;
  }
  h2,
  .h2 {
    font-size: 1.6875em;
    line-height: 1.7037037em;
    margin-top: 0.65185185em;
    margin-bottom: 0em;
  }
  h3,
  .h3 {
    font-size: 1em;
    line-height: 1.4375em;
    margin-top: 1.4375em;
    margin-bottom: 0em;
  }
  h4,
  .h4 {
    font-size: 1em;
    line-height: 1.4375em;
    margin-top: 1.4375em;
    margin-bottom: 0em;
  }
  h5,
  .h5 {
    font-size: 1em;
    line-height: 1.4375em;
    margin-top: 1.4375em;
    margin-bottom: 0em;
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
    border: none;
    height: 4px;
    background-color: var(--c-bleuvert);
    border-radius: 4px;
    // border-bottom: 4px solid var(--c-bleuvert);
    margin: ~"calc(var(--spacing) / 2)" 0;
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
    padding-left: 1.5em;

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
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8
      list-9;
    counter-increment: list-0;
  }
  ol li:before {
    content: counter(list-0, decimal) ". ";
  }

  strong,
  b {
    font-weight: 700;
  }

  a {
    text-decoration: underline;
    text-decoration-style: solid;
    // color: var(--color-purple);
    font-weight: inherit;
  }

  h1,
  h2 {
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }

  h1 {
    font-weight: 700;
  }

  h2,
  h3,
  h4 {
    font-weight: 700;
  }

  blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
  }

  code,
  pre {
    background-color: var(--color-black);
    color: white;
    border-radius: 3px;
    font-weight: 500;
  }
  pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
  }
  code {
    // font-size: 85%;
    // padding: 2px 4px;
  }

  .ql-align-center {
    text-align: center;
  }
  .ql-align-justify {
    text-align: justify;
  }
  .ql-align-right {
    text-align: right;
  }
}

@media print {
  :root {
    --body-bg: white !important;
  }
  .m_tags,
  .m_tags--allfragments {
    /* display: block !important; */
  }

  .m_tags--options {
    display: none !important;
  }
  .m_fragment--content {
    margin-bottom: 0 !important;
    page-break-inside: avoid;
    page-break-after: always;
  }

  .m_corpus {
    margin: 0 auto;
    display: block !important;
    height: auto !important;
  }
}

._loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;

  // backdrop-filter: blur(4px);
  // -webkit-backdrop-filter: blur(4px);
  // background-color: hsla(275, 10%, 63%, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--color-blue);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

.margin-vert-small {
  margin-top: var(--spacing);
  margin-bottom: var(--spacing);
}
.margin-vert-verysmall {
  margin-top: ~"calc(var(--spacing) / 2)";
  margin-bottom: ~"calc(var(--spacing) / 2)";
}
</style>
