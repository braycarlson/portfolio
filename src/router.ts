import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from './pages/HomePage.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/resume', name: 'resume', component: () => import('./pages/ResumePage.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
