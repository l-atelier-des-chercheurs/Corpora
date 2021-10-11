<template>
  <div class="m_infos">
    <div class v-if="$root.can_admin_corpora">
      <router-link
        :to="{
          name: 'Corpora',
        }"
        v-html="$t('back')"
      />
    </div>

    <div class="margin-sides-medium">
      <div class="margin-vert-small">Corpora v{{ $root.state.appVersion }}</div>
    </div>
    <div class="margin-sides-medium">
      <div class="margin-vert-small">
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

      <button
        type="button"
        class="button-nostyle a"
        @click="
          $root.settings.show_welcome_modal = true;
          $root.settings.unfold_legal_pane = true;
        "
        :class="{ 'is--active': $root.settings.show_welcome_modal }"
      >
        {{ $t("personal_data_and_legal_notices") }}
      </button>
    </div>
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
  watch: {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_infos {
}
</style>
