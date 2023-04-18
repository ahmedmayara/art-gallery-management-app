<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Modal from '../components/Modal.vue';

const getAllArtboards = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/artboards/all');
        artboards.value = response.data.data;
        console.log(response);
    } catch (error) {
        if (error.response && error.response.data) {
            console.log(error.response.data.errors);
        } else {
            console.log(error);
        }
    }
}

const artboards = ref([]);

const searchQuery = ref('');

const filtredArtboards = computed(() => {
    return artboards.value.filter(artboard => artboard.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
})

onMounted(() => {
    getAllArtboards();
})

const router = useRouter();

const isDark = useDark()
const toggleDark = useToggle(isDark)

// const artboardsByCategory = ref([]);

// const getArtboardsByCategory = async (category) => {
//     try {
//         const response = await axios.get(`http://localhost:8000/api/artboards/${category}`);
//         artboardsByCategory.value = response.data.data;
//         console.log(response);
//     } catch (error) {
//         if (error.response && error.response.data) {
//             console.log(error.response.data.errors);
//         } else {
//             console.log(error);
//         }
//     }
// }
</script>

<template>
    <div class="w-full bg-slate-200 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-500 ease-in-out">
        <nav class="border-b border-gray-300 dark:border-gray-600">
            <div class="px-4 mx-auto max-w-7xl">
                <div class="flex items-center gap-x-6 h-20">
                    <RouterLink to="/" class="hidden md:block">
                        <img class="w-10" src="../assets/img/logo.png" alt="Logo">
                    </RouterLink>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon icon="ph:magnifying-glass-duotone" class="w-5 h-5 text-gray-400" />
                        </div>
                        <input autocomplete="off" type="text" v-model="searchQuery" id="simple-search" class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search">
                    </div>
                    <div class="flex items-center">
                        <div class="relative cursor-pointer inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600">
                            <span class="font-medium text-sm text-gray-600 dark:text-gray-300">
                                AM
                            </span>
                        </div>
                        <button class="ml-4" @click="toggleDark()">
                            <Icon :icon="isDark ? 'ph:sun-duotone' : 'ph:moon-duotone'" class="w-6 h-6" :class="isDark ? 'text-white' : 'text-gray-500'" />
                        </button>
                        <button class="ml-4">
                            <Icon icon="ph:shopping-cart-simple-duotone" class="w-6 h-6" :class="isDark ? 'text-white' : 'text-gray-500'" />
                        </button>
                        <button class="ml-4">
                            <Icon icon="ph:sign-out-duotone" class="w-6 h-6" :class="isDark ? 'text-white' : 'text-gray-500'" />
                        </button>

                    </div>
                </div>
            </div>
        </nav>
        <main class="py-14 px-4 mx-auto max-w-7xl">
            <div class="flex items-center">
                <h1 class="text-4xl font-display">Browse Artboards</h1>
            </div>
            <p class="pt-3 mb-6 text-lg text-gray-700 dark:text-gray-200">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
            </p>

            <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="getArtboardsByCategory(25)">
                Get Artboards By Category
            </button>

            <div class="columns-1 md:columns-3 gap-x-8 pt-2" v-if="artboardsByCategory"> 
                <figure class="py-4 [break-inside:avoid]" v-for="artboard in artboardsByCategory" :key="artboard.id">
                    <img :src="artboard.image" alt="artboard" class="rounded-lg">
                    <figcaption class="mt-3 text-center text-gray-900 dark:text-gray-200 font-bold">
                        {{ artboard.title }}
                    </figcaption>
                </figure>
            </div> -->

            <div class="flex justify-center items-center">
                <span v-if="filtredArtboards.length === 0" class="text-center text-3xl text-gray-900 dark:text-gray-500 font-bold pt-5">Nothing found.</span>
            </div>
            <div class="columns-1 md:columns-3 gap-x-8 pt-2"> 
                <figure class="py-4 [break-inside:avoid]" v-for="artboard in filtredArtboards" :key="artboard.id">
                    <img :src="artboard.image" alt="artboard" class="rounded-lg">
                    <figcaption class="mt-3 text-gray-800 dark:text-gray-200">
                        <h2 class="text-2xl font-semibold mt-1">{{ artboard.title }}</h2>
                        <p class="text-sm mt-1 line-clamp-2">Made by : <span class="font-bold cursor-pointer hover:underline">{{ artboard.artist.first_name }} {{ artboard.artist.last_name }}</span></p>
                        <p class="text-sm mt-1 line-clamp-2">Price : <span class="font-semibold">{{ artboard.price }} $</span></p>
                        <p class="text-sm mt-1 line-clamp-2">Category : <span class="font-semibold">{{ artboard.category.name }}</span></p>
                    </figcaption>
                </figure>
            </div>
        </main>
    </div>
</template>