<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const isDark = useDark()
const toggleDark = useToggle(isDark)
const errors = ref([]);

const router = useRouter();

const form = ref({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
});

const handleRegister = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/register', form.value);
        console.log(response);
        router.push('/login');
    } catch (error) {
        console.log(error);
        errors.value = error.response.data.errors;
    }
}
</script>

<template>
    <section
        class="font-sans w-full min-h-screen text-gray-900 flex justify-center items-center dark:bg-gray-900 bg-slate-200">
        <div
            class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-700 dark:border-gray-600">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-xl font-bold text-center leading-tight tracking-tight text-gray-500 md:text-2xl dark:text-white">
                    Register for an account
                </h1>
                <form class="space-y-4 md:space-y-6" autocomplete="off" @submit.prevent="handleRegister">
                    <div>
                        <label for="firstname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                            Name</label>
                        <input v-model="form.first_name" type="text" name="first_name" id="first_name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your first name">
                        <span>
                            <p v-if="errors.first_name" class="text-sm text-red-500 font-bold mt-2">
                                {{ errors.first_name[0] }}
                            </p>
                        </span>
                    </div>
                    <div>
                        <label for="lastname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                            Name</label>
                        <input v-model="form.last_name" type="text" name="last_name" id="last_name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your last name">
                        <span>
                            <p v-if="errors.last_name" class="text-sm text-red-500 font-bold mt-2">
                                {{ errors.last_name[0] }}
                            </p>
                        </span>
                    </div>
                    <div>
                        <label for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input v-model="form.email" type="text" name="email" id="email"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@example.com">
                        <span>
                            <p v-if="errors.email" class="text-sm text-red-500 font-bold mt-2">
                                {{ errors.email[0] }}
                            </p>
                        </span>
                    </div>
                    <div>
                        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone
                            Number</label>
                        <input v-model="form.phone" type="text" name="phone" id="phone"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your phone number">
                        <span>
                            <p v-if="errors.phone" class="text-sm text-red-500 font-bold mt-2">
                                {{ errors.phone[0] }}
                            </p>
                        </span>
                    </div>
                    <div>
                        <label for="password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input v-model="form.password" type="password" name="password" id="password" placeholder="••••••••"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <span>
                        <p v-if="errors.password" class="text-sm text-red-500 font-bold mt-2">
                            {{ errors.password[0] }}
                        </p>
                    </span>
                </div>
                <div class="flex flex-col gap-y-2">
                    <button type="submit" class="w-full text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                        Register
                    </button>
                    <RouterLink to="/" class="w-full text-white bg-slate-500 hover:bg-slate-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                        Go back
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</section>
</template>