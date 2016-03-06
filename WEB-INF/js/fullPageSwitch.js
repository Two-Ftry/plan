
(function($){
	var _prefix = (function(temp){
		var aPrefixs = ['webkit', 'Moz', 'o', 'ms'];
		for(var i in aPrefixs){
			if(temp.style[aPrefixs[i] + 'Transition'] !== undefined){
				return aPrefixs[i].toLowerCase() + '-';
			}
		}
		return false;
	})(document.createElement(PageSwitch));
	var PageSwitch = (function(){
		function PageSwitch(element, options){
			this.settings = $.extend(true, $.fn.PageSwitch.defaults, options);
			this.element = element;
			this.init();
		}
		PageSwitch.prototype = {
			init: function(){
				var me = this;
				me.sessions = me.settings.selector.sessions;
				me.session = me.settings.selector.session;
				me.direction = me.settings.direction === 'vertical' ? true : false;
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;
				
				me.canScroll = true;
				
				me._initLayout();
				me._initPaging();
				me._initEvent();
			},
			pagesCount: function(){
				var me = this;
				var count = me.element.find(me.settings.selector.session).length;
				return count;
			},
			switchLength: function(){
				var me = this;
				if(me.direction){
					return me.element.height();
				}else{
					return me.element.width();
				}
			},
			_initLayout: function(){
				var me = this;
				var count = me.pagesCount;
				if(!me.direction){
					me.element.find(me.sessions).css({'width': count*100 +'%'});
					me.element.find(me.session).css({'width': (100/count).toFixed(2) + '%'});
					me.element.find(me.session).css('float', 'left');
				}
			},
			_initPaging: function(){
				var me = this;
				var pageClass = me.settings.selector.page;
				var s = '<ul class="' + pageClass.substring(1) + '">';
				var count = me.pagesCount;
				for(var i = 0; i < count; i++){
					s += '<li></li>';
				}
				s += '</ul>';
				me.element.append(s);
				me.element.find(pageClass + ' li').eq(me.index).addClass(me.settings.selector.active.substring(1));
				var $pageUl = me.element.find(pageClass);
				if(!me.direction){
					$pageUl.addClass(me.settings.selector.horizontalPlace.substring(1));
					me.element.find(pageClass + ' li').css('float', 'left');
				}else{
					$pageUl.addClass(me.settings.selector.verticalPlace.substring(1));
				}
				if(!me.settings.pagination){
					$pageUl.css('display', 'none');
				}
				me.pageItem = me.element.find(pageClass + ' li');
			},
			_initEvent: function(){
				var me = this;
				//点击事件
				me.element.on('click', me.settings.selector.page + ' li', function(){
					me.index = $(this).index();
					me._scrollPage();
				});
				//滚动事件
				me.element.on('mousewheel DOMMouseScroll', function(e){
					if(me.canScroll){
						var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
						if(delta>0 && (me.index && !me.settings.loop || me.settings.loop)){
							me.prev();
						}else if(delta < 0 &&(me.index < (me.pagesCount-1) && !me.settings.loop || me.settings.loop)){
							me.next();
						}
					}
				});
				//键盘事件
				if(me.settings.keyboard){
					$(window).on('keydown', function(e){
						var keyCode = e.keyCode;
						if(keyCode == 37 || keyCode == 38){
							me.prev();
						}else if(keyCode == 39 || keyCode == 40){
							me.next();
						}
					});
				}
				//缩放窗口
				$(window).resize(function(){
					me._scrollPage();
				});
				
				//transitonend事件
				me.element.find(me.settings.selector.sessions).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(){
					me.canScroll = true;
					if(me.settings.callback && $.type(me.settings.callback) == 'function'){
						me.settings.callback();
					}
				});
			},
			prev: function(){
				var me = this;
				if(me.index > 0){
					me.index --;
				}else if(me.settings.loop){
					me.index = me.pagesCount - 1;
				}
				me._scrollPage();
			},
			next: function(){
				var me = this;
				if(me.index < me.pagesCount-1){
					me.index ++;
				}else if(me.settings.loop){
					me.index = 0;
				}
				me._scrollPage();
			},
			_scrollPage:function(){
				var me = this;
				var sessions = me.element.find(me.settings.selector.sessions);
				var distance = me.switchLength()*me.index;
			    me.canScroll = false;
				if(_prefix){
					var transitionCss = 'all ' + me.settings.duration + 'ms ' + me.settings.easing;
					sessions.css(_prefix + 'transition', transitionCss);
					sessions.css('transition', transitionCss);
					
					var translate = me.direction ? 'translateY(-' + distance + 'px)' : 'translateX(-' + distance + 'px)';
					sessions.css(_prefix + 'transform', translate);
					sessions.css('transform', translate);
				}else{
					var animateCss = me.direction ?{top: -distance + 'px'} :{left: -distance + 'px'};
					sessions.animate(animateCss, me.settings.duration, me.settings.easing, function(){
						 me.canScroll = true;
						 if(me.settings.callback && $.type(me.settings.callback) == 'function'){
							me.settings.callback();
						}
					});
				}
				
				if(me.settings.pagination){
					var activeClass = me.settings.selector.active.substring(1);
					me.pageItem.eq(me.index).addClass(activeClass).siblings('li').removeClass(activeClass);
				}
			}
		};
		
		return PageSwitch;
	})();
	
	$.fn.PageSwitch = function(options){
		return this.each(function(){
			var me = $(this),
				instance = me.data('PageSwitch');
			if(!instance){
				instance = new PageSwitch(me, options);
				me.data('PageSwitch', instance);
			}
			if($.type(options) === 'string') return instance[options]();
		});
	};
	
	$.fn.PageSwitch.defaults = {
						selector: {
							sessions : '.sessions',
							session : '.session',
							page: '.pagination',
							active: '.active',
							verticalPlace: '.right-center',
							horizontalPlace: '.center-bottom'
						},
						index: 0,
						duration: 500,
						easing: 'linear',
						pagination: true,
						keyboard: true,
						direction: 'vertical',//horizotal/vertical
						loop: false,
						callback: ''
					};
})(jQuery);

$(function(){
	//{direction: 'horizontal'}
	$('.container').PageSwitch();
});
