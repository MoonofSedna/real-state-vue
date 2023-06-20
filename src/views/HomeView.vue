<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  // composables
  import useProperty from "@/composables/useProperty";
  // components
  import PropertyCard from "@/components/PropertyCard.vue";

  const {
    properties,
    getProperties,
    showLoadMore,
    onPaginateProperties,
    loading,
  } = useProperty();

  const paginateLoading = ref(false);
  const isFor = ref();

  onMounted(async () => {
    await getProperties({ isFor: isFor.value });
  });

  const onPaginate = async () => {
    const lastDoc = properties.value.slice(-1)[0].createdAt;
    paginateLoading.value = true;
    await onPaginateProperties(lastDoc, isFor.value);
    paginateLoading.value = false;
  };

  const onFilter = async () => {
    await getProperties({ isFor: isFor.value });
  };

  watch(isFor, onFilter);
</script>
<template>
  <h2 class="mb-12 text-center text-md-h4 font-weight-bold text-gray">
    Find Your Dream Home
  </h2>

  <div
    class="mb-4 filters w-100 px-4 d-flex align-center justify-start font-weight-bold text-black flex-wrap">
    <span class="mr-4 text-gray">Properties for:</span>
    <v-checkbox hide-details v-model="isFor" label="Sale" value="sale" />
    <v-checkbox hide-details v-model="isFor" label="Rent" value="rent" />
  </div>

  <v-row class="w-100" v-if="properties.length > 0">
    <PropertyCard
      :property="property"
      v-for="property in properties"
      :key="property.id" />
  </v-row>

  <v-row v-else-if="loading" class="mt-14">
    <v-progress-circular
      indeterminate
      color="primary"
      class="mx-auto"></v-progress-circular>
  </v-row>

  <v-row v-else>
    <v-col cols="12">
      <h2 class="text-center text-md-h4 font-weight-bold text-gray">
        No Properties Found
      </h2>
    </v-col>
  </v-row>

  <v-row class="w-100">
    <v-col cols="12" class="text-center">
      <v-btn
        color="primary"
        class="white--text"
        v-if="showLoadMore(properties.length, loading)"
        :disabled="paginateLoading"
        @click="onPaginate">
        {{ paginateLoading ? "Loading" : "Load More" }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<style>
  .filters .v-input {
    flex: inherit !important;
    margin-right: 1rem;
    font-weight: bold;
  }
</style>
