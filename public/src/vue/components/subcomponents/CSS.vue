<template>
  <div class="m_css">
    <div class="margin-vert-verysmall">
      <button
        type="button"
        @click="show_css = !show_css"
        v-html="'CSS'"
        :class="{
          'is--active': show_css,
        }"
      />
    </div>
    <template v-if="show_css">
      <textarea v-model="css_content" />
    </template>

    <v-style>
      {{ css_content }}
    </v-style>
  </div>
</template>
<script>
import localstore from "store";

export default {
  props: {},
  components: {},
  data() {
    return {
      show_css: false,
      css_content: "",
    };
  },
  created() {},
  mounted() {
    const css_content = localstore.get("css_content", this.css_content);
    if (css_content) {
      this.css_content = css_content;
      this.show_css = true;
    }
  },
  beforeDestroy() {},
  watch: {
    css_content() {
      localstore.set("css_content", this.css_content);
    },
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_css {
  position: fixed;
  bottom: calc(var(--spacing) * 0);
  right: calc(var(--spacing) * 0);
  background-color: var(--color-black);
  color: white;
  margin: 0;
  padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);
  // border-radius: 12px;
  border-top-left-radius: 12px;
  z-index: 10001;
}

button {
  display: block;
}

textarea {
  font-size: 90%;
  width: 33ch;
  height: 33vh;
}
</style>
