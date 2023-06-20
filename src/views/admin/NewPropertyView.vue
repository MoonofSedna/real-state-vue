<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import { useForm, useField } from "vee-validate";
  import { useFirestore } from "vuefire";
  import { useRoute, useRouter } from "vue-router";
  import { collection, addDoc, updateDoc } from "@firebase/firestore";
  import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
  // composables
  import useImage from "@/composables/useImage";
  import useLocationMap from "@/composables/useLocationMap";
  import useProperty from "@/composables/useProperty";
  // interfaces
  import { type PropertyInterface } from "@/interfaces/property.interface";
  // store
  import { useAuthStore } from "@/stores/auth";
  // styles
  import "leaflet/dist/leaflet.css";
  // utils
  import { rooms } from "@/utils";
  import {
    validationSchema,
    imageSchema,
  } from "@/utils/validation/newPropertySchema";

  const route = useRoute();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuthStore();

  const { getProperty, getRef } = useProperty();

  const loading = ref(false);
  const property = ref<PropertyInterface>();

  const id = computed(() => route.params.id as string);
  const isEditing = computed(() => !!id.value);

  const valSchema = isEditing.value
    ? validationSchema
    : {
        ...validationSchema,
        ...imageSchema,
      };

  const { handleSubmit } = useForm<PropertyInterface>({
    validationSchema: {
      ...valSchema,
    },
    initialValues: {
      isFor: "sale",
      pool: false,
    },
  });

  const { uploadImage, imageUrl } = useImage();
  const { zoom, center, pin } = useLocationMap();

  const title = useField<string>("title");
  const image = useField<File[]>("image");
  const price = useField<string>("price");
  const bedroom = useField<number>("bedroom");
  const bathroom = useField<number>("bathroom");
  const parking = useField<number>("parking");
  const description = useField<string>("description");
  const pool = useField<boolean>("pool");
  const isFor = useField<string>("isFor");
  const city = useField<string>("city");

  const submit = handleSubmit(async values => {
    loading.value = true;
    const { image, ...property } = values;

    if (isEditing.value) {
      const propertyRef = getRef(id.value);

      if (imageUrl.value) {
        const data = {
          ...property,
          imageUrl: imageUrl.value,
          location: center.value,
        };

        await updateDoc(propertyRef, data);
      } else {
        const data = {
          ...property,
          location: center.value,
        };
        await updateDoc(propertyRef, data);
      }

      router.push({ name: "admin-properties" });
    } else {
      if (!imageUrl || !auth.userId) {
        loading.value = false;
        return;
      }

      const docRef = await addDoc(collection(db, "properties"), {
        ...property,
        user: auth.userId,
        createdAt: Date.now(),
        imageUrl: imageUrl.value,
        location: center.value,
      });

      if (docRef.id) {
        router.push({ name: "admin-properties" });
      }
    }
    loading.value = false;
  });

  onMounted(async () => {
    if (id.value) {
      const propertyRef = (await getProperty(id.value)).data();
      property.value = propertyRef as PropertyInterface;
      center.value = propertyRef?.location;
    }
  });

  watch(property, property => {
    if (!property) return;
    title.value.value = property.title;
    price.value.value = property.price;
    city.value.value = property.city;
    bedroom.value.value = property.bedroom;
    bathroom.value.value = property.bathroom;
    parking.value.value = property.parking;
    description.value.value = property.description;
    pool.value.value = property.pool;
    isFor.value.value = property.isFor;
    center.value = property.location;
  });
</script>
<template>
  <v-card max-width="900" elevation="3" class="w-100 pa-12">
    <v-card-title
      class="text-center text-md-h4 font-weight-bold text-gray"
      tag="h1">
      {{ isEditing ? "Edit Property" : "New Property" }}
    </v-card-title>
    <h5 class="text-center text-ligth-gray text-overline">
      {{
        isEditing
          ? "Edit the property information"
          : "Create a new property filling the form below"
      }}
    </h5>

    <v-form class="mt-6">
      <v-text-field
        label="Property Title"
        variant="underlined"
        prepend-icon="mdi-home-city-outline"
        v-model="title.value.value"
        :error-messages="title.errorMessage.value" />

      <v-file-input
        accept="image/jpeg, image/png"
        label="Property Image"
        variant="underlined"
        prepend-icon="mdi-camera"
        v-model="image.value.value"
        :error-messages="image.errorMessage.value"
        @click:clear="uploadImage"
        @change="uploadImage"
        class="mt-2" />

      <div v-if="imageUrl || property?.imageUrl" class="ml-10">
        <img v-if="imageUrl" :src="imageUrl" alt="Property Image" width="100" />
        <img
          v-else
          :src="property?.imageUrl"
          alt="Property Image"
          width="100" />
      </div>

      <v-text-field
        type="number"
        label="Price"
        variant="underlined"
        prepend-icon="mdi-currency-usd"
        min="0"
        v-model="price.value.value"
        :error-messages="price.errorMessage.value"
        class="mt-2" />

      <v-text-field
        label="City"
        variant="underlined"
        prepend-icon="mdi-city-variant-outline"
        v-model="city.value.value"
        :error-messages="city.errorMessage.value" />

      <v-row>
        <v-col cols="12" md="4">
          <v-select
            label="Bedroom"
            variant="underlined"
            prepend-icon="mdi-bed-king-outline"
            :items="rooms"
            class="mt-2"
            v-model="bedroom.value.value"
            :error-messages="bedroom.errorMessage.value" />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Bathroom"
            variant="underlined"
            prepend-icon="mdi-bathtub-outline"
            :items="rooms"
            v-model="bathroom.value.value"
            :error-messages="bathroom.errorMessage.value"
            class="mt-2" />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Parking"
            variant="underlined"
            prepend-icon="mdi-garage"
            :items="rooms"
            v-model="parking.value.value"
            :error-messages="parking.errorMessage.value"
            class="mt-2" />
        </v-col>
      </v-row>

      <v-textarea
        auto-grow
        label="Description"
        variant="outlined"
        prepend-icon="mdi-text-box-outline"
        v-model="description.value.value"
        :error-messages="description.errorMessage.value"
        class="mt-2" />

      <v-checkbox
        label="Does this property have a pool?"
        class="mt-2"
        prepend-icon="mdi-pool"
        v-model="pool.value.value" />

      <v-radio-group v-model="isFor.value.value">
        <v-radio label="For Sale" value="sale" class="mt-2" />
        <v-radio label="For Rent" value="rent" class="mt-2" />
      </v-radio-group>
      <div class="my-8">
        <h4 class="text-center text-md-h5 font-weight-bold text-gray mb-5">
          Property Location
        </h4>

        <div style="height: 600px">
          <LMap
            v-model:zoom="zoom"
            :center="center"
            :use-global-leaflet="false">
            <LMarker :lat-lng="center" draggable @moveend="pin" />
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
          </LMap>
        </div>
      </div>

      <v-btn
        :disabled="loading"
        color="primary"
        class="mt-4 w-100"
        size="large"
        @click="submit">
        {{ isEditing ? "Update Property" : "Create Property" }}
      </v-btn>
    </v-form>
  </v-card>
</template>
<style scoped></style>
