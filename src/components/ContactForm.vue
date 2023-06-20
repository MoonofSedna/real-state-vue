<script setup lang="ts">
  import { ref } from "vue";
  import emailjs from "emailjs-com";
  import { useField, useForm } from "vee-validate";
  // utils
  import { minDate } from "@/utils";
  import { contactFormSchema } from "@/utils/validation/contactFormSchema";

  const dialog = ref(false);
  const loading = ref(false);

  const props = defineProps<{
    property: string;
  }>();

  const { handleSubmit } = useForm({
    validationSchema: contactFormSchema,
    validateOnMount: false,
  });

  const name = useField("name");
  const email = useField("email");
  const date = useField("date");
  const time = useField("time");

  const closeModal = () => {
    dialog.value = false;
  };

  const submit = handleSubmit(async (values, { resetForm }) => {
    loading.value = true;
    const fields = {
      ...values,
      property: props.property,
    };
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        fields,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      resetForm();
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
      closeModal();
    }
  });
</script>
<template>
  <v-btn color="primary" class="" @click="dialog = true" :loading="loading">
    Book a visit
  </v-btn>
  <v-dialog v-model="dialog" max-width="500" class="w-100">
    <v-card min-width="300px">
      <v-toolbar dark color="gray">
        <v-toolbar-title>Schedule a visit at {{ property }}</v-toolbar-title>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card max-width="900" elevation="3" class="w-100 pa-8">
        <v-form>
          <v-text-field
            label="Name"
            variant="underlined"
            prepend-icon="mdi-account-outline"
            class="mb-2"
            v-model="name.value.value"
            :error-messages="name.errorMessage.value" />

          <v-text-field
            label="Email"
            type="email"
            variant="underlined"
            prepend-icon="mdi-email-outline"
            class="mb-2"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value" />

          <v-text-field
            type="date"
            label="Date"
            :min="minDate"
            variant="underlined"
            prepend-icon="mdi-calendar"
            class="mb-2"
            v-model="date.value.value"
            :error-messages="date.errorMessage.value" />

          <v-text-field
            type="time"
            label="Time"
            format="12hr"
            variant="underlined"
            prepend-icon="mdi-clock-outline"
            class="mb-2"
            v-model="time.value.value"
            :error-messages="time.errorMessage.value" />

          <v-btn
            color="primary"
            class="mt-4 w-100"
            size="large"
            @click="submit">
            Schedule
          </v-btn>
        </v-form>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
