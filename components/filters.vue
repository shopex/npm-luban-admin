<template>
<div>
	<div class="form-inline" v-for="(search, idx) in searchs">
	  <!-- label -->
	  <div class="form-group">
	  	<template v-if="typeof(search.key)=='object'">
		  	<select name="value[]" v-model="search.field" v-on:change="search.field&&search.value&&changed()">
		  		<option value="" selected="selected">{{search.label}}</option>
		  		<template v-for="(val1, key1, index) in search.key" >
		    		<option :value="key1" > {{val1}} </option>
		    	</template>
		    </select>
		</template>
		<template  v-else>
			<label >{{search.label}}</label>
	    	<input type="hidden" name="value[]" v-model="search.field" />
	    </template>
	  </div>
	  <!-- model -->
	  <div class="form-group">
	    <select name="mode[]" v-model="search.mode" 
	    	v-on:change="search.value&&changed()" v-if="search.type=='string'">
	    	<option value="begin">开始于</option>
	    	<option value="=">是</option>
	    	<option value="!=">不是</option>
	    	<option value="has">包含</option>
	    	<option value="not_begin">不开始于</option>
	    	<option value="not_has">不包含</option>
	    </select>
	    <select name="mode[]" v-model="search.mode"
	    	v-on:change="search.value&&changed()" v-else-if="search.type=='number'">
	    	<option value="=">=</option>
	    	<option value="gt">&gt;</option>
	    	<option value="lt">&lt;</option>
	    </select>
	    <span v-else>
	    	:
	    	<input type="hidden" name="mode[]" value="=" />
	    </span>
	  </div>
	  <!-- value -->
	  <div class="form-group">
	  	<template v-if="typeof(search.type)=='object'">
		  	<select name="value[]" v-model="search.value" v-on:change="search.value&&changed()">
		  		<option value="" selected="selected">请选择</option>
		  		<template v-for="(val, key, index) in search.type" >
		    		<option :value="key" > {{val}} </option>
		    	</template>
		    </select>
		</template>
		<template  v-else>
	    	<input type="text" name="value[]" v-model="search.value" v-on:change="changed()"/>
	    </template>
	  </div>
	</div>
	  <div class="btn btn-primary" @click="changed()">搜索</div>
</div>	
</template>

<style scoped>
.btn{
    line-height: 1;
}
</style>

<script>
export default {
	props: ["searchs"],
	methods: {
		changed (){
			this.$emit('change');
		},
		data (){
			var filters = [];
			for(var i=0; i<this.searchs.length; i++){
				if(this.searchs[i].value){
					filters.push([i, this.searchs[i].value, this.searchs[i].mode,this.searchs[i].field]);
				}
			}
			return filters;
		}
	}
}
</script>