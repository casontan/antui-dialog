
/**
 @Name：antui v1.0.1 
 @Author：Cason
 @Site：
 @License：
 */
;var antui = (function(window){
	'use strict';

	var _options = {
		version:'1.0.1',
		name:'antui-dialog',
		tips_trigon_num: 10,
		is_css_loaded : false,//判断css是否加载完成 | 暂时没用
		auto_close_time : 3000,
		type: ['dialog', 'html', 'iframe', 'loading', 'tips'],
		tips_direction : ['left','right','top','bottom'],
	},
	_get_element = function(selected){//类似JQ的选择器
		if(!selected) return;
		switch(selected.substring(1,0)){
			case '#':
				return document.getElementById(selected.substring(1));
			case '.':
				return document.getElementsByClassName(selected.substring(1));
			default:
				return document.getElementsByTagName(selected)
		}
	},
	_is_include = function(){
		var links = _get_element('link');
		if(links.length < 1) return false;
		for (var i = links.length - 1; i >= 0; i--) {
			if(links[i].href.indexOf(_options.name)!=-1) return true;
		}
		return false;
	},
	_get_link_href = function(){
		var srcs = _get_element('script');
		if(srcs.length < 1) return false;
		for (var i = srcs.length - 1; i >= 0; i--) {
			if(srcs[i].src.indexOf(_options.name)!=-1){
				var src = srcs[i].src;
				return src.replace('/js/','/css/').replace('.js','.css');
			}
		}
		return null;
	},
	_is_mobile = function(){
		return /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent)
	},
	_close_by_selecter = function(selecter){
		var doms = _get_element(selecter);
		for (var i = doms.length - 1; i >= 0; i--)
			doms[i].parentElement.removeChild(doms[i]);
		_remove_shade();
	},
	_load_css = function(){
		var href = _get_link_href();
		var node = document.createElement('link');
		// node.href ='/static/css/antui-dialog.css';//其他属性设置省略 空白的 TAG 在 safari 上报错
		node.href = href; 
		node.rel = 'stylesheet';
		node.type = 'text/css';

		node.onload = function(){
		    _options.is_css_loaded = true;
		};
		node.onerror = function(){
		};
		_get_element('head')[0].appendChild(node);
	},
	_init = function(){
		if(!_is_include()){
			_load_css();
		}
	},
	_set_area_info = function(dom,area_info){
		dom.setAttribute('area',area_info.join(','));
	},
	_set_area = function(dom,area_info){
		// dom.
	},
	_show_shade = function(config){
		var shade = document.createElement('div');
		shade.className = 'ant-shade';
		var opacity = (config && config.opacity >= 0) ? config.opacity : 0.5;
		shade.style.opacity = opacity;
		document.body.appendChild(shade);

	},
	_remove_shade = function(){
		var shades = _get_element('.ant-shade');
		for (var i = shades.length - 1; i >= 0; i--) document.body.removeChild(shades[i]);
	},
	//适合需要计算宽高的元素
	_center_and_show = function(dom){
	  	//先删除 | 不严谨（如果是弹窗或者其他上面是可以叠加一个msg提示的）解决方案，优先级 msg < dialog < iframe
	  	document.body.appendChild(dom);
		var layouts = _get_element('.ant-msg-layout');
		if(layouts.length > 1) document.body.removeChild(layouts[0]);

		dom.style.opacity = 0;
		dom.style.left = (window.innerWidth - dom.offsetWidth) / 2 + 'px';
		dom.style.top = (window.innerHeight - dom.offsetHeight) / 2 + 'px';
		dom.style.opacity = 1;
    },
    //msg 消息内容 ，time 自动关闭时间，默认值3s 0 表示不自动关闭
	_msg = function(msg_val,time,callback){
		
		//自动关闭时间不传参数则设置为默认的时间
		time = time == undefined ? _options.auto_close_time : time;

		var time_handel;
     	var ant_layout = document.createElement('div');
      	ant_layout.className = 'ant-msg-layout ant-layout';
		var msg_dom = document.createElement('div');
		msg_dom.className = 'ant-msg';
		var msg_text = document.createTextNode(msg_val);
		msg_dom.appendChild(msg_text);
		ant_layout.appendChild(msg_dom);
		
		_center_and_show(ant_layout);

		//自动关闭处理
		if(!time) return;
		time_handel = setTimeout(function(){
			//关闭
			if(ant_layout.parentElement) document.body.removeChild(ant_layout);
			clearTimeout(time_handel);
			time_handel = null;
			if (typeof(callback) == 'function') callback();
		},time)
	},
	_show_loading = function(config,callback){
		var loader = document.createElement('div');
		loader.className = 'ant-loader ant-layout';
		var ball_list = document.createElement('div');
		ball_list.className = 'ant-ball-list';
		for (var i = 3 - 1; i >= 0; i--) {
			ball_list.appendChild(document.createElement('div'));
		}
		loader.appendChild(ball_list);
		_center_and_show(loader);

		if(!config) return;

		if(config.shade) _show_shade();
		
		if(config.time){
			var time_handel = setTimeout(function(){
				//关闭
				_close_loading();
				_remove_shade();
				clearTimeout(time_handel);
				time_handel = null;
				if (typeof(callback) == 'function') callback();
			},config.time)
		}

		
		
		
	},
	_close_loading = function(){
		var loaders = _get_element('.ant-loader');
		for (var i = loaders.length - 1; i >= 0; i--)
			document.body.removeChild(loaders[i]);
		
	},
	_create_tips = function(title,config,dom){
		dom = dom == null ? this : dom;
		var direction = config && config.direction ? config.direction : "right";
		var tips = document.createElement('div');
		tips.className = 'ant-tips-layout ant-tips-' + direction +' ant-layout';
		var content = document.createElement('div');
		content.className = 'ant-tips-content';
		var text_node = document.createTextNode(title);
		var trigon = document.createElement('i');
		trigon.className = 'ant-trigon';

		//appendChild
		content.appendChild(text_node);
		content.appendChild(trigon);
		tips.appendChild(content);

		//设置位置并显示
		document.body.appendChild(tips);
		_tips_position(tips,dom,direction);		
		
		var time = config && config.time ? config.time : 3000;
		if(time == 0) return;//不自动关闭

		var tip_timer = setTimeout(function(){
			tips.parentElement.removeChild(tips);
			clearTimeout(tip_timer);
		},time)

	},
	_tips_position = function(tips, dom, direction){
		switch(direction){
			case 'left':
				tips.style.top = dom.offsetTop + 'px';
				tips.style.left = (dom.offsetLeft - tips.offsetWidth - _options.tips_trigon_num)  + 'px';
			break;
			case 'top':
				tips.style.top = (dom.offsetTop - dom.offsetHeight - _options.tips_trigon_num) + 'px';
				tips.style.left = (dom.offsetLeft + dom.offsetWidth / 2 - _options.tips_trigon_num )  + 'px';
			break;
			case 'bottom':
				tips.style.top = (dom.offsetTop + dom.offsetHeight + _options.tips_trigon_num) + 'px';
				tips.style.left = (dom.offsetLeft + dom.offsetWidth / 2 - _options.tips_trigon_num )  + 'px';
			break;
			default://right
				tips.style.top = dom.offsetTop + 'px';
				tips.style.left = (dom.offsetLeft + dom.offsetWidth + _options.tips_trigon_num)  + 'px';
			break
		}	
	},
	_tips = function(title,config,selected){
		if(typeof(selected) == "object"){
			_create_tips(title,config,selected);
			return;
		}
		var doms = _get_element(selected);
		if(doms.length){
			for (var i = doms.length - 1; i >= 0; i--) 
				_create_tips(title,config,doms[i]);
			return;
		}
		_create_tips(title,config,doms);
		
	},
	_dialog = function(content,config,callback){
		var layout = document.createElement('div');
		layout.className = 'ant-dialog-layout ant-layout';

		//如果有title
		if(config && config.title){
			var header = document.createElement('div');
			header.className = 'ant-layout-header';
			var header_text = document.createTextNode(config.title);
			header.appendChild(header_text);
			layout.appendChild(header);
		}
		//toolbar
		var toolbar = document.createElement('div');
		toolbar.className = 'ant-layout-toolbar';
		var icon = document.createElement('i');
		icon.className = 'fa fa-close ant-icon';
		icon.onclick = function(){
			document.body.removeChild(icon.parentElement.parentElement);//关闭
			document.body.removeChild(_get_element('.ant-shade')[0]);//关闭
			_remove_shade();
		};
		toolbar.appendChild(icon);
		layout.appendChild(toolbar);

		//body
		var ant_body = document.createElement('div');
		ant_body.className = 'ant-layout-body';
		var body_text = document.createTextNode(content);
		ant_body.appendChild(body_text);
		layout.appendChild(ant_body);

		//footer
		var footer = document.createElement('div');
		footer.className = 'ant-layout-footer';
		var btn = document.createElement('button');
		btn.className = 'antui-btn antui-btn-info';
		var btn_text = document.createTextNode('OK');
		btn.appendChild(btn_text);
		btn.onclick = function () {                          //绑定点击事件
			if (typeof(callback) == 'function') callback();
        	document.body.removeChild(btn.parentElement.parentElement);//关闭
        	document.body.removeChild(_get_element('.ant-shade')[0]);//关闭
     	};
     	footer.appendChild(btn);
     	layout.appendChild(footer);
     	_center_and_show(layout);
     	_show_shade();
     },
     _html = function(html_content,config,callback){
     	var layout = document.createElement('div');
		layout.className = 'ant-html-layout ant-layout';

		//如果有title
		if(config && config.title){
			var header = document.createElement('div');
			header.className = 'ant-layout-header';
			var header_text = document.createTextNode(config.title);
			header.appendChild(header_text);
			layout.appendChild(header);
		}
		//toolbar
		var toolbar = document.createElement('div');
		toolbar.className = 'ant-layout-toolbar';
		var icon = document.createElement('i');
		icon.className = 'fa fa-close ant-icon';
		icon.onclick = function(){
			document.body.removeChild(icon.parentElement.parentElement);//关闭
			document.body.removeChild(_get_element('.ant-shade')[0]);//关闭
			_remove_shade();
			//关闭后的回调
			if (typeof(callback) == 'function') callback();
		};
		toolbar.appendChild(icon);
		layout.appendChild(toolbar);

		//body
		var ant_body = document.createElement('div');
		ant_body.className = 'ant-layout-body';

		//添加html
		ant_body.innerHTML = html_content;
		layout.appendChild(ant_body);

     	_center_and_show(layout);
     	_show_shade();
     },
     _iframe = function(url, config){
     	//create {'title':'','width':'','height':'','is_auto_full':0,'shade_close':0}

     	//最外层
     	var iframe_layout = document.createElement('div');
     	iframe_layout.className = 'ant-ifame-layout ant-layout';

     	//弹窗标题
     	var header = document.createElement('div');

     	var layout_title = (config  && config.title)? config.title : '弹窗';
     	header.className = 'ant-layout-header';
     	var title_node = document.createTextNode(layout_title);
     	
     	//右侧操作按钮
     	var toolbar = document.createElement('div');
     	toolbar.className = 'ant-layout-toolbar';

     	// var min_icon = document.createElement('i');
     	// min_icon.className = 'fa fa-window-minimize ant-icon';

     	var full_icon = document.createElement('i');
     	full_icon.className = 'fa fa-clone ant-icon ant-icon-full';
     	var close_icon = document.createElement('i');
     	close_icon.className = 'fa fa-close ant-icon';

     	//body
     	var iframe_layout_body = document.createElement('div');
     	iframe_layout_body.className = 'ant-layout-body';

     	//iframe 
     	var ant_iframe = document.createElement('iframe');
     	ant_iframe.src = url;

     	var iframe_height = (config  && config.height)? config.height : '400px';
     	var iframe_width = (config  && config.width)? config.width : '600px';
     	ant_iframe.style.width = iframe_width;
     	ant_iframe.style.height = iframe_height;


     	//操作按钮事件
     	// min_icon.onclick = function(){

     	// };
     	full_icon.onclick = function(){
     		//全屏
     		if(!iframe_layout.getAttribute('is_full')){
     			iframe_layout.style.width = '100%';
		        iframe_layout.style.left = 0;
		        iframe_layout.style.right = 0;
		        iframe_layout.style.bottom = 0;
		        iframe_layout.style.top = 0;
		        var header_heigth = header.offsetHeight;
		        ant_iframe.style.height = (window.innerHeight - header_heigth) + 'px';
		        ant_iframe.style.width = '100%';

     			iframe_layout.setAttribute('is_full','yes');
     			return;
     		}
     		//还原
     		iframe_layout.style.left = '';
			iframe_layout.style.right = '';
			iframe_layout.style.bottom = '';
			iframe_layout.style.top = '';

     		var area = iframe_layout.getAttribute('area');
			iframe_layout.style.width = area.split(',')[0];
			ant_iframe.style.height = area.split(',')[1];
			iframe_layout.style.left = area.split(',')[2];
			iframe_layout.style.top = area.split(',')[3];

		    iframe_layout.removeAttribute('is_full');
     	};
     	close_icon.onclick = function(){
     		document.body.removeChild(this.parentElement.parentElement);
			 _remove_shade();
			 if(config.close_callback && typeof(config.close_callback)=='function')
			 	config.close_callback();
     	};

     	//add header
     	header.appendChild(title_node);
     	iframe_layout.appendChild(header);

     	//add  toolbar
     	//toolbar.appendChild(min_icon);
     	toolbar.appendChild(full_icon);
     	toolbar.appendChild(close_icon);
     	iframe_layout.appendChild(toolbar);

     	//add  body
		iframe_layout_body.appendChild(ant_iframe);
		iframe_layout.appendChild(iframe_layout_body);

		//居中显示 add to body
		_center_and_show(iframe_layout);
     	_show_shade();
		_set_area_info(iframe_layout,[iframe_width,iframe_height,iframe_layout.style.left,iframe_layout.style.top]);

	 },
	 _close_iframe = function(){
		_close_by_selecter('.ant-ifame-layout');
	 },
	 _close_html = function(){
		_close_by_selecter('.ant-html-layout');
	 },
	 _close_dialog = function(){
		_close_by_selecter('.ant-dialog-layout');
	 };
	 
     window.onresize = function(){
     	var ant_layout = _get_element('.ant-layout');
     	for (var i = ant_layout.length - 1; i >= 0; i--) _center_and_show(ant_layout[i]);
     };
 	//初始化
    _init();

    //提供API
    return {
    	options : _options,
    	message :_msg,
    	dialog : _dialog,
    	iframe : _iframe,
    	html : _html,
    	tips : _tips,
    	loading : _show_loading,
		closeLoading : _close_loading,
		closeIframe : _close_iframe,
		closeHTML : _close_html,
		closeDialog : _close_dialog
    }
})(window);