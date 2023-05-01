<template>
    <nav v-if="props.meta.last_page > 1">
      <ul class="flex justify-center">
        <li class="mx-3">
          <a href="#"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            @click.prevent="props.goToPage(meta.current_page - 1)"
            :class="{'opacity-50 cursor-default': props.meta.current_page === 1}">
            Previous
          </a>
        </li>
  
        <template v-for="pageNumber in props.meta.last_page" :key="pageNumber">
          <li class="mx-1">
            <a href="#"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              :class="{ 'opacity-50 cursor-not-allowed': props.meta.current_page === pageNumber }"
              @click.prevent="props.goToPage(pageNumber)">
              {{ pageNumber }}
            </a>
          </li>
        </template>
  
        <li class="mx-3">
          <a href="#"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            @click.prevent="props.goToPage(props.meta.current_page + 1)"
            :class="{'opacity-50 cursor-default': props.meta.current_page === props.meta.last_page}">
            Next
          </a>
        </li>
      </ul>
    </nav>
</template>
  
<script setup>
const props = defineProps({
    meta: {
      type: Object,
      required: true,
    },
    goToPage: {
      type: Function,
      required: true,
    },
})
</script>
  