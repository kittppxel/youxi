
var coverInterval;//验证是否覆盖的定时器
// 点击隐藏开始按钮
$('gameStartButton').onclick = function(){
    // $('prompt').innerHTML = '请点击《开始游戏》';
    $('prompt').style.display = 'none';
    // $('gameStartButton').innerHTML = '开始游戏';
    $('gameStartButton').style.display = 'none';
    $('creditsButton').style.display = 'none';
    $('selectedBox').style.display = 'block';
    size.loader();
    // 生成卡片
    makeCard();
    // 开启覆盖的函数
    coverInterval = setInterval(coverCard,20);
    // 播放点击音效
    $('buttonAudio').play();
    // 播放背景音乐
    $('bgMusic').src = 'audio/gameBg.wav';
    $('bgMusic').play();
}

//index上肖了个肖的按钮
$('creditsButton').onclick = function(){
    $('gameBox').style.display = 'none';
    $('creditsBox').style.display = 'block';
    // 播放点击音效
    $('buttonAudio').play();
    // 播放背景音乐
    $('bgMusic').src = 'audio/creditsBg.wav';
    $('bgMusic').play();
}
//credits上返回的按钮
$('returnToIndex').onclick = function(){
    $('creditsBox').style.display = 'none';
    $('gameBox').style.display = 'block';
    // 播放点击音效
    $('buttonAudio').play();
    // 播放背景音乐
    $('bgMusic').src = 'audio/gameBg.wav';
}

// 读取vh和vw的size
var size = {
    width:-1,
    height:-1,
    loader(){
        this.width = $('size').offsetWidth;
        this.height = $('size').offsetHeight;
    }
}

// 读取normCard的数据
var normCardSize = {
    width:-1,
    height:-1,
    top:-1,
    left:-1,
    loader(){
        this.width = $('normCard').offsetWidth;
        this.height = $('normCard').offsetHeight;
        this.top = $('normCard').offsetTop;
        this.left = $('normCard').offsetLeft;
    }
}

// 读取cardBox的数据
var cardBoxSize = {
    width:-1,
    height:-1,
    top:-1,
    left:-1,
    loader(){
        this.width = $('cardBox').offsetWidth;
        this.height = $('cardBox').offsetHeight;
        this.top = $('cardBox').offsetTop;
        this.left = $('cardBox').offsetLeft;
    }
}

// 制造卡片
// 随机位置数据的生成
function cardTopRandom(){
    return (Math.random()*(cardBoxSize.height-normCardSize.height-10))+cardBoxSize.top;
}
function cardLeftRandom(){
    return (Math.random()*(cardBoxSize.width-normCardSize.width))+cardBoxSize.left;
}
//产生card的张数，一定要是3的倍数
var cardTimes = 9;
function makeCard(){
    var cardTop = -1;
    var cardLeft = -1;
    for(var i=0 ; i<cardTimes ; i++){
        for(var j=1 ; j<=12 ; j++){
            if(j<10){
                j='0'+j;
            }
            // 生成卡片框和确定位置
            var newCard = document.createElement('div');
            newCard.setAttribute('class','cardDiv');
            newCard.setAttribute('name',j);
            //随机位置数据的生成
            cardBoxSize.loader();
            normCardSize.loader();
            cardTop = cardTopRandom()+'px';
            cardLeft = cardLeftRandom()+'px';
            newCard.style.top = cardTop;
            newCard.style.left = cardLeft;
            $('cardBox').appendChild(newCard);
            // 卡片生成
            var skyCard = document.createElement('img');
            skyCard.setAttribute('class','skyCard');
            skyCard.setAttribute('name',newCard.getAttribute('name'));
            skyCard.style.backgroundImage = 'url(images/card'+j+'.png)';
            newCard.appendChild(skyCard);
            // 覆盖卡片生成
            var coverCard = document.createElement('img');
            coverCard.setAttribute('class','coverCard');
            coverCard.setAttribute('name',newCard.getAttribute('name'));
            coverCard.style.display = 'block';
            newCard.appendChild(coverCard);
            // 卡片点击效果
            skyCard.onclick = function(){
                // 播放点击音效
                $('clickAudio').play();
                // 添加块到选中盒子中
                var thisCard = document.createElement('img');
                thisCard.setAttribute('class','selectedCard');
                thisCard.setAttribute('name',this.getAttribute('name'));
                thisCard.style.backgroundImage = 'url(images/card'+this.getAttribute('name')+'.png)';
                $('selectedBox').appendChild(thisCard);
                // 删除游戏区的块
                this.parentNode.parentNode.removeChild(this.parentNode);
                //判断是否达到消除的条件（3个一组）
                meetTheConditions();
                // 判断是否赢
                endOrWin();
            }
        }
    }
}

