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

/* ── Avatar modal ── */

.avatar-modal-enter-active {
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.avatar-modal-enter-active .avatar-expanded {
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.avatar-modal-leave-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-modal-leave-active .avatar-expanded {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-modal-enter-from {
    opacity: 0;
}

.avatar-modal-enter-from .avatar-expanded {
    opacity: 0;
    transform: scale(0.6);
}

.avatar-modal-leave-to {
    opacity: 0;
}

.avatar-modal-leave-to .avatar-expanded {
    opacity: 0;
    transform: scale(0.85);
}

/* ── Cat modal ── */

.cat-modal-enter-active {
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-modal-enter-active .cat-photo {
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-modal-leave-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cat-modal-leave-active .cat-photo {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.cat-modal-enter-from {
    opacity: 0;
}

.cat-modal-enter-from .cat-photo {
    opacity: 0;
    transform: scale(0.6);
}

.cat-modal-leave-to {
    opacity: 0;
}

.cat-modal-leave-to .cat-photo {
    opacity: 0;
    transform: scale(0.85);
}

/* ── Project modal ── */

.modal-enter-active {
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-active .modal-card {
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-active .modal-nav {
    transition: opacity 0.6s ease 0.25s;
}

.modal-leave-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-leave-active .modal-card {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-leave-active .modal-nav {
    transition: opacity 0.25s ease;
}

.modal-enter-from {
    opacity: 0;
}

.modal-enter-from .modal-card {
    opacity: 0;
    transform: scale(0.7) translateY(30px);
}

.modal-enter-from .modal-nav {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-leave-to .modal-card {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

.modal-leave-to .modal-nav {
    opacity: 0;
}
</style>
