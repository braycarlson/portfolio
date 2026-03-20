<template>
    <div class="scroll-progress">
        <div ref="bar" class="scroll-progress-bar" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const bar = ref<HTMLElement | null>(null);

let ticking = false;

function update(): void {
    const element = bar.value;
    if (!element) return;

    const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollable > 0 ? document.documentElement.scrollTop / scrollable : 0;

    element.style.transform = `scaleX(${progress})`;
    ticking = false;
}

function onScroll(): void {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
    }
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
});
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
    transform: scaleX(0);
}

@media (prefers-reduced-motion: reduce) {
    .scroll-progress-bar {
        display: none;
    }
}
</style>
