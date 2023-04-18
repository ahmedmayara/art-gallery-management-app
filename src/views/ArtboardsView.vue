<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Modal from '../components/Modal.vue';
import useArtboards from '../composables/Artboards.js';
import useArtists from '../composables/Artists.js';
import useCategories from '../composables/Categories.js';

const { artboards, getArtboards, meta, goToPage } = useArtboards();
const { artists, getArtists } = useArtists();
const { categories, getCategories } = useCategories();

onMounted(() => {
    getArtboards();
    getArtists();
    getCategories();
});

const router = useRouter();

const showLogoutConfirmationModal = ref(false);

const confirmLogout = () => {
    showLogoutConfirmationModal.value = true;
}

const user = computed(() => {
    return JSON.parse(localStorage.getItem('user'));
})

const handleLogout = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/logout', null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        console.log(response);
    } catch (error) {
        if (error.response && error.response.data) {
            console.log(error.response.data.errors);
        } else {
            console.log(error);
        }
    }
}

const isDark = useDark()
const toggleDark = useToggle(isDark)

const sidebar = [
    {
        name: 'Dashboard',
        icon: 'mdi:view-dashboard',
        path: '/dashboard',
    },
    {
        name: 'Artists',
        icon: 'mdi:account-supervisor',
        path: '/artists',
    },
    {
        name: 'Categories',
        icon: 'mdi:format-list-bulleted',
        path: '/categories',
    },
    {
        name: 'Artboards',
        icon: 'mdi:palette',
        path: '/artboards',
    },
    {
        name: 'Customers',
        icon: 'mdi:account-group',
        path: '/customers',
    },
    {
        name: 'Orders',
        icon: 'mdi:package-variant-closed',
        path: '/orders',
    },
]

const showDeleteConfirmationModal = ref(false);

const artboardToDelete = ref({
    id: '',
    title: '',
    price: '',
    description: '',
    image: '',
    artist_id: '',
    category_id: '',
})

const confirmDelete = (artboard) => {
    artboardToDelete.value = artboard;
    showDeleteConfirmationModal.value = true;
}

const message = ref('');

