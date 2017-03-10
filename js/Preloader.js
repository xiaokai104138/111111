Fish.Preloader = function(game){
	Fish.Game.width = 320;
	Fish.Game.height = 480;
};
Fish.Preloader.prototype = { 
	//预加载
	preload: function(){
		//设置加载图片
		this.preloadBar = this.add.sprite(Fish.Game.width/2, Fish.Game.height/2, "preloaderBar");
		this.preloadBar.anchor.set(0.5);
		this.load.setPreloadSprite(this.preloadBar);
		//加载资源
		this.load.image("start_background","assets/image/start_background.jpg"); 
		this.load.image("start_button","assets/image/start_button.png");
		this.load.image("haidi","assets/image/haidi.png");
		this.load.image("bubble","assets/image/bubble.png");
		this.load.spritesheet("fish","assets/image/fish.png",20,20);
		this.load.image("fish2","assets/image/fish2.png");
		this.load.image("shanhu","assets/image/shanhu.png");
		this.load.image("arrow","assets/image/arrow.png");
		this.load.image("restart","assets/image/restart.png");
		this.load.image("tishi_button","assets/image/tishi.png");
		this.load.image("tishiban","assets/image/tishiban.png");
		this.load.image("yinyueban","assets/image/yinyueban.png");
		this.load.image("star1","assets/image/star1.png");
		this.load.image("star2","assets/image/star2.png");
		this.load.image("yinyue","assets/image/yinyue.png");
		this.load.image("qingchu_button","assets/image/qingchu_button.png");
		this.load.audio("start_music","assets/audio/start_music.mp3");
		this.load.audio("main_music1","assets/audio/main_music1.mp3");
		this.load.audio("main_music2","assets/audio/main_music2.mp3");
		this.load.audio("eat_music","assets/audio/eat_music.mp3");
	}, 
	create: function(){
		// 跳转到主界面
		this.state.start('MainMenu');
	}
};