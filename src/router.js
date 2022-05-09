import Login from './components/Login.vue';
import Escritorio from './components/Escritorio.vue';

const routes = [
    { name: "login", path: '/', component: Login },
    { name: "escritorio", path: '/escritorio', component: Escritorio },
];

export default routes;