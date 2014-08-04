
function result(recode,msg,data){
	return new function(){
		return {
			recode:recode||0
			,msg:msg||"FAIL"
			,data:data||{}
		}
	};
}

exports.result=result;
exports.error=function(msg,data){
	if(arguments.length===1&& typeof arguments[0]==="object"){
		return result(0,"FAIL",arguments[0]||{})
	}else{
		return result(0,msg||"FAIL",data||{})
	}
}

exports.ok=function(msg,data){
	if(arguments.length===1&& typeof arguments[0]==="object"){
		return result(1,"SUCCESS",arguments[0]||{})
	}else{
		return result(1,msg||"SUCCESS",data||{})
	}
}