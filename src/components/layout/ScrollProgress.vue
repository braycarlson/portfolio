<template>
    <div class="scroll-progress">
        <div class="scroll-progress-bar" :style="{ transform: `scaleX(${progress})` }" />
    </div>
</template>

<script setup lang="ts">
import { useScrollState } from '@/composables/useScrollState';

const { progress } = useScrollState();
</script>

<style scoped>
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 51;
    height: 2px;
    background: transparent;
    pointer-events: none;
}

.scroll-progress-bar {
    height: 100%;
    background: rgba(245, 245, 247, 0.25);
    transform-origin: left;
    will-change: transform;
    transition: transform 0.1s linear;
}

@media (prefers-reduced-motion: reduce) {
    .scroll-progress-bar {
        transition: none;
    }
}
</style>
