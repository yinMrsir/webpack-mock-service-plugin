import Vue from 'vue'
import App from './App.vue'

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err)
    console.log(vm)
    console.log(info)
}

new Vue({
    el: '#app',
    render: h => h(App)
})