<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import MingcuteLoadingFill from '~icons/mingcute/loading-fill'

const router = useRouter();

const email = ref('');
const password = ref('');
const errors = ref([]);
const message = ref('');

const login = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/login', {
            email: email.value,
            password: password.value
        });
        
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        router.push('/dashboard');
        console.log(response);
    } catch (error) {
        if (error.response.status === 401) {
            message.value = error.response.data.message;
        } else {
            errors.value = error.response.data.errors;
        }
        console.log(errors.value);
    }
}

const isLoading = ref(false);

const handleLogin = async() => {
  isLoading.value = true;
  await login();
  isLoading.value = false
}

const isDark = useDark()
const toggleDark = useToggle(isDark)

</script>

<template>
      <section class="relative w-full h-screen flex-col dark:bg-gray-900 dark:text-white text-gray-900 items-center justify-center grid lg:grid-cols-2 px-0">
    <RouterLink to="/" class="hidden md:inline-flex items-center dark:hover:bg-gray-800 justify-center text-sm font-medium transition-colors ease-in-out duration-500 hover:bg-gray-100 h-9 px-3 rounded-md absolute right-4 top-4 md:right-8 md:top-8">
      <Icon icon="ion:chevron-back" class="w-4 h-4" />
      <span class="mx-2">Back</span>
    </RouterLink>
    <div class="relative hidden h-screen flex-col bg-muted p-10 text-white dark:border-r border-gray-600 lg:flex">
      <div class="absolute inset-0 bg-cover">
        <img src="../assets/img/bg-login.jpg" alt="">
      </div>
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-6 w-6"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path></svg>
        <span>
          Log in to your account
        </span>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2"><p class="text-lg">“The art gallery management application was a game-changer for our business. It streamlined our operations and allowed us to focus on what really matters.”</p>
          <footer class="text-sm">
            Sofia Davis
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Please enter your credentials to continue.
          </p>
      </div>
      <div class="grid gap-6">
        <form autocomplete="off" @submit.prevent="handleLogin">
          <div class="grid gap-2">
            <div class="grid gap-1">
              <label for="email" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="text" v-model="email" name="email" id="email" class="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="name@example.com">
              <span v-if="errors.email" class="text-red-500 text-sm font-bold mt-2">{{ errors.email[0] }}</span>
              <span v-if="message" class="text-red-500 text-sm font-bold mt-2">{{ message }}</span>
            </div>
            <div class="grid gap-1">
              <label for="password" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
              <input type="password" v-model="password" name="password" id="password" class="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="••••••••">
              <span v-if="errors.password" class="text-red-500 text-sm font-bold mt-2">{{ errors.password[0] }}</span>
            </div>
            <div class="grid gap-1 mt-3">
              <button :class="{ 'cursor-not-allowed opacity-50' : isLoading }" type="submit" class="inline-flex ease-in-out duration-500 items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none text-white ring-offset-background bg-blue-500 hover:bg-blue-600 transition-colors h-10 py-2 px-4">
                <MingcuteLoadingFill v-show="isLoading" class="animate-spin" />
                <span :class="{ 'hidden' : isLoading }">Login</span>
              </button>
              <RouterLink to="/" class="w-full mt-3 ease-in-out duration-500 md:hidden block text-white bg-slate-500 hover:bg-slate-600 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors">Go back</RouterLink>
            </div>
            <div class="mt-2">
              <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Don’t have an account yet? 
                <RouterLink to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Sign up
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
