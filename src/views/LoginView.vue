<script setup lang="ts">
  import { useForm, useField } from "vee-validate";
  // schemas
  import { loginSchema as validationSchema } from "../utils/validation/loginSchema";
  //stores
  import { useAuthStore } from "../stores/auth";

  const { handleSubmit } = useForm({
    validationSchema,
  });

  const auth = useAuthStore();

  const email = useField("email");
  const password = useField("password");

  const submit = handleSubmit(values => {
    auth.login(values.email, values.password);
  });
</script>

<template>
  <v-card elevation="3" max-width="800" class="w-100 d-flex flex-column pa-8">
    <v-card-title
      class="text-center text-md-h4 font-weight-bold text-gray"
      tag="h1">
      Login
    </v-card-title>

    <h5 class="text-center text-ligth-gray text-overline">
      Please login to continue
    </h5>

    <v-alert
      v-if="auth.hasError"
      class="mt-4"
      type="error"
      :title="auth.errorMsg" />

    <v-form class="mt-6">
      <v-text-field
        type="email"
        label="Email"
        variant="underlined"
        v-model="email.value.value"
        :error-messages="email.errorMessage.value" />

      <v-text-field
        type="password"
        label="Password"
        variant="underlined"
        class="mt-2"
        v-model="password.value.value"
        :error-messages="password.errorMessage.value" />

      <v-btn color="primary" class="mt-4 w-100" size="large" @click="submit">
        Login
      </v-btn>
    </v-form>
  </v-card>
</template>

<style scoped></style>
