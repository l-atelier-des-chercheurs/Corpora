<template>
  <div class="m_bandeau">
    <div class="m_bandeau--content">
      <div>
        {{ $t("website_uses_cookies") }}
        <router-link
          :to="{
            name: 'Mentions légales',
          }"
          class="button"
          v-html="$t('learn_more')"
        />
      </div>
      <div>
        <button
          type="button"
          @click="$root.settings.show_bandeau = false"
          v-html="$t('I_agree')"
        />
      </div>
    </div>
  </div>
</template>
<script>
// import localstore from "store";

export default {
  props: {
    corpus: Object,
  },
  components: {},
  data() {
    return {};
  },

  created() {},
  mounted() {},
  beforeDestroy() {},

  watch: {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_bandeau {
  position: fixed;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  top: 0;
  left: 0;
  opacity: 1;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
}
.m_bandeau--content {
  width: calc(100% - 1.5rem * 4);
  pointer-events: auto;
  padding: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  box-sizing: border-box;
  background-color: #000;
  color: var(--color-lightgray);
  background-color: var(--color-blue);

  font-family: var(--ff-top-level);
  font-weight: 300;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

button,
a {
  font-weight: inherit;

  &:hover,
  &:active,
  &:focus {
    color: var(--color-black);
  }
}
</style>
