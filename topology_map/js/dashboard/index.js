var isClick = false;
var isSelected = false;
var isSelinCanv = false;
var isLine = false;
var isLineStart = false;
var isDivSel = false;
var isMoving = false;
var linemode = undefined;
var RtempDiv = undefined;
var prevDiv = undefined;
var tempDiv = undefined;
var div = undefined;
var curLine = undefined;
var _top, _left, x1, x2, y1, y2;
var prevSel = undefined;
var dynaId = {accesshub:0, basehub:0, client:0, filewall:0, group:0, router:0, server:0, switch:0, svg_line:0, line_txt:0};
var mapData = new Map();
var mapElem = new Map();
var element = {};

//움직이는 위치
function onEditMode(){
	if(isClick == false){		//처음 clone
		$(".element").show();
		isClick = true;
	}else{						//canvas 내에서 움직일때
		$(".element").hide();
		isClick = false;
	}
}

//element clone and set attributes & change eventlistener function
function cloneElem(id){
	isSelected = true;

	_top = $(".header").height()+$(".content_header").height();
	_left = $(".nav").width();
	
	num = dynaId[id];
	
	div = $('#'+id).clone()
	div.attr('id',id+'_'+num).attr('onmousedown','').attr('class','tmpElem')
	
	newDivid = id+'_'+num+'_';
	html = '<div id="'+newDivid+'" class="tmpElem" style="background-color:white;position:absolute;top:0;left:0;width:70px;height:75px;font-size:14px;text-align:center;"></div>';
	$("#topology_map").append(html);
	
	div.appendTo('#'+newDivid);
	var css = {
		'width':'50px',
		'height':'50px',
		'background-position': 'center',
		'background-repeat': 'no-repeat', 
		'background-size': 'contain',
		'cursor':'pointer',
		'position':'absolute',
		'top':'0px',
		'left':'50%',
		'transform':'translate(-50%)',
		'background-image':'url(../../resources/img/network/'+id+'.svg)'
	}
	div.css(css);
	
	div = $("#"+newDivid);
	div.attr('onmousedown','movingInCanvas(this.id)');
	dynaId[id]++
}

//canvas안에 움직일때
function movingInCanvas(id){
	isSelinCanv = true;
	isSelected = false;
	tempDiv = $('#'+id);
}

//setting mapData
function setData(data){
	mapData.set(data.id, data);
	name = data.name;
	ip = data.ip;
	html = '<div style="position:absolute; width:100%; bottom:0px; left:50%; transform:translateX(-50%)"><span>'+name+'<br>'+ip+'</span></div>'
	div.append(html);
	div = undefined;
}

//reset modal
function resetModal(){

	$(".net_header").text("장비 추가");
	$("#confirm").text("확인");
	$("#custom_rsc_btn").attr('class','active');
	$("#get_rsc_btn").attr('class','');
	$("#detail_rsc_btn").attr('class','');
	
	$('.net_contents').hide();
	$('#custom_rsc').show();
	
	$('.info').val('');
	
	if(prevTr != undefined){
		prevTr.css('background-color', 'white');
	}
}

//context menu events
function chgElement(id){
	var elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
	
	if(id == 'chgset'){
		resetModal();
		modifyElem(RtempDiv);
	}
	if(id == 'rename'){
		$('#rename_area').val(mapData.get(elem).name);
		$(".modal_rename").show();
	}
	if(id == 'remove'){
		if(RtempDiv.split("_").length < 3)
			$("#"+RtempDiv+"_").remove();
		else
			$("#"+RtempDiv).remove();
	}
	if(id == 'toTop'){
		zIdx = $("#"+elem).css("z-index");
		zIdx = parseInt(zIdx) > 0 ? parseInt(zIdx)+1 : 1;
		$("#"+elem).css("z-index",zIdx.toString());
	}
	if(id == 'toBelow'){
		zIdx = $("#"+elem).css("z-index");
		zIdx = parseInt(zIdx) < 0 ? parseInt(zIdx)-1 : -1;
		$("#"+elem).css("z-index",zIdx.toString());
	}
	$(".context_menu").hide();
}

