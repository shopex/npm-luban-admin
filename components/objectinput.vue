<template>
	<a href="#"  @click="open($event)" v-bind:class="{multiple: is_multiple,'btn btn-primary': botton_type,'outter': !botton_type}">
			<template v-if="botton_type">
				<span >{{buttonname}}</span>
			</template>	
			<template v-else>
				<transition-group name="fade" v-if="first_loaded">
				  <span class="label" 
				  		v-bind:class="{'label-primary':!item.remove, 'label-danger':item.remove}"
				  		v-bind:key="item.value"
				  		v-for="(item, i) in values">
						{{item.label}}
						<i  @mouseover="$set(item,'remove',true)"
							@mouseout="$set(item,'remove',false)"
							@click="remove(i,$event)"
							class="glyphicon glyphicon-remove"></i>
				  </span>
			  </transition-group>
	      		<div class="loading" v-else>
				  <div class="bounce1"></div>
				  <div class="bounce2"></div>
				  <div class="bounce3"></div>
				</div>

			  <input type="hidden" :name="name" :value="return_value" />
			</template>	
		<div class="modal" tabindex="-1" role="dialog" ref="modal">
		  <div class="modal-dialog modal-lg" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4 class="modal-title">请选择</h4>
		        <div class="searchbox"><filters :searchs="filterArr" @change="load" ref="filters"></filters></div>
		      </div>
		      <div class="modal-body" :style="{height:height}" style="position:relative;">
		      	<div ref="finderHeader"></div>
		      	<div ref="finderContent">
		      		<div class="loading">
					  <div class="bounce1"></div>
					  <div class="bounce2"></div>
					  <div class="bounce3"></div>
					</div>
		      	</div>
		      	<div class="input-finder-pager">
		      		<div ref="finderPager"></div>
		      	</div>
		      </div>
		      <div class="modal-footer">
			        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
			        <button type="button" class="btn btn-primary" @click="confirm">确定</button>
		      </div>
		    </div>
		  </div>
		</div>

	</a>
</template>

<style scoped>
.input-finder-pager{
	position: absolute;
	bottom: 0;
	left: 50%;
	margin-left: -15rem;
}
.outter{
	display: inline-block;
	border:1px solid #ccc; 
	min-width:20rem;
	min-height:2.8rem;
	cursor: pointer;
	white-space: normal;
	line-height: 1.5rem;
	text-decoration: none;
	display: flex;
	align-items: center;
	padding-left:5px;
}
.outter:hover{
	text-decoration: none;	
}
.outter .label{
	cursor: default;
	margin:5px 0 5px 5px;
	display: inline-block;
}
.searchbox{
	position: absolute;
    left: 6rem;
    top: 1rem;
    height: 36px;
    width: 44rem;
}
.searchbox >>> .form-inline{
	display: inline-block;
    margin: 0 0 0 3rem;
}
.searchbox >>> .btn{
    margin-top:0.3rem;
}
.searchbox >>> .form-group label{
	 margin: 0.5rem 5px 0.5rem 0;
}
.outter .label>.glyphicon{
	cursor: pointer;
}
.outter .caret{
	float: right;
	margin-top:1rem;
}
.outter .loading{
	position: absolute;
	margin:0;
	padding:0;
	transform: scale(0.35);
	display: inline-block;
}
.outter .loading > div{
	background-color: #ccc;
}
.outter .handle{
	margin-right:1rem;
}
.modal-footer{
	text-align: center;
}
.modal-body{
	padding:0;
	min-height: 30vh;
	width:100%;overflow: auto;	
}
.multiple .fade-enter-active,.multiple .fade-leave-active {
  transition: opacity .3s
}
.multiple .fade-enter,.multiple .fade-leave-to{
  opacity: 0
}
</style>

<script>
export default {
	props: ["name", "value", "multiple", "type", "filters",'height', 'width', "button","buttonname"],
	mounted(){
		var that = this;
		this.baseurl = $('meta[name="admin-baseurl"]').attr('content')+'/admin/component/objectinput/'+this.type;
		$(this.$refs.modal).on('show.bs.modal', function () {
			that.load();
			that.input_value();
		});
		if(this.value){
			this.sync();
			this.input_value();
		}
	},
	computed: {
		return_value(){
			if(!this.first_loaded){
				return this.value;
			}
			var ret = [];
			$(this.values).each(function(i, v){
				ret.push(v.value);
			});
			return ret.join(",")
		},
		is_multiple(){
			return this.multiple!=undefined;
		},
		botton_type(){
			if (this.button !=undefined) {
				return true
			}else{
				return false
			}
		},
		values_map(){
			var ret = {};
			$(this.values).each(function(i, v){
				ret[v.value] = true;
			});
			return ret;
		}
	},
	methods: {

		open(ev){
			ev.stopPropagation();
			ev.preventDefault();
			$(this.$refs.modal).modal({});
		},
		remove(i, ev){
	      	ev.stopPropagation();
	      	ev.preventDefault();
			this.$delete(this.values, i);
			this.input_value();
		},
		sync(){
			var that = this;
			$.ajax({
				url: this.baseurl,
				data: 'finder_request=sync&values='+this.value,
				success (rsp){
					that.values = rsp;
					that.first_loaded = true;
					that.input_value();
				}
			});
		},
		load (){
			var that = this;
			if(this.finder){
				this.checkbox = [];
				this.v_select_all = false;				
				this.finder.reload();
			}else if(!this.loading){
				$(document.body).append(this.$refs.modal);
				var filters = this.filters? this.filters : '[]';
				$.ajax({
					url: this.baseurl,
					data:{
						'filters': filters
					},
					complete (){
						that.loading = false;
					},
					success (rsp){
						var Finder = Vue.component("finder");
						that.finder = new Finder({
							data: {
								finder: rsp,
								select_mode: (that.is_multiple?'multi':'single')
							}
						}).$mount();
						that.filterArr = that.finder.finder.searchs
						$(that.$refs.finderHeader).replaceWith(that.finder.$refs.header);
						$(that.$refs.finderContent).replaceWith(that.finder.$refs.content);
						$(that.$refs.finderPager).replaceWith(that.finder.$refs.pager);
						that.input_value();
						console.log(that.finder.$refs.pager,99)
					}
				});
				that.loading = true;
			}
		},
		confirm (){
			$(this.$refs.modal).modal('hide');
			if(!this.finder){
				return;
			}
			if(this.is_multiple){
				var map = this.values_map;
				for(var i=0;i<this.finder.checked_result.length;i++){
					if(!map[this.finder.checked_result[i].value]){
						this.values.push(this.finder.checked_result[i]);
					}
				}
			}else{
				this.values = [
					{
						value: this.finder.radio,
						label: this.finder.radio_label,
						data:this.finder.radio_data
					}
				]
			}
			this.input_value();
		},
		input_value: function () {
	      this.$emit('input_value',this.return_value)
	      console.log(this.values)
	      this.$emit('change',this.values)
	    }
	},
	data (){
		return {
			first_loaded: false,
			values: [],
			baseurl: '',
			loading: false,
			finder: undefined,
			filterArr:[],
		}
	}
}
</script>
