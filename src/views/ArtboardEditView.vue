<script setup>
import useArtboards from '../composables/Artboards.js';
import useCategories from '../composables/Categories.js';
import useArtists from '../composables/Artists.js';
import { onMounted, computed } from 'vue';
import moment from 'moment';
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { artboard, getArtboard, updateArtboard, errors } = useArtboards();
const { categories, getCategories } = useCategories();
const { artists, getArtists } = useArtists();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const user = computed(() => {
    return JSON.parse(localStorage.getItem('user'));
})

onMounted(() => {
    getArtboard(props.id);
    getCategories();
    getArtists();
});

const sidebar = [
    {
        title: 'Dashboard',
        icon: 'mdi:view-dashboard',
        path: '/dashboard',
    },
    {
        title: 'Artists',
        icon: 'mdi:account-supervisor',
        path: '/artists',
    },
    {
        title: 'Categories',
        icon: 'mdi:format-list-bulleted',
        path: '/categories',
    },
    {
        title: 'Artboards',
        icon: 'mdi:palette',
        path: '/artboards',
    },
    {
        title: 'Customers',
        icon: 'mdi:account-group',
        path: '/customers',
    },
    {
        title: 'Orders',
        icon: 'mdi:package-variant-closed',
        path: '/orders',
    },
]


</script>

<template>
    <section
        class="w-full min-h-screen font-sans text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white flex transition-all duration-500 ease-in-out">
        <aside class="py-6 px-10 w-72 border-r border-gray-200 dark:border-gray-600 hidden lg:block">
            <div class="flex justify-center items-center">
                <a href="#" class="font-display text-2xl">Artivity</a>
            </div>
            <div class="mt-14 text-center">
                <div
                    class="relative inline-flex items-center justify-center w-28 h-28 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                    <span class="font-medium text-4xl text-gray-600 dark:text-gray-300">
                        {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
                    </span>
                </div>
                <h1 class="mt-3 text-xl font-semibold">
                    {{ user.first_name }} {{ user.last_name }}
                </h1>
                <p class="text-gray-500 text-sm font-medium mt-1">
                    Joined at {{ moment(user.created_at).format('MMMM DD, YYYY') }}
                </p>
            </div>
            <ul class="flex flex-col gap-y-6 pt-12 ml-4">
                <li v-for="item in sidebar">
                    <RouterLink :to="item.path" exact-active-class="text-blue-500" class="flex items-center gap-x-4 hover:text-blue-500 transition-colors group">
                        <span class="absolute w-1.5 h-8 bg-blue-500 rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out transition-transform"></span>
                        <Icon :icon="item.icon" width="25" />
                        <span>{{ item.title }}</span>
                    </RouterLink>
                </li>
            </ul>
        </aside>
        <main class="flex-1">
            <div class="flex items-center justify-between py-7 px-10 border-b border-gray-200 dark:border-gray-600">
                <div>
                    <h1 class="text-2xl font-semibold leading-relaxed">
                        Edit Artboard
                    </h1>
                    <p class="text-gray-500 text-sm font-medium">
                        You can edit the artboard here.
                    </p>
                </div>

                <div class="flex gap-x-4">
                    <button @click="toggleDark()">
                        <span v-if="isDark" title="Light Mode">
                            <Icon icon="ph:sun-duotone" width="25" />
                        </span>
                        <span v-else class="text-gray-900" title="Dark Mode">
                            <Icon icon="ph:moon-duotone" width="25" :class="isDark ? 'text-white' : 'text-gray-500'" />
                        </span>
                    </button>
                </div>
            </div>

            <form class="px-10 py-6 flex gap-x-12" @submit.prevent="updateArtboard($route.params.id)">
                <div class="flex-1 flex flex-col gap-y-6">
                    <div class="flex flex-col gap-y-2">
                        <label for="title" class="text-sm font-semibold text-gray-500">Title</label>
                        <input v-model="artboard.title" type="text" id="title" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Enter title">
                        <span v-if="errors.title" class="text-red-500 text-sm font-bold mt-1">{{ errors.title[0] }}</span>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label for="artist" class="text-sm font-semibold text-gray-500">Artist</label>
                        <select v-model="artboard.artist_id" id="artist" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none">
                            <option v-for="artist in artists" :value="artist.id">{{ artist.first_name }} {{ artist.last_name }}</option>
                        </select>
                        <span v-if="errors.artist" class="text-red-500 text-sm font-bold mt-1">{{ errors.artist_id[0] }}</span>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label for="category" class="text-sm font-semibold text-gray-500">Category</label>
                        <select v-model="artboard.category_id" id="category" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none">
                            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                        </select>
                        <span v-if="errors.category_id" class="text-red-500 text-sm font-bold mt-1">{{ errors.category_id[0] }}</span>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label for="description" class="text-sm font-semibold text-gray-500">Description</label>
                        <textarea v-model="artboard.description" id="description" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Enter description"></textarea>
                        <span v-if="errors.description" class="text-red-500 text-sm font-bold mt-1">{{ errors.description[0] }}</span>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label for="price" class="text-sm font-semibold text-gray-500">Price</label>
                        <input v-model="artboard.price" type="number" id="price" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Enter price">
                        <span v-if="errors.price" class="text-red-500 text-sm font-bold mt-1">{{ errors.price[0] }}</span>
                    </div>
                    <div class="flex flex-row gap-y-2">
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                            Edit
                        </button>
                        <RouterLink to="/artboards" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">
                            Cancel
                        </RouterLink>
                    </div>
                </div>
                <div class="flex-1 flex items-center flex-col gap-y-2">
                    <label for="image" class="text-sm font-semibold text-gray-500 text-center mb-3">Image Preview</label>
                    <img :src="artboard.image" :alt="artboard.title" class="object-cover w-[32rem]">
                </div>
            </form> 
        </main>
    </section>
</template>