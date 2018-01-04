<template>
	<div>
		<div v-for="(item,key) in choiceGroup">
			选择产品大类&nbsp;&nbsp;{{item.content}}（共<span class="num">{{item.children.length}}</span>项目，已选<span class="num">{{item.choice.length}}</span>项目）
			<el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(key)">全选</el-checkbox>
			<el-checkbox-group class="group" v-model="item.choice" @change="handleCheckedCitiesChange(key)">
				<el-checkbox v-for="(child,i) in item.children" :label="child" :key="child.id" @change="checkedChange(key,i,$event)">{{child.content}}</el-checkbox>
			</el-checkbox-group>
			<div  v-for="(child,i) in item.children" style="padding-left:30px;">
				<div v-if="child.children" >
					选择产品小类&nbsp;&nbsp;{{child.content}}（共<span class="num">{{child.children.length}}</span>项目，已选<span class="num">{{child.choice.length}}</span>项目）
					<el-checkbox :indeterminate="child.isIndeterminate" v-model="child.checkAll" @change="changeall(key,i)">全选</el-checkbox>
					<el-checkbox-group class="group" v-model="child.choice" @change="handleChange(key,i)">
						<el-checkbox v-for="(grandchild,i) in child.children" :label="grandchild" :key="grandchild.id">{{grandchild.content}}</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
			
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.num{color:green;}
	.group{
	}
	.group >>> label:first-child{
			margin-left:30px;
		}
</style>
<script type="text/javascript">
	export default{
		props:['options','url'],
		data(){
			return{
				choiceGroup:this.options,
			}
		},
		mounted(){
			var that = this;
		},
		methods: {
		    handleCheckAllChange(val) {
		        this.choiceGroup[val].choice = this.choiceGroup[val].checkAll ? this.choiceGroup[val].children : [];
		        this.choiceGroup[val].isIndeterminate = false;
	        	for(var i=0;i<this.choiceGroup[val].children.length;i++){
	        		if(this.choiceGroup[val].checkAll){
	        			this.getData(val,i)
	        		}else{
	        			this.closeData(val,i)
	        		}
	        	}
		    },
		    handleCheckedCitiesChange(val) {

		        let checkedCount = this.choiceGroup[val].choice.length;
		        this.choiceGroup[val].checkAll = checkedCount === this.choiceGroup[val].children.length;
		        this.choiceGroup[val].isIndeterminate = checkedCount > 0 && checkedCount < this.choiceGroup[val].children.length;

		    },
		    //三级全选
		    changeall(k,i){
		    	this.choiceGroup[k].children[i].choice = this.choiceGroup[k].children[i].checkAll ? this.choiceGroup[k].children[i].children : [];
		    	this.choiceGroup[k].children[i].isIndeterminate = false;
		    },
		    //三级单选
		    handleChange(k,i){
		    	let checkedCount = this.choiceGroup[k].children[i].choice.length;
		    	this.choiceGroup[k].children[i].checkAll = checkedCount === this.choiceGroup[k].children[i].children.length;
		    	this.choiceGroup[k].children[i].isIndeterminate = checkedCount > 0 && checkedCount < this.choiceGroup[k].children[i].children.length;
		    },
		    //生成子集
		    checkedChange(k,i,$ev){
		    	console.log($ev,6)
		    	$ev ? this.getData(k,i) : this.closeData(k,i);
		    },
		    closeData(k,i){
		    	if(this.choiceGroup[k].children[i].children) this.choiceGroup[k].children[i].children =null;
		    },
		    getData(k,i){
		    	var that = this;
 
		    	var data = this.choiceGroup[k].children[i];
		    	var id = data.id;
		    	$.ajax({
		    	  'type':'get',
		    	  'url':that.url,
		    	  'data':{
		    	  	id:id,
		    	  },
		    	  complete (){
		    	  }
		    	}).done(function(response){
		    		response = JSON.parse(response)
		    	    if(!response.length) return;
					that.$set(that.choiceGroup[k].children[i],'children',response)
					that.$set(that.choiceGroup[k].children[i],'isIndeterminate',false)
					that.$set(that.choiceGroup[k].children[i],'checkAll',false)
					that.$set(that.choiceGroup[k].children[i],'choice',[])
		    	});
		    },
		},
	}
</script>