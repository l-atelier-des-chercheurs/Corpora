<template>
  <Modal
    @close="$emit('close')"
    @submit="submitAction"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :prevent_close="true"
  >
    <template slot="header">
      <span class>Corpora</span>
    </template>

    <template slot="sidebar" class="custom_scrollbar">
      <div class="margin-vert-small">
        <div class="custom-select custom-select_tiny">
          <select v-model="new_lang">
            <option
              v-for="lang in this.$root.lang.available"
              :key="lang.key"
              :value="lang.key"
            >
              {{ lang.name }}
            </option>
          </select>
        </div>
      </div>

      <template v-if="$root.lang.current === 'fr'">
        <p>
          Ce site est un dispositif expérimental développé par
          <a href="https://latelier-des-chercheurs.fr" target="_blank"
            >l&#39;Atelier des chercheurs</a
          >
          et
          <a href="https://plurality-university.org" target="_blank">
            le réseau Université de la Pluralité
          </a>
          pour constituer collectivement des corpus d&#39;œuvres et de
          connaissances.
        </p>
        <p>
          Il peut inclure des contenus issus de services tiers (Twitter, YouTube
          et Vimeo) dont l'affichage provoque le dépôt de cookies sur votre
          ordinateur. Pour cette raison, nous vous proposons deux modes de
          navigation :
        </p>
        <p>
          <label for="CreateQRCode">
            <input
              type="checkbox"
              id="CreateQRCode"
              v-model="load_all_embeds_option"
              :true-value="true"
              :false-value="false"
            />
            Autoriser les cookies : le site affichera d'emblée tous les
            contenus, y compris issus de plateformes tierces
          </label>
          <label for="ScanQRCode">
            <input
              type="checkbox"
              id="ScanQRCode"
              :true-value="false"
              :false-value="true"
              v-model="load_all_embeds_option"
            />
            Refuser les cookies : vous devrez cliquer pour afficher chaque
            contenus tiers, ce qui provoquera en général le dépôt de cookies de
            la part du site d'origine.
          </label>
        </p>
        <p>
          Pour exercer vos droits sur les données collectées par les tiers ou
          pour toute question sur ces traitements, contactez directement les
          sites en question.
        </p>
        <p>Plus d’informations :</p>
        <button
          type="button"
          @click="
            $root.settings.unfold_legal_pane = !$root.settings.unfold_legal_pane
          "
          :class="{ 'is--active': $root.settings.unfold_legal_pane }"
        >
          <small>{{ $t("legal_notice") }}</small>
        </button>
      </template>
      <template v-else>
        <p>
          This website is an experimental platform developed by
          <a href="https://latelier-des-chercheurs.fr" target="_blank"
            >l&#39;Atelier des chercheurs</a
          >
          and
          <a href="plurality-university.org" target="_blank"
            >the Plurality University Network</a
          >
          in order to collectively build corpuses.
        </p>
        <p>
          It may include content from third-party platforms which install
          cookies on your computer. We offer two modes of navigation:
        </p>

        <p>
          <label for="CreateQRCode">
            <input
              type="checkbox"
              id="CreateQRCode"
              v-model="load_all_embeds_option"
              :true-value="true"
              :false-value="false"
            />
            Authorize 3rd-party cookies: the website will display all content,
            including that of 3rd-party platforms
          </label>
          <label for="ScanQRCode">
            <input
              type="checkbox"
              id="ScanQRCode"
              :true-value="false"
              :false-value="true"
              v-model="load_all_embeds_option"
            />
            Refuse cookies: you will have to click in order to display 3rd-party
            content, which will usually generate cookies on your computer.
          </label>
        </p>

        <p>
          If you want to exercise your rights on data collected by 3rd-party
          content providers, please contact the providers directly.
        </p>

        <p>For more informations:</p>

        <button
          type="button"
          @click="
            $root.settings.unfold_legal_pane = !$root.settings.unfold_legal_pane
          "
          :class="{ 'is--active': $root.settings.unfold_legal_pane }"
        >
          <small>{{ $t("legal_notice") }}</small>
        </button>
      </template>

      <div v-if="$root.settings.unfold_legal_pane">
        <template v-if="$root.lang.current === 'fr'">
          <h2>Informations légales et protection des données personnelles</h2>
          <h3>Informations éditeur</h3>
          <p>
            Association Réseau Université de la Pluralité (Plurality University
            Network) – 5 rue de la Véga, 75012 Paris
          </p>
          <p>
            Responsable de la publication et webmaster : Chloé Luchs –
            chloe.luchs(at)plurality-university.org
          </p>
          <h3>Hébergeur</h3>
          <ul>
            <li>Société : DigitalOcean</li>
            <li>Adresse web : www.digitalocean.com</li>
            <li>
              Adresse postale : 101 Avenue of the Americas, New York 10013
            </li>
            <li>Adresse électronique (Email) : contact@digitalocean.com</li>
            <li>Serveur situé à Frankfort, Allemagne.</li>
          </ul>

          <h3>Vos données personnelles</h3>
          <p>
            Ce site est un dispositif expérimental développé par
            <a href="https://latelier-des-chercheurs.fr" target="_blank"
              >l&#39;Atelier des chercheurs</a
            >
            et
            <a href="plurality-university.org" target="_blank">
              le réseau Université de la Pluralité
            </a>
            pour constituer collectivement des corpus d&#39;œuvres et de
            connaissances.
          </p>
          <p>
            Nous nous efforçons de minimiser la collecte de données à caractère
            personnelle et nous engageons à n’en faire aucun usage autre que
            celui qui consiste à faciliter la navigation dans le site. En
            revanche, cet affichage peut inclure des contenus issus de services
            tiers (Twitter, YouTube ou Vimeo) dont l&#39;affichage provoque le
            dépôt de cookies sur votre ordinateur.
          </p>

          <p>
            Pour toute information ou exercice de vos droits sur les traitements
            de données personnelles gérés par le site, vous pouvez nous
            contacter
          </p>
          <ul>
            <li>Par mail : info@plurality-university.org</li>
            <li>
              Par courrier : Réseau Université de la Pluralité (Plurality
              University Network) – 5 rue de la Véga, 75012 Paris - France
            </li>
          </ul>
        </template>
        <template v-else>
          <h2>Legal Notice, Personal Data Management</h2>
          <h3>Publisher Information</h3>
          <p>
            Association Réseau Université de la Pluralité (Plurality University
            Network) – 5 rue de la Véga, 75012 Paris
          </p>
          <p>
            Editor and webmaster : Chloé Luchs –
            chloe.luchs(at)plurality-university.org
          </p>
          <h3>Hoster</h3>
          <ul>
            <li>Company: DigitalOcean</li>
            <li>URL: www.digitalocean.com</li>
            <li>Postal address: 101 Avenue of the Americas, New York 10013</li>
            <li>Email: contact@digitalocean.com</li>
            <li>Server located in Frankfurt, Germany.</li>
          </ul>

          <h3>Your Personal Data</h3>
          <p>
            This website is an experimental platform developed by
            <a href="https://latelier-des-chercheurs.fr" target="_blank"
              >l&#39;Atelier des chercheurs</a
            >
            and
            <a href="plurality-university.org" target="_blank"
              >the Plurality University Network</a
            >
            in order to collectively build corpuses.
          </p>
          <p>
            We strive to minimize the collection of personal data and will not
            use them to any other purpose than that of facilitating access to
            the content. However, this content may include third-party cookies
            (from Twitter, YouTube and Vimeo).
          </p>

          <p>
            If you need information or want to exercise your rights on your
            personal data, please contact the third-party providers, or contact
            us:
          </p>
          <ul>
            <li>Email : info@plurality-university.org</li>
            <li>
              Mail : Réseau Université de la Pluralité (Plurality University
              Network) – 5 rue de la Véga, 75012 Paris - France
            </li>
          </ul>
        </template>
      </div>

      <label for="rememberChoice" v-if="load_all_embeds_option">
        <input
          type="checkbox"
          id="rememberChoice"
          v-model="remember_embeds_option_choice"
        />
        {{ $t("remember_settings") }}
      </label>
    </template>

    <template slot="submit_button">{{ $t("go_to_website") }}</template>
  </Modal>
</template>
<script>
import Modal from "./BaseModal.vue";
import localstore from "store";

export default {
  props: {
    corpus: Object,
  },
  components: {
    Modal,
  },
  data() {
    return {
      new_lang: this.$root.lang.current,

      load_all_embeds_option: this.$root.settings.load_all_embeds,
      remember_embeds_option_choice: true,
    };
  },

  created() {},
  mounted() {},
  beforeDestroy() {},

  watch: {
    new_lang() {
      this.$root.updateLocalLang(this.new_lang);
    },
  },
  computed: {},
  methods: {
    submitAction() {
      this.$root.settings.load_all_embeds = this.load_all_embeds_option;
      this.$root.settings.show_welcome_modal = false;

      debugger;
      // refuse cookies : unset all
      if (this.load_all_embeds_option === false) {
        if (localstore.hasOwnProperty("load_all_embeds_option")) {
          localstore.set("load_all_embeds_option", undefined);
        }
        localstore.set("remember_embeds_option_choice", undefined);
      } else {
        //accepter cookies : ce qu’on enregistre
        localstore.set("load_all_embeds_option", true);
        localstore.set(
          "remember_embeds_option_choice",
          this.remember_embeds_option_choice
        );
      }
    },
  },
};
</script>
<style></style>
