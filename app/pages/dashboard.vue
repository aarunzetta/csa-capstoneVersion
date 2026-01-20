<script setup lang="ts">
import { Users, IdCard, CarTaxiFront, UserStar } from "lucide-vue-next";
import { ref } from "vue";

const passengers = ref(1);
const drivers = ref(3);
const rides = ref(5);
const admins = ref(2);
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-white text-4xl">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <uiCard
        id="passengers"
        label="Passengers"
        :value="passengers"
        :icon="Users"
        href="/passengers"
      />
      <uiCard
        id="drivers"
        label="Drivers"
        :value="drivers"
        :icon="IdCard"
        href="/drivers"
      />
      <uiCard
        id="rides"
        label="Rides"
        :value="rides"
        :icon="CarTaxiFront"
        href="/rides"
      />
      <uiCard
        id="admins"
        label="Admins"
        :value="admins"
        :icon="UserStar"
        href="/admins"
      />
    </div>
  </div>
</template>
