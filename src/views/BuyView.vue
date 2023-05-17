<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';
import Toast from '../components/Toast.vue';
import MdiCheck from '~icons/mdi/check'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';

const user = computed(() => {
    return JSON.parse(localStorage.getItem('user'));
});

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
};

const handleLogout = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/logout', null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
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

const handleMakeOrder = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/orders', form.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const isLoading = ref(false);

const getArtboards = async () => {
    isLoading.value = true;
    await getAllArtboards();
    isLoading.value = false;
}

const artboards = ref([]);

const searchQuery = ref('');

const filtredArtboards = computed(() => {
    return artboards.value.filter(artboard => artboard.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

onMounted(() => {
    getArtboards();
    localStorage.setItem('cart', JSON.stringify(cart.value));
});

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

const cart = ref([]);

const addToCart = (artboard) => {
    cart.value.push(artboard);
    localStorage.setItem('cart', JSON.stringify(cart.value));
    console.log(cart.value);
};

const removeFromCart = (artboard) => {
    cart.value = cart.value.filter(item => item.id !== artboard.id);
    form.value.artboards = cart.value;
    localStorage.setItem('cart', JSON.stringify(cart.value));
    console.log(cart.value);
};

const total = computed(() => {
    let total = 0;
    cart.value.forEach(artboard => {
        total += artboard.price;
    });
    console.log(total);
    return total;
});

const form = ref({
    user_id: localStorage.getItem('user_id'),
    artboards: cart.value,
    total: total
});

const showLogoutConfirmationModal = ref(false);

const confirmLogout = () => {
    showLogoutConfirmationModal.value = true;
};

const showSuccessToaster = ref(false);

const showLoadingToaster = ref(false);

const handleOrder = async () => {
    showLoadingToaster.value = true;
    await handleMakeOrder();
    setTimeout(() => {
        showLoadingToaster.value = false;
        showSuccessToaster.value = true;
    }, 3500);
    cart.value = [];
    localStorage.setItem('cart', JSON.stringify(cart.value));
    form.value.artboards = cart.value;
};
</script>

<template>
    <div class="w-full bg-slate-200 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-500 ease-in-out">
        <Toast :show="showLoadingToaster" :loading="true" message="Please wait while we proccess your order..." variant="transparent" />
        <Toast :show="showSuccessToaster" @close="showSuccessToaster = false" :icon="MdiCheck" message="Your order has been placed successfully!" variant="success" />
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
                    <div class="flex items-center space-x-4">
                        <div class="relative cursor-pointer inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600">
                            <span class="font-medium text-sm text-gray-600 dark:text-gray-300">
                                {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
                            </span>
                        </div>
                        <button class="ml-4" @click="toggleDark()">
                            <Icon :icon="isDark ? 'ph:sun-duotone' : 'ph:moon-duotone'" class="w-6 h-6" :class="isDark ? 'text-white' : 'text-gray-500'" />
                        </button>
                            <Menu as="div" class="relative inline-block text-left">
                                <MenuButton class="flex flex-row">
                                    <Icon icon="ph:shopping-cart-simple-duotone" class="w-6 h-6" :class="isDark ? 'text-white' : 'text-gray-500'" />
                                    <div v-if="cart.length > 0" class="w-4 h-4 bg-red-500 rounded-full relative right-2 bottom-0.5">
                                        <p v-if="cart.length <= 9" class="text-xxs text-white text-center">{{ cart.length }}</p>
                                        <p v-else class="text-xxs text-white text-center">9+</p>
                                    </div>
                                </MenuButton>
                                <Transition 
                                    enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95"
                                >
                                    <MenuItems :class="{ 'absolute right-5 z-50 w-72 md:w-96 mt-2 top-6 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg outline-none' : cart.length > 0 }" class="absolute right-1 z-50 w-64 md:w-96 mt-2 top-6 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg outline-none">
                                        <div class="px-4 py-2">
                                            <p class="text-sm leading-5 text-center">
                                                Cart
                                            </p>
                                        </div>

                                        <div v-for="item in cart" class="px-4 py-2 flex flex-row items-center">
                                            <div>
                                                <img :src="item.image" class="w-12 h-12 rounded-md object-cover" alt="Artboard">
                                            </div>
                                            <div class="flex flex-col ml-3 space-y-1">
                                                <p class="text-sm text-gray-900 dark:text-white">
                                                    {{ item.title }}
                                                </p>
                                                <p class="text-sm text-gray-900 dark:text-white">
                                                    ${{ item.price }}
                                                </p>
                                            </div>

                                            <div class="flex flex-col ml-auto">
                                                <button @click="removeFromCart(item)" class="text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 dark:text-gray-400 dark:border-gray-600">
                                                    <Icon icon="ph:x" class="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div class="px-4 py-2 flex flex-col">
                                            <p v-if="cart.length > 0"  class="text-sm text-right text-gray-900 dark:text-white mt-2 mb-2">
                                                Total : <span class="font-semibold">
                                                    ${{ cart.reduce((total, item) => total + item.price, 0) }}
                                                </span>
                                            </p>

                                            <p v-else class="text-sm text-center text-gray-900 dark:text-white my-3">
                                                Your cart is empty
                                            </p>

                                            <div class="flex flex-row my-2">
                                                <button :class="{ 'opacity-25 dark:opacity-50 cursor-not-allowed' : cart.length === 0 }" @click="cart = []" class="w-full text-white bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600">
                                                    Clear Cart
                                                </button>
                                                <button @click="handleOrder" :class="{ 'opacity-25 dark:opacity-50 cursor-not-allowed' : cart.length === 0 }" class="w-full text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 ml-2">
                                                    Checkout
                                                </button>
                                            </div>
                                        </div>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                            <button @click="confirmLogout" :class="{ 'relative right-2' : cart.length > 0 }">
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
                <span v-if="(isLoading === false && filtredArtboards.length === 0)" class="text-center text-3xl text-gray-900 dark:text-gray-500 font-bold pt-5">Nothing found.</span>
            </div>

            <div v-if="isLoading" class="flex justify-center items-center">
                <Icon icon="mingcute:loading-fill" class="w-12 h-12 my-6 animate-spin text-gray-900 dark:text-gray-500" />
            </div>
            <div class="columns-1 md:columns-3 gap-x-8 pt-2"> 
                <figure class="py-4 [break-inside:avoid]" v-for="artboard in filtredArtboards" :key="artboard.id">
                    <div class="relative">
                        <img :src="artboard.image" alt="artboard" class="rounded-lg">
                        <div class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity items-center justify-center flex cursor-pointer rounded-lg">
                            <div @click="addToCart(artboard)" class="text-white">
                                <Icon icon="ph:heart-straight-fill" class="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <div v-if="cart.includes(artboard)" class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity items-center justify-center flex cursor-pointer rounded-lg">
                            <div class="text-white">
                                <p class="text-2xl font-semibold">Added to cart</p>
                            </div>
                        </div>
                    </div>
                    <figcaption class="mt-3 text-gray-800 dark:text-gray-200">
                        <h2 class="text-2xl font-semibold mt-1">{{ artboard.title }}</h2>
                        <p class="text-sm mt-1 line-clamp-2">Made by : <span class="font-bold cursor-pointer hover:underline">{{ artboard.artist.first_name }} {{ artboard.artist.last_name }}</span></p>
                        <p class="text-sm mt-1 line-clamp-2">Price : <span class="font-semibold">{{ artboard.price }} $</span></p>
                        <p class="text-sm mt-1 line-clamp-2">Category : <span class="font-semibold">{{ artboard.category.name }}</span></p>
                    </figcaption>
                </figure>
            </div>
        </main>

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
</template>