/* jquery ---------------------------*/
$(document).ready(function(){
	var pageSwitch = $('.content').PageSwitch({
		direction: 'vertical',
		callback: function(){
			var index = $('.pagination li.active').index();
			$('.bg-img').removeClass('bg-to-small');
			var $bgImg = $('.session').eq(index).find('.bg-img');
			if($bgImg.length > 0){
				$bgImg.addClass('bg-to-small');
			}
		}
	});
	
	$('.m-list-item').hover(function(){
		$(this).find('.m-cover').removeClass('hide');
	}, function(){
		$(this).find('.m-cover').addClass('hide');
	});
	
	//ev-barrage
	$('.ev-barrage').click(function(){
		var $this = $(this);
		var $barrage = $this.closest('.barrage');
		if(!$this.hasClass('on')){
			$this.addClass('on');
			var data = ['我曹，这么牛逼', '其实还好啦！！！', 'rrr,最烂的片，没有之一', '喜欢喜欢，就是这个feel', '哈哈哈，就喜欢这个，楼上傻逼'];
			barrage(data);
			$barrage.find('.bar-layer span').addClass('hide');
			$barrage.find('.bar-layer input').focus();
		}else{
			$this.removeClass('on');
			$barrage.find('.bar-layer span').removeClass('hide');
			$('.barrage-item').remove();
		}
	});
	
	//transitonend事件
	$(document).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', '.barrage-item', function(){
		$(this).remove();
	});
	
	$('.bar-layer span').click(function(){
		var $this = $(this);
		var $barrage = $this.closest('.barrage');
		$this.addClass('hide');
		$barrage.find('input').focus();
		$barrage.find('.bar-btn-btn').remove('on').click();
	});
	
});

/**
 * 
 * @param {Object} data
 */
function barrage(data){
	var colors = ['red', 'yellow', 'green', 'orange'];
	var arr = new Array();
	var width = $('.sessions').width() + 1000;
	for(var i = 0, len = data.length; i < len; i++){
		//<p class="barrage-item">说的就是快点结婚时代科技试试收到</p>
		var $p = $('<p class="barrage-item">' + data[i] + '</p>');
		var duration = Math.floor(Math.random()*20000 + 15000);
		var c = Math.floor(Math.random() * colors.length);
		var y = Math.floor(Math.random()*250) + Math.floor(Math.random()*50);
		$('.content').append($p);
		$p.css('transition', 'all ' + duration + 'ms ease');
		$p.css('color', colors[c]);
		arr.push($p);
	}
	window.setTimeout(function(){
		for(var i = 0, len = arr.length; i < len; i++){
			arr[i].css('transform', 'translate('+ (-width) + 'px, ' + y + 'px)');
		}
	}, 500);
}

