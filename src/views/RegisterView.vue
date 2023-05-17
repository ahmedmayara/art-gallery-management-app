<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

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
    role: 'customer'
});

const handleRegister = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/register', form.value);
        console.log(response);
        
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_id', JSON.stringify(response.data.user.id));

        if (response.data.user.role === 'admin') {
            router.push('/dashboard');
        } else {
            router.push('/buy');
        }

    } catch (error) {
        console.log(error);
        errors.value = error.response.data.errors;
    }
}
</script>

<template>
<section class="relative w-full h-screen flex-col dark:bg-gray-900 dark:text-white text-gray-900 items-center justify-center grid lg:grid-cols-2 px-0">
    <div class="relative order-last hidden h-screen flex-col bg-muted p-10 text-white dark:border-l border-gray-600 lg:flex">
      <div class="absolute inset-0 bg-cover">
        <img src="../assets/img/bg-register.jpg" alt="">
      </div>
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-6 w-6"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path></svg>
        <span>
          Create an account to get started
        </span>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2"><p class="text-lg">“The art gallery management application was incredibly user-friendly and intuitive, making it easy for us to manage our inventory, sales, and customer relationships all in one place.”</p>
          <footer class="text-sm">
            Jack Smith
          </footer>
        </blockquote>
      </div>
    </div>
    <RouterLink to="/" class="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ease-in-out duration-500 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 px-3 absolute top-4 left-4 md:top-8 md:left-8" href="/">
      <Icon icon="ion:chevron-back" class="w-4 h-4" />
      <span class="mx-2">Back</span>
    </RouterLink>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Your best work starts here, let's get you set up.
          </p>
      </div>
      <div class="grid gap-6">
        <form autocomplete="off" @submit.prevent="handleRegister">
          <div class="grid gap-2">
            <div class="grid gap-1">
              <label for="firstname" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your Firstname</label>
              <input type="text" v-model="form.first_name" name="firstname" id="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Enter your firstname">
              <span v-if="errors.first_name" class="text-red-500 text-sm font-bold mt-2">{{ errors.first_name[0] }}</span>
            </div>
            <div class="grid gap-1">
              <label for="lastname" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your Lastname</label>
              <input type="text" v-model="form.last_name" name="lastname" id="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Enter your lastname">
              <span v-if="errors.last_name" class="text-red-500 text-sm font-bold mt-2">{{ errors.last_name[0] }}</span>
            </div>
            <div class="grid gap-1">
              <label for="phone" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your Phone Number</label>
              <input type="text" v-model="form.phone" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Enter your phone number">
              <span v-if="errors.phone" class="text-red-500 text-sm font-bold mt-2">{{ errors.phone[0] }}</span>
            </div>
            <div class="grid gap-1">
              <label for="email" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="text" v-model="form.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="name@example.com">
              <span v-if="errors.email" class="text-red-500 text-sm font-bold mt-2">{{ errors.email[0] }}</span>
            </div>
            <div class="grid gap-1">
              <label for="password" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
              <input type="password" v-model="form.password" name="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="••••••••">
              <span v-if="errors.password" class="text-red-500 text-sm font-bold mt-2">{{ errors.password[0] }}</span>
            </div>
            <div class="grid gap-1 mt-3">
              <button type="submit" class="inline-flex ease-in-out duration-500 items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none text-white ring-offset-background bg-blue-500 hover:bg-blue-600 transition-colors h-10 py-2 px-4">
                <span class="mr-2">Create an account</span>
                <Icon icon="ion:chevron-forward" class="w-4 h-4" />
              </button>
              <button class="w-full mt-3 md:hidden block text-white bg-slate-500 hover:bg-slate-600 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors">Go back</button>
            </div>
            <div class="mt-2">
              <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?
                <RouterLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Log in
                </RouterLink>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  </section>
</template>

<style scoped>
.bg-cover {
    height: 100vh;
}
.bg-cover img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>