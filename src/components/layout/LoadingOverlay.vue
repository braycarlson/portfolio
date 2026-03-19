<template>
    <Transition name="loading">
        <div v-if="!ready" class="loading-overlay">
            <div class="loading-spinner" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useAppReady } from '@/composables/useAppReady';

const { ready } = useAppReady();
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: #08080b;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(245, 245, 247, 0.06);
    border-top-color: rgba(245, 245, 247, 0.28);
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-leave-active {
    transition: opacity 0.5s ease;
}

.loading-leave-to {
    opacity: 0;
}
</style>
