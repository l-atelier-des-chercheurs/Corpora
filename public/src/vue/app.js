/** *********
  VUE
***********/

// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from "vue";

import localstore from "store";
import _ from "underscore";
Object.defineProperty(Vue.prototype, "$_", { value: _ });

import alertify from "alertify.js";
Vue.prototype.$alertify = alertify;

import auth from "../adc-core/auth-client.js";
auth.init();
Vue.prototype.$auth = auth;

import locale_strings from "./locale_strings.js";

Vue.prototype.$eventHub = new Vue(); // Global event bus

import VueRouter from "vue-router";
import router from "./router";
Vue.use(VueRouter);

import PortalVue from "portal-vue";
Vue.use(PortalVue);

import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import VuePlyr from "vue-plyr";
Vue.use(VuePlyr);

Vue.component("Loader", {
  name: "Loader",
  template: `
    <div class="_loader">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>    
    </div>
  `,
});

import Modal from "./components/modals/BaseModal.vue";
Vue.component("Modal", Modal);

Vue.directive("visible", function (el, binding) {
  el.style.visibility = !!binding.value ? "visible" : "hidden";
});

import VueTippy, { TippyComponent } from "vue-tippy";

Vue.use(VueTippy);
Vue.component("tippy", TippyComponent);

let lang_settings = {
  available: [
    {
      key: "fr",
      name: "Français",
    },
    {
      key: "en",
      name: "English",
    },
  ],
  default: "en",
  current: "",
  init: function () {
    let localstore_lang = localstore.get("language");

    // // force lang to french
    // this.current = 'fr';
    // return;

    if (localstore_lang !== undefined) {
      // exists in available
      if (this.available.find((l) => l.key === localstore_lang)) {
        this.current = localstore_lang;
      }
    }

    if (this.current === "") {
      // set current lang from window.navigator.language
      // window.navigator.language can be 'fr', 'en', or 'fr-FR'
      let browser_lang_available = this.available.find((l) => {
        return window.navigator.language.includes(l.key);
      });
      this.current = browser_lang_available
        ? browser_lang_available.key
        : this.default;
    }

    // this.current = this.default;
  },
};
lang_settings.init();

import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-gb";

moment.locale(lang_settings.current);
Vue.prototype.$moment = moment;

const html = document.documentElement; // returns the html tag
html.setAttribute("lang", lang_settings.current);

// tweak locale_strings to fit vuei18n pattern
let messages = {};
Object.entries(locale_strings).map(([key, translations]) => {
  Object.entries(translations).map(([lang_code, translation]) => {
    if (typeof translation === "object") {
      const key2 = lang_code;
      const translations = translation;

      Object.entries(translations).map(([lang_code, translation]) => {
        if (!messages[lang_code].hasOwnProperty(key))
          messages[lang_code][key] = {};
        if (!messages[lang_code][key].hasOwnProperty(key2))
          messages[lang_code][key][key2] = {};
        messages[lang_code][key][key2] = translation;
      });
      // Object.entries(translation).map(([key2, translation2]) => {
      //   if (!messages[lang_code][key].hasOwnProperty(key2))
      //     messages[lang_code][key][key2] = {};
      //   messages[lang_code][key][key2][lang_code] = translation2;
      // });
    } else {
      if (!messages.hasOwnProperty(lang_code)) messages[lang_code] = {};
      if (!messages[lang_code].hasOwnProperty(key))
        messages[lang_code][key] = {};
      messages[lang_code][key] = translation;
    }
  });
});
const lang_keys = lang_settings.available.map((l) => l.key);

// check for missing lang

// var get_missing_langs = function({ translation_slug, items }) {
//   let list = [];
//   const missing_lang = lang_keys.filter(k => !Object.keys(items).includes(k));
//   if (missing_lang.length > 0) {
//     missing_lang.map(lang => {
//       list.push({ lang, translation_slug });
//     });
//   }
//   return list;
// };

