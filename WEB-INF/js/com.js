/**
 * @desc 公共插件文件
 * 	1、popup动画
 * @requires zepto.min.js 
 * @author jianfeng_huang
 * @date 2016-03-04 10:14
 */
(function(window, $){
	var cUtil = {
		data:{
			
		},
		init: function(){
			this.bindEvt();
		},
		bindEvt: function(){
			$('#ev-slide-down').tap(function(event){
				event.stopPropagation();
				$('.c-pop-box').pop({
					'hideFire': ['.t-pop span', 'body']
				});
			});
		}
	};
	
	window.cUtil = window.cUtil || cUtil;
	
	var prefix = (function(){
		var prefixs = ['-webkit-','-moz-', '-o-', '-ms-'];
		var cssTransform = 'transform', htmlStyle = document.documentElement.style;
		for(var i in prefixs){
			cssTransform = prefixs[i] + cssTransform;
			if(cssTransform in htmlStyle){
				return prefixs[i];
			}
		}
		return '';
	})();
	
	var Pop = (function(){
		var Pop = function(ele, options){
			this.settings = $.extend(true, $.fn.pop.defaults, options);
			this.box = $(ele);
			this.directionIn = this.settings.directionIn === 'up' ? true : false;
			this.init();
		};
		
		return Pop; 
	})();
	
	Pop.prototype = {
			init:function(settings){
				if(this.box.length <= 0){
					return;
				}
				//初始化内容
				if(!this.inited){
					this.initPlace();
					//绑定事件
					this.bindEvent();
					this.initOffset();
					
					this.inited = true;
					this.trigger = true;
				}
				
				this.triggerFun();
			},
			initPlace: function(){
				this.setAttr = '';
				if(this.directionIn){
					this.setAttr = 'bottom';
				}else {
					this.setAttr = 'top';
				}
				this.box.css(this.setAttr,'-9999px');
				this.box.css('display', 'block');
				
				this.boxHeight = this.box.height();
				this.boxWidth = this.box.width();
				this.box.css(this.setAttr,'-' + this.boxHeight + 'px');
				
				var transitionCss = 'all ' + this.settings.duration + ' ' + this.settings.ease;
				this.box.css(prefix + 'transition', transitionCss);
			},
			//设置偏移量
			initOffset:function(){
				var y = this.settings.offsetY;
				if(!isNaN(y)){
					this.offset = y;
				}else if(y.indexOf('rem')){
					var html = document.documentElement;
					var $html = $(html);
					var fontSize = $html.css('fontSize');
					this.offset = parseFloat(y.split('rem')[0]) * parseFloat(fontSize.split('px')[0]);
				}else{
					this.offset = 0;
				}
			},
			show:function(){
				if(this.directionIn){
					this.box.css(prefix + 'transform','translateY(' + '-' + (this.boxHeight + this.offset )+ 'px)');
				}else{
					this.box.css(prefix + 'transform','translateY(' + (this.boxHeight + this.offset ) + 'px)');
				}
				this.trigger = false;
			},
			hide: function(){
				if(this.directionIn){
					this.box.css(prefix + 'transform','translateY(' + (this.boxHeight + this.offset )+ 'px)');
				}else{
					this.box.css(prefix + 'transform','translateY(' + '-'  + (this.boxHeight + this.offset ) + 'px)');
				}
				this.trigger = true;
			},
			triggerFun: function(){
				if(this.trigger){
					this.show();
				}else{
					this.hide();
				}
			},
			bindEvent: function(){
				var me = this, hideFire = this.settings.hideFire;
				if(!hideFire){
					return;
				}
				if(typeof hideFire === 'string'){
					me.bindSigleEvent(hideFire);
				}else if(hideFire instanceof Array){
					for(var i in hideFire){
						me.bindSigleEvent(hideFire[i]);
					}
				}
				
			},
			bindSigleEvent: function(selector){
				var me = this;
				if($(selector).length > 0){
					$(selector).on('tap', function(){
						me.hide();
					});
				}
			}
		};
	
	$.fn.pop = function(options){
		return this.each(function(){
			var me = this,
				instance = $(me).data('pop');
			if(!instance){
				instance = new Pop(me, options);
				$(me).data('pop', instance);
			}else{
				instance.init();
			}
		});
	};
	$.fn.pop.defaults = {
		ease: 'ease-out',//动画: linear | ease-in | ease-out | ease-in-out
		duration: '0.3s',//动画持续时间
		directionIn: 'up',//支持: down | up 
		offsetY: '0.2rem', //上下的偏移量，单位px|rem(支持数字和rem，默认是px，不用带px单位)
		hideFire: '' //点击隐藏
	};
	
})(window, Zepto);
