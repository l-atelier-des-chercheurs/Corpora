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
        <small
          :class="{
            'is--warning': fragmentdata.title.length > 80,
          }"
          >{{ fragmentdata.title.length }} ≤ 80 char</small
        >
      </div>

      <!-- <div>
        <label>{{ $t("source_of_contribution") }}</label>
        <CollectMode v-model="fragmentdata.contribution_moment" />
      </div> -->

      <div class="margin-bottom-small fullWidth">
        <label>{{ $t("tag") }}</label>
        <!-- {{ all_tags_rightly_formatted }} -->
        <!-- <div class="custom-select">
          <select v-model="fragmentdata.category">
            <option v-html="'(aucune)'" value="" />
            <option
              v-for="(tag, index) in all_tags_rightly_formatted"
              :key="index"
              v-html="tag.text"
            />
            <option
              v-if="$root.can_admin_corpora"
              v-html="$t('new_cat')"
              value="new"
            />
          </select>
        </div> -->
        <!-- 
        <template v-if="fragmentdata.category === 'new'">
          <label>{{ $t("new_cat_name") }}</label>
          <input type="text" v-model="new_cat_name" />
        </template> -->

        <TagsInput
          :allKeywords="all_tags_rightly_formatted"
          :keywords="fragmentdata.tags"
          :type="'tabs'"
          :placeholder="$t('add_tab')"
          @tagsChanged="(newTags) => (fragmentdata.tags = newTags)"
        />
      </div>

      <div class="margin-bottom-small">
        <label>{{ $t("keywords") }}</label>
        <TagsInput
          :allKeywords="all_keywords_rightly_formatted"
          :allow_new_terms="true"
          :type="'keywords'"
          :keywords="fragmentdata.keywords"
          :placeholder="$t('add_keyword')"
          @tagsChanged="(newKeywords) => (fragmentdata.keywords = newKeywords)"
        />
      </div>
    </template>
    <template slot="submit_button">{{ $t("save") }}</template>
  </Modal>
</template>
<script>
import TagsInput from "../subcomponents/TagsInput.vue";
import CollectMode from "../subcomponents/CollectMode.vue";
export default {
  props: {
    fragment: Object,
    corpus: Object,
    all_tags: Array,
    all_keywords: Array,
  },
  components: { TagsInput, CollectMode },
  data() {
    return {
      fragmentdata: {
        title: this.fragment.title,
        contribution_moment: this.fragment.contribution_moment,
        keywords: this.fragment.keywords,
        tags: this.fragment.tags,
        // tags:
        //   this.fragment.tags && this.fragment.tags.length > 0
        //     ? this.fragment.tags[0].title
        //     : "",
      },

      new_cat_name: "",
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

      let tags = this.fragmentdata.tags;
      if (this.fragmentdata.category) {
        // if (this.fragmentdata.category === "new" && !!this.new_cat_name)
        //   tags = [{ title: this.new_cat_name }];
        // else tags = [{ title: this.fragmentdata.category }];
      }

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
