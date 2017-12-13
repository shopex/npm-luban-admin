<template>
	<div v-bind:class="{unselectable: draging}" class="desktop" @click="link_action">
		<div class="top">
			<div class="brand"><img src='/logo.png'></div>
			<div class="searchbar">
				<searchbar :items="search"></searchbar>
			</div>
			<div class="icons">
				<slot name="topbar"></slot>
			</div>
		</div>
		<div class="deskmain">
			<div class="sidepanel">
				<div class="menus unselectable">
					<appmenu :menus="menus"></appmenu>
				</div>
				<div class="copyright">
					<slot name="copyright"></slot>
				</div>
			</div>

			<div class="main">
				<div class="topbar">
					<transition-group name="taskbar" class="taskbar unselectable">
						<div v-for="win in windows"
							class="taskbar-item"
							:id="'taskbar-'+win.id"
							:class="{active: win.isfocus}"
							:key="win.id">
							<span class="taskbar-item-title"
									@click.prevent="show(win.id)"
									@mouseup.middle.prevent="close(win.id)">
								{{win.title}}
							<em class="left"></em>
							<em class="right"></em>
							</span>
							<span class="taskbar-item-split"></span>
							<span class="close" style="z-index:99999" @click.prevent="close(win.id)">X</span>
						</div>
					</transition-group>
					
					<div class="topbar-shadow"></div>
				</div>

				<div class="workspace" ref="workspace">
					<transition-group name="window">
						<window v-for="win in windows" ref="win" :key="win.id"
							:left="win.left"
							:top="win.top"
							:initwidth="win.width"
							:initheight="win.height"
							:zindex="((win.is_pin && !win.is_max)?500:10)+win.zindex"
							:isfocus="win.isfocus"
							:id="win.id"
							:name="win.name"
							:initurl="win.url"
							:initmax="win.is_max"
							@link="link_action"
							@max="onMaxChange"
							@min="onMinChange"
							@pin="pin"
							@url="onUrlChange"
							@focus="active(win.id)"
							@close="close(win.id)"
							@dragend="draging=false;active(win.id)"
							@title="onTitleChange"
							@dragstart="draging=true"></window>
					</transition-group>
				</div>
			</div>

			<div class="background"></div>
		</div>
	</div>
</template>

<style scoped>
.topbar >>> a, .topbar >>> a:hover{
	text-decoration: none;
	color: #333;
}
.topbar >>> .topbar-icon{
	font-size: 150%;
	line-height: 3rem;
	margin-right: 1rem
}
</style>

<style scoped lang="scss">
@import 'variables.scss';

.desktop{
	display: flex;
	flex-direction:column;
	.background{
		z-index: -99;
		position: absolute;
		left:0;
		right:0;
		top:0;
		bottom: 0;
	}
	.top{
		height:4rem;background:$finder-top-color;
		display:flex;    align-items: center;
		.brand{
			height:100%;
			color: #f0f0f0;
			flex:1;
			display:flex;
			align-items:center;
			img{
				height:2.6rem;
				width:auto;
				margin-left: 3rem;
			}
		}
		.icons{
			min-width: $topbar-icons-width;
			text-align: right;
			line-height: $topbar-height;
			padding-left: 1rem;
			padding-right: 1rem;
			padding:0 2rem;
		}
	}
	.deskmain{
		display: flex;
		position: absolute;
		top: 4rem;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		z-index:-1;
	}
}

.taskbar-enter-active, .taskbar-leave-active {
  transition: opacity .2s
}
.taskbar-enter, .taskbar-leave-to{
  opacity: 0;
}

.window-enter-active, .window-leave-active {
  transition: all  .2s;
  z-index: 999;
}
.window-enter, .window-leave-to{
  opacity: 0;
  transform: scale(0.6);
  z-index: 999;
}

.unselectable{
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	cursor: default;
}

.topbar{
	border-bottom: 1px solid #ccc;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: topbar-height;
	background: $topbar-bg;

	.topbar-shadow{
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: -20;
		background: transparent;
		box-shadow:0px 0px 10px rgba(0,0,0,0.3);
	}
	.taskbar{
		line-height: $topbar-height;
		display: flex;
		margin-right: $topbar-icons-width;
		height: $topbar-height;
	}
	.taskbar-item{
		flex: $task-item-width 0;
		display: flex;
		position: relative;
		z-index: 199;
		top:1px;
		max-width:16rem;
		align-items: flex-end;
		&.active{
			z-index:999;
		}
		&:first-child{
			padding-left:1rem;
		}
	}
	.taskbar-item .close{
		position: absolute;
		top: 0.9rem;
		right: 1rem;
		font-size: 1.3rem;
		border: 2px solid #dcdcdc;
		border-radius: 50%;
		background: #dcdcdc;
	}
	.taskbar-item-title{
		flex: 1 1;
		margin: 0 0.5rem;
		font-size:1.2rem;
		line-height: 2.2rem;
		text-overflow: ellipsis;
		cursor: pointer;
		display: flex ;
		white-space: nowrap;
		max-width: $task-item-width;
		justify-content:center;
		background:#dcdcdc;
		border-top:1px solid #999;
		position: relative;
		height:2.2rem;
		&:hover{
			background:#eee;
			em{
				background:#eee;
			}	
		}
		em{
			position: absolute;
		    height: 100%;
		    width: 3.5rem;
		    background: #dcdcdc;
		    border-top: 1px solid #999;
		    z-index: -1;
		    &.right{
		    	transform: rotate(55deg);
		    	transform-origin: 0 0;
			    right: -3.5rem;
			    top: -1px;
		    }
		    &.left{
		    	transform: rotate(-55deg);
		    	transform-origin: right 0;
			    left: -2.76rem;
			    width:2.7rem;
			    top: -1px;
		    }
		}

	}
	.active .taskbar-item-title{
		// background: $topbar-active-bg;
		cursor: default;
		// border-color: $taskbar-border-active-color;
			background:#fff;
		em {
			background:#fff;
		}
	}
	.taskbar-item-split{
		flex: 1px 0;
		background: transparent;
		margin: 5px 2px;
	}
}

