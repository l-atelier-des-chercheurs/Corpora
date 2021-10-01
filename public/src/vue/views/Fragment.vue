<template>
  <Modal
    @close="closeModal"
    :read_only="false"
    :typeOfModal="'LargeAndNoScroll'"
    :is_loading="is_sending_content_to_server"
    class="m_fragmentModal"
  >
    <template slot="header">
      <span class>{{ $t("create_a_story") }}</span>
    </template>
    <template slot="preview">COUCOU</template>
    <template slot="sidebar">SIDEBAR</template>
  </Modal>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    closeModal() {
      this.$router.push({ path: `./` });
    },
  },
};
</script>
<style lang="scss" scoped>
.m_fragmentModal {
  z-index: 9999;
}
</style>
