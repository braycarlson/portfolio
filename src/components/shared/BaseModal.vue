<template>
    <Teleport to="body">
        <Transition :name="transition" @after-leave="unlock">
            <div
                v-if="open"
                role="dialog"
                aria-modal="true"
                class="modal-backdrop"
            >
                <div class="modal-overlay" @click.self="$emit('close')">
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue';
import { useEventListener } from '@vueuse/core';

const props = defineProps<{
    open: boolean;
    transition?: string;
}>();

const emit = defineEmits<{
    close: [];
}>();

function lock(): void {
    document.documentElement.classList.add('scroll-locked');
}

function unlock(): void {
    document.documentElement.classList.remove('scroll-locked');
}

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (props.open && event.key === 'Escape') {
        emit('close');
    }
});

watch(() => props.open, (value) => {
    if (value) lock();
});

onUnmounted(() => {
    unlock();
});
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    overscroll-behavior: none;
}

.modal-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 2rem;
    background: rgba(8, 8, 11, 0.7);
    cursor: pointer;
    overflow-y: auto;
    overscroll-behavior: none;
}
</style>
