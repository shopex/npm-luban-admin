<template>
  <div class="cascader">
    <input type="hidden" :name="namevalue" v-model="selectedop">
    <el-cascader
      :options="regionJson"
      v-model="selectedop"
      :expand-trigger="acttype"
      @active-item-change="itemChange"
    @change="handleChange">
    ></el-cascader>
  </div>

</template>

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
      }
    },

     methods: {
      handleChange(value) {
          this.$emit('selected-change',value)
      },
      itemChange(v){
        var that = this;
        var pro =  window.location.protocol
        var host = window.location.host
        console.log(pro,host)
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
            'url': pro+'//'+host+'/getRegion?itemid='+that.itemid,
            complete (){
              // that.items_loading = false;
            }
          }).done(function(response){
              if(!response.length) return;
              if(that.itemid==0){
                 that.regionJson = response
              }else{
                  k=0;
                  finderItem(that.regionJson);
                  obj.children = response;
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