//已有的卡片总类
var haveCardName = ["01","02","03","04","05","06","07","08","09","10","11","12"];
//判断是否达到消除的条件（3个一组）
function meetTheConditions(){
    // 所有selectedCard 的 数组
    var selectedCardArr = $$('selectedCard');
	//循环所有总类看有没有已经大于等于3个的
	haveCardName.forEach(function(curr){
		var number = 0;
		var haveCard = [];
		for(var i=0; i<selectedCardArr.length; i++){
		    if(selectedCardArr[i].name == curr){
				haveCard[number] = i;
		        number++;
		    }
		}
		if(number >= 3){
			//颠倒数组
			haveCard.reverse();
            // 让数组内所有值执行一次循环
			haveCard.forEach(function(curr1){
				selectedCardArr[curr1].remove();
			})
            $('scoreAudio').play();
		}
	});
}

//覆盖函数
function coverCard(){
    var allCard = $$('cardDiv');
    if(allCard.length==1){
        allCard[0].lastElementChild.style.display = 'none';
    }else if(allCard.length>1){
        for(var i=0 ; i<allCard.length ; i++){
            var thisCardWidth = allCard[i].offsetWidth;
            var thisCardHeight = allCard[i].offsetHeight;
            var thisCardTop = allCard[i].offsetTop;
            var thisCardLeft = allCard[i].offsetLeft;
            allCard[i].lastElementChild.style.display = 'none';
            // console.log(thisCardWidth,thisCardHeight,thisCardTop,thisCardLeft);
            for(var j=i+1 ; j<allCard.length ; j++){
                var nextCardWidth = allCard[j].offsetWidth;
                var nextCardHeight = allCard[j].offsetHeight;
                var nextCardTop = allCard[j].offsetTop;
                var nextCardLeft = allCard[j].offsetLeft;
                // console.log(nextCardWidth,nextCardWidth,nextCardTop,nextCardLeft);
                if((nextCardTop+nextCardHeight>thisCardTop+2 && 
                    nextCardTop<thisCardTop+thisCardHeight-2 && 
                    nextCardLeft+nextCardWidth>thisCardLeft+2 && 
                    nextCardLeft<thisCardLeft+thisCardWidth-2))
                {
                    allCard[i].lastElementChild.style.display = 'block';
                    allCard[j].lastElementChild.style.display = 'none';
                }
            }
        }
    }
}

//判断赢或输
function endOrWin(){
    var allCard = $$('cardDiv');
    var allSelectedCard = $$('selectedCard');
    if(allSelectedCard.length>=11){
        // 清空所有盒子
        $('cardBox').innerHTML = '';
        $('selectedBox').innerHTML = '';
        $('selectedBox').style.display = 'none';
        // 更改并显示标语和制作人信息
        $('prompt').innerHTML = '游戏结束！！！';
        $('prompt').style.display = 'block';
        $('gameStartButton').innerHTML = '重新开始游戏';
        $('gameStartButton').style.display = 'block';
        $('creditsButton').style.display = 'block';
        // 清除判断覆盖的函数
        clearInterval(coverInterval);
        // 关闭背景音乐
        $('bgMusic').pause();
        // 播放输的音效
        $('endAudio').play();
    }else{
        if(allCard.length<=0){
            // 清空所有盒子
            $('cardBox').innerHTML = '';
            $('selectedBox').innerHTML = '';
            $('selectedBox').style.display = 'none';
            // 更改并显示标语和制作人信息
            $('prompt').innerHTML = 'You Win!!!';
            $('prompt').style.display = 'block';
            $('gameStartButton').innerHTML = '再次游玩';
            $('gameStartButton').style.display = 'block';
            $('creditsButton').style.display = 'block';
            // 清除判断覆盖的函数
            clearInterval(coverInterval);
            // 关闭背景音乐
            $('bgMusic').pause();
            // 播放赢的音效
            $('winAudio').play();
        }
    }
}