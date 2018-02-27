<template>
  <div class="datepicker">
          <el-date-picker
            :editable="false"
              v-model="dateval"
              type="date"
              :name="namevalue"
              :size="size"
              :picker-options="pickerOptions"
              :placeholder="placeholder?placeholder:'请选择日期'">
            </el-date-picker>
  </div>
</template>
<style scoped >
</style>
<script>
  import Vue from 'vue'
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(Element)
  var dateb, datee;
  export default {
    props: ['placeholder', 'namevalue', 'value', 'datebegin', 'dateend', 'size'],
    mounted(){
      var that = this;
      dateb = this.datebegin
      datee = this.dateend
    },
    data() {
      return {
        dateval:this.value,
      	pickerOptions: {
          disabledDate(time) {
            if(dateb&&!datee){
              return time.getTime() < dateb - 8.64e7 
            }else if(datee&&!dateb){
              return  time.getTime() > datee
            }
            return time.getTime() < dateb - 8.64e7 || time.getTime() > datee ;
          }
        },
      };
    },
    methods: {
    }

  };
</script>