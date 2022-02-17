<template>
  <div class="m_langSwitch">
    <template v-for="(lang, index) in $root.lang.available">
      <span v-if="index > 0" v-html="'/'" :key="'/' + lang.key" />
      <button
        :key="lang.key"
        type="button"
        :class="{
          'is--active': lang.key === $root.lang.current,
        }"
        @click="new_lang = lang.key"
      >
        {{ lang.key }}
      </button>
    </template>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      new_lang: this.$root.lang.current,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    new_lang() {
      this.$root.updateLocalLang(this.new_lang);
    },
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_langSwitch {
  display: flex;
  align-items: center;
}
</style>
