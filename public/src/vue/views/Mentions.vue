<template>
  <div class="m_mentions">
    <div class="margin-vert-small">
      <router-link
        :to="{
          name: 'Corpus',
          params: { slugFolderName: corpus.slugFolderName },
        }"
        class="button"
        v-html="'← ' + $t('show_fragments')"
      />
    </div>
    <div class="margin-vert-small _description mediaTextContent" v-if="false">
      <h2>Informations légales et protection des données personnelles</h2>
      <h3>Informations éditeur</h3>
      <p>
        Association Réseau Université de la Pluralité (Plurality University
        Network) &ndash; 5 rue de la Véga, 75012 Paris
      </p>
      <p>
        Responsable de la publication et webmaster : Chloé Luchs &ndash;
        chloe.luchs(at)plurality-university.org
      </p>
      <h3>Hébergeur</h3>
      <ul>
        <li>Société : DigitalOcean</li>
        <li>Adresse web : www.digitalocean.com</li>
        <li>Adresse postale : 101 Avenue of the Americas, New York 10013</li>
        <li>Adresse électronique (Email) : contact@digitalocean.com</li>
        <li>Serveur situé &agrave; Francfort, Allemagne.</li>
      </ul>
      <h3>Vos données personnelles</h3>
      <p>
        Ce site est un dispositif expérimental développé par
        <a class="js--openInBrowser" href="https://latelier-des-chercheurs.fr"
          >l'Atelier des chercheurs</a
        >
        et
        <a class="js--openInBrowser" href="https://plurality-university.org"
          >le Réseau Université de la Pluralité</a
        >
        pour constituer collectivement des corpus d'&oelig;uvres et de
        connaissances.
      </p>
      <p>
        Nous nous effor&ccedil;ons de minimiser la collecte de données &agrave;
        caract&egrave;re personnelle et nous engageons &agrave; n&rsquo;en faire
        aucun usage autre que celui qui consiste &agrave; faciliter la
        navigation dans le site. Par ailleurs, les pages peuvent inclure des
        contenus issus de services tiers (Twitter, YouTube, Vimeo ou SoundCloud)
        dont l'affichage provoque le dép&ocirc;t de cookies sur votre
        ordinateur.
      </p>
      <p>
        Pour toute information ou exercice de vos droits sur les traitements de
        données personnelles gérés par le site, vous pouvez nous contacter
      </p>
      <ul>
        <li>Par mail : info@plurality-university.org</li>
        <li>
          Par courrier : Réseau Université de la Pluralité (Plurality University
          Network) &ndash; 5 rue de la Véga, 75012 Paris - France
        </li>
      </ul>
      <p><br /><br /><br /></p>
    </div>
  </div>
</template>
<script>
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
<style lang="scss">
.m_mentions {
  padding: 0 calc(var(--spacing) * 2) calc(var(--spacing) * 2);

  ._description {
    max-width: 99ch;
    font-family: inherit;
    font-weight: 300;

    h2 {
      font-weight: 300;
    }
    h3,
    h4 {
      font-weight: 500;
    }

    .ql-editor {
      max-width: none;
    }

    .app:not(.mobile_view) & {
      // margin-left: 33%;
    }
  }
}
</style>
