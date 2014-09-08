if (!window.XN)
	window.XN = {};
if (!window.XN.Share) {
	var static_url = "http://xnimg.connect.renren.com";
	var connect_url = "http://www.connect.renren.com";
	XN.Share = {
		init : function(opts){
			var ssyl = document.createElement('link');
			ssyl.rel = 'stylesheet';
			ssyl.type = 'text/css';
			ssyl.href = static_url+'/css/connect/share_button.css';
			this.insertDom(ssyl);
			this.prober = setInterval(XN.Share.probe, 700);
			if (window.attachEvent)
				window.attachEvent("onload", XN.Share.stopProbe);
			else
				window.addEventListener("load", XN.Share.stopProbe, false);
		},
		insertDom : function(e) {
			(document.getElementsByTagName('head')[0] || document.body)
					.appendChild(e);
		},	
		addQS : function(url, qs) {
			var a = [];
			for (var k in qs)
				if (qs[k])
					a.push(k.toString() + '=' + encodeURIComponent(qs[k]));
			return url + '?' + a.join('&');
		},
		probe : function() {
			var btns = document.getElementsByName('xn_share');
			for (var i = 0; i < btns.length; i++){
				var btn = btns[i];
				if(!btn.rendered) {
					XN.Share.Button.renderButton(btn);
				}
			}
			if (XN.Share.Counter.urls.length > 0)
				XN.Share.Counter.fetchData();
		},
		stopProbe : function() {
			clearInterval(XN.Share.prober);
			XN.Share.probe();
		}
	},
	XN.Share.Button = {
		getType : function(elem) {			
			return elem.getAttribute('type') || 'button_count';
		},
		getUrl : function(elem) {
			if("#"==elem.getAttribute('href')) return window.location.href;
			else return elem.href;
		},
		renderButton : function(elem){
			var url = this.getUrl(elem), types = this.getType(elem).split('_'),
			label = elem.innerHTML.length > 0 ? elem.innerHTML : '分享到人人', hasCount = types[1]&&types[1]=='count',
			size = types[hasCount?3:1]||'small', pos = types[2]||'right', syl = types[0]=='icon'? 'icon':'button';
			var html = '<span class="xn_share_wrapper xn_share_' +pos+ '"><span class="xn_share_'+size+'">',
				biHl='<span class="xn_share_'+ syl +'">';   
			if(syl=="button") biHl+='<span class="xn_share_button_head"></span>';
			biHl+='<span class="xn_share_label">' + label + '</span>';
			if(syl=="button") biHl+='<span class="xn_share_button_end"></span>';		
			biHl+='</span>';
			if(hasCount){
				var nub='<span class="xn_share_count_nub xn_share_no_count"></span>';
				var count='<span class="xn_share_counter xn_share_no_count"></span>';
				if(pos=="right"||pos=="bottom") html+=biHl+nub+count;
				else html+=count+nub+biHl;
			}else html+=biHl;
			elem.innerHTML = html+'</span></span>';
			
			elem.href = XN.Share.addQS(connect_url+'/sharer.do', {
					'url' : url, 'title' : url == window.location.href? document.title : null
				});
			elem.onclick = function() {
				if (!this.xn_clicked) {
					this.xn_count += 1;
					XN.Share.Button.renderCounter(this);
					this.xn_clicked = true;
				}
				window.open(this.href, 'sharer', 'toolbar=0,status=0,width=550,height=400,left='+(screen.width-550)/2+',top='+(screen.height-500)/2);
				return false;
			},
			elem.style.textDecoration = 'none';
			if(this.getType(elem).indexOf('count') >= 0){
				elem.renderCounter = this.renderCounter;
				var co = XN.Share.Counter.counters[url];
				if(co==undefined||co.c==undefined){
					XN.Share.Counter.addCounter(url, elem);
				}else if(co.c!=undefined){
					elem.xn_count = co.c;
					if(elem.renderCounter) elem.renderCounter(elem);
				}
			}
			elem.rendered = true;
		},
		renderCounter : function(elem) {
			if (typeof(elem.xn_count) == 'number'&& !isNaN(elem.xn_count)){
				for (var i = 0, l=elem.firstChild.firstChild.childNodes.length; i < l; i++) {
					var e = elem.firstChild.firstChild.childNodes[i];
					e.className = e.className.replace('xn_share_no_count', '');
					if (e.className.indexOf('xn_share_counter') >= 0)
						e.innerHTML = XN.Share.Counter.pretty(elem.xn_count);
				}
			}
		}
	},
	XN.Share.Counter = {
		counters : {},
		urls : [],
		fetchData : function() {
			var spt = document.createElement('script');
			spt.src = XN.Share.addQS(connect_url+'/linksCounter.do', {
						'urls' : this.urls.join(","),
						'format' : 'json',
						'callback' : 'XN.Share.Counter.onFetchData'
					});
			XN.Share.insertDom(spt);
			this.urls.length = 0;
		},
		pretty : function(c) {
			return c >= 1e+07 ? Math.round(c / 1e+06) + 'M' : (c >= 10000? Math.round(c / 1000) + 'K' : c);
		},
		addCounter : function(url, elem) {
			if(this.counters[url]==undefined)
				this.counters[url] = {cts:[]};
			this.counters[url].cts.push(elem);
			this.urls.push(url);
		},
		onFetchData : function(results) {
			for (var i = 0; results && i < results.length; i++)	{
				var c = results[i].share_count,elems = this.counters[results[i].url].cts;
				this.counters[results[i].url].c = c;
				for(var j = 0; j<elems.length; j++){
					elems[j].xn_count = c;
					if(elems[j].renderCounter) elems[j].renderCounter(elems[j]);
				}
			}
		}
	};
	XN.Share.init();
}