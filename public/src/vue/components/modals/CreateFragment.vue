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

      <div class="margin-bottom-small admin_cat fullWidth">
        <label>{{ $t("tag") }}</label>
        <div class="custom-select">
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
        </div>

        <template v-if="fragmentdata.category === 'new'">
          <label>{{ $t("new_cat_name") }}</label>
          <input type="text" v-model="new_cat_name" />
        </template>
        <!-- <TagsInput
          :allKeywords="all_tags_rightly_formatted"
          :allow_new_terms="$root.can_admin_corpora"
          :type="'tabs'"
          :placeholder="$t('add_tab')"
          :show_existing_by_default="true"
          @tagsChanged="(newTags) => (fragmentdata.tags = newTags)"
        /> -->
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
    <template slot="submit_button">{{ $t("create") }} </template>
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
        category: "",
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

      if (this.fragmentdata.category) {
        if (this.fragmentdata.category) {
          if (this.fragmentdata.category === "new" && !!this.new_cat_name)
            additionalMeta.tags = [{ title: this.new_cat_name }];
          else additionalMeta.tags = [{ title: this.fragmentdata.category }];
        }
      }

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