// const missing_translations = Object.entries(locale_strings).reduce(
//   (acc, [translation_slug, items]) => {
//     if (typeof Object.values(items)[0] === "object") {
//       const list = Object.entries(items).reduce(
//         (acc, [translation_slug, items]) => {
//           const list = get_missing_langs({ translation_slug, items });
//           if (list.length > 0) {
//             acc = acc.concat(list);
//           }
//           return acc;
//         },
//         []
//       );
//       if (list.length > 0) {
//         acc = acc.concat(list);
//       }
//     } else {
//       const list = get_missing_langs({ translation_slug, items });
//       if (list.length > 0) {
//         acc = acc.concat(list);
//       }
//     }
//     return acc;
//   },
//   []
// );

// Create VueI18n instance with options
let i18n = new VueI18n({
  locale: lang_settings.current, // set locale
  fallbackLocale: "en",
  messages, // set locale messages
});

/** *********
  SOCKETIO
***********/

import custom_socketio from "../adc-core/custom-socketio.js";
Vue.prototype.$socketio = custom_socketio.init(i18n, auth, alertify);

import App from "./App.vue";

let vm = new Vue({
  // eslint-disable-line no-new
  i18n,
  router,
  el: "#app",
  components: { App },
  template: `
    <App
      :class="{
        'mobile_view' : mobile_view
      }"
    />
  `,
  data: {
    store: window.store,
    state: window.state,

    justCreatedMediaID: false,

    currentTime: "",
    app_is_fullscreen: false,
    admin_pwd: "",

    fragments_read: [],

    settings: {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      enable_system_bar: window.state.is_electron && window.state.is_darwin,
      text_media_being_edited: false,
      load_all_embeds: localstore.get("load_all_embeds_option")
        ? localstore.get("load_all_embeds_option") === true
        : false,
      unfold_legal_pane: false,
      show_welcome_modal: localstore.get("remember_embeds_option_choice")
        ? localstore.get("remember_embeds_option_choice") !== true
        : true,
    },
    lang: {
      available: lang_settings.available,
      current: lang_settings.current,
    },
  },
  created() {
    if (window.state.dev_mode === "debug") console.log("ROOT EVENT: created");

    if (this.settings.enable_system_bar)
      document.body.classList.add("has_systembar");

    if (window.state.dev_mode === "debug")
      console.log("ROOT EVENT: created / checking for password");

    window.addEventListener("resize", () => {
      this.settings.windowWidth = window.innerWidth;
      this.settings.windowHeight = window.innerHeight;
    });

    this.currentTime = this.$moment().millisecond(0);
    setInterval(() => (this.currentTime = this.$moment().millisecond(0)), 1000);

    if (window.state.dev_mode === "debug")
      console.log(
        "ROOT EVENT: created / no errors, checking for content to load"
      );

    window.addEventListener("tag.newTagDetected", this.newTagDetected);

    if (this.state.mode === "live") {
      console.log("ROOT EVENT: created / now connecting with socketio");

      if (!this.$root.state.is_electron) {
        this.$eventHub.$on("socketio.connect", () => {
          // this.$alertify
          //   .closeLogOnClick(true)
          //   .delay(4000)
          //   .success(this.$t('notifications["connected_to_dodoc"]'));
        });
        this.$eventHub.$on("socketio.reconnect", () => {
          // this.$alertify
          //   .closeLogOnClick(true)
          //   .delay(4000)
          //   .success(this.$t('notifications["connected_to_dodoc"]'));
        });
      }

      if (this.$root.state.session_password === "has_pass") {
        var session_storage_pwd =
          this.$auth.getSessionPasswordFromLocalStorage();
        if (session_storage_pwd) {
          this.$socketio.connect(session_storage_pwd);

          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .log(this.$t("notifications.using_saved_password"));

          this.$eventHub.$once("socketio.socketerror", () => {
            this.showSessionPasswordModal = true;
          });
        } else {
          this.showSessionPasswordModal = true;
        }

        this.$eventHub.$on("socketio.socketerror", () => {
          // if error, attempt to reconnect
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t('notifications["wrong_password_for_dodoc"]'));
          this.showSessionPasswordModal = true;
        });
      } else {
        this.$socketio.connect();
      }

      this.$eventHub.$once("socketio.authentificated", () => {
        this.$socketio.listFolders({ type: "corpus" });
      });
    }
  },
  beforeDestroy() {
    this.$root.settings.current_publication.page_id = false;
  },
  watch: {
    "settings.has_modal_opened": function () {
      if (window.state.dev_mode === "debug") {
        console.log(
          `ROOT EVENT: var has changed: has_modal_opened: ${this.settings.has_modal_opened}`
        );
      }
      if (this.has_modal_opened) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    $route: {
      handler(to) {
        if (to.name === "Fragment")
          if (!this.fragments_read.includes(to.fullPath))
            this.fragments_read.push(to.fullPath);
      },
      immediate: true,
    },
  },
  computed: {
    mobile_view() {
      return this.settings.windowWidth < 768;
    },
    can_admin_corpora() {
      // todo actual admin checks
      return (
        this.$root.state.is_electron ||
        this.hashCode(this.$root.admin_pwd.toLowerCase()) === 3670
      );
    },

    current_publication() {
      if (this.settings.current_publication.slug) {
        if (
          this.store.publications.hasOwnProperty(
            this.settings.current_publication.slug
          )
        ) {
          return this.store.publications[
            this.settings.current_publication.slug
          ];
        }
      }
      return false;
    },
    all_folders() {
      return Object.values(this.store.corpus).reduce((acc, p) => {
        if (!!p.folder && !acc.includes(p.folder)) acc.push(p.folder);
        return acc;
      }, []);
    },
    corpus_that_are_accessible() {
      const type = "corpus";
      return Object.values(this.store[type]).filter((p) =>
        this.canAccessFolder({ type, slugFolderName: p.slugFolderName })
      );
    },
    current_publication_medias() {
      if (
        !this.current_publication ||
        !this.current_publication.hasOwnProperty("medias")
      )
        return false;

      if (
        this.current_publication.template === "page_by_page" &&
        this.$root.settings.current_publication.page_id
      ) {
        // we need to check current page
        return Object.values(this.current_publication.medias).filter(
          (m) => m.page_id === this.$root.settings.current_publication.page_id
        );
      }
      return this.current_publication.medias;
    },
    currentTime_human() {
      return this.$moment(this.currentTime).format("LL   LTS");
    },
  },
  methods: {
    hashCode(s) {
      return s.split("").reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    },

    createFolder(fdata) {
      return new Promise((resolve, reject) => {
        if (window.state.dev_mode === "debug") {
          console.log(
            `ROOT EVENT: createfolder: ${JSON.stringify(fdata, null, 4)}`
          );
        }

        fdata.id =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        this.$socketio.createFolder(fdata);

        const catchFolderCreation = function (d) {
          if (fdata.id === d.id) {
            return resolve(d);
          } else {
            this.$eventHub.$once(
              "socketio.folder_created_or_updated",
              catchFolderCreation
            );
          }
        };
        this.$eventHub.$once(
          "socketio.folder_created_or_updated",
          catchFolderCreation
        );
      });
    },
    editFolder: function (fdata) {
      return new Promise((resolve, reject) => {
        if (window.state.dev_mode === "debug") {
          console.log(
            `ROOT EVENT: editFolder: ${JSON.stringify(fdata, null, 4)}`
          );
        }

        fdata.id =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        this.$socketio.editFolder(fdata);

        const catchFolderEdition = function (d) {
          if (fdata.id === d.id) {
            return resolve(d);
          } else {
            this.$eventHub.$once(
              "socketio.folder_created_or_updated",
              catchFolderEdition
            );
          }
        };
        this.$eventHub.$once(
          "socketio.folder_created_or_updated",
          catchFolderEdition
        );
      });
    },
    removeFolder: function ({ type, slugFolderName }) {
      if (window.state.dev_mode === "debug") {
        console.log(
          `ROOT EVENT: removeFolder: slugFolderName = ${slugFolderName} of type = ${type}`
        );
      }
      this.$socketio.removeFolder({ type, slugFolderName });
    },

    createMedia: function (mdata) {
      return new Promise((resolve, reject) => {
        if (window.state.dev_mode === "debug") {
          console.log(`ROOT EVENT: createMedia`);
        }
        mdata.id =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        if (this.current_author) {
          if (!mdata.hasOwnProperty("additionalMeta")) {
            mdata.additionalMeta = {};
          }
          mdata.additionalMeta.authors = [
            { slugFolderName: this.current_author.slugFolderName },
          ];
        }

        this.$socketio.createMedia(mdata);

        const editMediaTimeout = setTimeout(() => {
          this.$eventHub.$off(
            `socketio.media_created_or_updated`,
            catchMediaCreation
          );
          return reject();
        }, 120000);

        const catchMediaCreation = (d) => {
          if (mdata.id === d.id) {
            clearTimeout(editMediaTimeout);
            this.$nextTick(() => {
              return resolve(d);
            });
          } else {
            this.$eventHub.$once(
              `socketio.media_created_or_updated`,
              catchMediaCreation
            );
          }
        };

        this.$eventHub.$once(
          `socketio.media_created_or_updated`,
          catchMediaCreation
        );
      });
    },

    removeMedia: function (mdata) {
      if (window.state.dev_mode === "debug") {
        console.log(
          `ROOT EVENT: removeMedia: ${JSON.stringify(mdata, null, 4)}`
        );
      }
      this.$socketio.removeMedia(mdata);
    },
    editMedia: function (mdata) {
      return new Promise((resolve, reject) => {
        if (window.state.dev_mode === "debug") {
          console.log(
            `ROOT EVENT: editMedia: ${JSON.stringify(mdata, null, 4)}`
          );
        }

        mdata.id =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        this.$socketio.editMedia(mdata);

        const editMediaTimeout = setTimeout(() => {
          this.$eventHub.$off(
            `socketio.media_created_or_updated`,
            catchMediaCreation
          );
          return reject();
        }, 30000);

        const catchMediaCreation = (d) => {
          if (mdata.id === d.id) {
            clearTimeout(editMediaTimeout);
            this.$nextTick(() => {
              return resolve(d);
            });
          } else {
            this.$eventHub.$once(
              `socketio.media_created_or_updated`,
              catchMediaCreation
            );
          }
        };

        this.$eventHub.$once(
          `socketio.media_created_or_updated`,
          catchMediaCreation
        );
      });
    },
    canAccessFolder: function ({ type, slugFolderName }) {
      if (!this.store[type].hasOwnProperty(slugFolderName)) return false;

      // if folder doesn’t have a password set
      if (this.store[type][slugFolderName].password !== "has_pass") {
        return true;
      }

      const has_reference_to_folder = this.state.list_authorized_folders.filter(
        (i) => {
          if (
            !!i &&
            i.hasOwnProperty("type") &&
            i.type === type &&
            i.hasOwnProperty("allowed_slugFolderNames") &&
            i.allowed_slugFolderNames.indexOf(slugFolderName) >= 0
          )
            return true;
          return false;
        }
      );

      if (has_reference_to_folder.length > 0) {
        return true;
      }
      return false;
    },
    updateLocalLang: function (newLangCode) {
      if (window.state.dev_mode === "debug") {
        console.log("ROOT EVENT: updateLocalLang");
      }
      i18n.locale = newLangCode;
      moment.locale(newLangCode);
      this.lang.current = newLangCode;

      const html = document.documentElement; // returns the html tag
      html.setAttribute("lang", newLangCode);

      localstore.set("language", newLangCode);
    },
    formatDateToHuman(date) {
      return this.$moment(date, "YYYY-MM-DD HH:mm:ss").calendar();
    },
    formatDateToPrecise(date) {
      return this.$moment(date, "YYYY-MM-DD HH:mm:ss").format("LTS L");
    },
    formatDurationToMinuteHours(date) {
      return this.$moment.utc(date).format("mm:ss");
    },
    updateNetworkInfos() {
      this.$socketio.updateNetworkInfos();
    },
    formatBytes(a, b) {
      if (0 == a) return `0 ${this.$t("bytes")}`;

      var e = [
        this.$t("bytes"),
        this.$t("kb"),
        this.$t("mb"),
        this.$t("gb"),
        "TB",
        "PB",
        "EB",
        "ZB",
        "YB",
      ];

      var c = 1024,
        d = b || 2,
        f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
  },
});
