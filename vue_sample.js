(function () {
    "use strict";
    const ComponentA = Vue.extend({
        data(){
            return {
                msg:'hello'
            }
        },
        template:`
        <div></div>
        `
    });
    const vm = new Vue({
        el:'#app',
        data:{
            msg:'hello'
        },
        components: {
            'component-a': ComponentA
        },
        computed:{

        },
        methods:{
            myMethod(){
            }
        }
    })
})();