const handleDeleteArtboard = async () => {
    try {
        const response = await axios.delete(`http://localhost:8000/api/v1/artboards/${artboardToDelete.value.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showDeleteConfirmationModal.value = false;
        getArtboards();
        showDeleteAlert();
    } catch (error) {
        if (error.response.status === 400 ) {
            message.value = error.response.data.message;
        } else {
            errors.value = error.response.data.errors;
        }
        console.log(errors.value);
        console.log(message.value);
    }
}

// Clear the message when the delete modal is closed
watchEffect(() => {
    if (!showDeleteConfirmationModal.value) {
        message.value = '';
    }
})

const searchQuery = ref('');

const filtredArtboards = computed(() => {
    return artboards.value.filter(artboard => artboard.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
})

const showAddArtboardModal = ref(false);

const addArtboard = () => {
    showAddArtboardModal.value = true;
}

const newArtboard = ref({
    id: '',
    title: '',
    price: '',
    description: '',
    image: '',
    artist_id: '',
    category_id: '',
})

const selectedFileName = ref('');

const handleUploadImage = (e) => {
    const file = e.target.files[0];
    newArtboard.value.image = file;
    selectedFileName.value = file.name;
}

const errors = ref({});

const handleAddArtboard = async () => {
    try {
        const formData = new FormData();
        formData.append('title', newArtboard.value.title);
        formData.append('price', newArtboard.value.price);
        formData.append('description', newArtboard.value.description);
        formData.append('image', newArtboard.value.image);
        formData.append('artist_id', newArtboard.value.artist_id);
        formData.append('category_id', newArtboard.value.category_id);

        const response = await axios.post('http://localhost:8000/api/v1/artboards', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);
        showAddArtboardModal.value = false;
        getArtboards();
        addSuccessAlert();
    } catch (error) {
        if (error.response && error.response.data) {
            errors.value = error.response.data.errors;
        } else {
            console.log(error);
        }
    }
}

// Clear the input fields when the add modal is closed
watchEffect(() => {
    if (!showAddArtboardModal.value) {
        newArtboard.value.title = '';
        newArtboard.value.price = '';
        newArtboard.value.description = '';
        newArtboard.value.image = '';
        newArtboard.value.artist_id = '';
        newArtboard.value.category_id = '';
    }
    errors.value = {};
    selectedFileName.value = '';
})

const addSuccessAlert = () => {
    const alertContainer = document.getElementById('alerts-container');
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `<div class="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline flex-shrink-0 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"/></svg>
                            <span class="sr-only">Info</span>
                            <div>
                                <span class="font-medium">Success! Artboard added successfully.</span>
                            </div>
                            </div>`;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

const showDeleteAlert = () => {
    const alertContainer = document.getElementById('alerts-container');
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `<div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline flex-shrink-0 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m5 5h-2.5l-1-1h-3l-1 1H7v2h10V7M9 18h6a1 1 0 0 0 1-1v-7H8v7a1 1 0 0 0 1 1Z"/></svg>
                            <span class="sr-only">Info</span>
                            <div>
                                <span class="font-medium">Success! Artboard deleted successfully.</span>
                            </div>
                            </div>`;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

const dropImage = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    newArtboard.value.image = file;
    selectedFileName.value = file.name;
}
</script>

<template>
    <section
        class="w-full min-h-screen font-sans text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white flex transition-all duration-500 ease-in-out">
        <div id="alerts-container" class="absolute top-8 right-8 z-50">
                <!-- alerts will be dynamically added here -->
        </div>
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
                        <span>{{ item.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </aside>
        <main class="flex-1">
            <div class="flex items-center justify-between py-7 px-10 border-b border-gray-200 dark:border-gray-600">
                <div>
                    <h1 class="text-2xl font-semibold leading-relaxed">
                        Manage your artboards
                    </h1>
                    <p class="text-gray-500 text-sm font-medium">
                        You can add, edit, and delete artboards here.
                    </p>
                </div>

                <form class="flex items-center" autocomplete="off">   
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-96">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon icon="mdi:magnify" width="20" />
                        </div>
                        <input v-model="searchQuery" type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Search">
                    </div>
                </form>
                <div class="flex gap-x-4">
                    <button @click="toggleDark()">
                        <span v-if="isDark" title="Light Mode">
                            <Icon icon="ph:sun-duotone" width="25" />
                        </span>
                        <span v-else class="text-gray-900" title="Dark Mode">
                            <Icon icon="ph:moon-duotone" width="25" :class="isDark ? 'text-white' : 'text-gray-500'" />
                        </span>
                    </button>
                    <button @click="confirmLogout" title="Logout">
                        <Icon icon="ph:sign-out-duotone" width="25" :class="isDark ? 'text-white' : 'text-gray-500'" />
                    </button>
                    <button @click="addArtboard" class="flex items-center justify-center gap-x-2 bg-blue-500 py-2 px-4 hover:bg-blue-600 transition-colors rounded-lg">
                        <Icon icon="mdi:image-plus-outline" width="22" color="white" />
                        <span class="font-normal text-white">Add Artboard</span>
                    </button>


                    <Modal v-model:show="showAddArtboardModal" title="Add Artboard" @close="showAddArtboardModal = false">
                        <template #header>
                            <div class="flex">
                                <Icon icon="mdi:image-plus-outline" width="25" />
                                <h1 class="text-md font-semibold leading-relaxed ml-3">Add Artboard</h1>
                            </div>
                        </template>
                        <template #body>
                                <div class="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Title
                                        </label>
                                        <input v-model="newArtboard.title" type="text" id="title" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type a title">
                                        <p v-if="errors.title" class="text-red-500 font-bold text-sm mt-2">
                                            {{ errors.title[0] }}
                                        </p>
                                    </div>
                                    <div>
                                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Price
                                        </label>
                                        <input v-model="newArtboard.price" type="number" id="price" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type a price">
                                        <p v-if="errors.price" class="text-red-500 font-bold text-sm mt-2">
                                            {{ errors.price[0] }}
                                        </p>
                                    </div>
                                    <div>
                                        <label for="artist" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Artist
                                        </label>
                                        <select v-model="newArtboard.artist_id" id="artist_id" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none">
                                            <option value="" disabled selected>Select Artist</option>
                                            <option v-for="artist in artists" :value="artist.id">{{ artist.first_name }} {{ artist.last_name }}</option>
                                        </select>
                                        <p v-if="errors.artist_id" class="text-red-500 font-bold text-sm mt-2">
                                            {{ errors.artist_id[0] }}
                                        </p>
                                    </div>
                                    <div>
                                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Category
                                        </label>
                                        <select v-model="newArtboard.category_id" id="category_id" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none">
                                            <option value="" disabled selected>Select Category</option>
                                            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                                        </select>
                                        <p v-if="errors.category_id" class="text-red-500 font-bold text-sm mt-2">
                                            {{ errors.category_id[0] }}
                                        </p>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Description
                                    </label>
                                    <textarea rows="5" v-model="newArtboard.description" id="description" class="border resize-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type a small description about this artboard"></textarea>
                                    <p v-if="errors.description" class="text-red-500 font-bold text-sm mt-2">
                                        {{ errors.description[0] }}
                                    </p>
                                </div>
                                <div>
                                    <label for="image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Image
                                    </label>
                                    <div class="flex items-center justify-center w-full">
                                        <label for="dropzone-file" @drop="dropImage" class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Icon icon="mdi:cloud-upload-outline" class="w-10 h-10 mb-2 text-gray-400 dark:text-gray-500" />
                                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p v-if="selectedFileName" class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Selected image : {{ selectedFileName }}
                                                </p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, JPG or SVG (MAX. 2 MB)</p>
                                            </div>
                                            <input id="dropzone-file" v-on:change="handleUploadImage" type="file" class="hidden" />
                                        </label>
                                    </div> 
                                    <p v-if="errors.image" class="text-red-500 font-bold text-sm mt-2">
                                        {{ errors.image[0] }}
                                    </p>
                                </div>
                        </template>
                        
                        <template #footer> 
                            <div>
                                <button @click="handleAddArtboard" class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">Add</button>
                                <button @click="showAddArtboardModal = false" class="px-4 py-2 ml-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                            </div>
                        </template>
                    </Modal>
                
                <Modal v-model:show="showLogoutConfirmationModal" title="Logout Confirmation" @close="showLogoutConfirmationModal = false">
                    <template #header>
                        <div class="flex justify-center items-center">
                            <Icon icon="ion:ios-warning" width="25" />
                            <h1 class="text-md font-semibold leading-relaxed ml-3">Logout Confirmation</h1>
                        </div>
                    </template>
                    <template #body>
                        <p class="text-gray-500 text-lg font-medium">
                            Are you sure you want to logout?
                        </p>
                    </template>
                    <template #footer>
                        <button @click="showLogoutConfirmationModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                        <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">Logout</button>
                    </template>
                </Modal>
            </div>

            </div>
            
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-200 dark:bg-gray-800">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Artboard
                        </th>
                        <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th> -->
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Artist
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delete
                        </th>
                    </tr>
                </thead>
                <tr v-if="filtredArtboards.length === 0">
                    <td colspan="6" class="text-center text-xl text-gray-900 dark:text-gray-500 font-bold pt-5">No results found</td>
                </tr>
                <tr v-for="artboard in filtredArtboards" :key="artboard.id" class="border-b border-gray-200 dark:border-gray-600">
                    <td class="flex gap-x-4 items-center py-4 pl-5">
                        <div class="relative">
                            <img :src="artboard.image" class="w-40 aspect-[3/2] rounded-lg object-cover object-top" />
                            <div class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity items-center justify-center flex cursor-pointer rounded-lg">
                                <RouterLink :to="{ name: 'artboard-edit', params: { id: artboard.id } }" class="text-white">
                                    <Icon icon="ion:ios-eye" width="25" />
                                </RouterLink>
                            </div>
                        </div>
                    </td>
                    <!-- <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-500">
                            {{ artboard.title }}
                        </div>
                    </td> -->
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-gray-500">
                            {{ artboard.price }} $
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-gray-500">
                            {{ artboard.description }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-gray-500">
                            By {{ artboard.artist.first_name }} {{ artboard.artist.last_name }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-gray-500">
                            {{ artboard.category.name }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button @click="confirmDelete(artboard)" class="text-red-500 hover:text-red-600 transition-colors">
                            <Icon icon="ph:trash-duotone" width="25" />
                        </button>
                    </td>
                </tr>
            </table>

            <nav v-if="meta.last_page > 1">
                <ul class="flex justify-center mt-6">
                    <li class="mx-3">
                        <a href="#"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            @click.prevent="goToPage(meta.current_page - 1)" :class="{'opacity-50 cursor-default': meta.current_page === 1}">Previous</a>
                    </li>
                    
                    <template v-for="pageNumber in meta.last_page">
                        <li class="mx-1">
                            <a href="#"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                :class="{ 'opacity-50 cursor-not-allowed': meta.current_page === pageNumber }"
                                @click.prevent="goToPage(pageNumber)">{{ pageNumber }}</a>
                        </li>
                    </template>
                    
                    <li class="mx-3">
                        <a href="#"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            @click.prevent="goToPage(meta.current_page + 1)" :class="{'opacity-50 cursor-default': meta.current_page === meta.last_page}">Next</a>
                    </li>
                </ul>
            </nav>
        </main>

        <Modal v-model:show="showDeleteConfirmationModal" title="Delete Category" @close="showDeleteConfirmationModal = false">
            <template #header>
                <div class="flex items-center justify-center">
                    <Icon icon="mdi:delete-alert" width="25" />
                    <h1 class="text-md font-semibold leading-relaxed ml-3">
                        Delete Confirmation
                    </h1>
                </div>
            </template>
            <template #body>
                <p class="text-gray-500 text-lg font-medium">
                    Are you sure you want to delete this artboard?
                </p>
                <p v-if="message" class="text-red-500 text-sm font-medium mt-1">
                    <span class="font-bold">Error ! {{ message }}</span> 
                </p>
            </template>
            <template #footer>
                <button @click="showDeleteConfirmationModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                <button @click="handleDeleteArtboard" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" :class="{ 'hidden' : message }">Delete</button>
            </template>
        </Modal>
    </section>
</template>