<template>
  <Modal
    @close="$emit('close')"
    @submit="newFragment"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <span class>{{ $t("create_a_story") }}</span>
    </template>

    <template slot="sidebar">
      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("fragment_title") }}</label>
        <input
          type="text"
          class="bold"
          v-model.trim="fragmentdata.title"
          required
          autofocus
        />
      </div>

      <!-- <div>
        <label>{{ $t("source_of_contribution") }}</label>
        <CollectMode v-model="fragmentdata.contribution_moment" />
      </div> -->

      <div class="margin-bottom-small admin_cat" v-if="$root.can_admin_corpora">
        <i>admin</i>
        <label>{{ $t("categories") }}</label>
        <TagsInput
          :allKeywords="all_tags_rightly_formatted"
          :allow_new_terms="$root.can_admin_corpora"
          :type="'tabs'"
          :placeholder="$t('add_tab')"
          :show_existing_by_default="true"
          @tagsChanged="(newTags) => (fragmentdata.tags = newTags)"
        />
      </div>

      <div class="margin-bottom-small">
        <label>{{ $t("keywords") }}</label>
        <TagsInput
          :allKeywords="all_keywords_rightly_formatted"
          :type="'keywords'"
          :placeholder="$t('add_keyword')"
          @tagsChanged="(newKeywords) => (fragmentdata.keywords = newKeywords)"
        />
      </div>
    </template>
    <template slot="submit_button">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        style="enable-background: new 0 0 24 24"
        xml:space="preserve"
      >
        <path
          style="fill: currentColor"
          d="M0,10.5h10.5V0h2.9v10.5H24v2.9H13.5V24h-2.9V13.5H0V10.5z"
        />
      </svg>
      <span>{{ $t("create") }}</span>
    </template>
  </Modal>
</template>
<script>
import TagsInput from "../subcomponents/TagsInput.vue";
import CollectMode from "../subcomponents/CollectMode.vue";

export default {
  props: {
    corpus: Object,
    all_tags: Array,
    all_keywords: Array,
    current_contribution_mode: String,
  },
  components: { TagsInput, CollectMode },
  data() {
    return {
      fragmentdata: {
        title: "",
        tags: [],
        contribution_moment: this.current_contribution_mode,
      },
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    all_tags_rightly_formatted() {
      return this.all_tags.map((kw) => {
        return {
          text: kw,
          classes: "tagcolorid_" + (parseInt(kw, 36) % 2),
        };
      });
    },
    all_keywords_rightly_formatted() {
      return this.all_keywords.map((kw) => {
        return {
          text: kw,
          classes: "tagcolorid_" + (parseInt(kw, 36) % 2),
        };
      });
    },
  },
  methods: {
    newFragment() {
      let additionalMeta = {
        type: "fragment",
        medias_slugs: [],
      };

      const title = this.fragmentdata.title;

      if (this.corpus.medias && Object.values(this.corpus.medias).length > 0) {
        if (
          Object.values(this.corpus.medias).find(
            (m) => m.type === "fragment" && m.title === title
          )
        ) {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t("notifications.fragment_with_title_already_exists"));
          return;
        }
      }

      additionalMeta.title = title;

      if (this.fragmentdata.tags) additionalMeta.tags = this.fragmentdata.tags;
      if (this.fragmentdata.keywords)
        additionalMeta.keywords = this.fragmentdata.keywords;
      if (this.fragmentdata.contribution_moment)
        additionalMeta.contribution_moment =
          this.fragmentdata.contribution_moment;

      this.$root
        .createMedia({
          slugFolderName: this.corpus.slugFolderName,
          type: "corpus",
          additionalMeta,
        })
        .then((mdata) => {
          this.$emit("createdFragment", mdata.metaFileName);
          this.$emit("close");

          this.$router.push({
            name: "Fragment",
            params: { fragmentId: mdata.media_filename },
            query: this.$route.query ? this.$route.query : {},
          });
        });
    },
  },
};
</script>
<style lang="scss"></style>
