//拖放方法
	var drag={
		bind:function(e){
			$document.on('mousedown.dragable', e.data, drag.doDown);
			$document.on('mousemove.dragable', e.data, drag.doMove);
			$document.on('mouseup.dragable', e.data, drag.doUp);
		},
		apply:function(opts){

		},
		doDown:function(e){
			//记录鼠标按下的坐标
			e.data._drag.startX=e.pageX;
			e.data._drag.startY=e.pageY;
			e.data.onStartDrag.call(e.data.proxy, e);
			return false;
		},
		doMove:function(e){
			e.data._drag.dragX=e.data._drag.dragLastX+e.pageX-e.data._drag.startX;
			e.data._drag.dragY=e.data._drag.dragLastY+e.pageY-e.data._drag.startY;
			rotate.apply(e.data);
			e.data.onDrag.call(e.data.proxy, e);
			return false;
		},
		doUp:function(e){
			e.data._drag.dragLastX=e.data._drag.dragX;
			e.data._drag.dragLastY=e.data._drag.dragY;
			$document.off('.dragable');
			e.data.onStopDrag.call(e.data.proxy, e);

			//变换中心点，用于旋转定位圆心用
			e.data._drag.centerX+=e.pageX-e.data._drag.startX;
			e.data._drag.centerY+=e.pageY-e.data._drag.startY;
			return false;
		}
	};