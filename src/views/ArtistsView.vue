<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Modal from '../components/Modal.vue';
import useArtists from '../composables/Artists';

const { artists, getArtists } = useArtists();

onMounted(() => {
    getArtists();
})

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

const showAddArtistModal = ref(false);

const addArtist = () => {
    showAddArtistModal.value = true;
}

const newArtist = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
})

const errors = ref({});

const handleAddArtist = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/artists', newArtist.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showAddArtistModal.value = false;
        getArtists();
        addSuccessAlert();
    } catch (error) {
        if (error.response && error.response.data) {
            errors.value = error.response.data.errors;
        } else {
            console.log(error);
        }
    }
}

const addSuccessAlert = () => {
    const alertContainer = document.getElementById('alerts-container');
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `<div class="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline flex-shrink-0 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"/></svg>
                            <span class="sr-only">Info</span>
                            <div>
                                <span class="font-medium">Success! Artist added successfully.</span>
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
                                <span class="font-medium">Success! Artist deleted successfully.</span>
                            </div>
                            </div>`;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

const showEditAlert = () => {
    const alertContainer = document.getElementById('alerts-container');
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `<div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline flex-shrink-0 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"/></svg>
                            <span class="sr-only">Info</span>
                            <div>
                                <span class="font-medium">Success! Artist updated successfully.</span>
                            </div>
                            </div>`;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// Clear the inputs after closing the modal
watchEffect(() => {
    if (!showAddArtistModal.value) {
        newArtist.value = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            bio: '',
            website: '',
        }
        errors.value = {};
    }
});

const showDeleteConfirmationModal = ref(false);

const artistToDelete = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
})

const confirmDelete = (artist) => {
    artistToDelete.value = artist,
    showDeleteConfirmationModal.value = true;
}

const message = ref('');

