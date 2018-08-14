import Vue from 'vue';
import App from './app.vue';

import './assets/style/test.css';

var vm = new Vue({
    el: '#app',
    render: (h) => h(App)
});
