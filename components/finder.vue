<template>
	<div>
			<div class="finder-action-bar" ref="actionbar">
				<div class="finder-tabber">
					  <ul class="nav nav-tabs" role="tablist">
					    <li v-for="(panel, tab_id) in finder.tabs" v-bind:class="{'active': tab_id==finder.tab_id}">
					    	<a v-on:click="select_tab(tab_id)">{{panel.label}}</a>
					    </li>
						<li v-bind:class="{'active': 'workdesk'==finder.tab_id}" v-if="!disable_workdesk">
					    	<a v-on:click="select_tab('workdesk')">
								<i class="glyphicon glyphicon-duplicate"></i>
								<sup v-show="workdesk.length>0" style="background: red" class="badge">
									{{workdesk.length}}
								</sup>
					    	</a>
					    </li>
					  </ul>
				</div>
				<div>
					<div class="btn-group" role="group">
						<a v-for="(action, idx) in finder.actions"
							class="btn"
							v-bind:href="action_url[idx]"
							v-bind:data-modal-title="action.label"
							v-bind:data-modal-confirm="action.confirm"
							v-bind:modal-height="action['modal_height']"
							v-bind:modal-width="action['modal_width']"
							v-bind:target="action.target ?action.target:'window'">
							{{action.label}}
						</a>
					</div>
				</div>
			</div>
			<div class="finder-header" ref="header">
				<form class="finder-search-bar" v-on:submit="reload()"
					v-if="'workdesk'!=finder.tab_id && finder.searchs && finder.searchs.length>0">
					<filters :searchs="finder.searchs" @change="reload" ref="filters"></filters>
				</form>

				<div class="finder-workdesk-bar" v-if="!disable_workdesk && 'workdesk'==finder.tab_id">
					操作台: 一个临时收纳台.
					<button class="btn btn-default btn-sm"
					v-bind:disabled="this.workdesk.length==0"
					v-on:click="clear_workdesk">清空列表</button>
				</div>
			</div>

			<div class="finder-content" ref="content">
				<div class="finder-list">
					<div v-if="showbtn && selected.length>0" class="showbtn">已选择{{selected.length}}条数据，是否选择&nbsp;<span @click="selall">全部{{finder.data.total}}条数据</span></div>
					<table class="finder-title" ref="left_title" style="z-index:99">
						<tr class="finder-row">
							<td class="col-sel">
								<label class="finder-col-sel" v-if="select_mode=='multi'">
									<input type="checkbox" v-on:change="select_all" v-model="v_select_all" />
								</label>
								<label class="finder-col-sel" v-if="select_mode=='single'">
									<input type="radio" style="visibility: hidden" />
								</label>
							</td>
							<td v-for="(col, col_id) in finder.cols"
								v-bind:class="col_class[col_id]"
								v-if="!col.hidden && col.lock">
								{{col.label}}
							</td>
						</tr>
					</table>
					
					<table class="finder-title finder-title-right" ref="right_title">
						<tr class="finder-row">
							<td v-for="(col, col_id) in finder.cols"
								v-bind:class="col_class[col_id]"
								v-if="!col.hidden && !col.lock">
								{{col.label}}
							</td>
							<td></td>
						</tr>
					</table>
					<div class="content-box">
						<div class="finder-content-left" ref="left" v-on:scroll="scrollLeft" >
							<table class="finder-body"
								v-if="finder.data"
								 ref="left_body"
								v-on:mouseup="sel_mup($event)"
								v-bind:class="{'unselectable': unselectable}">

								<tr class="finder-row"
											v-for="(item,idx) in finder.data.items"
											v-on:mouseout="sel_mout(idx,$event)"
											v-on:mouseover="sel_mover(idx,$event)"
											v-on:click="toggle_detail(idx, $event)"
											v-bind:class="{'selected':(checkbox[idx] || radio==item.$id), 'detail':current_detail==idx}">
										<td class="col-sel">
											<label class="finder-col-sel"
												v-on:mousedown="sel_mdown(idx,$event)"
												v-if="select_mode=='multi'">
												<input type="checkbox" v-model="checkbox[idx]" />
											</label>
											<label class="finder-col-sel" v-else-if="select_mode=='single'">
												 <input type="radio"
														@click="radio_check(idx)"
														name="finder-select"
														:value="item.$id" v-model="radio" />
											</label>
										</td>
										<td v-for="(col, col_id) in finder.cols"
											v-bind:class="col_class[col_id]"
											v-if="!col.hidden && col.lock">
											<span v-if="typeof(item[col_id])=='object' && item[col_id].date">
												{{item[col_id].date}}
											</span>
											<span v-else-if="col.html" v-html="item[col_id]"></span>
											<span v-else :title="item[col_id]">{{item[col_id]}}</span>
										</td>
								</tr>
							</table>
						</div>
						<div class="finder-content-right" v-on:scroll="scrollRight" ref="right">
							<table class="finder-body"
								v-if="finder.data"
								ref="right_body"
								v-on:mouseup="sel_mup($event)"
								v-bind:class="{'unselectable': unselectable}">

								<tr class="finder-row"
											v-for="(item,idx) in finder.data.items"
											v-on:click="toggle_detail(idx, $event)"
											v-bind:class="{'selected':(checkbox[idx] || radio==item.$id), 'detail':current_detail==idx}">

									<td v-for="(col, col_id) in finder.cols"
										 v-bind:class="col_class[col_id]"
										 v-if="!col.hidden && !col.lock">
										<span v-if="typeof(item[col_id])=='object' && item[col_id] && item[col_id].date">
											{{item[col_id].date}}
										</span>
										<span v-else-if="col.html" v-html="item[col_id]"></span>
										<span v-else :title="item[col_id]">{{item[col_id]}}</span>
									</td>
									<td></td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div class="finder-pager" v-if="finder.data" ref="pager">
					<span class="dropdown">
					  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true">
					    {{(finder.data.currentPage-1)*finder.data.perPage+1}}
					    -
					    {{Math.min(finder.data.currentPage*finder.data.perPage,finder.data.total)}}, 共{{finder.data.total}}项
					  </button>
					  <ul class="dropdown-menu">
					    <li v-for="(sort, idx) in finder.sorts">
						    <a v-on:click="finder.sort_id=idx;reload()">
						    	{{sort.label}}
						    	<i class="glyphicon glyphicon-ok" v-if="idx==finder.sort_id"></i>
						    </a>
					    </li>
					    <li v-if="finder.sorts && finder.sorts.length>0" role="separator" class="divider"></li>
						<li v-for="(col, col_id) in finder.cols">
							<a v-on:click="toggle_col(col_id)">
								{{col.label}}
								<i class="glyphicon glyphicon-ok" v-if="!col.hidden"></i>
							</a>
						</li>
					  </ul>
					</span>
					<button class="btn btn-default" v-on:click="first_page($event)" v-bind:disabled="finder.data.currentPage==1">
						首页
					</button>

					<button class="btn btn-default" v-on:click="go_page(-1, $event)" v-bind:disabled="finder.data.currentPage==1">
						<i class="glyphicon glyphicon-menu-left"></i>
					</button>
					<button class="btn btn-default" v-on:click="go_page(1, $event)" v-bind:disabled="finder.data.hasMorePages==false">
						<i class="glyphicon glyphicon-menu-right"></i>
					</button>

					<button class="btn btn-default" v-on:click="last_page($event)" v-bind:disabled="finder.data.hasMorePages==false">
						末页
					</button>
				</div>
				<transition name="finder-slide-bottom" v-if="this.finder.batchActions && this.finder.batchActions.length>0 && !disable_workdesk">
					<div class="finder-batch-action-bar" v-if="selected.length>0">
						<div>
							<span>{{showfilters?finder.data.total:selected.length}}</span>

							<form ref="formbtn" v-bind:target="batch_action_target"
								  v-bind:data-modal-confirm="batch_action_confirm"
								  method="POST">
								<input type="hidden" name="finder_request" value="batch_action" />
								<input type="hidden" name="_token" v-bind:value="csrf_token">
								<input type="hidden" name="action_id" v-bind:value="batch_action_id" />
								<input type="hidden" name="id[]" v-bind:value="id" v-for="id in selected" />
								<input type="hidden" v-if="showfilters" name="filtersarr" v-bind:value="filtersarr"/>

								<div class="btn-group" role="group">
									<button v-for="(action, idx) in finder.batchActions"
											v-on:click="submit(idx, action.target, action.confirm,action.url, $event)"
											type="submit"
											class="btn btn-default specialbtn">
											{{action.label}}
									</button>
								</div>

								<button v-if="'workdesk'==finder.tab_id" v-on:click="del_workdesk($event)" class="btn btn-default">移出操作台</button>
								<button v-else v-on:click="put_workdesk($event)" class="btn btn-default">放入操作台</button>
							</form>
						</div>
					</div>
				</transition>

				<div class="finder-detail" ref="detail" v-if="current_detail!=undefined">
				  <span class="close-btn" @click="current_detail=undefined">
				  	<i class="glyphicon glyphicon-remove-circle"></i>
				  </span>
				  <ul class="nav nav-tabs" role="tablist">
				    <li v-for="(panel, panel_id) in finder.infoPanels"
				    	v-bind:class="{'active': panel_id==current_panel}">
				    	<a v-on:click="show_panel(current_detail, panel_id)">{{panel.label}}</a>
				    </li>
				  </ul>
				  <div class="tab-content">
				    <div role="tabpanel" class="tab-pane active"
				    	v-for="(panel, panel_id) in finder.infoPanels"
				    	v-if="panel_id==current_panel">
				    	<div class="finder-detail-content" v-html="finder.data.items[current_detail].panels[panel_id]"></div>
				    </div>
				  </div>
				  <div class="movecicle" @mousedown="movebeg($event)">&lt; &gt;</div>
				</div>

				<div
					v-show="items_loading"
					class="finder-masker"
					ref="loading"
					v-bind:style="{'background': masker_bgcolor}">
					<div class="loading">
					  <div class="bounce1"></div>
					  <div class="bounce2"></div>
					  <div class="bounce3"></div>
					</div>
				</div>
			</div>
	</div>
