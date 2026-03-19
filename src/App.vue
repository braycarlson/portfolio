<template>
    <LoadingOverlay />
    <ScrollProgress />
    <div class="ambient" aria-hidden="true">
        <canvas ref="ambient" class="ambient-canvas" />
    </div>
    <NavBar />
    <router-view v-slot="{ Component }">
        <transition
            name="page-fade"
            mode="out-in"
            @before-enter="scrollToTop"
        >
            <component :is="Component" />
        </transition>
    </router-view>
    <PageFooter />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoadingOverlay from '@/components/layout/LoadingOverlay.vue';
import NavBar from '@/components/layout/NavBar.vue';
import PageFooter from '@/components/layout/PageFooter.vue';
import ScrollProgress from '@/components/layout/ScrollProgress.vue';
import { useAmbientCanvas } from '@/composables/useAmbientCanvas';

const ambient = ref<HTMLCanvasElement | null>(null);
useAmbientCanvas(ambient);

function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'instant' });
}
</script>

<style>
.ambient {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
}

.ambient-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
</style>
