/*中原证劵消息弹出框
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
	var msg={
		build:function(opts){
			var $target,html="";
			$(".msg-box").remove();
			html+='<div class="msg-box">';
			html+='<div class="msg-box-panel">';
			html+='<div class="msg-box-icons">';
			html+='<div class="msg-icon-'+opts.icon+'"></div>';
			html+='</div>';
			html+='<div class="msg-box-body">'+opts.html+'</div>';
			html+='</div>';
			html+='</div>';
			$target=$(html).appendTo("body");
			return $target;
		}
		,opts:{
			html:""
			,icon:"info"
			,timeout:1
			,callback:$.noop
		}
		,show:function(html,timeout,callback){
			var that=this,$target,opts={};
			if(arguments.length===1&&typeof html==="object"){
				opts=$.extend({},that.opts,html);
				opts.icon=that.icon;
			}else{
				opts=$.extend({},that.opts,{
					icon:that.icon
					,html:html
					,timeout:timeout
					,callback:callback
				});
			}

			$target=that.build(opts);
			that.hide.call($target,opts);
			return $target;
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
			this.icon="ok";
			this.show.apply(this,arguments);
		}
		,info:function(){
			this.icon="info";
			this.show.apply(this,arguments);
		}
		,error:function(){
			this.icon="error";
			this.show.apply(this,arguments);
		}
		,wait:function(){
			this.icon="wait";
			this.show.apply(this,arguments);
		}
	}
	window.msg=msg;
})(window);