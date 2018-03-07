<template>
<div :class="{filtersbox:showtop}">
	<div v-if="showtop" class="top">
		<div class="tleft">查询</div>
		<div class="tright" @click="showmore=!showmore">更多条件</div>
	</div>
	<div class="flexbox">
		<div class="bottom" :class="{showmore:showmore||!showtop}" >
			<div class="form-inline" v-for="(search, idx) in searchs">
			  <!-- label -->
			  <div class="form-group" style="margin-right: -2px">
			  	<template v-if="typeof(search.key)=='object'">
				  	<select name="value[]" v-model="search.field" v-on:change="search.field&&(search.value||search.value==0)&&changed()">
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
			    <span v-else>:<input type="hidden" name="mode[]" value="=" />
			    </span>
			  </div>
			  <!-- value -->
			  <div class="form-group">
			  	<template v-if="typeof(search.type)=='object'">
				  	<select name="value[]" v-model="search.value" v-on:change="(search.value||search.value==0)&&changed()">
				  		<option value="" selected="selected">请选择</option>
				  		<template v-for="(val, key, index) in search.type" >
				    		<option :value="key" > {{val}} </option>
				    	</template>
				    </select>
				</template>
				<template v-else-if="search.type=='begintime'">
					<select name="mode[]" v-model="search.mode">
				    	<option value="=">=</option>
				    	<option value="gt">&gt;</option>
				    	<option value="lt">&lt;</option>
				    </select>
				     <el-date-picker
				           v-model="daterange"
				           type="date"
				           v-on:change="changeddate2(idx)" 
				           placeholder="选择日期">
				         </el-date-picker>
				</template>
				<template v-else-if="search.type=='betweentime'">
				     <el-date-picker 
				     	type="daterange"
				     	size="mini"
				     	class="mini"
		      			range-separator="-"
		      			start-placeholder="开始日期"
		      			end-placeholder="结束日期"
		      			v-on:change="changeddate(idx)" 
		      			v-model="daterange[idx]" ></el-date-picker>
				</template>
				<template v-else-if="search.type=='address'">
				     <cascader style="width:250px;" ref="cascaderval" changeselect  @selected-change="blurcasca(idx,$event)"></cascader>
				</template>
				<template  v-else>
					   <input type="text" name="value[]" v-model="search.value" v-on:change="changed()"/>
			    </template>
			  </div>
			</div>
		</div>
		<div class="btn btn-primary" @click="changed()">搜索</div>
	</div>
</div>	
</template>

<style scoped>
.btn{
    line-height: 1;
    margin-left: 2.5rem;
	height:28px;
	margin-right:30px;
}
.filtersbox{
    background: #fff;
    border: 1px solid #dcdcdc;
    border-top:none;
}
.filtersbox .top{
	height:40px;
}
.filtersbox .top .tleft{
	color:#333;
	font-size:16px;
	float: left;    margin-left: 2.5rem;
    margin-top: 10px;
}
.filtersbox .top .tright{
	color:#255AC1;
	font-size:12px;
	float: right;margin-right:30px;    margin-top: 15px;cursor:pointer;
}
.bottom{
	height:40px;
	width:80%;
	overflow: hidden;
	flex:1;
}
.bottom.showmore{
	height:auto;
}
.flexbox{
	display: flex;
}
.form-group label{
	/*color:#255AC1;*/
	margin-right: 0px;
}
</style>

<script>
export default {
	props: ["searchs"],
	data(){
		return{
			daterange:{},
			daterange2:'',
			showmore:false,
			showtop:true,
		}
	},
	mounted(){
		if($(this.$el).parent().parent().hasClass('modal-header')) this.showtop = false;
		for(var i=0; i<this.searchs.length; i++){
			if(this.searchs[i].type=="betweentime"){
				this.daterange[i] = '';
			}
		}
	},
	methods: {
		blurcasca(idx,e){
			var str = this.$refs.cascaderval[0].$children[0].$refs.input.$refs.input.defaultValue;
			// for(var i=0;i<e.length;i++){
			// 	if(i==e.length-1){
			// 		str=str+e[i];
			// 		break;	
			// 	} 
			// 	str=str+e[i]+'/'
			// }
			this.searchs[idx].value = str;
			this.changed();
		},
		changed (){
			this.$emit('change');
		},
		changeddate (idx){
			var db = this.format(this.daterange[idx][0])
			var de = this.format(this.daterange[idx][1])
			this.searchs[idx].value = db+'-'+de;
			this.searchs[idx].mode = '#'
			this.changed();
		},
		changeddate2 (idx){
			var db = this.format(this.daterange2)
			this.searchs[idx].value = db.indexOf('1970')>=0? '': db;
			this.changed();
		},
		format(val){
			    var d = new Date(val);
			    var year = d.getFullYear();
			    var month = d.getMonth() + 1;
			    var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
			    return year+ '/' + month + '/' + day
		},
		data (){
			var filters = [];
			for(var i=0; i<this.searchs.length; i++){
				if(this.searchs[i].value||this.searchs[i].value=='0'){
					filters.push([i, this.searchs[i].value, this.searchs[i].mode,this.searchs[i].field]);
				}
			}
			return filters;
		}
	}
}
</script>