import Vue from 'vue';
import BasicTableApp from './BasicTableApp';

Vue.config.productionTip = false;

new Vue({
    render: h => h(BasicTableApp),
}).$mount('#app');
