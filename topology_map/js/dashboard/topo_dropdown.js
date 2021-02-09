isActive = false;
prevIdx = undefined;

function doDropdown(idx){
	isActive = isActive == false ? true : false;
	
	if(isActive == false && idx == prevIdx){
		$(".topo_select").css("border","1px solid #ccc");
		$(".topo_dropDown").css('z-index','0');
		$(".topo_dropDown").hide()
		return;
	}

	prevIdx = idx;
	
	//reset
	$(".topo_dropDown").hide();
	$(".topo_select").css("border","1px solid #ccc");
	
	//change
	$("#topo_select"+idx).css("border","2px solid #738de2");
	
	var top = $(".topo_select").height()*2 + 12;
	var width = $(".topo_select").width();
	
	var css = {
			'position':'absolute',
			'top':top+'px',
			'left':'88px',
			'width':width+'px',
			'z-index':'1000'
	}
	
	$("#topo_dropDown"+idx).css(css);
	$("#topo_dropDown"+idx).show();
}

function chgTopoVal(id, idx){
	var val = $("#"+id+">span").text();
	$("#topo_selectedTxt"+idx).val(val);
	$(".topo_dropDown").hide()
	$(".topo_select").css("border","1px solid #ccc");
	isActive = false;
}

window.addEventListener('mousedown',function(ev){
	targetCln = ev.target.className
	if(!targetCln.includes('topo')){
		isActive = false;
		$(".topo_select").css("border","1px solid #ccc");
		$(".topo_dropDown").css('z-index','0');
		$(".topo_dropDown").hide()
	}
});