<template>
  <div class="app">
    <List
      v-if="$root.do_navigation.view === 'ListView'"
      :corpuses="Object.values($root.store.corpus)"
    />

    <Corpus
      v-else-if="$root.do_navigation.view === 'CorpusView'"
      :corpus="$root.current_corpus"
    />
  </div>
</template>

<script>
import List from "./views/List.vue";
import Corpus from "./views/Corpus.vue";

export default {
  name: "app",
  components: {
    List,
    Corpus
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  beforeDestroy() {},
  computed: {},
  methods: {}
};
</script>
<style lang="scss">
:root {
  --spacing: 1rem;
  --color-black: #111;
  --color-white: #fff;
  --active-color: #ccd0da;
}

body {
  background-color: #e8f4eb;
  background-color: #e2edef;
  margin: 0;
  font-family: "base12", sans-serif;
  font-size: 90%;
  line-height: 1.21;
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
  font-size: 1.5rem;
  line-height: 1.125;
}

h3 {
  font-weight: normal;
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.15;
}

button {
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
  line-height: 0;
}
sub,
sup {
  line-height: 0;
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
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
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
  color: var(--active-color);
  font-weight: 600;
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

html,
body,
.app {
  height: 100%;
}

button,
.button {
  border: none;
  background: #aaa;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
}

img,
video,
audio {
  max-width: 100%;
  height: auto;
  display: block;
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

.module-switch-move {
  position: relative;
  background-color: white;
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

  // position: absolute;
  z-index: 0 !important;
}
</style>