</template>
<style scoped lang="scss">
@import 'variables.scss';

$finder-scrollbar-size: 12px;

::-webkit-scrollbar {
    -webkit-appearance: none;
    width: $finder-scrollbar-size;
    height: $finder-scrollbar-size;
    background: $finder-scrollbar-color;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
.finder-content-left{
   
}
.content-box{
	top: $finder-title-height;
}
.finder-row:hover{
	background: #eaf2f6;
	color:#666;
}
.finder-row.selected{
	background: $finder-selected-bg;
}
.finder-row.detail{
	background: $finder-active-bg;
	color: $finder-active-fg;
}
.finder-title{
	// background: $finder-title-bg;
	// color: $finder-title-fg;
	background:#eaf2f6;
	color:#666;
}
.finder-detail{
	border-left: 1px solid rgba(255, 255, 255, 0.3);
	display:flex;
	flex-direction:column;
}
.finder-detail .tab-content{
	overflow:auto;
	flex:1;
}
.finder-detail>.nav-tabs{
	background: $finder-title-bg;
	color: $finder-title-fg;
}
.finder-detail>.nav-tabs a{
	color: $finder-title-fg;
}
.finder-detail>.nav-tabs .active a, .finder-detail>.nav-tabs a:hover{
	color: $finder-title-bg;
}
.finder-action-bar  .btn-group a{
	border:1px solid $finder-basecolor;
	color:$finder-basecolor;
}
</style>

<style scoped>
label{
	display: inline;
}
table{
	table-layout:fixed
}
.movecicle{
	display: none;
	position: absolute;
	top:50%;left:0;margin-top:-25px;margin-left:-25px;
	border:1px solid #dcdccd;border-radius: 50%;
	width:50px;height:50px;line-height: 50px;text-align: center;
	background: #fff;cursor:move;
}
.finder-detail:hover .movecicle{
	display: block;
}
.finder-content{
	position: absolute;
	top:0;
	left:0;
	bottom:0;
	right:0;
	display: flex;
	overflow: hidden;
	background: #fff;
}
.finder-list{
	position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow: auto;
}
.finder-detail{
	flex: 30rem 0;
    z-index: 100;
    background: #fff;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width:35%;border-left: 1px solid #dcdcdc;
}
.finder-detail .close-btn{
	display: block;
	cursor: pointer;
	color: rgba(255,255,255,0.8);
	position: absolute;
	right: 0;
	padding: 0.75rem;
}
.finder-detail .close-btn:hover{
	color: rgba(255,255,255,1);
}
.finder-content-left{
	position: absolute;
	left: 0;
	-ms-overflow-style: none;
	overflow: -moz-scrollbars-none;
    z-index: 10;
    background: #fff;
}
.finder-content-left::-webkit-scrollbar {
    display: none;
}
.finder-title-right{
	z-index: 9;
}
.finder-content-right{
	
}
.content-box{
	position: absolute;
    left: 0;
    bottom: 0; 
}
.finder-title{
	position: absolute;
	top: 0;
	left: 0;
	height: 3rem;
}
.finder-header{
	overflow: hidden;
}
.col-sel{
	width: 2rem;
}
.finder-row >>> .col{
/*	display: inline-block; */
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-left: 2.5rem;
}
.finder-row >>> .col span a{
		margin-left:5px;
}
.finder-row >>> .col span a:first-child{margin-left: 0;}
.finder-row >>> .col-1 {
	width: 6rem;
}
.finder-row >>> .col-2{
	width: 12rem;
}
.finder-row >>> .col-3{
	width: 18rem;
}
.finder-row >>> .col-4{
	width: 24rem;
}
.finder-row >>> .col-5{
	width: 30rem;
}
.finder-row >>> .col-6{
	width: 36rem;
}
.finder-row >>> .col-7{
	width: 42rem;
}
.finder-row >>> .col-8{
	width: 48rem;
}
.finder-row >>> .col-9{
	width: 54rem;
}
.finder-row >>> .col-10{
	width: 60rem;
}
.finder-row >>> .col-11{
	width: 66rem;
}
.finder-row >>> .col-12{
	width: 72rem;
}

.finder-col-sel{
	width: 3rem;
	z-index: 99;
	text-align: center;
/*	line-height: 3rem;*/
	/*height: 3rem;*/
	margin: 0;
}
.finder-row{
	border-bottom: 1px solid #ccc;
/*	border-bottom: 1px solid #ccc;
	display:inline-block;
	min-width: 100%;	*/
}
.finder-row td{
	padding: 0 0.5rem;
	height: 3rem;
	overflow: hidden;
}
.finder-detail .nav-tabs{
	padding: 0.5rem 0.5rem 0 0.5rem;
	display: flex;
	/*justify-content: center;*/
}
.finder-detail .nav-tabs li{

}
.finder-detail .nav > li > a{
	padding: 0.3rem 1rem;
	cursor: pointer;
}



.finder-detail-content{
	margin: 0.5rem;
	min-height: 15rem;
	overflow: hidden;
	word-break: break-all;
}
.finder-workdesk-bar{
	border-top: 1px solid #ccc;
	background: #9f9;
	color: #000;
	padding: 0.3rem;
	text-align: center;
}
.finder-batch-action-bar{
	position: absolute;
	bottom: 0;
	left:0;
	right:0;
	display: flex;
	justify-content: center;
}
.finder-batch-action-bar>div{
	border:1px solid #ccc;
	padding:1.5rem .5rem .5rem .5rem;
	z-index: 999;
	border-top-left-radius: 1rem;
	border-top-right-radius: 1rem;
	border-bottom: none;
	background: #000;
	color: #ccc;
}
.finder-batch-action-bar>div span{
	border:0.5rem solid #000;
	background: #666;
	color: #ccc;
	position: absolute;
	height:4rem;
	width:4rem;
	text-align: center;
	display: block;
	top: -2.5rem;
	border-radius: 100%;
	line-height: 3rem;
	left: 50%;
	margin-left: -2rem;
}
.finder-batch-action-bar .btn-default{
	background: #000;
	color: #ccc;
}
.finder-action-bar > div{
	line-height: 3rem;
}
.finder-tabber{
	padding-right: 1rem;
	margin:-0.4rem;
	display: flex;
	align-items: flex-end;
}
.finder-tabber .nav-tabs{
	display: flex;
	justify-content: center;
	border-bottom: none;
}
.finder-tabber .nav > li > a{
	cursor: pointer;
	padding: 0.7rem 1.5rem;
}
.finder-action-bar{
	display: flex;
}
.finder-pager{
position: absolute;
bottom: 0;left:0;right:0;
height: 45px;
    white-space: nowrap;
    text-align: center;
}
.finder-pager >.dropdown > .btn-default{
	border: none;
	background: transparent;
}
.finder-masker{
	background: #fff;
	z-index: 9999;
	position: absolute;
	width: 100%;
	height: 100%;
	padding-top: 10vh;
	left:0; top:0;
}

.finder-search-bar{
	padding: 0;
	background: #f0f0f0;
	overflow: hidden;
}
.finder-search-bar >>> .form-inline{
	display: inline-block;
	margin: 0 0 0 2.5rem;
}
.finder-search-bar >>> input, .finder-search-bar >>> select, .finder-search-bar >>> label{
	height: 2rem;
	line-height: 2rem;
	margin:0.5rem 5px 0.5rem 0;
}
.finder-search-bar >>> .mini input{
	padding:0;margin:0;line-height:100%;height:100%;
}
.finder-user-header{
	border-top: 1px solid #ccc;
}

.finder-slide-bottom-enter-active {
  transition: all .3s ease;
}
.finder-slide-bottom-leave-active {
  transition: all .3s ease;
}
.finder-slide-bottom-enter, .finder-slide-bottom-leave-to{
  transform: translateY(100%);
  opacity: 0;
}
.showbtn{
	position: absolute;
	top:0;
	left: 3rem;
    text-align: center;
    font-size: 12px;
    background: #fff;
    z-index: 999;
    right: 3rem;
}
.showbtn span{
	cursor: pointer;
	color:red;
	font-weight: bold;
}
</style>

<script>
export default {
	  mounted (){
	  	if(this.finder.batchActions && this.finder.batchActions.length>0){
	  		this.select_mode = 'multi';
	  	}
	  	
	  },
	  computed: {
	  	col_class (){
	  		var ret = [];
	  		for(var i=0;i<this.finder.cols.length;i++){
	  			var obj = {'col': true};
	  			if(this.finder.cols[i].className){
	  				obj[this.finder.cols[i].className] = true;
	  			}
	  			obj['col-'+this.finder.cols[i].size] = true;
	  			ret[i] = obj;
	  		}
	  		return ret;
	  	},
	  	selected (){
	  		var ret = [];
	  		for(var i=0; i<this.checkbox.length;i++){
	  			if(this.checkbox[i]==true){
	  				ret.push(this.finder.data.items[i].$id);
	  			}
	  		}
	  		return ret;
	  	},
	  	action_url (){
	  		var ret = [];
	  		for(var i=0; i<this.finder.actions.length; i++){
	  			ret[i] = this.finder.actions[i].url;
	  			if(!ret[i]){
	  				ret[i] = this.finder.baseUrl+'?finder_request=action&id='+i;
	  			}
	  		}
	  		return ret;
	  	},
	  	checked_result (){
	  		var ret = [];
	  		for(var i=0; i<this.checkbox.length;i++){
	  			if(this.checkbox[i]==true){
	  				ret.push({
	  					value: this.finder.data.items[i].$id,
	  					label: this.finder.data.items[i][0],
	  					data: this.finder.data.items[i]
	  				});
	  			}
	  		}
	  		return ret;
	  	}
	  },
	  methods:{
	  	movebeg(e){
	  		var width = $('.finder-detail').width();
	  		$(window).on('mousemove',function(v){
	  			if(v.pageX<25) return;
	  			var w = v.pageX-e.x;
	  			if(w>width-100) return;
	  			$('.finder-detail').css('width',width-w+'px')
	  		});
	  		$(window).on('mouseup',function(v){
	  			$(window).unbind('mousemove');
	  			$(window).unbind('mouseup');
	  		});
	  	},
	  	scrollLeft(ev){
	  		// $(this.$refs.left).scrollTop( $(this.$refs.right).scrollTop() );
	  		this.$refs.right.scrollTop = this.$refs.left.scrollTop;
	  	},
	  	scrollRight(ev){
	  		// $(this.$refs.left).scrollTop( $(this.$refs.right).scrollTop() );
	  		this.$refs.left.scrollTop = this.$refs.right.scrollTop;
	  		this.$refs.right_title.style.left = (this.leftWidth-this.$refs.right.scrollLeft)+"px";
	  	},
	  	reload (page){
	  		this.items_loading = true;
			this.current_detail = undefined;

			var filters = this.$refs.filters? this.$refs.filters.data() : [];

			var that = this;
			$.ajax({
				'url': this.finder.baseUrl,
				'data': {
					'finder_request':'data',
					'page': page,
					'sort': this.finder.sort_id,
					'tab_id': this.finder.tab_id,
					'filters': JSON.stringify(filters)
				},
				complete (){
					that.items_loading = false;
				}
			}).done(function(response){
				that.checkbox = [];
				that.v_select_all = false;
				that.finder.data = response;
			});
	  	},
	  	resize(){
			this.$refs.left_title.style.width = "auto";
		  	this.leftWidth = $(this.$refs.left_title).width();
		  	this.$refs.left.style.width = this.leftWidth+"px";
		  	this.$refs.right.style.paddingLeft = this.leftWidth+"px";

		  	// this.$refs.right.style.minWidth =  - this.leftWidth;

		  	$(this.$refs.left_body).width(this.leftWidth);
		  	$(this.$refs.left_title).width(this.leftWidth);

			this.$refs.right_title.style.width = "auto";
		  	var rightWidth = $(this.$refs.right_title).width();
		  	var w2 = $(this.$refs.content).width() - this.leftWidth;

	  		if(rightWidth < w2){
	  			rightWidth = w2;
	  		}

		  	$(this.$refs.right_body).width(rightWidth);
		  	$(this.$refs.right_title).width(rightWidth);

			this.$refs.right_title.style.left = (this.leftWidth-this.$refs.right.scrollLeft)+"px";
		},
		select_all (e){
			if(this.v_select_all){
				for(var i=0;i<this.finder.data.items.length;i++){
					this.$set(this.checkbox, i, true);
				}
				this.showbtn=true;
			}else{
				this.checkbox = [];
				this.showbtn=false;
				this.showfilters=false;
			}
		},
		toggle_col (id){
			this.$set(this.finder.cols[id], "hidden", this.finder.cols[id].hidden?false:true);
		},
		put_workdesk (e){
          e.stopPropagation();
          e.preventDefault();
          for(var i=0; i<this.checkbox.length; i++){
          	if(this.checkbox[i]){
          		if(!this.workdesk_ids[this.finder.data.items[i].$id]){
          			this.workdesk_ids[this.finder.data.items[i].$id] = true;
					this.workdesk.push(this.finder.data.items[i]);
          		}
          	}
          }
          this.checkbox = [];
		  this.v_select_all = false;
		},
		reload_workdesk (){
			this.finder.data = {
				items: this.workdesk,
				currentPage: 1,
				perPage: this.workdesk.length,
				total: this.workdesk.length,
				hasMorePages: false
			}
		},
		clear_workdesk (){
			this.workdesk_ids={};
			this.workdesk=[];
			this.reload_workdesk();
		},
		del_workdesk (e){
          e.stopPropagation();
          e.preventDefault();
          var map = {};
          for(var i=0; i<this.checkbox.length; i++){
          	if(this.checkbox[i]){
          		this.$delete(this.workdesk_ids, this.workdesk[i].$id);
          		this.workdesk[i] = undefined;
          	}
          }
          var new_workdesk = [];
          for(var i=0;i< this.workdesk.length; i++){
          	if(this.workdesk[i]){
          		new_workdesk.push(this.workdesk[i]);
          	}
          }
          this.workdesk = new_workdesk;
          this.checkbox = [];
		  this.v_select_all = false;
          this.reload_workdesk();
		},
		toggle_detail (id, e){
			if( ["A","BUTTON","SELECT","INPUT"].indexOf(e.target.tagName)>=0 ){
				return;
			}
			if(this.finder.infoPanels && this.finder.infoPanels.length>0){
				if(this.current_detail==id){
					this.current_detail = undefined;
				}else{
					this.current_detail = id;
					this.show_panel(id, 0);
				}
			}else if(this.select_mode=='single'){
				this.radio = this.finder.data.items[id].$id;
				this.radio_check(id);
			}else if(this.select_mode=='multi'){
				if(this.checkbox[id]){
					this.$set(this.checkbox, id, false);
				}else{
					this.$set(this.checkbox, id, true);
				}
			}
		},
		go_page (v, ev){
			ev.stopPropagation();
			this.reload(this.finder.data.currentPage+v);
		},
		first_page(ev){
			ev.stopPropagation();
			this.reload(1);
		},
		last_page(ev){
			ev.stopPropagation();
			this.reload(Math.ceil(this.finder.data.total/this.finder.data.perPage));
		},
		select_tab (tab_id){
			this.finder.tab_id = tab_id;
			this.v_select_all = false;
			this.page_num = 0;
			if(tab_id=='workdesk'){
				this.reload_workdesk();
			}else{
				this.reload(0);
			}
		},
		show_panel (item_idx, panel_id){
			if(!this.finder.data.items[item_idx]){
				return;
			}
			if(!this.finder.data.items[item_idx].panels){
				this.$set(this.finder.data.items[item_idx], 'panels', {});
			}
			if(!this.finder.data.items[item_idx].panels[panel_id]){
				this.$set(this.finder.data.items[item_idx].panels,
					panel_id, $(this.$refs.loading).html());
				var that = this;
				$.ajax({
					'url': this.finder.baseUrl,
					'data': {
						'finder_request':'detail',
						'panel_id': panel_id,
						'item_id': this.finder.data.items[item_idx].$id
					}
				}).done(function(response){
					that.$set(that.finder.data.items[item_idx].panels, panel_id, response);
				});
			}
			this.current_panel = panel_id;
		},
		sel_mup (e){
			if(!this.batch_select_mode){
				return;
			}
			this.batch_select_mode = false;
			this.batch_select_value = undefined;
			this.batch_select_lastidx = 0;
			this.unselectable = false;
		},
		sel_mdown (idx,e){
			this.batch_select_mode = true;
		},
		sel_mover (idx,e){
			if(!this.batch_select_mode || this.batch_select_lastidx==idx){
				return;
			}
			var to = Math.max(this.batch_select_lastidx, idx);
			for(var i=Math.min(this.batch_select_lastidx, idx)+1; i<=to; i++){
				this.$set(this.checkbox, i, this.batch_select_value);
			}
			this.batch_select_lastidx = idx;
		},
		sel_mout (idx,e){
			if(!this.batch_select_mode){
				return;
			}
			if(this.batch_select_value==undefined){
				if(this.checkbox[idx]){
					this.$set(this.checkbox, idx, false);
				}else{
					this.$set(this.checkbox, idx, true);
				}
				this.batch_select_value = this.checkbox[idx];
				this.batch_select_lastidx = idx;
				this.unselectable = true;
			}
		},
		radio_check(idx){
			this.radio_label = this.finder.data.items[idx][0];
			this.radio_data = this.finder.data.items[idx];
		},
		submit (idx, target, confirm, url, $event){
			$event.preventDefault();
			this.batch_action_id = idx;
			this.batch_action_target = target;
			this.batch_action_confirm = confirm;
			this.csrf_token = $('meta[name="csrf-token"]').attr('content');
			if(url) this.$refs.formbtn.action = url;
			if(!target){
				this.$nextTick(function(){this.$refs.formbtn.submit();})
			}
		},
		selall(){
			this.filtersarr = this.$refs.filters? this.$refs.filters.data() : []
			this.showfilters = true;
			this.showbtn = false;
		},
	  },
	  data (){
	  	return {
	  		csrf_token: '',
		    current_detail: undefined,
		    current_panel: 0,
		    checkbox: [],
		    radio: undefined,
		    radio_label: "",
		    radio_data: "",
		    disable_workdesk: false,
		    workdesk: [],
		    workdesk_ids: {},
		    v_select_all: false,
		    disable_tabber: false,
		    items_loading: false,
		    select_mode: '',
		    leftWidth:0,
		    panel_loading: false,
		    unselectable: false,
			batch_action_target: '',
			batch_action_confirm: '',
			batch_action_id: -1,
			batch_select_mode: false,
			batch_select_value: undefined,
			batch_select_lastidx: 0,
			masker_bgcolor: 'rgba(255,255,255,0.4)',
			filtersarr:'',
			showfilters:false,
			showbtn:false,
	  	}
	  }
	}
</script>