<template>
  <div class="m_fragmentModal m_modal--mask">
    <div class="m_modal--container">
      <p>
        Suspendisse orci arcu, scelerisque sollicitudin suscipit sit amet,
        sollicitudin vel leo. Sed eget felis quam. Praesent dapibus semper nisi
        in gravida. Nullam aliquet erat sed ultricies elementum. Donec et lectus
        id lectus faucibus ultrices in in velit. Sed finibus tincidunt augue, at
        varius odio. Fusce accumsan dolor in risus lacinia, sed hendrerit urna
        tincidunt. Aliquam feugiat tortor ut ante egestas, sit amet aliquam
        ipsum faucibus. Phasellus eleifend justo in odio placerat, in cursus
        ligula sollicitudin. Vestibulum mauris sem, commodo vel varius ut,
        gravida id purus. Pellentesque hendrerit sed odio vitae lobortis.
      </p>
    </div>
  </div>
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
}
</style>
