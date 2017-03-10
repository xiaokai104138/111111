Fish.MainMenu = function(game){
	FlagArray = [true,true,true];
	var max_score = 0;
};
var start_music; //开始背景音乐
var text1;		 //提示信息
var style = { font: "30px Arial", fill: "#f0ffff", align: "center" };//#ff0044
var tishi_flag = true; //提示板标识
var tishiban;		   //提示板
var yinyue_flag = true;//音乐版标识
var yinyueban;		   //音乐板
var starArray = [];		   //星星数组
var star;
var flag = false;
var qingchu_button;
Fish.MainMenu.prototype = {
	create: function(){
		//加载开始背景水平垂直对齐,不会随着缩小放大而受影响
		this.add.image(0, 0, 'start_background');
		//添加提示按钮
		this.add.button(250, 10, 'tishi_button', this.tishi, this, 1, 0, 2);
		//添加音乐图标
		this.add.button(20, 10, 'yinyue', this.yinyue, this, 1, 0, 2);
		this.scale.pageAlignHorizontally = true;
  		this.scale.pageAlignVertically = true;
  		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  		//添加开始画面背景音乐
		start_music = this.add.audio("start_music",0.5,true);
		start_music.play();
  		//加载游戏开始按钮 
  		this.add.button(this.world.centerX-50, 350, 'start_button', this.startGame, this, 1, 0, 2);
	},
	startGame: function() {
		//结束开始背景音乐
		start_music.stop();
		// 开始游戏
		this.state.start('Game');
	},
	//判断是否按下提示按钮
	tishi:function(){
		if(tishi_flag){
			//添加提示板
			tishiban = this.add.image(this.world.centerX, this.world.centerY-60,"tishiban");
			tishiban.anchor.set(0.5);
			//添加提示信息
			text1 = this.add.text(this.world.centerX, this.world.centerY-60, "进入游戏后\n请点击鼠标或屏幕\n进行移动", style);
			text1.anchor.set(0.5);
			//设置标记
			tishi_flag = false;
		}else{
			//销毁
			text1.destroy();
			tishiban.destroy();
			//设置标记
			tishi_flag = true;
		}
		
	},
	//判断是否按下音乐按钮
	yinyue:function(){
//		//判断解锁的音乐个数
		var score_number = Math.ceil(localStorage.getItem("max",max_score)/5);
		//var score_number = 3;
		//防止分数溢出
		if(score_number>3){
			score_number = 3;
		}
		//防止分数为0
		if(score_number==0){
			score_number = 1;
		}
		if(yinyue_flag){
			//添加成就板
			var i;
			//音乐板
			yinyueban = this.add.image(this.world.centerX, this.world.centerY-120,"yinyueban");
			yinyueban.anchor.set(0.5);
			//清理缓存按钮
			qingchu_button = this.add.button(this.world.centerX+90, this.world.centerY-120,"qingchu_button",this.qingchu,this,0,0,0);
			qingchu_button.anchor.set(0.5);
			//音乐按钮
			for(i = 0;i<score_number;i++){
				if(FlagArray[i] && !flag){
					star = this.add.button(this.world.centerX-90+i*60, this.world.centerY-120, 'star2', eval("this.change_star_style"+i), this,2,0,1);
					star.anchor.set(0.5);
					starArray.push(star);
					flag = true;
				}else{
					star = this.add.button(this.world.centerX-90+i*60, this.world.centerY-120, 'star1', eval("this.change_star_style"+i+i), this,2,0,1);
					star.anchor.set(0.5);
					starArray.push(star);
				}
			}
			//设置标识
			yinyue_flag = false; 
		}else{
			//销毁
			yinyueban.destroy();
			qingchu_button.destroy();
			for(var i = 0;i<starArray.length;i++){
				starArray[i].destroy();
			};
			starArray = [];
			//设置标识
			yinyue_flag = true;
			flag = false;
		}
	},
	qingchu:function(){
		//清空缓存
		max_score = 0;
		localStorage.clear();
		start_music.stop();
		this.state.start("Boot");
	},
	change_star_style0:function(){
		if(flag){
			starArray[0].destroy();
			var star = this.add.button(this.world.centerX-90, this.world.centerY-120, 'star1',this.change_star_style00, this,2,0,1);
			star.anchor.set(0.5);
			starArray[0] = star;
			FlagArray[0] = false;
			flag = false;
		}
		
		
	},
	change_star_style1:function(){
		if(flag){
			starArray[1].destroy();
			var star = this.add.button(this.world.centerX-90+60, this.world.centerY-120, 'star1',this.change_star_style11, this,2,0,1);
			star.anchor.set(0.5);
			starArray[1] = star;
			FlagArray[1] = false;
			flag = false;
		}
	},
	change_star_style2:function(){
		if(flag){
			starArray[2].destroy();
			var star = this.add.button(this.world.centerX-90+120, this.world.centerY-120, 'star1',this.change_star_style22, this,2,0,1);
			star.anchor.set(0.5);
			starArray[2] = star;
			FlagArray[2] = false;
				flag = false;
		}
	},
	change_star_style00:function(){
		if(!flag){
			starArray[0].destroy();
			var star = this.add.button(this.world.centerX-90, this.world.centerY-120, 'star2',this.change_star_style0, this,2,0,1);
			star.anchor.set(0.5);
			starArray[0] = star;
			FlagArray[0] = true;
			flag = true;
		}
		
	},
	change_star_style11:function(){
		if(!flag){
			starArray[1].destroy();
			var star = this.add.button(this.world.centerX-90+60, this.world.centerY-120, 'star2',this.change_star_style1, this,2,0,1);
			star.anchor.set(0.5);
			starArray[1] = star;
			FlagArray[1] = true;
			flag = true;
		}
	},
	change_star_style22:function(){
		if(!flag){
			starArray[2].destroy();
			var star = this.add.button(this.world.centerX-90+120, this.world.centerY-120, 'star2',this.change_star_style2, this,2,0,1);
			star.anchor.set(0.5);
			starArray[2] = star;
			FlagArray[2] = true;
			flag = true;
		}
	}
}; 