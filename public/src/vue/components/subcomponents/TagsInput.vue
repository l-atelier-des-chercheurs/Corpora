<template>
  <div>
    <transition-group
      name="list-complete"
      tag="div"
      class="m_keywordField"
      :class="[!!type ? 'm_keywordField_' + type : '']"
    >
      <button
        type="button"
        v-for="tag in tags"
        :key="tag.text"
        @click="removeTag(tag.text)"
        class="can_be_removed"
        :class="['tagcolorid_' + (parseInt(tag.text, 36) % 2)]"
      >
        {{ tag.text }}
      </button>

      <div class="new-tag-input-wrapper" :key="'new-tag-input'">
        <input
          type="text"
          class="new-tag-input"
          v-model.trim="tag"
          :placeholder="placeholder ? placeholder : $t('add_keyword')"
          @keydown.enter.prevent="createTag"
        />
        <button
          type="button"
          @click="createTag"
          :disabled="disableAddButton"
          v-if="tag.length > 0"
        >
          +
        </button>
      </div>

      <div
        v-if="matchingKeywords.length > 0"
        class="autocomplete"
        :key="'autocomplete'"
      >
        <label>{{ $t("suggestion") }}</label>
        <div>
          <button
            type="button"
            v-for="keyword in matchingKeywords"
            :key="keyword.text"
            class="tag"
            @click="createTagFromAutocomplete(keyword.text)"
          >
            {{ keyword.text }}
          </button>
        </div>
      </div>
    </transition-group>

    <div
      class="m_keywordField"
      :class="[!!type ? 'm_keywordField_' + type : '']"
    >
      <div
        v-if="
          allKeywordsExceptCurrent.length > 0 && matchingKeywords.length === 0
        "
        class="autocomplete"
      >
        <button
          type="button"
          class="button-small _existing_button"
          :class="{ 'is--active': show_existing }"
          @click="show_existing = !show_existing"
        >
          {{ $t("existing") }}
        </button>

        <div v-if="show_existing">
          <button
            type="button"
            v-for="keyword in allKeywordsExceptCurrent"
            :key="keyword.text"
            class="tag"
            @click="createTagFromAutocomplete(keyword.text)"
          >
            {{ keyword.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createTags } from "@johmun/vue-tags-input";

export default {
  props: {
    placeholder: String,
    type: String,
    keywords: Array,
    allKeywords: Array,
  },
  components: {},
  data() {
    return {
      tags:
        !!this.keywords && this.keywords.length > 0
          ? createTags(this.keywords.map((k) => k.title))
          : [],
      tag: "",
      new_tag: "",

      show_existing: false,
    };
  },

  created() {},
  mounted() {
    if (this.tags.length > 0) {
      this.updateTags(this.tags);
    }
  },
  beforeDestroy() {},
  watch: {},
  computed: {
    matchingKeywords() {
      if (this.tag.length === 0) {
        return [];
      }
      const fitting_keywords = this.allKeywords.filter(
        (i) =>
          new RegExp(this.tag, "i").test(i.text) &&
          !this.tags.find((t) => t.text === i.text)
      );
      return fitting_keywords.slice(0, 2);
      // return fitting_keywords;
      // return this.$root.allKeywords.filter(i => i.text.toLowerCase().startsWith(this.tag.toLowerCase()) && !this.tags.find(t => t.text === i.text));
    },
    disableAddButton() {
      if (this.tag.length === 0) return true;

      // if (this.tags.find((t) => t.text === this.tag)) {
      //   return true;
      // }
      return false;
    },
    allKeywordsExceptCurrent() {
      return this.allKeywords.filter(
        (i) => !this.tags.find((t) => t.text === i.text)
      );
    },
  },
  methods: {
    createTagFromAutocomplete: function (tag) {
      this.tag = tag;
      this.createTag();
    },
    createTag: function () {
      if (this.tag.trim().length === 0) {
        return;
      }
      if (
        this.tags.some((t) => t.text.toLowerCase() === this.tag.toLowerCase())
      ) {
        this.$alertify
          .closeLogOnClick(true)
          .delay(4000)
          .error(this.$t("tag_already_exists"));
        return;
      }

      // if tag already exists with some other case, we take it
      if (
        this.allKeywords.some(
          (t) => t.text.toLowerCase() === this.tag.toLowerCase()
        )
      ) {
        this.tag = this.allKeywords.find(
          (t) => t.text.toLowerCase() === this.tag.toLowerCase()
        ).text;
      }

      this.tags.push({ text: this.tag });
      this.sendTags(this.tags);
      this.tag = "";
    },
    removeTag: function (tag_text) {
      this.tags = this.tags.filter((t) => t.text !== tag_text);
      this.sendTags(this.tags);
    },
    updateTags: function (newTags) {
      this.tags = newTags.map((val) => {
        val.classes = "tagcolorid_" + (parseInt(val.text, 36) % 2);
        return val;
      });
    },
    sendTags: function (newTags) {
      this.updateTags(newTags);
      const tag_array = this.tags.map((val) => {
        return { title: val.text };
      });
      if (!!this.new_tag) tag_array.push({ title: this.new_tag });

      this.$emit("tagsChanged", tag_array);
    },
  },
};
</script>
<style></style>
