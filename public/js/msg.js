/*消息弹出框
*说明，总共有4种类型[ok,info,error,wait]
*调用方式1 参数调用
*msg.ok("操作成功"),默认1秒后隐藏
*msg.ok("操作成功",2),默认2秒后隐藏
*msg.ok("操作成功",2,function(opts){}),默认2秒后隐藏,执行回调函数
*
*调用方式2  对象参数调用
*msg.ok({html:"操作成功"})
*msg.ok({html:"操作成功",timeout:2,callback:function(opts){}})
*/


(function(window,undefined){

	function extend(target, source) {
	    for (var p in source) {
	        if (source.hasOwnProperty(p)) {
	        	if(typeof source[p] !=="undefined"){
	            	target[p] = source[p];
	        	}
	        }
	    }
	    return target;
	};

	var msg={
		build:function(opts){
			var target,html="";
			document.getElementById("msgBox")&&document.getElementById("msgBox").remove();
			target=document.createElement("div");
			html+='<div class="msg-box">';
			html+='<div class="msg-box-panel">';
			html+='<div class="msg-box-icon">';
			html+='<span class="msg-icon '+opts.icon+'"></span>';
			html+='</div>';
			html+='<span class="msg-text">'+opts.html+'</span>';
			html+='</div>';
			html+='</div>';
			target.innerHTML=html;
			target.id="msgBox";
			document.body.appendChild(target);
			return target;
		}
		,opts:{
			html:""
			,icon:"info"
			,timeout:1
			,callback:function(){}
		}
		,show:function(html,timeout,callback){
			var that=this,target,opts={};
			if(arguments.length===1&&typeof html==="object"){
				opts=extend({},that.opts,html);
				opts.icon=that.icon;
			}else{
				opts=extend(that.opts,{
					icon:that.icon
					,html:html
					,timeout:timeout
					,callback:callback
				});
			}

			target=that.build(opts);
			that.hide.call(target,opts);
			return target;
		}
		,hide:function(opts){
			opts.timeout=opts.timeout||0;
			var that=this;
			setTimeout(function(){
				that.remove();
				opts.callback&&opts.callback.call(that,opts);
			},opts.timeout*1000);
		}
		,ok:function(){
			this.icon="icon-ok-sign msg-icon-ok";
			this.show.apply(this,arguments);
		}
		,info:function(){
			this.icon="icon-info-sign msg-icon-info";
			this.show.apply(this,arguments);
		}
		,error:function(){
			this.icon="icon-remove-sign msg-icon-error";
			this.show.apply(this,arguments);
		}
		,wait:function(){
			this.icon="icon-spinner rotate msg-icon-wait";
			this.show.apply(this,arguments);
		}
	}
	window.msg=msg;
})(window);