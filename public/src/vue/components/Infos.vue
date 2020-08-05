<template>
  <div class="m_infos">
    <div class v-if="$root.can_admin_corpora">
      <button type="button" @click="$root.closeCorpus()">back</button>
    </div>

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
            >{{ lang.name }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="margin-sides-medium">
      <div class="margin-vert-small">
        <template v-if="!$root.can_admin_corpora">
          <button
            type="button"
            class="button-nostyle a"
            @click="show_admin_login = !show_admin_login"
            :class="{ 'is--active' : show_admin_login }"
          >admin</button>
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
        @click="$root.show_welcome_modal = true"
        :class="{ 'is--active' : $root.show_welcome_modal }"
      >{{ $t('personal_data_and_legal_notices')}}</button>
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
      current_role: "contributor",

      show_admin_login: false,
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
