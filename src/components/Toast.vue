<template>
    <div>
        <Transition
            appear
            enter-active-class="transition ease-out duration-300 transform"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-100 transform"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="props.show"
                class="absolute top-6 right-6 z-50"
            >
                <div class="flex items-center w-full max-w-md p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
                    <div :class="alertClass">
                        <div v-if="props.loading" class="animate-spin">
                            <Icon icon="mingcute:loading-fill" class="w-5 h-5" />
                        </div>
                        <component :is="props.icon" class="w-5 h-5" />
                    </div>
                    <div :class="{'mr-4' : props.loading}" class="ml-4 text-sm font-normal select-none">
                        <p v-text="props.message"></p>
                    </div>
                    <button v-if="['success', 'info', 'danger'].includes(props.variant)" @click="emit('close')" class="ml-4 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ease-in-out duration-300">
                        <Icon icon="mdi:close" class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { cva } from 'class-variance-authority';
import { watch, computed } from 'vue';

const props = defineProps({
    message: String,
    show: Boolean,
    loading: Boolean,
    close: Function,
    icon: {
        type: Object,
    },
    variant: {
        type: String,
        default: 'success',
        validator(value) {
            return ['success', 'danger', 'info', 'transparent'].includes(value)
        }
    }
});

const alertClass = computed(() => {
    return cva("inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg", {
        variants: {
            variant: {
                success: "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200",
                danger: "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200",
                info: "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200",
                transparent: "text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-200",
            }
        }
    })({
        variant: props.variant
    });
});

const emit = defineEmits(['close']);

watch(() => props.show, (show) => {
    if (show) {
        setTimeout(() => {
            emit('close')
        }, 3000)
    }
});
</script>