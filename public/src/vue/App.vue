<template>
  <div>
    <List
      v-if="$root.do_navigation.view === 'ListView'"
      :corpuses="Object.values($root.store.corpus)"
    />

    <Corpus v-else-if="$root.do_navigation.view === 'CorpusView'" :corpus="$root.current_corpus" />
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
<style>
:root {
  --spacing: 1em;
  --color-black: #111;
}
</style>
