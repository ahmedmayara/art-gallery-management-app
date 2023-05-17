<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Modal from '../components/Modal.vue';
import Chart from 'chart.js/auto';
import useArtboards from '../composables/Artboards.js';
import useArtists from '../composables/Artists.js';
import useCategories from '../composables/Categories.js';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const { artists, getArtists, totalArtists } = useArtists();
const { getCategories, totalCategories } = useCategories();
const { latestArtboards, getLatestArtboards, totalArtboards, getArtboards } = useArtboards();

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

const orders = ref([]);

const approvedOrders = ref([]);
const pendingOrders = ref([]);
const rejectedOrders = ref([]);
const pendingOrdersValues = ref([]);

const getOrders = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/v1/orders', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        orders.value = response.data.data;
        approvedOrders.value = orders.value.filter(order => order.status === 'Approved').length;
        pendingOrders.value = orders.value.filter(order => order.status === 'Pending').length;
        rejectedOrders.value = orders.value.filter(order => order.status === 'Rejected').length;
        pendingOrdersValues.value = orders.value.filter(order => order.status === 'Pending');

    } catch (error) {
        if (error.response && error.response.data) {
            console.log(error.response.data.errors);
        } else {
            console.log(error);
        }
    }
}


onMounted(() => {
    getOrders();
    getArtists();
    getCategories();
    getLatestArtboards();
    getArtboards();

    Chart.defaults.font.family = 'Inter';
    Chart.defaults.plugins.legend.labels.padding = 10;
    
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [{
                label: 'Total Orders',
                data: [approvedOrders.value, pendingOrders.value, rejectedOrders.value],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Total Orders',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            }
        },

    });

    watch([approvedOrders, pendingOrders, rejectedOrders], () => {
        myChart.data.datasets[0].data = [approvedOrders.value, pendingOrders.value, rejectedOrders.value];
        myChart.update();
    });
})



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
                        <span>{{ item.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </aside>
        <main class="flex-1">
            <div class="flex items-center justify-between py-7 px-10 border-b border-gray-200 dark:border-gray-600">
                <div>
                    <h1 class="text-2xl font-semibold leading-relaxed">Dashboard</h1>
                    <p class="text-gray-500 text-sm font-medium">
                        Welcome back, {{ user.first_name }} {{ user.last_name }}!
                    </p>
                </div>
                <div class="flex gap-x-4">
                    <div class="lg:hidden cursor-pointer" @click="toggleDropdown">
                        <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                            <span class="font-medium text-md text-gray-600 dark:text-gray-300">
                                {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
                            </span>
                        </div>
                    </div>
                    <div v-if="isVisibile" class="absolute top-16 mt-4 w-32 bg-gray-200 rounded-md shadow-xl z-20 dark:bg-gray-700 p-5">
                        <ul>
                            <li v-for="item in sidebar">
                                <RouterLink :to="item.path" exact-active-class="text-blue-500" class="flex items-center py-0.5 hover:text-blue-500 transition-colors">
                                    <span>{{ item.name }}</span>
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                    <Menu>
                        <MenuButton>
                            <Icon icon="ph:bell-duotone" width="25" :class="isDark ? 'text-white' : 'text-gray-500'" />
                            <span class="absolute top-10 w-4 h-4 bg-red-500 rounded-full" style="right: 7.4rem;">
                                <p class="text-xs text-white text-center">{{ pendingOrders }}</p>
                            </span>
                        </MenuButton>
                        <Transition enter-active-class="transition ease-out duration-100 transform"
                                    enter-from-class="opacity-0 scale-95"
                                    enter-to-class="opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75 transform"
                                    leave-from-class="opacity-100 scale-100"
                                    leave-to-class="opacity-0 scale-95">
                            <MenuItems class="absolute right-32 w-56 mt-2 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg outline-none" style="top: 4.5rem; p-5">
                                <div class="px-4 py-2">
                                    <p class="text-sm leading-5 text-center">
                                        Pending Orders
                                    </p>
                                </div>
                                <div v-for="pendingOrder in pendingOrdersValues" class="px-4 py-2">
                                    <p class="text-xs text-gray-900 dark:text-white mt-2 mb-2">
                                        Order ID : <span class="font-semibold">#000{{ pendingOrder.id }}</span>
                                    </p>
                                    <p class="text-xs text-gray-900 dark:text-white mb-2">
                                        Made by : <span class="font-semibold">{{ pendingOrder.user.first_name }} {{ pendingOrder.user.last_name }}</span>
                                    </p>
                                    <p class="text-xs text-gray-900 dark:text-white mb-2">
                                        Status : <span class="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                            {{ pendingOrder.status  }}
                                        </span>
                                    </p>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>
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

            <div class="grid grid-cols-4 border-b border-gray-200 dark:border-gray-600">
                
                <div class="flex flex-col m-5 p-3 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex">
                            <Icon icon="ph:users-three-duotone" class="m-3" width="85" /> 
                        </div>
                        <div class="flex flex-col justify-end">
                            <h1 class="text-2xl font-semibold leading-relaxed mr-3">Total Artists</h1>
                            <div class="flex items-end justify-end mr-3">
                                <p class="text-gray-500 text-3xl font-medium">
                                    {{ artists.length }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col m-5 p-3 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex">
                            <Icon icon="ph:images-duotone" class="m-3" width="85" /> 
                        </div>
                        <div class="flex flex-col justify-end">
                            <h1 class="text-2xl font-semibold leading-relaxed mr-3">Total Artboards</h1>
                            <div class="flex items-end justify-end mr-3">
                                <p class="text-gray-500 text-3xl font-medium">
                                    {{ totalArtboards }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col m-5 p-3 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex">
                            <Icon icon="ph:list-bullets-duotone" class="m-3" width="85" /> 
                        </div>
                        <div class="flex flex-col justify-end">
                            <h1 class="text-2xl font-semibold leading-relaxed mr-3">Total Categories</h1>
                            <div class="flex items-end justify-end mr-3">
                                <p class="text-gray-500 text-3xl font-medium">
                                    {{ totalCategories }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col m-5 p-3 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex">
                            <Icon icon="ph:package-duotone" class="m-3" width="85" /> 
                        </div>
                        <div class="flex flex-col justify-end">
                            <h1 class="text-2xl font-semibold leading-relaxed mr-3">Total Orders</h1>
                            <div class="flex items-end justify-end mr-3">
                                <p class="text-gray-500 text-3xl font-medium">
                                    {{ orders.length }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row border-b border-gray-200 dark:border-gray-600">
                <div class="flex w-3/4 flex-col m-5 p-3 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <div class="flex flex-col items-center justify-center">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>

                <div class="flex flex-col m-5 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <img class="object-cover rounded-t-lg h-80" src="../assets/img/bg.jpg" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Manage your art gallery with ease
                        </h5>
                        <p class="mb-2 text-gray-700 dark:text-gray-300">
                            Artivity is a comprehensive art gallery management solution for you. It is a web application that allows you to manage your art gallery with ease. You can manage your artists, artboards, categories, orders, and more.
                        </p>
                    </div>
                </div>
                
                <div class="flex h-2/3 w-3/4 flex-col m-5 p-7 space-y-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-500 cursor-pointer">
                    <div class="flex items-center justify-between mb-4">
                        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Artboards</h5>
                        <RouterLink to="/artboards" class="text-sm font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 hover:underline dark:hover:text-blue-500 transition-colors">
                            View all
                        </RouterLink>
                    </div>
                    <div class="flow-root" style="height: 24.5rem;">
                        <ul v-for="artboard in latestArtboards" class="divide-y divide-gray-200 dark:divide-gray-700">
                            <li class="py-5">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <img class="w-10 h-10 rounded-2xl object-cover" :src="artboard.image">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {{ artboard.title }}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            Made by {{ artboard.artist.first_name }} {{ artboard.artist.last_name }}
                                        </p>
                                    </div>

                                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        {{ artboard.price }} $
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <footer class="flex items-center justify-between py-9 px-10">
                <div class="flex items-center flex-shrink-0 text-gray-800 mr-6 dark:text-white">
                    <img class="w-8 mr-2" src="../assets/img/logo.png" alt="Logo">
                    <span class="font-display text-xl tracking-tight">Artivity</span>
                </div>
                <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div class="text-sm lg:flex-grow">
                        <a href="#" class="block mt-4 lg:inline-block lg:mt-0 text-gray-800 dark:text-white mr-4">
                            Developed by <span class="font-bold">Ahmed Mayara</span> & <span class="font-bold">Taha Lammouchi</span>
                        </a>
                    </div>
                    <div>
                        <a href="#" class="inline-block text-sm px-4 py-2 leading-none text-gray-800 dark:text-white">
                            All rights reserved &#169; 2023
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    </section>
</template>