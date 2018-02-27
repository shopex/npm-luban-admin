<template>
  <div class="cascader">
    <input type="hidden" :name="namevalue" v-model="selectedop">
    <el-cascader
      style="width:100%;"
      :options="regionJson"
      :size="size"
      v-model="selectedop"
      :expand-trigger="acttype"
      @active-item-change="itemChange"
      :change-on-select="changeselect"
    @change="handleChange">
    ></el-cascader>
  </div>

</template>
<style scoped >
.cascader{
  width:300px;

}
</style>
<script>
  import Vue from 'vue'
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(Element)
  var p;
  export default {
    mounted(){
      var that = this;
      if(!this.options){
        that.itemChange()
        var k = 0;
        p.then(function(){
          initv();
        })
        function initv(){
            k++;
            if(k>=that.selectedval.length) {
              that.selectedop = that.selectedval;
              return};
            that.itemChange(that.selectedval.slice(0,k))
            p.then(function(){
              initv();
            })
        }
      }
    },
    data() {
      return {
        selectedop:[],
        itemid:0,
        regionJson:this.options ? this.options:[],
        acttype:this.options ? 'hover' :'click',
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
      },
      baseurl: {
        type: String,
        default () {
          return "/getRegion"
        },
      },
      size: {
        type: String,
        default () {
          return ""
        },
      },
      changeselect:{
        type:Boolean,
        default () {
          return false
        },
      }

    },

     methods: {
      handleChange(value) {
        var that = this
        if(!this.changeselect) return;
        this.itemChange(value)
          
      },
      itemChange(v){
        var that = this;
        var pro =  window.location.protocol
        var host = window.location.host
        p = new Promise(function(resolve, reject){
          if(that.options) return;
          var k = 0;
          var arr = [];
          var obj ;
          if(v){
              that.itemid = v[v.length-1];
          }
          $.ajax({
            'type':'get',
            'url': pro+'//'+host+that.baseurl+'?itemid='+that.itemid,
            complete (){
              // that.items_loading = false;
              // 今天真jiba累！
            }
          }).done(function(response){
              if(!response.length) return;
              if(that.itemid==0){
                 that.regionJson = response
              }else{
                  k=0;
                  finderItem(that.regionJson);
                  obj.children = response;
                  that.$emit('selected-change',v)
              }
              resolve('succ')
          });
          function finderItem(data){
             for(var i=0;i<data.length;i++){
               if(data[i].value==v[k]){
                  if(data[i].children.length==0){
                    obj = data[i]
                    return ;
                  }else{
                    k++;
                    if(k>=v.length) return data[i];
                    finderItem(data[i].children)
                  }
               }
             }
          }
        })
      },
    }

  };
</script>