//modify modal events
function modifyElem(id){
	var box, elem;

	if(id.split("_").length < 3)
		box = id+'_';
	else
		elem = id;

	$(".net_header").text("장비 수정");
	$("#confirm").text("수정");

	if(mapData.get(box) != undefined){
		$("#rsc_name").val(mapData.get(box).name);
		$("#rsc_ip").val(mapData.get(box).ip);
		$("#company").val(mapData.get(box).company);
		$("#building").val(mapData.get(box).building);
		$("#floor").val(mapData.get(box).floor);
		$("#room").val(mapData.get(box).room);
		$("#company").val(mapData.get(box).company);
	}

	for(var i=0;i<8;i++){
		if($("#"+'_net_rsc'+i+'>td:eq(0)').text() == mapData.get(box).name && $("#"+'_net_rsc'+i+'>td:eq(1)').text() == mapData.get(box).ip){
			$("#"+'_net_rsc'+i).css('background-color','#d8e5f1');
		}
	}
	
	$('.modal_network_body').show();
}

//rename modal events
function renameConfirm(id){
	var elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
	if(id == 'cancle_rename'){
		$(".modal_rename").hide();
	}else{
		var chgName = $("#rename_area").val();
		updateDataMap(elem, chgName);
		$("#"+elem+">div>span").text(chgName+"\n"+mapData.get(elem).ip);
		$(".modal_rename").hide();
	}
}

//update mapData
function updateDataMap(elem, name, ip, company, building, floor, room, status){
	mapData.get(elem).name = name || mapData.get(elem).name;
	mapData.get(elem).ip = ip || mapData.get(elem).ip;
	mapData.get(elem).company = company || mapData.get(elem).company;
	mapData.get(elem).building = building || mapData.get(elem).building;
	mapData.get(elem).floor = floor || mapData.get(elem).floor;
	mapData.get(elem).room = room || mapData.get(elem).room;
	mapData.get(elem).status = status || mapData.get(elem).status;
}

function selectedMode(mode){
	isLine = false;
	linemode = undefined;
	if(mode == 'one'){
		$("#"+prevSel).attr('class', 'header_btn');
		$("#sl_one").attr('class','header_btn selected');
		prevSel = 'sl_one'
	}
}

function drawLine(id){	
		isLine = true;
	if(id == 'straight'){
		linemode = 1;
		$("#"+prevSel).attr('class', 'header_btn');
		$("#straight").attr('class','header_btn selected');
		prevSel = 'straight'
	}else{
		linemode = 2;
		$("#"+prevSel).attr('class', 'header_btn');
		$("#poly").attr('class','header_btn selected');
		prevSel = 'poly'
	}
}

function setSvgLine(){	
	html = '<svg class="tmpElem" id="svg_line" style="position:absolute;width:100%;height:100%;"><line id="svg_line_'+dynaId['svg_line']+'" style="stroke:#444;stroke-width:1;"/></svg>'
	$(".lineContainer").append(html)
	curLine = 'svg_line_'+dynaId['svg_line'];
	dynaId['svg_line']++;
}

//change mouse cursor
function chgCursorStyle(idx){

	if(idx == 1){
		$(".nav").css('cursor','not-allowed');
		$(".header").css('cursor', 'not-allowed');
		$('.content_header').css('cursor', 'not-allowed');
	}else{
		$(".nav").css('cursor','auto');
		$(".header").css('cursor', 'auto');
		$('.content_header').css('cursor', 'auto');
	}
}

