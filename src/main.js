import Vue from 'vue';
import App from './TableContainerApp';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
