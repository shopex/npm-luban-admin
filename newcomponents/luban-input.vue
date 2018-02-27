<template>
  <div class="input">
     <el-input :type="inputtype" :autosize="autosize" ref='input' :class="error?'error':''" @focus="focus" @input="input" @blur="blur" :placeholder="placeholder" v-model="value2" :size="size" :name="namevalue" :maxlength="maxlen" :minlength="minlen"></el-input>
     <div class="errorval">{{errorval}}</div>
  </div>
</template>
<style scoped >
.input{
  display: inline-block;
  width:100%;
}
.error{
	border:1px solid #f00;
	border-radius:6px;
}
.errorval{
	color:#f00;font-size:12px;padding-left:15px;
}
</style>
<script>
  import Vue from 'vue'
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(Element)
  export default {
    props: ['placeholder', 'namevalue', 'value', 'size', 'type', 'maxlen', 'minlen', 'inputtype', 'autosize'],
    mounted(){
      var that = this;
  		if(that.type && that.type=='password'){
  			that.$refs.input.$refs.input.type='password'
  		}
    },
    data() {
      return {
      	value2:this.value||'',
      	error:false,
      	errorval:'',
      };
    },
    methods: {
      blur(){	
      	if(this.type=='tel'){
      		if(!this.value2){
      			this.error=true
      			this.errorval = '手机号码不能为空'
      		}else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.value2))){
      			this.error=true
      			this.errorval = '手机格式不正确'
      		}
      	}else if(this.type=='email'){
      		 var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9])+/; 
      		if(!this.value2){
      			this.error=true
      			this.errorval = '邮箱不能为空'
      		}else if(! reg.test(this.value2)){
      			this.error=true
      			this.errorval = '邮箱格式不正确'
      		}

      	}else if(this.type=='password'){
      		if(!this.value2){
      			this.error=true
      			this.errorval = '密码不能为空'
      		}else if(!(/^[0-9a-zA-Z]{6,}$/.test(this.value2))||/^\d+$/.test(this.value2)||/^[a-zA-Z]+$/.test(this.value2)){
      			this.error=true
      			this.errorval = '密码由6位以上英文字母及数字组成'
      		}
      	}
      	if(this.value2.length<this.minlen){
      		this.error=true
      		this.errorval = '此输入框长度至少为'+this.minlen
      	}else if(this.value2.length>this.maxlen){
      		this.error=true
      		this.errorval = '此输入框长度至多为'+this.minlen
      	}
      },
      focus(){
      	this.error = false
      	this.errorval = ""
      },
      input(){},
    }

  };
</script>