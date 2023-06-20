<script setup lang="ts">
  import { onMounted, ref } from "vue";
  // components
  import Image from "@/components/Image.vue";
  // composables
  import useProperty from "@/composables/useProperty";
  // interfaces
  import type { PropertyInterface } from "@/interfaces/property.interface";
  // stores
  import { useAuthStore } from "@/stores/auth";
  // utils
  import { normalizePrice } from "@/utils";
  import { computed } from "vue";

  const auth = useAuthStore();

  const loading = ref(false);
  const paginateLoading = ref(false);
  const selectedProperty = ref<PropertyInterface | null>(null);

  const { getUserProperties, userProperties, showLoadMore, deleteProperty } =
    useProperty();

  onMounted(async () => {
    if (!auth.userId) return;
    loading.value = true;
    await getUserProperties(auth.userId);
    loading.value = false;
  });

  const onPaginate = async () => {
    if (!auth.userId) return;
    const lastDoc = userProperties.value.slice(-1)[0].createdAt;
    paginateLoading.value = true;
    await getUserProperties(auth.userId, lastDoc);
    paginateLoading.value = false;
  };

  const closeModal = () => {
    selectedProperty.value = null;
  };

  const removeItem = async () => {
    if (!selectedProperty.value || !auth.userId) return;
    await deleteProperty(
      selectedProperty.value.id,
      selectedProperty.value.imageUrl
    );
    await getUserProperties(auth.userId);
    closeModal();
  };
  const isOpen = computed(() => !!selectedProperty.value);
</script>

<template>
  <div class="w-100">
    <h2 class="text-center text-md-h4 font-weight-bold text-gray mb-12">
      Admin Panel
    </h2>

    <v-btn class="mb-6" color="primary" :to="{ name: 'new-property' }"
      >Add New Property</v-btn
    >

    <v-row v-if="!loading && userProperties.length > 0">
      <v-col
        md="12"
        v-for="(property, index) in userProperties"
        :key="property.id">
        <v-card class="d-flex" elevation="2">
          <v-avatar rounded="0" size="150">
            <Image :imageUrl="property.imageUrl" />
          </v-avatar>
          <div
            class="d-flex flex-fill flex-wrap justify-space-between overflow-hidden py-2">
            <div class="flex-fill overflow-hidden px-4">
              <v-card-title class="font-weight-bold text-gray pa-0 mb-2">
                <router-link
                  class="text-decoration-none text-gray"
                  :to="{
                    name: 'property',
                    params: { id: property.id },
                  }">
                  {{ property.title }}</router-link
                >
              </v-card-title>

              <v-card-subtitle
                tag="h4"
                class="font-weight-bold text-body-1 bg-gray d-inline rounded-pill py-1 mt-2">
                {{ normalizePrice(property.price) }}
              </v-card-subtitle>
            </div>
            <v-card-actions class="pr-4 mt-2">
              <v-btn
                class="ms-2 bg-primary"
                :to="{
                  name: 'edit-property',
                  params: { id: property.id },
                }">
                Edit
              </v-btn>
              <v-btn
                class="ms-2 bg-red-darken-3"
                @click="selectedProperty = property"
                :loading="loading">
                Delete
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>

        <v-divider v-if="index < userProperties.length - 1" class="mt-6" />
      </v-col>
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

    <v-row v-if="showLoadMore(userProperties.length, loading)">
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          class="white--text"
          :disabled="paginateLoading"
          @click="onPaginate">
          {{ paginateLoading ? "Loading..." : "Load More" }}
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog
      v-if="selectedProperty"
      max-width="500"
      class="w-100"
      v-model="isOpen">
      <v-card>
        <v-toolbar dark color="gray">
          <v-toolbar-title>Delete Property</v-toolbar-title>
          <v-btn icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card elevation="3" class="w-100 pa-8">
          Are you sure you want to delete this property?
          <span class="my-6 d-block font-weight-bold">
            {{ selectedProperty.title }}</span
          >
          <v-card-actions class="pa-0">
            <v-btn class="bg-red-darken-3" @click="removeItem"> Delete </v-btn>
            <v-btn class="bg-primary" @click="closeModal"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>
