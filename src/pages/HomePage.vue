<template>
    <div>
        <HeroSection @navigate="onNavigate" />
        <AboutSection @navigate-project="onNavigateProject" />
        <ProjectSection />
        <CtaBar />
    </div>
</template>

<script setup lang="ts">
import CtaBar from '@/components/home/CtaBar.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import ProjectSection from '@/components/home/ProjectSection.vue';
import AboutSection from '@/components/home/AboutSection.vue';
import { useProjectHighlight } from '@/composables/useProjectHighlight';
import { useSmoothScroll } from '@/composables/useSmoothScroll';

const HIGHLIGHT_DELAY_MS = 1300;

const { scrollTo } = useSmoothScroll();
const { highlight } = useProjectHighlight();

function onNavigate(hash: string): void {
    const target = document.getElementById(hash);
    if (target) scrollTo(target);
}

function onNavigateProject(name: string): void {
    const target = document.getElementById('projects');

    if (target) {
        scrollTo(target);

        setTimeout(() => {
            highlight(name);
        }, HIGHLIGHT_DELAY_MS);
    }
}
</script>
