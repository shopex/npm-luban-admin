<template>
  <div class="selector">
     <el-select :size="size" :name="namevalue" v-model="value" :placeholder="placeholder?placeholder:'请选择'">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
  </div>
</template>
<style scoped >
.selector{

}
</style>
<script>
  import Vue from 'vue'
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(Element)
  var p;
  export default {
    props: ['placeholder', 'namevalue', 'value', 'options', 'size'],
    mounted(){
      var that = this;
    },
    data() {
      return {
      };
    },
    methods: {
      
    }

  };
</script>