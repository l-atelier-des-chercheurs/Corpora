<template>
  <div class="custom-select">
    <select :value="contribution_moment" @change="selectChange($event)">
      <option value="" v-if="!!is_filter && is_filter">
        {{ $t("all") }}
      </option>
      <option value="online">
        {{ $t("online") }}
      </option>
      <option
        v-for="{ name } in $root.current_corpus.contribution_moments"
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
    is_filter: Boolean,
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
    contribution_moment() {
      if (!this.value && !this.is_filter) return "online";
      return this.value;
    },
  },
  methods: {
    selectChange($event) {
      this.$emit("input", $event.target.value);
    },
  },
};
</script>
<style lang="scss"></style>
