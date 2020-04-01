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
}

body {
  background-color: #e8f4eb;
  margin: 0;
  font-family: "base12", sans-serif;
  font-size: 90%;
  line-height: 1.21;
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

html,
body,
.app {
  height: 100%;
}

button,
.button {
  border: none;
}

img,
video,
audio {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
