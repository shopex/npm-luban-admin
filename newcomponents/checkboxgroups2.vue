<template>
	<div>
		<div v-for="(item,key) in choiceGroup">
			选择产品大类&nbsp;&nbsp;{{item.brands_name}}（共<span class="num">{{item.children.length}}</span>项目，已选<span class="num">{{item.choice.length}}</span>项目）
			<el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(key)">全选</el-checkbox>
			<el-checkbox-group class="group" v-model="item.choice" @change="handleCheckedCitiesChange(key)">
				<el-checkbox v-for="(child,i) in item.children" :label="child" :key="child.id" @change="checkedChange(key,i,$event)">{{child.bigcate_name}}</el-checkbox>
			</el-checkbox-group>
			<div  v-for="(child,i) in item.children" style="padding-left:30px;">
				<div v-if="child.children" >
					选择产品小类&nbsp;&nbsp;{{child.bigcate_name}}（共<span class="num">{{child.children.length}}</span>项目，已选<span class="num">{{child.choice.length}}</span>项目）
					<el-checkbox :indeterminate="child.isIndeterminate" v-model="child.checkAll" @change="changeall(key,i)">全选</el-checkbox>
					<el-checkbox-group class="group" v-model="child.choice" @change="handleChange(key,i)">
						<el-checkbox v-for="(grandchild,j) in child.children" :label="grandchild" @change="lastcheckedChange(key,i,j,$event)" :key="grandchild.id">{{grandchild.bigcate_name}}</el-checkbox>
					</el-checkbox-group>

				
					<div v-if="grandchild.children" v-for="(grandchild,j) in child.children" style="padding-left:30px;">
						选择服务方式&nbsp;&nbsp;{{grandchild.bigcate_name}}（共<span class="num">{{grandchild.children.length}}</span>项目，已选<span class="num">{{grandchild.choice.length}}</span>项目）
						<el-checkbox :indeterminate="grandchild.isIndeterminate" v-model="grandchild.checkAll" @change="lastchangeall(key,i,j)">全选</el-checkbox>
						<el-checkbox-group class="group" v-model="grandchild.choice" @change="lasthandleChange(key,i,j)">
							<el-checkbox v-for="(lastchild,i) in grandchild.children" :label="lastchild" :key="lastchild.id">{{lastchild.service_mode_name}}</el-checkbox>
						</el-checkbox-group>
					</div>

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
		props:['options','url','lasturl','ajaxdata'],
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
		    	for(var j=0;j<this.choiceGroup[k].children[i].children.length;j++){
	        		if(this.choiceGroup[k].children[i].checkAll){
	        			this.getlastData(k,i,j)
	        		}else{
	        			this.closelastData(k,i,j)
	        		}
	        	}
		    },
		    //三级单选
		    handleChange(k,i){
		    	let checkedCount = this.choiceGroup[k].children[i].choice.length;
		    	this.choiceGroup[k].children[i].checkAll = checkedCount === this.choiceGroup[k].children[i].children.length;
		    	this.choiceGroup[k].children[i].isIndeterminate = checkedCount > 0 && checkedCount < this.choiceGroup[k].children[i].children.length;
		    },
		    //四级全选
		    lastchangeall(k,i,j){
		    	this.choiceGroup[k].children[i].children[j].choice = this.choiceGroup[k].children[i].children[j].checkAll ? this.choiceGroup[k].children[i].children[j].children : [];
		    	this.choiceGroup[k].children[i].children[j].isIndeterminate = false;
		    },
		    //四级单选
		    lasthandleChange(k,i,j){
		    	let checkedCount = this.choiceGroup[k].children[i].children[j].choice.length;
		    	this.choiceGroup[k].children[i].children[j].checkAll = checkedCount === this.choiceGroup[k].children[i].children[j].children.length;
		    	this.choiceGroup[k].children[i].children[j].isIndeterminate = checkedCount > 0 && checkedCount < this.choiceGroup[k].children[i].children[j].children.length;
		    },
		    //生成子集
		    checkedChange(k,i,$ev){
		    	$ev ? this.getData(k,i) : this.closeData(k,i);
		    },
		    //生成服务方式
		    lastcheckedChange(k,i,j,$ev){
		    	$ev ? this.getlastData(k,i,j) : this.closelastData(k,i,j);
		    },
		    closeData(k,i){
		    	if(this.choiceGroup[k].children[i].children) this.choiceGroup[k].children[i].children =null;
		    },
		    closelastData(k,i,j){
		    	if(this.choiceGroup[k].children[i].children[j].children) this.choiceGroup[k].children[i].children[j].children =null;
		    },
		    getlastData(k,i,j){
    	    	var that = this;
    	
    	    	var data = this.choiceGroup[k].children[i].children[j];
    	    	var id = data.id;
    	    	this.ajaxdata.bigcate_id = this.choiceGroup[k].children[i].id
    	    	this.ajaxdata.id = id
    	    	$.ajax({
    	    	  'type':'get',
    	    	  'url':that.lasturl,
    	    	  'data':this.ajaxdata,
    	    	  complete (){
    	    	  }
    	    	}).done(function(response){
    	    		response = JSON.parse(response).data
    	    	    if(!response.length) return;
    				that.$set(that.choiceGroup[k].children[i].children[j],'children',response)
    				that.$set(that.choiceGroup[k].children[i].children[j],'isIndeterminate',false)
    				that.$set(that.choiceGroup[k].children[i].children[j],'checkAll',false)
    				that.$set(that.choiceGroup[k].children[i].children[j],'choice',[])
    	    	});
		    },
		    getData(k,i){
		    	var that = this;
 
		    	var data = this.choiceGroup[k].children[i];
		    	this.ajaxdata.bigcate_id = data.id
		    	$.ajax({
		    	  'type':'post',
		    	  'url':that.url,
		    	  'data':that.ajaxdata,
		    	  complete (){
		    	  }
		    	}).done(function(response){
		    		response = JSON.parse(response).data
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