const handleDeleteArtist = async () => {
    try {
        const response = await axios.delete(`http://localhost:8000/api/v1/artists/${artistToDelete.value.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showDeleteConfirmationModal.value = false;
        getArtists();
        showDeleteAlert();
    } catch (error) {
        if (error.response.status === 400) {
            message.value = error.response.data.message;
        } else {
            errors.value = error.response.data.errors;
        }
        console.log(errors.value);
        console.log(message.value);
    }
}

watchEffect(() => {
    if (!showDeleteConfirmationModal.value) {
        message.value = '';
    }
})

const showEditArtistModal = ref(false);

const artistToEdit = ref({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
})

const editArtist = (artist) => {
    artistToEdit.value = artist;
    showEditArtistModal.value = true;
}

const handleEditArtist = async () => {
    try {
        const response = await axios.put(`http://localhost:8000/api/v1/artists/${artistToEdit.value.id}`, artistToEdit.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showEditArtistModal.value = false;
        getArtists();
        showEditAlert();
    } catch (error) {
        if (error.response && error.response.data) {
            errors.value = error.response.data.errors;
            console.log(error.response.data.errors);
        } else {
            console.log(error);
        }
    }
}

// Clear the inputs after closing the modal
watchEffect(() => {
    if (!showEditArtistModal.value) {
        artistToEdit.value = {
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            bio: '',
            website: '',
        }
        errors.value = {};
    }
});

const reloadPageOnEdit = () => {
    showEditArtistModal.value = false;
    getArtists();
}

const searchQuery = ref('');

const filtredArtists = computed(() => {
    return artists.value.filter(artist => {
        return artist.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            artist.last_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    })
})

const showViewArtistModal = ref(false);

const artistToView = ref({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
})

const viewArtist = (artist) => {
    artistToView.value = artist;
    showViewArtistModal.value = true;
}
</script>

<template>
    <section
        class="w-full min-h-screen font-sans text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white flex transition-all duration-500 ease-in-out">
        <div id="alerts-container" class="absolute top-8 right-8 z-50">
                <!-- alerts will be dynamically added here -->
        </div>
        <aside class="py-6 px-10 w-72 border-r border-gray-200 dark:border-gray-600">
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
                        Manage your artists
                    </h1>
                    <p class="text-gray-500 text-sm font-medium">
                        You can add, edit, and delete artists here.
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
                    <button @click="addArtist" class="flex items-center justify-center gap-x-2 bg-blue-500 py-2 px-4 hover:bg-blue-600 transition-colors rounded-lg">
                        <Icon icon="mdi:account-plus" width="22" color="white" />
                        <span class="font-normal text-white">Add Artist</span>
                    </button>
                </div>

                <Modal v-model:show="showAddArtistModal" title="Add Artist" @close="showAddArtistModal = false">
                    <template #header>
                        <div class="flex items-center justify-center">
                            <Icon icon="mdi:account-plus" width="22" />
                            <h1 class="text-md font-semibold leading-relaxed ml-3">Add a new artist</h1>
                        </div>
                    </template>

                    <template #body>
                        <div class="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label for="firstname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                                <input type="text" v-model="newArtist.first_name" name="firstname" id="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type first name">
                                <p v-if="errors.first_name" class="text-red-500 text-sm font-bold mt-2">{{ errors.first_name[0] }}</p>
                            </div>
                            <div>
                                <label for="lastname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                                <input type="text" v-model="newArtist.last_name" name="lastname" id="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type last name">
                                <p v-if="errors.last_name" class="text-red-500 text-sm font-bold mt-2">{{ errors.last_name[0] }}</p>
                            </div>
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="text" v-model="newArtist.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type email">
                                <p v-if="errors.email" class="text-red-500 text-sm font-bold mt-2">{{ errors.email[0] }}</p>
                            </div>
                            <div>
                                <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                                <input type="text" v-model="newArtist.phone" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type phone number">
                                <p v-if="errors.phone" class="text-red-500 text-sm font-bold mt-2">{{ errors.phone[0] }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-y-1 mb-4">
                            <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website</label>
                            <input type="text" v-model="newArtist.website" name="website" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type website">
                            <span v-if="errors.website" class="text-red-500 text-sm font-bold mt-1">{{ errors.website[0] }}</span>
                        </div>
                        <div class="flex flex-col gap-y-1">
                            <label for="bio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                            <textarea v-model="newArtist.bio" id="bio" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" rows="5" placeholder="Type bio"></textarea>
                            <span v-if="errors.bio" class="text-red-500 text-sm font-bold mt-1">{{ errors.bio[0] }}</span>
                        </div>
                    </template>

                    <template #footer>
                        <button @click="showAddArtistModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                        <button @click="handleAddArtist" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Add</button>
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
            
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-200 dark:bg-gray-800">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                        </th>
                        <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bio
                        </th> -->
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Website
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registred At
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            View
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Edit
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delete
                        </th>
                    </tr>
                </thead>

                <tr v-for="artist in filtredArtists" :key="artist.id" class="border-b border-gray-200 dark:border-gray-600">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ artist.first_name }} {{ artist.last_name }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ artist.email }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ artist.phone }}
                        </div>
                    </td>
                    <!-- <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-500">
                            {{ artist.bio.slice(0, 25) }}...
                        </div>
                    </td> -->
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ artist.website.slice(0, 8) === 'https://' ? artist.website.slice(8) : artist.website }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ moment(artist.created_at).format('MMMM DD, YYYY') }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button @click="viewArtist(artist)" class="text-gray-500 hover:text-gray-600 transition-colors">
                            <Icon icon="ph:eye-duotone" width="25" />
                        </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button @click="editArtist(artist)" class="text-blue-500 hover:text-blue-600 transition-colors">
                            <Icon icon="ph:note-pencil-duotone" width="25" />
                        </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button @click="confirmDelete(artist)" class="text-red-500 hover:text-red-600 transition-colors">
                            <Icon icon="ph:trash-duotone" width="25" />
                        </button>
                    </td>
                </tr>
            </table>
        </main>

        <Modal v-model:show="showDeleteConfirmationModal" title="Delete Artist" @close="showDeleteConfirmationModal = false">
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
                    Are you sure you want to delete this artist?
                </p>
                <p v-if="message" class="text-red-500 text-sm font-medium mt-1">
                    <span class="font-bold">Error ! {{ message }}</span> 
                </p>
            </template>
            <template #footer>
                <button @click="showDeleteConfirmationModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                <button @click="handleDeleteArtist" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" :class="{ 'hidden' : message }">Delete</button>
            </template>
        </Modal>
        
        <Modal v-model:show="showEditArtistModal" @close="showEditArtistModal = false">
            <template #header>
                <div class="flex items-center justify-center">
                    <Icon icon="mdi:account-edit" width="25" />
                    <h1 class="text-md font-semibold leading-relaxed ml-3">
                        Edit Artist
                    </h1>
                </div>
            </template>

            <template #body>
                <div class="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label for="firstname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                        <input type="text" v-model="artistToEdit.first_name" name="firstname" id="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type first name">
                        <p v-if="errors.first_name" class="text-red-500 text-sm font-bold mt-2">{{ errors.first_name[0] }}</p>
                    </div>
                    <div>
                        <label for="lastname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                        <input type="text" v-model="artistToEdit.last_name" name="lastname" id="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type last name">
                        <p v-if="errors.last_name" class="text-red-500 text-sm font-bold mt-2">{{ errors.last_name[0] }}</p>
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="text" v-model="artistToEdit.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type email">
                        <p v-if="errors.email" class="text-red-500 text-sm font-bold mt-2">{{ errors.email[0] }}</p>
                    </div>
                    <div>
                        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                        <input type="text" v-model="artistToEdit.phone" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type phone number">
                        <p v-if="errors.phone" class="text-red-500 text-sm font-bold mt-2">{{ errors.phone[0] }}</p>
                    </div>
                </div>
                <div class="flex flex-col gap-y-1 mb-4">
                    <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website</label>
                    <input type="text" v-model="artistToEdit.website" name="website" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type website">
                    <span v-if="errors.website" class="text-red-500 text-sm font-bold mt-1">{{ errors.website[0] }}</span>
                </div>
                <div class="flex flex-col gap-y-1">
                    <label for="bio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                    <textarea v-model="artistToEdit.bio" id="bio" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" rows="5" placeholder="Type bio"></textarea>
                    <span v-if="errors.bio" class="text-red-500 text-sm font-bold mt-1">{{ errors.bio[0] }}</span>
                </div>
            </template>

            <template #footer>
                <button @click="reloadPageOnEdit" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                <button @click="handleEditArtist" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Edit</button>
            </template>
        </Modal>

        <Modal v-model:show="showViewArtistModal" @close="showViewArtistModal = false">
            <template #header>
                <div class="flex items-center justify-center">
                    <Icon icon="ph:eye-duotone" width="25" class="text-gray-500" />
                    <h1 class="text-md font-semibold leading-relaxed ml-3">
                        View Artist
                    </h1>
                </div>
            </template>

            <template #body>
                <div class="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label for="firstname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                        <input type="text" v-model="artistToView.first_name" name="firstname" id="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type first name" disabled>
                    </div>
                    <div>
                        <label for="lastname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                        <input type="text" v-model="artistToView.last_name" name="lastname" id="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type last name" disabled>
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="text" v-model="artistToView.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type email" disabled>
                    </div>
                    <div>
                        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                        <input type="text" v-model="artistToView.phone" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type phone number" disabled>
                    </div>
                </div>
                <div class="flex flex-col gap-y-1 mb-4">
                    <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website</label>
                    <input type="text" v-model="artistToView.website" name="website" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type website" disabled>
                </div>
                <div class="flex flex-col gap-y-1">
                    <label for="bio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                    <textarea v-model="artistToView.bio" id="bio" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" rows="5" placeholder="Type bio" disabled></textarea>
                </div>
            </template>

            <template #footer>
                <button @click="showViewArtistModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Close</button>
            </template>
        </Modal>
    </section>
</template>