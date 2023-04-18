<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import axios from 'axios'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

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

const isDark = useDark()
const toggleDark = useToggle(isDark)

</script>

<template>
    <section class="font-sans w-full min-h-screen text-gray-900 flex justify-center items-center dark:bg-gray-900 bg-slate-200">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-700 dark:border-gray-600">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold text-center leading-tight tracking-tight text-gray-500 md:text-2xl dark:text-white">
                  Log in to your account
              </h1>
              <form class="space-y-4 md:space-y-6" @submit.prevent="login" autocomplete="off">
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="text" v-model="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="name@example.com">
                      <span>
                        <p v-if="errors.email" class="text-sm text-red-500 font-bold mt-2">
                            {{ errors.email[0] }}
                        </p>
                        <p v-if="message" class="text-sm text-red-500 font-bold mt-2">
                            {{ message }}
                        </p>
                      </span>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" v-model="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none">
                      <span>
                          <p v-if="errors.password" class="text-sm text-red-500 font-bold mt-2">
                                {{ errors.password[0] }}
                          </p>
                      </span>
                  </div>
                  <div class="flex flex-col gap-y-2">
                    <button type="submit" class="w-full text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">Log in</button>
                    <RouterLink to="/" class="w-full text-white bg-slate-500 hover:bg-slate-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">Go back</RouterLink>
                  </div>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                      Don’t have an account yet? <RouterLink to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                            Register
                      </RouterLink>
                  </p>
              </form>
          </div>
      </div>
    </section>
</template>
