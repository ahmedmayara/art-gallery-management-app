<script setup>
import { watch } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    maxWidth: {
        type: String,
        default: '6xl',
    },
    closable: {
        type: Boolean,
        default: true,
    },
});

const isDark = useDark();
const toggleDark = useToggle(isDark);

const emit = defineEmits(['close']);

watch(
    () => props.show,
    (value) => {
        if (value) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }
);
</script>

<template>
    <teleport to='body' />
    <Transition leave-active-class="duration-200" name="fade">
        <div
            v-if="props.show"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition
                    enter-active-class="ease-out duration-300"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="ease-in duration-200"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <div
                        v-if="props.show"
                        class="fixed inset-0 backdrop-blur-sm bg-black/50"
                        aria-hidden="true"
                    >
                        <div class="absolute inset-0"></div>
                    </div>
                </Transition>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
                    >&#8203;</span
                >
                <Transition
                    enter-active-class="ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-active-class="ease-in duration-200"
                    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        v-if="props.show"
                        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div class="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:px-6 sm:flex sm:items-center sm:justify-between border-b dark:border-gray-600">
                            <h3 class="text-lg leading-6 font-medium text-gray-800 dark:text-gray-100" id="modal-headline">
                                <slot name="header" />
                            </h3>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800 px-4 sm:p-6 sm:pb-4">
                            <div>
                                <div class="mt-3 text-center sm:mt-0 sm:text-left">
                                    <slot name="body" />
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:px-6 sm:flex sm:flex-row-reverse">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-leave-to,
.fade-enter-from {
    opacity: 0;

}

.fade-leave-from,
.fade-enter-to {
    opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
    transition: opacity 0.3s ease-out;
}
</style>