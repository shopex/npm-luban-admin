<template>
	<div class="box">
		<searchbar :items="searchbar" class="searchbar"></searchbar>
		<div class="tabber">
			<ul role="tablist" class="nav nav-tabs">
				<li class="active"><a>今日创建</a></li> 
				<li><a>今日创建</a></li> 
				<li><a>今日创建</a></li> 
				<li><a>今日创建</a></li> 
				<li><a>今日创建</a></li> 
			</ul>
		</div>
	</div>
</template>

<style scoped>
.box{
	display: flex;
}
.searchbar{
	flex: 20rem 0;
	padding-right: 2rem;
}
.tabber{
	flex: 1 1;
	display: flex;
	align-items: flex-end;
}
.tabber .nav-tabs{
	border: none;
}
.tabber .nav-tabs a{
	color: #666;
}
.tabber .nav-tabs .active a{
	background-color: #fff;
}
</style>

<script>
export default {
	props: ["searchbar"]
}
</script>