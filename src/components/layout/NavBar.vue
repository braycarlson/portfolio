<template>
    <nav class="nav" :class="{ scrolled }">
        <div class="nav-inner">
            <router-link to="/" class="nav-logo">
                Brayden Carlson
            </router-link>
            <div class="nav-sep" />
            <router-link
                v-for="link in links"
                :key="link.to"
                :to="link.to"
                class="nav-link"
                :class="{ active: route.name === link.name }"
            >
                {{ link.text }}
            </router-link>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScrollState } from '@/composables/useScrollState';

const route = useRoute();
const { scrolled: isScrolled } = useScrollState();
const scrolled = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

watch(isScrolled, (value) => {
    if (timeout) clearTimeout(timeout);

    if (value) {
        scrolled.value = true;
    } else {
        timeout = setTimeout(() => {
            scrolled.value = false;
        }, 300);
    }
});

const links = [
    { to: '/', name: 'home', text: 'Home' },
    { to: '/resume', name: 'resume', text: 'Resume' },
];
</script>

<style scoped>
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
    padding: 16px 0;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background 0.4s ease, border-color 0.4s ease;
}

.nav.scrolled {
    background: rgba(8, 8, 11, 0.92);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border-bottom-color: rgba(245, 245, 247, 0.06);
}

.nav-inner {
    display: flex;
    align-items: center;
    gap: 2px;
}

.nav-logo {
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #f5f5f7;
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 6px;
    white-space: nowrap;
}

.nav-sep {
    width: 1px;
    height: 14px;
    background: rgba(245, 245, 247, 0.06);
    margin: 0 8px;
}

.nav-link {
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: rgba(245, 245, 247, 0.35);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 6px;
    background-image: linear-gradient(#f5f5f7, #f5f5f7);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.5s ease, color 0.3s ease;
}

.nav-link:hover {
    background-size: 100% 1px;
    color: rgba(245, 245, 247, 0.85);
}

.nav-link.active {
    color: rgba(245, 245, 247, 0.85);
}
</style>
