var Fish={};
Fish.Boot = function(game){};
Fish.Boot.prototype = {
	preload: function(){
		//添加加载进度条
		this.load.image("preloaderBar","assets/image/loading-bar.png");
	},
	create: function(){
		this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.state.start('Preloader');
	}
};