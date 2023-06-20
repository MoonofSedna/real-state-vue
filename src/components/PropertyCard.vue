<script setup lang="ts">
  import { computed } from "@vue/reactivity";
  // components
  import Image from "./Image.vue";
  // interfaces
  import type { PropertyInterface } from "@/interfaces/property.interface";
  // utils
  import { normalizePrice } from "@/utils";

  const props = defineProps<{
    property: PropertyInterface;
  }>();

  const isForRent = computed(() => props.property.isFor === "rent");

  const pool = computed(() => (props.property.pool ? "1" : "0"));
</script>

<template>
  <v-col cols="12" md="4" sm="6">
    <v-card class="mx-auto overflow-hidden" elevation="2">
      <Image
        :label="property.city"
        :imageUrl="property.imageUrl"
        height="250" />

      <v-card-title class="font-weight-bold pb-2 bg-gray overflow-hidden">{{
        property.title
      }}</v-card-title>

      <v-card-text>
        <div
          align="center"
          class="mx-0 pt-4 d-flex justify-space-between font-weight-bold icons">
          <div>
            <span>Beds</span>
            <div>
              <v-icon size="x-large" icon="mdi-bed-king-outline" color="gray" />
              {{ property.bedroom }}
            </div>
          </div>

          <div>
            <span>Baths</span>

            <div>
              <v-icon size="x-large" icon="mdi-bathtub-outline" color="gray" />
              {{ property.bathroom }}
            </div>
          </div>

          <div>
            <span>Parking</span>

            <div>
              <v-icon size="x-large" icon="mdi-garage" color="gray" />
              {{ property.parking }}
            </div>
          </div>

          <div>
            <span>Pool</span>

            <div>
              <v-icon size="x-large" icon="mdi-pool" color="gray" />
              {{ pool }}
            </div>
          </div>
        </div>

        <v-divider class="my-4" />

        <p class="max-lines">
          {{ property.description }}
        </p>
      </v-card-text>

      <v-divider class="mx-4 mb-1" />

      <v-card-actions class="d-flex justify-space-between px-4">
        <div>
          <v-card-title class="py-2 px-0">
            <span
              class="me-2 text-body-1 font-weight-bold bg-gray text-white rounded-pill py-1 px-2"
              >For {{ property.isFor }}
            </span>

            <p class="my-2 text-subtitle-1 text-gray font-weight-bold">
              {{ normalizePrice(property.price) }}
              <span v-if="isForRent">/ month</span>
            </p>
          </v-card-title>
        </div>

        <v-btn
          class="ml-2 bg-primary"
          :to="{
            name: 'property',
            params: { id: property.id },
          }">
          View Details
        </v-btn>
      </v-card-actions>
    </v-card></v-col
  >
</template>

<style scoped>
  .max-lines {
    display: block;
    display: -webkit-box;
    height: 5.3em;
    line-height: 1.3em;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icons > div {
    font-size: 0.8rem;
    color: #2f4858;
  }
</style>
