<script setup>
import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const menus = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Buy',
    path: '/buy',
  },
  {
    name: 'Contact',
    path: '/contact',
  },
]

const features = [
  {
    title: 'Modern Design',
    icon: 'ph:palette-duotone',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nisl elit aliquet nunc, eget aliquam massa nisl eget dolor.',
  },
  {
    title: 'Easy to use',
    icon: 'ph:hand-pointing-duotone',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nisl elit aliquet nunc, eget aliquam massa nisl eget dolor.',
  },
  {
    title: 'Fast and secure',
    icon: 'ph:shield-check-duotone',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nisl elit aliquet nunc, eget aliquam massa nisl eget dolor.',
  },
]
</script>

<template>
  <div class="font-sans w-full min-h-screen text-gray-900 dark:text-white bg-slate-200 dark:bg-gray-900 transition-colors duration-500 ease-in-out">
    <div class="px-6 mx-auto max-w-6xl">
      <div class="flex justify-between items-center py-8">
        <div class="flex items-center flex-shrink-0 text-gray-800 mr-6 dark:text-white">
            <img class="w-8 mr-2" src="../assets/img/logo.png" alt="Logo">
            <span class="font-display font-bold text-xl tracking-tight">Artivity</span>
        </div>
        <nav class="hidden md:flex md:items-center md:space-x-10">
          <a href="#" v-for="item in menus">
            <RouterLink :to="item.path" exact-active-class="text-blue-500" class="hover:text-blue-500 transition-colors">{{ item.name }}</RouterLink>
          </a>
          <RouterLink class="bg-blue-500 hover:bg-blue-600 h-10 px-8 rounded-xl text-white items-center justify-center flex transition-colors" to="login">Login</RouterLink>
          <button @click="toggleDark()">
            <span v-if="isDark">
              <Icon icon="ph:sun-duotone" width="25" />
            </span>
            <span v-else class="text-gray-900">
              <Icon icon="ph:moon-duotone" width="25" :class="isDark ? 'text-white' : 'text-gray-500'" />
            </span>
          </button>
        </nav>

        <Menu>
          <MenuButton class="p-4 md:hidden">
            <Icon icon="ph:list-duotone" width="25" :class="isDark ? 'text-white' : 'text-gray-500'" />
          </MenuButton>
          <Transition enter-active-class="transition ease-out duration-100 transform"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75 transform"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-95">
            <MenuItems class="absolute right-11 w-56 mt-2 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg outline-none" style="top: 4.5rem;">
              <div class="px-1 py-1">
                <a href="#" v-for="item in menus">
                  <RouterLink :to="item.path" exact-active-class="text-blue-500" class="block rounded-md hover:bg-gray-200 px-4 dark:hover:bg-gray-500 py-2 text-sm text-gray-700 dark:text-white">{{ item.name }}</RouterLink>
                </a>
              </div>
              <div class="px-1 py-1">
                <button @click="toggleDark()">
                  <span v-if="isDark">
                    <a href="#" class="block rounded-md hover:text-blue-500 px-4 dark:hover:text-blue-500 py-2 text-sm text-gray-700 dark:text-white">Switch to Light Mode</a>
                  </span>
                  <span v-else class="text-gray-900">
                    <a href="#" class="block rounded-md hover:text-blue-500 px-4 dark:hover:text-blue-500 py-2 text-sm text-gray-700 dark:text-white">Switch to Dark Mode</a>
                  </span>
                </button>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
    <div class="px-6 mx-auto max-w-6xl">
      <div class="flex flex-col-reverse items-center md:flex-row lg:items-end">
        <div class="w-1/2 pt-4 text-center md:text-left">
          <h1 class="text-2xl md:text-6xl font-display leading-tight md:leading-snug">Welcome to our Art Gallery Management Application!</h1>
          <p class="pt-8 text-lg md:text-xl leading-relaxed text-gray-500 md:max-w-md">This is a free simple application that allows you to
            manage your art gallery.</p>
          <div class="flex justify-center md:justify-start items-center pt-10 space-x-6">
            <RouterLink
                class="flex items-center justify-center py-3 px-8 font-bold tracking-wide leading-7 text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl"
                to="/login">Login
              </RouterLink>
              <RouterLink
                class="flex items-center justify-center py-3 px-8 font-bold tracking-wide leading-7 text-white bg-green-600 hover:bg-green-700 transition-colors rounded-xl"
                to="/register">Register
              </RouterLink>
          </div>
        </div>
        <div class="w-1/2 mb-3">
            <img src="../assets/img/art-illustration.svg">
        </div>
      </div>
    </div>
    <div class="bg-slate-200 text-gray-900 dark:text-white dark:bg-gray-900 transition-colors duration-500 ease-in-out">
      <div class="py-12 px-6 mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row gap-y-5 md:gap-x-5">
          <div v-for="feature in features" class="flex flex-col p-8 space-y-4 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-500 hover:shadow-xl duration-500 ease-out transition-shadow cursor-pointer">
            <div class="flex items-center space-x-3">
              <Icon :icon="feature.icon" width="28" :class="isDark ? 'text-white' : 'text-gray-500'" />
              <h2 class="text-xl font-bold font-display">{{ feature.title }}</h2>
            </div>
            <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-50">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
</div>
</template>