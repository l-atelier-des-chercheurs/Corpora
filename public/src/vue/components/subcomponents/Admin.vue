<template>
  <div class="m_admin">
    <template v-if="!$root.can_admin_corpora">
      <button
        type="button"
        class="button-nostyle a"
        @click="show_admin_login = !show_admin_login"
        :class="{ 'is--active': show_admin_login }"
        v-if="collapsable"
      >
        admin
      </button>
      <div v-if="show_admin_login || !collapsable">
        <p>Password to admin</p>
        <input
          ref="input"
          type="password"
          autofocus
          v-model="$root.admin_pwd"
        />
      </div>
    </template>
    <div class="_connected flex-wrap" v-else>
      <button
        type="button"
        @click="
          $root.admin_pwd = '';
          show_admin_login = false;
        "
      >
        (admin) {{ $t("logout") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    collapsable: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  data() {
    return {
      show_admin_login: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    show_admin_login() {
      if (this.show_admin_login) {
        this.$nextTick(() => {
          if (this.$refs.input) this.$refs.input.focus();
        });
      }
    },
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
input {
  background: white;
}
</style>
