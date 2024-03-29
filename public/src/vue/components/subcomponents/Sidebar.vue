<template>
  <div class="_sidebarContent">
    <div class="" v-if="!show_collection_meta">
      <label
        for="fragments-search"
        :class="{
          'is--active': text_search,
        }"
        @click="setAllFiltersToZero"
      >
        {{ $t("search_in_fragments") }}
      </label>
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
        <!-- <span
          class="input-addon"
          v-if="text_search.length > 0 && text_search === text_search_in_field"
        >
          <button
            type="button"
            @click="
              text_search_in_field = '';
              setTextFilter();
            "
            class="_emptySearch"
          >
            ×
          </button>
        </span> -->
        <span class="input-addon" v-if="text_search !== text_search_in_field">
          <button type="submit">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 56.6 50.1"
              style="enable-background: new 0 0 56.6 50.1"
              xml:space="preserve"
              aria-hidden="true"
              stroke="currentColor"
              fill="transparent"
            >
              <g>
                <path
                  vector-effect="non-scaling-stroke"
                  d="M24.8,49c0,0,5-23.9-22.7-23.9V25C29.9,25,24.8,1.1,24.8,1.1"
                ></path>
                <line
                  vector-effect="non-scaling-stroke"
                  x1="1.3"
                  y1="25.1"
                  x2="55.3"
                  y2="25.1"
                ></line>
              </g>
            </svg>
          </button>
        </span>
      </form>
      <div class="_searchOptions">
        <small>
          <button
            type="button"
            :class="{
              'is--active': text_search_mode === 'titles_only',
            }"
            @click="$emit('update:text_search_mode', 'titles_only')"
          >
            {{ $t("titles_only") }}
          </button>
          <button
            type="button"
            :class="{
              'is--active': text_search_mode === 'titles_and_contents',
            }"
            @click="$emit('update:text_search_mode', 'titles_and_contents')"
          >
            {{ $t("titles_and_contents") }}
          </button>
        </small>
      </div>
    </div>

    <div
      class="_tags"
      v-if="!show_collection_meta && all_tags && all_tags.length > 0"
    >
      <label
        :class="{
          'is--active': tag_search,
        }"
        @click="setAllFiltersToZero"
        >{{ $t("tags") }}</label
      >
      <div class="m_keywordField">
        <button
          type="button"
          class="button tag"
          v-for="[tag, count] in all_tags_subset"
          :key="tag"
          @click="setTagFilter(tag)"
          :class="{
            'is--active': tag === tag_search,
          }"
        >
          {{ tag }} ({{ count }})
        </button>

        <template
          v-if="
            all_tags &&
            (all_tags_subset.length < all_tags.length || show_all_tags)
          "
        >
          <button
            type="button"
            class="button more"
            @click="show_all_tags = !show_all_tags"
          >
            <template v-if="!show_all_tags">
              {{ $t("show_all_tags") }}
            </template>
            <template v-else>
              {{ $t("hide") }}
            </template>
          </button>
        </template>
      </div>
    </div>

    <div
      class="_keywords"
      v-if="
        !show_collection_meta &&
        all_keywords_with_counts &&
        all_keywords_with_counts.length > 0
      "
    >
      <label
        :class="{
          'is--active': keyword_search,
        }"
        @click="setAllFiltersToZero"
        >{{ $t("keywords") }}</label
      >

      <div class="m_keywordField">
        <button
          type="button"
          class="keyword button"
          v-for="[keyword, count] in keywords_subset"
          :key="keyword"
          @click="setKeywordFilter(keyword)"
          :class="{
            'is--active': keyword === keyword_search,
          }"
        >
          {{ keyword }} ({{ count }})
        </button>

        <template
          v-if="
            all_keywords &&
            (keywords_subset.length < all_keywords.length || show_all_keywords)
          "
        >
          <button
            type="button"
            class="button more"
            @click="show_all_keywords = !show_all_keywords"
          >
            <template v-if="!show_all_keywords">
              {{ $t("show_all_keywords") }}
            </template>
            <template v-else>
              {{ $t("hide") }}
            </template>
          </button>
        </template>
      </div>
    </div>

    <div class="">
      <label
        for="fragments-search"
        :class="{
          'is--active': show_collection_meta,
        }"
        @click="setAllFiltersToZero"
        >{{ $t("collections") }}
      </label>

      <div class="_collectionsList m_keywordField">
        <button
          type="button"
          class="button _create"
          @click="$emit('showCreateCollection')"
        >
          +
          {{ $t("create_your_collection") }}
        </button>

        <button
          type="button"
          v-for="collection in sorted_collections_subset"
          class="button"
          :key="collection.media_filename"
          :class="{
            'is--active': show_collection_meta === collection.media_filename,
          }"
          @click="openCollection(collection.media_filename)"
        >
          <div>
            <div class="_title">
              {{ collection.title }}
            </div>
            <div>
              (<template
                v-if="
                  collection.fragments_slugs &&
                  Array.isArray(collection.fragments_slugs)
                "
                >{{ collection.fragments_slugs.length }}
                <template v-if="collection.fragments_slugs.length === 1">
                  {{ $t("fragment").toLowerCase() }})
                </template>
                <template v-else>
                  {{ $t("fragments").toLowerCase() }})
                </template>
              </template>
              <template v-else>0 {{ $t("fragment").toLowerCase() }})</template>
            </div>
          </div>
        </button>

        <template
          v-if="
            sorted_collections_subset.length &&
            (sorted_collections_subset.length < sorted_collections.length ||
              show_all_collections)
          "
        >
          <button
            type="button"
            class="button more"
            @click="show_all_collections = !show_all_collections"
          >
            <template v-if="!show_all_collections">
              {{ $t("show_all_collections") }}
            </template>
            <template v-else>
              {{ $t("hide") }}
            </template>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fragments: [Boolean, Array],
    all_keywords: Array,
    all_tags: Array,

    keyword_search: [Boolean, String],
    tag_search: [Boolean, String],
    text_search: [String],
    text_search_mode: [String],

    sorted_collections: [Boolean, Array],

    show_collection_meta: [Boolean, String],
  },
  components: {},
  data() {
    return {
      show_all_tags: false,
      show_all_keywords: false,
      show_all_collections: false,

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
    show_collection_meta() {
      this.setQueryURLFromFilters();
    },
  },
  computed: {
    all_tags_with_counts() {
      if (!this.fragments || !this.all_tags) return false;

      let all_tags = this.fragments.reduce((acc, f) => {
        if (!!f.tags && Array.isArray(f.tags) && f.tags.length > 0)
          acc = acc.concat(f.tags.map((t) => t.title));
        return acc;
      }, []);

      const sorted_tags_with_count = Object.entries(
        this.$_.countBy(all_tags)
      ).sort(function (a, b) {
        return b[1] - a[1];
      });

      return sorted_tags_with_count;
    },

    all_tags_subset() {
      if (!this.all_tags_with_counts) return false;
      if (!this.show_all_tags) return this.all_tags_with_counts.slice(0, 5);
      return this.all_tags_with_counts;
    },

    all_keywords_with_counts() {
      if (!this.fragments || !this.all_keywords) return false;

      let all_keywords = this.fragments.reduce((acc, f) => {
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
        return this.all_keywords_with_counts.slice(0, 5);
      return this.all_keywords_with_counts;
    },

    sorted_collections_subset() {
      if (!this.sorted_collections) return false;
      if (!this.show_all_collections && this.show_collection_meta === false)
        return this.sorted_collections.slice(0, 3);
      return this.sorted_collections;
    },
  },
  methods: {
    setAllFiltersToZero() {
      this.$emit("update:tag_search", false);
      this.$emit("update:text_search", "");
      this.$emit("update:keyword_search", false);
      this.$emit("update:show_collection_meta", false);
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
    openCollection(coll) {
      this.setAllFiltersToZero();
      this.$emit(
        "update:show_collection_meta",
        this.show_collection_meta === coll ? false : coll
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

      const obj = {
        query,
        // name: "Corpus",
        params: { savePosition: true },
      };

      if (!["Corpus", "Fragment"].includes(this.$route.name)) {
        obj.name = "Corpus";
      }

      this.$router.push(obj);

      this.$nextTick(() => {
        this.$emit("scrollTop");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
._sidebarContent {
  padding: calc(var(--spacing) * 2);
  padding-bottom: 0;
  overflow: auto;
  height: 100%;

  > * {
    padding-bottom: calc(var(--spacing) * 2);
    max-width: 320px;
  }
}

.m_keywordField {
  button {
    display: flex;
  }
}

input {
  background: white;
}

._emptySearch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  font-size: 2em;
  font-weight: 300;
}

._disableFilter {
  position: absolute;
  left: 100%;
  width: 1em;
  height: 1em;
  font-size: 2em;
  font-weight: 300;
}

._searchOptions {
  margin-left: calc(var(--spacing) / -4);
}
</style>
