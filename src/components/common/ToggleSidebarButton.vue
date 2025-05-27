<template>
  <div class="flex items-center gap-3">
    <button
      class="bg-white border rounded-md p-2 shadow-sm md:hidden"
      @click="$emit('onToggleSidebar')"
    >
      >
    </button>
    <h1 class="text-3xl font-bold text-gray-800">
      <slot />
    </h1>
  </div>
</template>

<script setup>
defineEmits(['onToggleSidebar'])
</script>
