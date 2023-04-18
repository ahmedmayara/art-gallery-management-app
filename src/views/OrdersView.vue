<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Modal from '../components/Modal.vue';

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

const isVisibile = ref(false);

const toggleDropdown = () => {
    isVisibile.value = !isVisibile.value;
}

const orders = ref([]);

const getOrders = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/v1/orders', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        orders.value = response.data.data;
        console.log(response);
    } catch (error) {
        if (error.response && error.response.data) {
            console.log(error.response.data.errors);
        } else {
            console.log(error);
        }
    }
}

const approveOrder = async ( orderId ) => {
    try {
        const response = await axios.put(`http://localhost:8000/api/v1/orders/${orderId}/approve`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        getOrders();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const rejectOrder = async ( orderId ) => {
    try {
        const response = await axios.put(`http://localhost:8000/api/v1/orders/${orderId}/reject`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        getOrders();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getOrders();
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
                    <h1 class="text-2xl font-semibold leading-relaxed">
                        Manage your orders
                    </h1>
                    <p class="text-gray-500 text-sm font-medium">
                        You can approve or reject orders here.
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

            <table class="w-full">
                <thead>
                    <tr class="bg-gray-200 dark:bg-gray-800">
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Artboard Title
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Name
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Phone
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Made At
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tr v-for="order in orders" :key="order.id" class="border-b border-gray-200 dark:border-gray-600">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500 flex justify-center items-center">
                            000{{ order.id }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500 flex justify-center items-center">
                            {{ order.artboard.title }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500 flex justify-center items-center">
                            {{ order.customer.first_name }} {{ order.customer.last_name }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500 flex justify-center items-center">
                            {{ order.customer.phone }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-md text-gray-900 dark:text-gray-500 flex justify-center items-center">
                            <div v-if="order.status === 'Pending'">
                                <span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                    {{ order.status }}
                                </span>
                            </div>
                            <div v-else-if="order.status === 'Approved'">
                                <span class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    {{ order.status }}
                                </span>
                            </div>
                            <div v-else-if="order.status === 'Rejected'">
                                <span class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    {{ order.status }}
                                </span>
                            </div> 
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-md text-gray-900 dark:text-gray-500">
                            {{ moment(order.created_at).format('MMMM DD, YYYY') }}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div class="flex justify-center">
                            <button :class="{ 'opacity-50 cursor-not-allowed' : order.status === 'Approved' }" @click="approveOrder(order.id)" class="outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 font-medium rounded-lg text-sm px-2.5 py-1.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700">
                                <Icon icon="mdi:check-bold" width="25" />
                            </button>
                            <button :class="{ 'opacity-50 cursor-not-allowed' : order.status === 'Rejected' }" @click="rejectOrder(order.id)" class="outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700">
                                <Icon icon="mdi:close-thick" width="25" />
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
        </main>
    </section>
</template>