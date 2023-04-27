<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Modal from '../components/Modal.vue';
import useCategories from '../composables/Categories.js';

const { categories, getCategories, meta, goToPage } = useCategories();

onMounted(() => {
    getCategories();
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

const showAddCategoryModal = ref(false);

const addCategory = () => {
    showAddCategoryModal.value = true;
}

const newCategory = ref({
    name: '',
    description: '',
});

const errors = ref({});

const handleAddCategory = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/categories', newCategory.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showAddCategoryModal.value = false;
        getCategories();
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
                                <span class="font-medium">Success! Category added successfully.</span>
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
                                <span class="font-medium">Success! Category deleted successfully.</span>
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
                                <span class="font-medium">Success! Category updated successfully.</span>
                            </div>
                            </div>`;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

const showDeleteConfirmationModal = ref(false);

const categoryToDelete = ref({
    id: '',
    name: '',
});

const confirmDelete = (category) => {
    categoryToDelete.value = category;
    showDeleteConfirmationModal.value = true;
}

const message = ref('');

const handleDeleteCategory = async () => {
    try {
        const response = await axios.delete(`http://localhost:8000/api/v1/categories/${categoryToDelete.value.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showDeleteConfirmationModal.value = false;
        getCategories();
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

// Clear the input fields when the add modal is closed
watchEffect(() => {
    if (!showAddCategoryModal.value) {
        newCategory.value = {
            name: '',
            description: '',
        }
        errors.value = {};
    }
})

const showEditCategoryModal = ref(false);

const categoryToEdit = ref({
    id: '',
    name: '',
    description: '',
});

const confirmEdit = (category) => {
    categoryToEdit.value = category;
    showEditCategoryModal.value = true;
}

const handleEditCategory = async () => {
    try {
        const response = await axios.put(`http://localhost:8000/api/v1/categories/${categoryToEdit.value.id}`, categoryToEdit.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response);
        showEditCategoryModal.value = false;
        getCategories(meta.value.current_page);
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

// Clear the input fields when the edit modal is closed
watchEffect(() => {
    if (!showEditCategoryModal.value) {
        categoryToEdit.value = {
            id: '',
            name: '',
            description: '',
        }
        errors.value = {};
    }
})

const reloadPageOnEdit = () => {
    showEditCategoryModal.value = false;
    getCategories(meta.value.current_page);
}

const searchQuery = ref('');

const filtredCategories = computed(() => {
    return categories.value.filter(category => category.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
})

const showReadModal = ref(false);

const categoryToRead = ref({
    id: '',
    name: '',
    description: '',
});

const confirmRead = (category) => {
    categoryToRead.value = category;
    showReadModal.value = true;
}
</script>

<template>
    
    <section
        class="w-full min-h-screen font-sans text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white flex transition-all duration-500 ease-in-out">
        <div id="alerts-container" class="absolute top-8 right-8 z-50">
                <!-- alerts will be dynamically added here -->
        </div>
        <aside class="py-6 w-72 border-r border-gray-200 dark:border-gray-600">
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
            <ul class="flex flex-col gap-y-6 pt-12 ml-4 px-10">
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
                        Manage your categories
                    </h1>
                    <p class="text-gray-500 text-sm font-medium">
                        You can add, edit, and delete categories here.
                    </p>
                </div>
                <form class="flex items-center" autocomplete="off">   
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-96">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon icon="ph:magnifying-glass-duotone" class="w-5 h-5 text-gray-400" />
                        </div>
                        <input v-model="searchQuery" type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Search">
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
                    <button @click="addCategory" class="flex items-center justify-center gap-x-2 bg-blue-500 py-2 px-4 hover:bg-blue-600 transition-colors rounded-lg">
                        <Icon icon="mdi:content-save-plus" width="22" color="white" />
                        <span class="font-normal text-white">Add Category</span>
                    </button>
                </div>

                    <Modal v-model:show="showAddCategoryModal" title="Add Category" @close="showAddCategoryModal = false">
                        <template #header>
                            <div class="flex items-center justify-center">
                                <Icon icon="mdi:content-save-plus" width="22" />
                                <h1 class="text-md font-semibold leading-relaxed ml-3">Add a new category</h1>
                            </div>
                        </template>
                        <template #body>
                            <div class="flex flex-col gap-y-4">
                                <div class="flex flex-col gap-y-1">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                    <input v-model="newCategory.name" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Type a category name" />
                                    <span v-if="errors.name" class="text-red-500 text-sm font-bold mt-1">{{ errors.name[0] }}</span>
                                </div>
                                <div class="flex flex-col gap-y-1">
                                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <textarea v-model="newCategory.description" id="description" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" rows="5" placeholder="Type a small description about this category"></textarea>
                                    <span v-if="errors.description" class="text-red-500 text-sm font-bold mt-1">{{ errors.description[0] }}</span>
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <button @click="showAddCategoryModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                            <button @click="handleAddCategory" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Add</button>
                        </template>
                    </Modal>
                    
                    <Modal v-model:show="showLogoutConfirmationModal" title="Logout Confirmation" @close="showLogoutConfirmationModal = false">
                        <template #header>
                            <div class="flex items-center justify-center">
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
                            Description
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
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
                <tr v-for="category in filtredCategories" :key="category.id" class="border-b border-gray-200 dark:border-gray-600">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ category.name }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ category.description.slice(0, 50) }}...
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ moment(category.created_at).format('MMMM DD, YYYY') }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button @click="confirmRead(category)" class="text-gray-500 hover:text-gray-600 transition-colors">
                            <Icon icon="ph:eye-duotone" width="25" />
                        </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button @click="confirmEdit(category)" class="text-blue-500 hover:text-blue-600 transition-colors">
                            <Icon icon="ph:note-pencil-duotone" width="25" />
                        </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button @click="confirmDelete(category)" class="text-red-500 hover:text-red-600 transition-colors">
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
                    Are you sure you want to delete this category?
                </p>
                <p v-if="message" class="text-red-500 text-sm font-medium mt-1">
                    <span class="font-bold">Error ! {{ message }}</span> 
                </p>
            </template>
            <template #footer>
                <button @click="showDeleteConfirmationModal = false" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                <button @click="handleDeleteCategory" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" :class="{ 'hidden' : message }">Delete</button>
            </template>
        </Modal>

        <Modal v-model:show="showEditCategoryModal" @close="showEditCategoryModal = false">
            <template #header>
                <div class="flex items-center justify-center">
                    <Icon icon="ph:note-pencil-duotone" width="25" />
                    <h1 class="text-md font-semibold leading-relaxed ml-3">
                        Edit Category
                    </h1>
                </div>
            </template>
            <template #body>
                <div class="flex flex-col">
                    <div class="flex flex-col mb-4">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="name">Name</label>
                        <input v-model="categoryToEdit.name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" type="text" name="name" id="name" placeholder="Name">
                        <p v-if="errors.name" class="text-red-500 text-sm font-bold mt-2">{{ errors.name[0] }}</p>
                    </div>
                    <div class="flex flex-col mb-4">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="description">Description</label>
                        <textarea v-model="categoryToEdit.description" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Description" rows="5"></textarea>
                        <p v-if="errors.description" class="text-red-500 text-sm font-bold mt-2">{{ errors.description[0] }}</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <button @click="reloadPageOnEdit" class="px-4 ml-2 py-2 text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                <button @click="handleEditCategory" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Edit</button>
            </template>
        </Modal>

        <Modal v-model:show="showReadModal" @close="showReadModal = false">
            <template #header>
                <div class="flex items-center justify-center">
                    <Icon class="text-gray-500" icon="ph:eye-duotone" width="25" />
                    <h1 class="text-md font-semibold leading-relaxed ml-3">
                        View Category
                    </h1>
                </div>
            </template>

            <template #body>
                <div class="flex flex-col">
                    <div class="flex flex-col mb-4">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="name">Name</label>
                        <input v-model="categoryToRead.name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" type="text" name="name" id="name" placeholder="Name" disabled>
                    </div>
                    <div class="flex flex-col mb-4">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="description">Description</label>
                        <textarea v-model="categoryToRead.description" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Description" rows="5" disabled></textarea>
                    </div>
                </div>
            </template>

            <template #footer>
                <button @click="showReadModal = false" class="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors">Close</button>
            </template>
        </Modal>
    </section>
</template>