//line 중점에 텍스트
function createText(){
	//중심 x,y좌표 계산
	var x = (x1+x2)/2;
	var y = (y1+y2)/2;
	
	var obj = mapElem.get(curLine);
	var inter1 = mapData.get(obj.x1_y1).name.split(' ')[0];
	var inter2 = mapData.get(obj.x2_y2).name.split(' ')[0];
	$("#inter1").text(inter1+" : ");
	$("#inter2").text(inter2+" : ");
	
	//line modal box open
	$("#interface").show();
	$(".modal_edit_line").show();
	
	obj.line = 'line_txt_'+dynaId.line_txt;
	var html = '<span id="line_txt_'+ dynaId.line_txt +'" style="position:absolute; top:'+y+'px; left:'+x+'px;">statusstatsu</span>';
	$(".lineContainer").append(html);
	dynaId.line_txt++;
}

window.addEventListener('mousemove',function(ev){
	if(isSelected == true && isLine == false){			//beginning (clone the element)
		x = ev.pageX-_left;
		y = ev.pageY-_top;
		div.css('top', y+'px').css('left',x+'px');
		
		chgCursorStyle(1);
	}
	else if(isSelinCanv == true && isLine == false && isMoving == true){	//in the canvas for moving element
		x = ev.pageX-_left;
		y = ev.pageY-_top;
		tempDiv.css('top', y+'px').css('left',x+'px');
		
		elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
		var line = [], which = [], text = [];
		mapElem.forEach(function(val, key){
			for(k in val){
				if(val[k] == elem){
					line.push($("#"+key));
					which.push(k);
				}
			}
		});
		
		var lineX = x+35;
		var lineY = y+37.5;
		for(var i=0;i<line.length;i++){
			if(which[i] == 'x1_y1')
				line[i].attr('x1', lineX).attr('y1',lineY);
			else if(which[i] == 'x2_y2')
				line[i].attr('x2', lineX).attr('y2',lineY);
		}
		
		chgCursorStyle(1);
	}
	else if(isLine == true && linemode == 1 && isLineStart == true){	//for drawing line
		_top = $(".header").height()+$(".content_header").height();
		_left = $(".nav").width();
		
		x = ev.pageX - _left;
		y = ev.pageY - _top;

		$("#"+curLine).attr("x2",x).attr("y2",y);
		x2 = x; y2 = y;
		chgCursorStyle(1);
	}else{
		chgCursorStyle(2);
	}
});

window.addEventListener('mouseup', function(ev){
	if(isSelected == true){
		isSelected = false;
		resetModal();
		$('.modal_network_body').show();
	}

	if(isSelinCanv == true){
		tempDiv = undefined;
		isSelinCanv = false;
	}
	
	if(isLine == true && isDivSel == true){
		isLineStart = true;
	}
	
	isMoving = false;
});

window.addEventListener('mousedown', function(ev){
	_top = $(".header").height()+$(".content_header").height();
	_left = $(".nav").width();
	
	if(ev.target.className == 'tmpElem'){
		$("#"+prevDiv).css('border','none');
		RtempDiv = ev.target.id;
		elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
		prevDiv = elem;
		$("#"+elem).css('border','2px solid #9ac0ff');
		
		isMoving = true;
		isDivSel = isLine == true ? true :false;		//check if element is selected
	}else{
		if(RtempDiv != undefined){
			elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
			$("#"+elem).css('border','none');
		}
	}
	
	if(ev.target.className == 'canvas' || ev.target.className == 'lineContainer'){
		$(".context_menu").hide();
	}

	/*line 그리기*/
	if(isLine == true && isDivSel == true){
		if(isLineStart == true){	//last point
			isLineStart = false;
			isDivSel = false;
			
			elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
			element.x2_y2 = elem;
			mapElem.set(curLine, element);
			createText();
			element = {};
		}else{						//start point
			setSvgLine();
			x = ev.pageX - _left;
			y = ev.pageY - _top;
			$("#"+curLine).attr("x1",x).attr("y1",y);
			x1 = x; y1 = y;
			elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
			element.x1_y1 = elem;
		}
	}
	
});

window.addEventListener('contextmenu', function(ev){
	ev.preventDefault();
	var id = ev.target.id;
	if(RtempDiv == id && !id.includes("map")){
		var x = ev.clientX;
		var y = ev.clientY;
		$(".context_menu").css('top',y+'px').css('left', x+'px').show();
	}
});