.main{
	flex: 1 1;
	position: relative;

	.workspace{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: $topbar-height;
		z-index:999;
	}
}

.sidepanel{
	background: $sidebar-bg;
	// background: linear-gradient(45deg,#0f1e48,#0690df);
	border-right:1px solid #ccc;
	flex: $sidebar-width 0;
	// color: sidebar-fg;
	color:#fff;
	display: flex;
	flex-direction: column;
	z-index:-1;
	.searchbar input{
		background: rgba(255,255,255, 0.2);
		border: 1px solid rgba(255,255,255, 0.5);
	}

	.searchbar{
		flex: 3rem 0;
		padding-bottom: 1rem;
	}

	.menus{
		flex: 1 1;
		overflow:auto;
	}

	.copyright{
		flex: 1rem 0;
		padding: 1rem;
		text-align: center;
		font-size: 0.8rem;
		color: #ccc;
	}
}
</style>

<script>
export default {
	props: ["menus", "search"],
	data() {
		return {
			draging: false,
			win_id: 0,
			title: "",
			windows: {},
			layers: []
		}
	},
	mounted(){
		this.$watch('layers', this.setLayers);
		this.title = document.title;
		window.$desktop = this;
	},
	methods: {
		link_action(ev){
			var el = this.find_el(ev.target, 'A', 3);
			if(el){
				var target = $(el).attr('target');
				var url = $(el).attr('href');
				if(target=='window'){
					this.open(url);
					ev.stopPropagation();
			        ev.preventDefault();
				}else if(target && target.length>7 && target.substr(0, 7)=='window:'){
					var win_name = target.substr(7);
					var win = this.get_window_by_name(win_name);
					if(win){
						win.load(url);
						this.active(win.id);
					}else{
						this.open(url, win_name);
					}
					ev.stopPropagation();
			        ev.preventDefault();
				}
			}
		},
		find_el(el, tag, n){
			if(el.tagName==tag){
				return el;
			}else if(n!=0){
				return this.find_el(el.parentNode, tag, n-1);
			}else{
				return false;
			}
		},
		open(url, name) {
			var win = {
				id: this.win_id++,
				width: 640,
				height: 480,
				zindex: 0,
				title: "",
				name: name,
				is_min: false,
				is_pin: false,
				is_max: true,
				url: url
			};

			win.left = 20 + ($(this.$refs.workspace).width() - win.width - 20) * Math.random();
			win.top = 20 + ($(this.$refs.workspace).height() - win.height - 50 - 20) * Math.random();

			this.layers.push(win.id);
			this.$set(this.windows, win.id, win);
		},
		pin(id, is_pin){
			this.windows[id].is_pin = is_pin;
		},
		active(id){
			this.layers = this.delete(this.layers, id);
			this.layers.push(id);
		},
		delete(list, item){
			var len = list.length;
			var new_list = [];
			for(var i=0;i<len;i++){
				if(item!=list[i]){
					new_list.push(list[i]);
				}
			}
			return new_list;
		},
		get_window_by_id(id){
			if(!this.$refs.win){
				return false;
			}
			for(var i=0; i<this.$refs.win.length; i++){
				var win = this.$refs.win[i];
				if(win.id==id){
					return win;
				}
			}
			return false;
		},
		get_window_by_name(name){
			if(!this.$refs.win){
				return false;
			}
			for(var i=0; i<this.$refs.win.length; i++){
				var win = this.$refs.win[i];
				if(win.name==name){
					return win;
				}
			}
			return false;
		},
		show(id){
			var win = this.get_window_by_id(id);
			if(win.is_min){
				win.min_restore();
				this.active(id);
			}else if(win.isfocus){
				win.min();
			}else{
				this.active(id);
			}
		},
		setLayers() {
			var len = this.layers.length;
			var last_show;
			for(var i=0;i<len;i++){
			if(!this.windows[this.layers[i]]) continue ;
				this.$set(this.windows[this.layers[i]], 'zindex', i);
				this.$set(this.windows[this.layers[i]], 'isfocus', false);
				if(this.windows[this.layers[i]].is_min==false){
					last_show = this.windows[this.layers[i]];
				}
			}
			if(last_show){
				this.updateTitle(last_show);
				last_show.isfocus = true;
			}
		},
		updateTitle(win){
			document.title = win.title? ( win.title + ' - ' + this.title ) : this.title;
		},
		close(id){
			this.layers = this.delete(this.layers, id);
			this.$delete(this.windows, id);
		},
		onTitleChange(id, title){
			this.windows[id].title = title;
			if(this.windows[id].isfocus){
				this.updateTitle(this.windows[id]);
			}
		},
		onMinChange(id, is_min){
			this.windows[id].is_min = is_min;
			this.setLayers();
		},
		onMaxChange(id, is_max){
			this.windows[id].is_max = is_max;
		},
		onUrlChange(id, url){
			this.windows[id].url = url;
		}
	}
}
</script>