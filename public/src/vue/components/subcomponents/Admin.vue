<template>
  <div>
    <template v-if="!$root.can_admin_corpora">
      <button
        type="button"
        class="button-nostyle a"
        @click="show_admin_login = !show_admin_login"
        :class="{ 'is--active': show_admin_login }"
      >
        admin
      </button>
      <div v-if="show_admin_login">
        <p>Enter password to admin</p>
        <input type="password" autofocus v-model="$root.admin_pwd" />
      </div>
    </template>
    <template v-else>
      <p>Connected as admin</p>
    </template>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      show_admin_login: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
