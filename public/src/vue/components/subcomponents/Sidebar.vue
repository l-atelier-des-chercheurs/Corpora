<template>
  <div class="_sidebarContent">
    <div class="">
      <label for="fragments-search">{{ $t("search_in_fragments") }}</label>
      <form
        class="flex-nowrap align-items-stretch"
        @submit.prevent="setTextFilter"
      >
        <input
          type="search"
          id="fragments-search"
          v-model="text_search_in_field"
          :aria-label="$t('search_in_fragments')"
        />

        <span class="input-addon">
          <button
            type="submit"
            :disabled="text_search === text_search_in_field"
          >
            √
          </button>
        </span>
      </form>
    </div>

    <div class="_tags" v-if="all_tags && all_tags.length > 0">
      <label>{{ $t("tags") }}</label>
      <div class="m_keywordField m_keywordField_tags">
        <button
          type="button"
          class="tag"
          v-for="tag in all_tags_subset"
          :key="tag"
          @click="setTagFilter(tag)"
          :class="{
            'is--active': tag === tag_search,
          }"
        >
          {{ tag }}
        </button>
      </div>
      <button type="button" v-if="!show_all_tags" @click="show_all_tags = true">
        ► {{ $t("show_all_tags") }}
      </button>
    </div>

    <div class="_collections" v-if="false">
      <label for="fragments-search"
        >{{ $t("collections") }}
        <button type="button" @click="show_create_collection_modal = true">
          {{ $t("create") }}
        </button>
      </label>

      <CreateCollection
        v-if="show_create_collection_modal"
        :collections="collections"
        :slugFolderName="corpus.slugFolderName"
        @close="show_create_collection_modal = false"
        @openCollection="openCollection"
      />

      <button
        type="button"
        v-for="collection in sorted_collections_subset"
        :key="collection.media_filename"
        class="collList"
        :class="{
          'is--active': show_collection_meta === collection.media_filename,
        }"
        @click="openCollection(collection.media_filename)"
      >
        <div class="_title">
          {{ collection.title }}
        </div>
        <template
          v-if="
            collection.fragments_slugs &&
            Array.isArray(collection.fragments_slugs)
          "
        >
          {{ collection.fragments_slugs.length }}
        </template>
        <template v-else>0</template>
        {{ $t("fragments") }}
      </button>

      <button
        type="button"
        class="_showallcoll"
        v-if="
          !show_all_collections &&
          sorted_collections_subset.length < sorted_collections.length
        "
        @click="show_all_collections = true"
      >
        ► {{ $t("show_all_collections") }}
      </button>
    </div>

    <div
      class="_keywords"
      v-if="all_keywords_with_counts && all_keywords_with_counts.length > 0"
    >
      <label>{{ $t("keywords") }}</label>

      <!-- {{ all_keywords_with_counts }} -->
      <div class="m_keywordField m_keywordField_keywords">
        <button
          type="button"
          class="tag"
          v-for="[keyword, count] in keywords_subset"
          :key="keyword"
          @click="setKeywordFilter(keyword)"
          :class="{
            'is--active': keyword === keyword_search,
          }"
        >
          {{ keyword }} <span class="_count">{{ count }}</span>
        </button>
      </div>
      <button
        type="button"
        v-if="
          !show_all_keywords &&
          keywords_subset &&
          keywords_subset.length < all_keywords_with_counts.length
        "
        @click="show_all_keywords = true"
      >
        ► {{ $t("show_all_keywords") }}
      </button>
    </div>
  </div>
</template>
<script>
import CreateCollection from "../../components/modals/CreateCollection.vue";

