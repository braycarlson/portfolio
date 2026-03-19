<template>
    <span
        class="cat-name"
        :style="{
            backgroundImage: gradient,
            borderColor: color,
        }"
        @click="open = true"
    >
        {{ name }}
    </span>

    <BaseModal :open="open" transition="cat-modal" @close="open = false">
        <div class="cat-photo">
            <img :src="src" :alt="name" />
            <span
                class="cat-label"
                :style="{ backgroundImage: gradient }"
            >
                {{ name }}
            </span>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/shared/BaseModal.vue';

defineProps<{
    color: string;
    gradient: string;
    name: string;
    src: string;
}>();

const open = ref(false);
</script>

<style scoped>
.cat-name {
    font-weight: 600;
    cursor: pointer;
    border-bottom: 1px solid;
    padding-bottom: 1px;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cat-photo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.cat-photo img {
    width: min(420px, 85vw);
    height: min(420px, 85vw);
    object-fit: cover;
    border-radius: 24px;
    border: 1px solid rgba(245, 245, 247, 0.08);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6);
}

.cat-label {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cat-modal-enter-active,
.cat-modal-leave-active {
    transition: opacity 0.25s ease;
}

.cat-modal-enter-active .cat-photo,
.cat-modal-leave-active .cat-photo {
    transition: transform 0.25s ease;
}

.cat-modal-enter-from,
.cat-modal-leave-to {
    opacity: 0;
}

.cat-modal-enter-from .cat-photo {
    transform: scale(0.9);
}

.cat-modal-leave-to .cat-photo {
    transform: scale(0.95);
}
</style>
