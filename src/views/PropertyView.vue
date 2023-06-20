<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
  import "leaflet/dist/leaflet.css";
  import type { _RefFirestore } from "vuefire";
  // components
  import Image from "@/components/Image.vue";
  import ContactForm from "@/components/ContactForm.vue";
  // composables
  import useLocationMap from "@/composables/useLocationMap";
  import useProperty from "@/composables/useProperty";
  // interfaces
  import type { PropertyInterface } from "@/interfaces/property.interface";
  // utils
  import { normalizePrice } from "@/utils";

  const router = useRoute();

  const { center, zoom } = useLocationMap();

  const { getProperty } = useProperty();

  const property = ref<PropertyInterface | null>(null);
  const loading = ref(false);

  const id = computed(() => router.params.id as string);
  const pool = computed(() => (property?.value?.pool ? "1" : "0"));

  onMounted(async () => {
    loading.value = true;
    if (id.value) {
      const propertyRef = (await getProperty(id.value)).data();
      property.value = propertyRef as PropertyInterface;
      center.value = propertyRef?.location;
    }
    loading.value = false;
  });
</script>
<template>
  <v-row v-if="loading" class="mt-14">
    <v-progress-circular indeterminate color="primary" class="mx-auto" />
  </v-row>
  <template v-else-if="!loading && property">
    <h2 class="mb-12 text-center text-md-h4 font-weight-bold text-gray">
      {{ property.title }}
    </h2>

    <v-card elevation="3" class="w-100">
      <Image :imageUrl="property.imageUrl" height="450" />

      <v-card class="bg-gray py-4 px-6 rounded-0">
        <div
          align="center"
          class="mx-0 d-flex justify-space-around flex-wrap font-weight-bold">
          <div>
            <span>Beds</span>
            <div>
              <v-icon
                size="x-large"
                icon="mdi-bed-king-outline"
                color="primary" />
              {{ property.bedroom }}
            </div>
          </div>

          <v-divider vertical class="mx-2" />

          <div>
            <span>Baths</span>
            <div>
              <v-icon
                size="x-large"
                icon="mdi-bathtub-outline"
                color="primary" />
              {{ property.bathroom }}
            </div>
          </div>

          <v-divider vertical class="mx-2" />

          <div>
            <span>Parking</span>

            <div>
              <v-icon size="x-large" icon="mdi-garage" color="primary" />
              {{ property.parking }}
            </div>
          </div>

          <v-divider vertical class="mx-2" />

          <div>
            <span>Pool</span>

            <div>
              <v-icon size="x-large" icon="mdi-pool" color="primary" />
              {{ pool }}
            </div>
          </div>
        </div>
      </v-card>

      <v-row class="pa-6">
        <v-col
          cols="12"
          md="6"
          sm="12"
          class="d-flex flex-column justify-space-between align-start">
          <div>
            <v-card-title class="title px-0 font-weight-bold text-gray">{{
              property.title
            }}</v-card-title>

            <v-card-text
              class="px-2 py-1 rounded-pill bg-gray d-inline text-body-1 font-weight-bold">
              For {{ property.isFor }}
            </v-card-text>

            <v-card-text class="pt-4 px-0 text-h6 font-weight-bold text-gray">
              {{ normalizePrice(property.price) }}
            </v-card-text>

            <v-card-text class="px-0 text-body-1 text-gray">
              <p>{{ property.description }}</p>
            </v-card-text>
          </div>

          <ContactForm :property="property.title" />
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-card-title class="px-0 font-weight-bold text-gray">{{
            property.city
          }}</v-card-title>

          <div style="height: 400px" class="w-100">
            <LMap
              v-model:zoom="zoom"
              :center="center"
              :use-global-leaflet="false">
              <LMarker :lat-lng="center">
                <LPopup>
                  <span>{{ property.title }}</span>
                </LPopup>
              </LMarker>
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
            </LMap>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </template>
  <v-row v-else>
    <v-col cols="12">
      <h2 class="text-center text-md-h4 font-weight-bold text-gray">
        Property not found
      </h2>
    </v-col>
  </v-row>
</template>

<style scoped>
  .title {
    white-space: wrap !important;
  }
</style>
