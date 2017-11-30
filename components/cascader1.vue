<template>
  <div class="cascader">
    <el-cascader
      :options="options"
      v-model="selectedop"
    @change="handleChange">
    ></el-cascader>
  </div>

</template>

<script>
  import Vue from 'vue'
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  var region = require('../region.json');
  Vue.use(Element)
  
  export default {
    mounted(){
      var that = this;
      this.selectedop = this.selectedval;
      this.$watch("selectedop", function(v){
        that.$emit('selected-change', v);
      })
    },
    data() {
      return {
        options: region,
        selectedop:[]
      };
    },
    props: {
      selectedval: {
        type: Array,
        default () {
          return []
        }
      }
    },

     methods: {
      handleChange(value) {
        this.selectedop = value;
      },
      selectedopfn(vl){
        console.log(vl)
        this.selectedop = vl
      }
    }

  };
</script>