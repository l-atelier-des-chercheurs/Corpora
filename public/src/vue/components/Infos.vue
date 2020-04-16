<template>
  <div class="m_infos">
    <div class="margin-sides-medium">
      <div class="margin-vert-small">Corpora v{{ $root.state.appVersion }}</div>
    </div>
    <div class="margin-sides-medium">
      <div class="margin-vert-small">
        <div class="custom-select custom-select_tiny">
          <select v-model="new_lang">
            <option
              v-for="lang in this.$root.lang.available"
              :key="lang.key"
              :value="lang.key"
              >{{ lang.name }}</option
            >
          </select>
        </div>
      </div>
    </div>
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
  watch: {
    new_lang() {
      this.$root.updateLocalLang(this.new_lang);
    },
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
