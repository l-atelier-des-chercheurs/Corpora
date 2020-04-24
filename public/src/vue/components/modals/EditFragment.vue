<template>
  <Modal
    @close="$emit('close')"
    @submit="editFragment"
    :read_only="false"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <span class>{{ $t("edit_a_fragment") }}</span>
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

      <div>
        <label>{{ $t("source_of_contribution") }}</label>
        <CollectMode v-model="fragmentdata.contribution_moment" />
      </div>

      <div class="margin-bottom-small">
        <label>{{ $t("keywords") }}</label>
        <TagsInput
          :allKeywords="all_keywords_rightly_formatted"
          :type="'keywords'"
          :keywords="fragmentdata.keywords"
          :placeholder="$t('add_keyword')"
          @tagsChanged="(newKeywords) => (fragmentdata.keywords = newKeywords)"
        />
      </div>

      <div class="margin-bottom-small">
        <label>{{ $t("tabs") }}</label>
        <TagsInput
          :allKeywords="all_tags_rightly_formatted"
          :keywords="fragmentdata.tags"
          :type="'tabs'"
          :placeholder="$t('add_tab')"
          @tagsChanged="(newTags) => (fragmentdata.tags = newTags)"
        />
      </div>
    </template>
    <template slot="submit_button">{{ $t("edit") }}</template>
  </Modal>
</template>
<script>
import Modal from "./BaseModal.vue";
import TagsInput from "../subcomponents/TagsInput.vue";
import CollectMode from "../subcomponents/CollectMode.vue";
export default {
  props: {
    fragment: Object,
    corpus: Object,
    all_tags: Array,
    all_keywords: Array,
  },
  components: { Modal, TagsInput, CollectMode },
  data() {
    return {
      fragmentdata: {
        title: this.fragment.title,
        contribution_moment: this.fragment.contribution_moment,
        keywords: this.fragment.keywords,
        tags: this.fragment.tags,
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
    editFragment() {
      const title = this.fragmentdata.title;

      if (this.corpus.medias && Object.values(this.corpus.medias).length > 0) {
        if (
          Object.values(this.corpus.medias).find(
            (m) =>
              m.type === "fragment" &&
              m.title === title &&
              title !== this.fragment.title
          )
        ) {
          this.$alertify
            .closeLogOnClick(true)
            .delay(4000)
            .error(this.$t("notifications.fragment_with_title_already_exists"));
          return;
        }
      }

      const tags = this.fragmentdata.tags;
      const keywords = this.fragmentdata.keywords;
      const contribution_moment = this.fragmentdata.contribution_moment;

      this.$emit("close");

      this.$root.editMedia({
        slugFolderName: this.corpus.slugFolderName,
        slugMediaName: this.fragment.metaFileName,
        type: "corpus",
        data: {
          title,
          contribution_moment,
          tags,
          keywords,
        },
      });
    },
  },
};
</script>
<style lang="scss"></style>
