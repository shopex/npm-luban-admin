<template>
  <div class="cascader">
    <input type="hidden" :name="namevalue" v-model="selectedop">
    <el-cascader
      :options="regionJson"
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
    },
    data() {
      return {
        selectedop:[],
        regionJson:this.options?this.options:region
      };
    },
    props: {
      selectedval: {
        type: Array,
        default () {
          return []
        }
      },
      options: {
        type: Array,
        default () {
          return null
        },
      },
      namevalue: {
        type: String,
        default () {
          return ""
        },
      }
    },

     methods: {
      handleChange(value) {
          this.$emit('selected-change',value)
      },
    }

  };
</script>