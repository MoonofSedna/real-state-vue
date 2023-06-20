<script setup lang="ts">
  defineProps<{
    label?: string;
    imageUrl: string;
    height?: string;
  }>();
</script>

<template>
  <v-img
    cover
    :height="height"
    :src="imageUrl"
    aspect-ratio="1"
    :alt="imageUrl">
    <v-card-title v-if="label" class="card-header"
      >{{ label }} <v-icon icon="mdi-map-marker" />
    </v-card-title>

    <template v-slot:placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular color="grey-lighten-4" indeterminate />
      </div>
    </template>
  </v-img>
</template>

<style>
  .card-header {
    background-color: #2f48589a;
    color: white;
  }
</style>
