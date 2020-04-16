<template>
  <div class="custom-select">
    <select :value="value" @change="selectChange($event)">
      <option value="">
        {{ $t("all") }}
      </option>
      <option value="online">
        {{ $t("online") }}
      </option>
      <option
        v-for="{ name } in $root.current_corpus.contribution_moment"
        :key="name"
      >
        {{ name }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    all_contribution_modes() {},
  },
  methods: {
    selectChange($event) {
      this.$emit("input", $event.target.value);
    },
  },
};
</script>
<style lang="scss"></style>
