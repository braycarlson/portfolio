<template>
    <footer class="footer">
        <div class="footer-inner">
            <span class="footer-item">&copy; {{ year }} Brayden Carlson</span>
            <span class="footer-separator">&middot;</span>
            <span class="footer-item">All rights reserved</span>
        </div>
    </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    padding: 0 48px 56px;
}

.footer-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding-top: 40px;
    width: 100%;
    max-width: 1140px;
    border-top: 1px solid rgba(245, 245, 247, 0.06);
}

.footer-item {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
    white-space: nowrap;
}

.footer-separator {
    font-size: 13px;
    color: rgba(245, 245, 247, 0.06);
    user-select: none;
}
</style>
