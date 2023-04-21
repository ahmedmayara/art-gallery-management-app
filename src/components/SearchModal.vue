<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useDark, useToggle } from '@vueuse/core';
import axios from 'axios'
import { Dialog, DialogOverlay, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

const isOpen = ref(false)

const router = useRouter();

const isDark = useDark();
const toggleDark = useToggle(isDark);

const onKeyDown = (e) => {
    if (e.key === 'b' && e.ctrlKey) {
        isOpen.value = true
    }
}

const selectedIndex = ref(0);

const getAllArtboards = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/artboards/all');
        artworks.value = response.data.data;
        console.log(response);
    } catch (error) {
        if (error.response && error.response.data) {
            console.log(error.response.data.errors);
        } else {
            console.log(error);
        }
    }
};

const searchQuery = ref('');

const filtredArtworks = computed(() => {
    return artworks.value.filter(artwork => artwork.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const artworks = ref([]);

onMounted(() => {
    getAllArtboards();
    window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
});

</script>

<template>
    <button v-bind="$attrs" @click="isOpen = true" class="flex items-center space-x-2 border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-gray-900/10 px-3 py-2 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:border-gray-300 rounded-lg">
        <Icon icon="ph:magnifying-glass-duotone" class="flex-none text-gray-400 -ml-1 w-5 h-5" />
        <span class="text-sm text-gray-400 flex-1 text-left">Search</span>
        <span class="flex-none font-semibold text-xs text-gray-400">Ctrl + B</span>
    </button>

    <TransitionRoot :show="isOpen" as="template">
        <Dialog class="fixed inset-0 z-50 flex justify-center items-start" :open="isOpen" @close="isOpen = false">
            <TransitionChild as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
        >
                <DialogOverlay class="fixed inset-0 bg-black/50" />
            </TransitionChild>

            <TransitionChild as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
            >
                <DialogPanel class="relative flex flex-col w-full max-w-2xl bg-white rounded-lg mx-4 max-h-[80vh] mt-[10vh] overflow-hidden dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <form action="#" class="flex items-center relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Icon icon="ph:magnifying-glass-duotone" class="flex-none text-gray-400 -ml-1 w-5 h-5" />
                            </div>

                            <input v-model="searchQuery" type="text" class="w-full border-b border-gray-200 px-3 py-3 pl-12 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search..." />

                            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                                <button @click="isOpen = false" class="flex items-center p-1.5 uppercase dark:text-white font-semibold tracking-wider text-gray-800 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300 text-xxs" type="button">ESC</button>
                            </div>
                        </form>

                        <div class="overflow-auto">
                            <ul v-if="filtredArtworks.length > 0" class="divide-y divide-gray-200 dark:divide-gray-600">
                                <li @click="router.push('artboards/' + item.id)" :class="{ 'bg-gray-100 dark:bg-gray-500' : selectedIndex === index }" @mousemove="selectedIndex = index" v-for="(item, index) in filtredArtworks" :key="index" class="flex items-center px-4 py-2.5 cursor-pointer">
                                    <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-full object-cover border-white border-2 shrink-0 bg-gray-200" />
                                    <div class="ml-3">
                                        <div class="font-semibold text-gray-600 dark:text-white">
                                            {{ item.title }}
                                        </div>
                                        <div class="text-xs text-gray-600 mt-1 dark:text-white">
                                            {{ item.description }}
                                        </div>
                                        <div class="text-xs text-gray-600 mt-1 dark:text-white">
                                            {{ item.price }} $
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div v-if="filtredArtworks.length === 0" class="flex items-center justify-center h-32 text-gray-400">
                                No results found
                            </div>
                        </div>
                </DialogPanel>
            </TransitionChild>
        </Dialog>
    </TransitionRoot>

</template>