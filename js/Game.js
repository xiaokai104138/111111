Fish.Game = function(game){	};
//游戏背景音乐
var main_music1;
var main_music2;
var main_music3;
var fish; // 贪吃鱼
var arrow; // 指示箭头
var rotateDirection = 1; //旋转方向:1顺时针, 2逆时针 
var power = 0; //火力
var hudText; //得分
var charging=false; //是否在积蓄火力
var degToRad=0.0174532925; //度弧度的转换
var score = 0; //分数
var fish2; //被吃的鱼
var shanhuArray = []; //珊瑚数组
var gameOver = false; //判断是否结束游戏
var friction = 0.99; //贪吃鱼在水中的阻力
var radius = 10; //所有元素半径
var rotateSpeed = 3; //箭头旋转速度
var minPower = 50; //最小火力
var maxPower = 200; //最大火力          
var emitter; //粒子
var max_score = 0; //最高分
var sounds = [];
var musicArray = [];
var current;
if(localStorage.getItem("max",max_score)!=null){
	max_score = localStorage.getItem("max",max_score);
}
Fish.Game.prototype = {
	//生成游戏对象
	create:function(){
		//加载游戏背景图
		this.add.image(0, 0, 'haidi');
		//加载游戏背景音乐
		main_music1 = this.add.audio("main_music1",0.5,true);
		main_music2 = this.add.audio("main_music2",0.5,true);
		start_music = this.add.audio("start_music",0.5,true);
		musicArray = [main_music1,main_music2,start_music];
		//通过判断是否勾选歌曲播放
		
		for(i = 0;i<Math.ceil(localStorage.getItem("max",max_score)/5);i++){
		//for(i = 0;i<2;i++){
			if(FlagArray[i]){
				sounds.push(musicArray[i]);
			}
		}
		//判断是否为空，第一次玩或者没有积分
		if(sounds.length != 0){
			sounds[0].play();
		}else{
			musicArray[0].play();
		}
		//设置发射器(横,纵坐标,粒子数量)
	    emitter = this.add.emitter(this.world.centerX, 460, 50);//第三个参数代表粒子数量
		//加载泡泡图片
	    emitter.makeParticles('bubble');
	    //设置粒子是否旋转
	    emitter.setRotation(0, 0);
	    emitter.setAlpha(0.1, 1, 3000); 
	    emitter.setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
	    emitter.gravity = -200;
	    emitter.start(false, 5000, 400);//第三个参数越小发射的越快
	    emitter.emitX = 0;
		//设置泡泡发射器的位置true代表是否移动
	    this.add.tween(emitter).to( { emitX: 320 }, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
		//加载贪吃鱼
		fish = this.add.sprite(this.world.centerX,this.world.centerY,"fish");
		//给鱼瞄点
		fish.anchor.x = 0.5;
		fish.anchor.y = 0.5;
		//给贪吃鱼添加动画效果
		fish.animations.add('charging',[0,1,2],10,true);
		//给鱼初始加速度
		fish.xSpeed = 0;
		fish.ySpeed = 0;
		//被吃的鱼
		fish2 = this.add.sprite(0,0,"fish2");
		fish2.anchor.x =0.5;
		fish2.anchor.y =0.5;
		//加载箭头
		arrow = this.add.sprite(this.world.centerX,this.world.centerY,"arrow");
		arrow.anchor.x = -1;
  		arrow.anchor.y = 0.5;
  		//放置珊瑚 
  		Fish.method.placeShanhu(this);
  		//放置被吃的鱼
  		Fish.method.placeFish2();
  		//设置计分板
  		hudText = this.add.text(5,0,"",{
		    font: "11px Arial",
		    fill: "#ffffff", 
		    align: "left" 
		});
		Fish.method.updateHud();
		//鼠标监听事件
		this.input.onDown.add(Fish.method.charge,this);
	},
	//不断刷新渲染
	update:function(){
		//如果游戏没结束
		if(!gameOver){
			Fish.method.updateHud();
			//判断是否在积蓄能量
			if(charging){
		      	fish.animations.stop();
		  		fish.frame = 0;//第四帧	
		  		power+=2;
		  		//取最小值
		  		power = Math.min(power,maxPower);
		  		Fish.method.updateHud();
		    }
		    else{
		    	arrow.angle+=rotateSpeed*rotateDirection;
	      		fish.angle+=rotateSpeed*rotateDirection;
		      	fish.animations.play('charging');
		    }
		    //设置鱼的位置
		    fish.x+=fish.xSpeed;
		    fish.y+=fish.ySpeed;
		    //给鱼添加阻力，减少鱼的速度
		    fish.xSpeed *= friction;
		    fish.ySpeed *= friction;
		    //设置墙壁，不让鱼出去
			Fish.method.wallBounce();
			//设置指示箭头位置和鱼保持一致
	    	arrow.x = fish.x;
	    	arrow.y =fish.y;
	    	//贪吃鱼吃到了鱼
	    	if(Fish.method.getDistance(fish,fish2)<(radius*2)*(radius*2)){
		    	score += 1;
		    	Fish.method.updateHud();
		    	Fish.method.placeShanhu(this);
		    	Fish.method.placeFish2();
		    }
	    	//判断贪吃鱼是否撞在珊瑚上
	    	for(var i = 0;i<shanhuArray.length;i++){
	    		if(Fish.method.getDistance(fish,shanhuArray[i])<(radius*2)*(radius*2)){
	    			gameOver = true;
//	    			main_music1.stop();
					//更新值
	    			if(localStorage.getItem("max",max_score)==null){
						localStorage.setItem("max",max_score);
					}else{
						if(localStorage.getItem("max",max_score)<max_score){
							localStorage.setItem("max",max_score);
						} 
					}
					//停止音乐
					if(sounds.length != 0){
						sounds[0].stop();
					}else{
						musicArray[0].stop();
					}
					sounds = [];
	    			this.add.button(40, 300, "restart", this.restart, this);
	    		}
	    	}
	    }
	},
	//重新开始游戏
	restart:function(){
		if(max_score<score){
	    	max_score = score;
	    }
		score = 0;
		shanhuArray = [];
		gameOver = false;
		this.state.start("MainMenu");
	}
};
//外部方法
Fish.method = {
//	start:function(){
//		sounds.shift();
//		sounds[0].loopFull(0.6);
//		
//		
//	},
	//更新计分板
	updateHud:function(){
		//判断当前得分是否高于最高分
		if(score>max_score){
			max_score = score;
		}
		//更新数值
		hudText.text = "Power: "+power+"     Score: "+score+"     Max_score:"+max_score
	},
	//放置珊瑚
	placeShanhu:function(game){
		var shanhu = game.add.sprite(0,0,"shanhu");
		shanhu.anchor.x = 0.5;
		shanhu.anchor.y = 0.5;
		//放进数组
		shanhuArray.push(shanhu);
		//当鱼和珊瑚组之间距离不合适或珊瑚组之间距离不合适，循环数组,随机生成珊瑚
		do{
			for(var i = 0;i<shanhuArray.length;i++){
			    var randomX=Math.random()*(Fish.Game.width-2*radius)+radius;
			    var randomY=Math.random()*(Fish.Game.height-2*radius)+radius;
			    shanhuArray[i].x=randomX;
			    shanhuArray[i].y=randomY;
			};
		}while(Fish.method.illegalShanhu());
	},
	//放置被吃的鱼 
	placeFish2:function(){
		do{
			var randomX=Math.random()*(Fish.Game.width-2*radius)+radius;
			var randomY=Math.random()*(Fish.Game.height-2*radius)+radius;
			fish2.x = randomX;
			fish2.y = randomY;
		}while(Fish.method.illegalFish2());
	},
	//鼠标按下
	charge:function(){
		power = minPower;
		this.input.onDown.remove(Fish.method.charge,this);
		this.input.onUp.add(Fish.method.fire,this);
		charging = true;
	}, 
	//鼠标按下增加积蓄能量
	//松开发射
	fire:function(){
		this.input.onUp.remove(Fish.method.fire,this);
		this.input.onDown.add(Fish.method.charge,this);
		fish.xSpeed += Math.cos(arrow.angle*degToRad)*power/20;
		fish.ySpeed += Math.sin(arrow.angle*degToRad)*power/20;
		power = 0;
		//转向
		rotateDirection*=-1;
		charging = false;
	},
	//阻止鱼出界
	wallBounce:function(){
		//当鱼撞在左边框
		if(fish.x<radius){
			fish.x = radius;
			fish.xSpeed *= -1;
		}
		//撞在上边框
		if(fish.y<radius){
			fish.y = radius;
			fish.ySpeed *= -1;
		}
		//撞在右边框
		if(fish.x>Fish.Game.width-radius){
			fish.x = Fish.Game.width-radius;
			fish.xSpeed *= -1;
		}
		//撞在下边框
		if(fish.y>Fish.Game.height-radius){
			fish.y = Fish.Game.height-radius;
			fish.ySpeed *= -1;
		}
	},
	//计算距离
	getDistance:function(from,to){
	  var xDist = from.x-to.x;
	  var yDist = from.y-to.y;
	  return xDist*xDist+yDist*yDist;
	},
	//判断鱼和珊瑚的距离小于3个半径的话需要换位置
	illegalShanhu:function(){
		//珊瑚组和鱼的位置比较
		for(var i=0;i<shanhuArray.length;i++){
			if(Fish.method.getDistance(fish,shanhuArray[i])<(radius*3)*(radius*3)){
			    return true;
			 }
	 	}
		//珊瑚组之间的比较
		for(var i=0;i<shanhuArray.length-1;i++){
			for(var j = i+1;j<shanhuArray.length;j++){
				if(Fish.method.getDistance(shanhuArray[i],shanhuArray[j])<(radius*2)*(radius*2)){
					return true;
				}
			}
		}
		return false;
	},
	//判断被吃的鱼和其他元素之间的距离
	illegalFish2:function(){
		//鱼和鱼
		if(Fish.method.getDistance(fish,fish2)<(radius*2.5)*(radius*2.5)){
		    return true;
		}
		//鱼和珊瑚数组
		for(var i = 0;i<shanhuArray.length;i++){
			if(Fish.method.getDistance(shanhuArray[i],fish2)<(radius*3)*(radius*3)){
				return true;
			} 
		}
		return false;
	}
}
