<template>
  <Modal
    @close="$emit('close')"
    @submit="editFragment"
    :read_only="false"
    :typeOfModal="'LargeAndNoScroll'"
  >
    <template slot="header">{{ media.media_filename }}</template>
    <template slot="preview">
      <MediaContent
        :context="'edit'"
        :media="media"
        :slugFolderName="slugFolderName"
        :read_only="false"
      />
    </template>
  </Modal>
</template>
<script>
import MediaContent from "../subcomponents/MediaContent.vue";

export default {
  props: {
    media: Object,
    slugFolderName: String,
  },
  components: { MediaContent },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    editFragment() {},
  },
};
</script>
<style lang="scss"></style>