export default {
  props: {
    sorted_fragments: [Boolean, Array],
    all_keywords: Array,
    all_tags: Array,

    keyword_search: [Boolean, String],
    tag_search: [Boolean, String],
    text_search: [String],

    show_collection_meta: [Boolean, String],
  },
  components: {
    CreateCollection,
  },
  data() {
    return {
      show_all_tags: false,
      show_all_keywords: false,
      show_create_collection_modal: false,

      text_search_in_field: "",
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    $route: {
      handler() {
        if (this.$route.query) {
          this.text_search_in_field = this.$route.query.text_search || "";
          this.$emit("update:text_search", this.text_search_in_field);

          this.$emit(
            "update:keyword_search",
            this.$route.query.keyword_search || false
          );

          this.$emit(
            "update:tag_search",
            this.$route.query.tag_search || false
          );

          this.$emit(
            "update:show_collection_meta",
            this.$route.query.collection || false
          );
        }
      },
      immediate: true,
    },
    keyword_search() {
      this.setQueryURLFromFilters();
    },
    tag_search() {
      this.setQueryURLFromFilters();
    },
    text_search() {
      this.setQueryURLFromFilters();
    },
  },
  computed: {
    all_tags_subset() {
      if (!this.show_all_tags) return this.all_tags.slice(0, 5);
      return this.all_tags;
    },

    all_keywords_with_counts() {
      if (!this.sorted_fragments || !this.all_keywords) return false;

      let all_keywords = this.sorted_fragments.reduce((acc, f) => {
        if (!!f.keywords && Array.isArray(f.keywords) && f.keywords.length > 0)
          acc = acc.concat(f.keywords.map((t) => t.title));
        return acc;
      }, []);

      const sorted_keywords_with_count = Object.entries(
        this.$_.countBy(all_keywords)
      ).sort(function (a, b) {
        return b[1] - a[1];
      });

      return sorted_keywords_with_count;
    },
    keywords_subset() {
      if (!this.all_keywords_with_counts) return false;
      if (!this.show_all_keywords)
        return this.all_keywords_with_counts.slice(0, 10);
      return this.all_keywords_with_counts;
    },

    sorted_collections_subset() {
      if (!this.sorted_collections) return false;
      if (!this.show_all_collections)
        return this.sorted_collections.slice(0, 3);
      return this.sorted_collections;
    },
  },
  methods: {
    setAllFiltersToZero() {
      this.$emit("update:tag_search", false);
      this.$emit("update:text_search", "");
      this.$emit("update:keyword_search", false);
    },
    setKeywordFilter(kw) {
      this.setAllFiltersToZero();
      this.$emit(
        "update:keyword_search",
        this.keyword_search === kw ? false : kw
      );
    },
    setTagFilter(tag) {
      this.setAllFiltersToZero();
      this.$emit("update:tag_search", this.tag_search === tag ? false : tag);
    },
    setTextFilter() {
      this.setAllFiltersToZero();
      this.$emit("update:text_search", this.text_search_in_field);
    },

    openCollection(media_filename) {
      this.tag_search = false;
      this.keyword_search = false;
      this.text_search = this.text_search_in_field = "";

      this.$emit(
        "update:show_collection_meta",
        this.show_collection_meta === media_filename ? false : media_filename
      );
    },

    setQueryURLFromFilters() {
      console.log(`setQueryURLFromFilters`);

      let query = Object.assign({}, this.$route.query) || {};

      if (this.text_search === "") delete query.text_search;
      else query.text_search = this.text_search;

      if (!this.keyword_search) delete query.keyword_search;
      else query.keyword_search = this.keyword_search;

      if (!this.tag_search) delete query.tag_search;
      else query.tag_search = this.tag_search;

      if (!this.show_collection_meta) delete query.collection;
      else query.collection = this.show_collection_meta;

      this.$router.push({
        query,
        params: { savePosition: true },
      });

      this.$emit("scrollTop");
    },
  },
};
</script>
<style lang="scss" scoped>
._sidebarContent {
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 2);
  > * {
    margin-bottom: calc(var(--spacing) * 2);
  }
}

._count {
  background: var(--color-black);
  background: rgba(60, 53, 65, 0.25);
  // border: 2px solid var(--color-black);
  width: 1rem;
  height: 1rem;
  // color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 80%;
  margin: 0 calc(var(--spacing) / 4);
}
</style>
