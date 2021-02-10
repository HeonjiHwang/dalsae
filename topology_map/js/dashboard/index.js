var isClick = false;
var isSelected = false;
var isSelinCanv = false;
var isLine = false;
var isLineStart = false;
var isDivSel = false;
var isMoving = false;
var isRect = false;
var isRectStart = false;
var isRectSel = false;
var linemode = undefined;
var RtempDiv = undefined;
var prevDiv = undefined;
var tempDiv = undefined;
var div = undefined;
var curLine = undefined;
var _top, _left, x1, x2, y1, y2, top_, left_, width_, height_;
var prevSel = 'sl_one';
var dynaId = {accesshub:0, basehub:0, client:0, filewall:0, group:0, router:0, server:0, switch:0, svg_line:0, line_txt:0, eth1_txt:0, eth2_txt:0};
var mapData = new Map();
var mapElem = new Map();
var mapLineData = new Map();
var element = {};
var startX = 0, startY = 0;

//network resource modal global value
var preTab = {btn:'custom_rsc_btn', div:'custom_rsc'};
var prevTr = undefined;
var saveData = {};

//edit line modal global value


//움직이는 위치
function onEditMode(){
	if(isClick == false){		//처음 clone
		$(".element").show();
		$("#modify").attr('class','header_btn selected');
		isClick = true;
	}else{						//canvas 내에서 움직일때
		$(".element").hide();
		$("#modify").attr('class','header_btn');
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
	html = '<div id="'+newDivid+'" class="tmpElem chkSel" style="background-color:white;position:absolute;top:0;left:0;width:70px;height:75px;font-size:14px;text-align:center;"></div>';
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
	if(mode == 'group'){
		isRect = true;
		$("#"+prevSel).attr('class', 'header_btn');
		$("#sl_group").attr('class','header_btn selected');
		prevSel = 'sl_group'
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
	html = '<svg class="tmpElem" id="svg_line" style="position:absolute;width:100%;height:100%;pointer-events:none;">';
	html += '<line class="chkSel" id="svg_line_'+dynaId['svg_line']+'" stroke="black" stroke-width="0.5"/></svg>';
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
	isEditor = true;
	$("#interface").show();
	$(".modal_edit_line").show();
	
	obj.line = 'line_txt_'+dynaId.line_txt;
	var html = '<span id="line_txt_'+ dynaId.line_txt +'" class="chkSel" style="position:absolute;background-color:white;color:#1c67a2;font-size:11px;font-weight:bold;">1000gb</span>';
	$(".lineContainer").append(html);
	obj.txt = 'line_txt_'+dynaId.line_txt;
	var width = x - $("#line_txt_"+dynaId.line_txt).width()/2;
	var height = y - $("#line_txt_"+dynaId.line_txt).height()/2;
	
	$("#line_txt_"+dynaId.line_txt).css('top', height +'px').css('left', width +'px')
	dynaId.line_txt++;
}

function setLine(){
	if(curLine == undefined && Object.keys(saveData).length == 0) return;
	
	mapLineData.set(curLine, saveData);


	var connDiv = mapElem.get(curLine);
	var eth1 = saveData.eth1;
	var eth1IP = saveData.eth1IP1;
	var eth2 = saveData.eth2;
	var eth2IP = saveData.eth1IP2;
	
	var elem = RtempDiv.split('_').length < 3 ? RtempDiv+"_" : RtempDiv;
	var num1 = dynaId.eth1_txt;
	var num2 = dynaId.eth2_txt;
	html = '<div id=eth1_txt_'+num1+' class="chkSel" style="position:absolute;background-color:white;color:#444444;font-size:11px;font-weight:bold;">'+eth1+'<br>'+eth1IP+'</div>';
	html += '<div id=eth2_txt_'+num2+' class="chkSel" style="position:absolute;background-color:white;color:#444444;font-size:11px;font-weight:bold;">'+eth2+'<br>'+eth2IP+'</div>';
	$(".lineContainer").append(html);

	var lft1 = x1 < x2 ? x1 + ($("#"+connDiv.x1_y1).width()) : x1 - ($("#"+connDiv.x1_y1).width());
	var lft2 = x2 < x1 ? x2 + ($("#"+connDiv.x2_y2).width()) : x2 - ($("#"+connDiv.x2_y2).width());
	
	$("#eth1_txt_"+num1).css('top', y1+'px').css('left', lft1+'px');
	$("#eth2_txt_"+num2).css('top', y2+'px').css('left', lft2+'px');
	
	connDiv.x1_y1_txt = 'eth1_txt_'+num;
	connDiv.x2_y2_txt = 'eth2_txt_'+num;
	
	dynaId.eth1_txt++;
	dynaId.eth2_txt++;
	curLine = undefined;
	saveData = {};
}

function close_modal(){
	$('.modal_network_body').hide();
}

function onchangeTap(id){
	preId = preTab.btn;
	preDiv = preTab.div;
	curDiv = id.split('_btn')[0];
	$('#'+preId).attr('class', '');
	$('#'+preDiv).hide();
	$('#'+id).attr('class', 'active');
	$('#'+curDiv).show();
	preTab.btn = id;
	preTab.div = curDiv;		
}

function getSaveData(id){
	var elem;
	
	if(prevTr != undefined)
		prevTr.css('background-color','white');
	$('#'+id).css('background-color','#d8e5f1');
	var name = $('#'+id+' > td:eq(0)').text()
	var ip = $('#'+id+' > td:eq(1)').text()
	var stat = $('#'+id+'>td:eq(2)').text()
	var els1 = $('#'+id+' > td:eq(3)').text()
	var els2 = $('#'+id+' > td:eq(4)').text()
	
	var status = stat == '' ? '사용불가능' : '사용가능';
	
	$("#rsc_name").val('');
	$("#rsc_ip").val('');
	$("#rsc_name").val(name);
	$("#rsc_ip").val(ip);

	if($("#confirm").text() == '수정'){
		elem = RtempDiv.split("_").length<3 ? RtempDiv+'_' : RtempDiv; 
	}
	
	saveData.id = div!= undefined ? div[0].id : elem;
	saveData.name = name
	saveData.ip = ip;
	saveData.status = status;
	
	prevTr = $('#'+id);
}

function checklocation(){
	var needs = ['company', 'building', 'floor', 'room'];
	
	for(var i=0;i<needs.length;i++){
		if($("#"+needs[i]).val() == ""){
			alert('위치 정보가 필요합니다. 작성해주세요.\n[장비설정 > 위치 설정]');
			return;
		}
		saveData[needs[i]] = $("#"+needs[i]).val()
	}
	return true;
}

function checkData(){
	if(saveData.name != undefined && saveData.ip != undefined)
		return true;
	
	var name = $('#rsc_name').val();
	var ip = $('#rsc_ip').val();
	if(name == undefined || name == '' || ip == undefined || ip == ''){
		alert('장비와 IP정보를 설정해주세요');
		return false;
	}
	saveData.name = name;
	saveData.ip = ip;
}

function onConfirm(id){
	if(id == 'cancel'){
		if($("#confirm").text() == '확인')
			div.remove();
		close_modal();
	}else{
		if($("#"+id).text() == '확인'){
			makeNewElem();
		}
		else if($("#"+id).text() == '수정'){
			chgElemData();
		}
	}
}

function makeNewElem(){
	var datCheck = checkData();		//장비명,ip input 체크
	//var locCheck = datCheck == true ? checklocation() : undefined;	//위치 정보 검사
	locCheck = true;
	if(locCheck == true && datCheck == true){
		if(saveData.status == '사용불가능'){
			alert('해당 장비는 사용이 불가능합니다.');
			return;
		}
		if(saveData.name == '' || saveData.ip == ''){
			alert("장비 또는 IP 정보가 불명확합니다.");
		}
		var data = 'NAME : '+saveData.name+'\nIP : '+saveData.ip;
		isSave = confirm(data+'\n데이터를 저장하시겠습니까?');
		if(isSave == true){
			alert('데이터가 저장되었습니다.');
			setData(saveData);
			saveData = {};
			close_modal();
		}
	}
}

function chgElemData(){
	elem = RtempDiv.split("_").length<3 ? RtempDiv+'_' : RtempDiv;
	data = mapData.get(elem);
	
	data.name = $("#rsc_name").val();
	data.ip = $("#rsc_ip").val();
	if(checklocation() == true){
		data.company = $('#company').val();
		data.building = $("#building").val();
		data.floor = $("#floor").val();
		data.room = $("#room").val();
		
		$("#"+elem+">div>span").text('')
		$("#"+elem+">div>span").text(data.name+'\n'+data.ip);
		close_modal();
	}
}

function mMoveDiv(ev){
	x = ev.pageX-_left;
	y = ev.pageY-_top;
	div.css('top', y+'px').css('left',x+'px');
	
	chgCursorStyle(1);
}
function mMoveConnElement(ev){
	x = ev.pageX-_left;
	y = ev.pageY-_top;
	tempDiv.css('top', y+'px').css('left',x+'px');
	
	elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
	var line = [], which = [], text = [], xy_txt = [], line_nm = [];
	mapElem.forEach(function(val, key){
		for(k in val){
			if(val[k] == elem){
				line.push($("#"+key));
				line_nm.push(key);
				which.push(k);
				text.push($("#"+val.txt));
				var id = k+'_txt'
				xy_txt.push($("#"+val[id]));
			}
		}
	});
	
	var lineX = x+35;
	var lineY = y+37.5;
	for(var i=0;i<line.length;i++){
		let x1 = parseFloat(line[i].attr('x1'));
		let x2 = parseFloat(line[i].attr('x2'));
		let y1 = parseFloat(line[i].attr('y1'));
		let y2 = parseFloat(line[i].attr('y2'));
		
		if(which[i] == 'x1_y1'){
			line[i].attr('x1', lineX).attr('y1',lineY);
			var connDiv = mapElem.get(line_nm[i]).x1_y1;
			var left = x1 < x2 ? x1 + ($("#"+connDiv).width()) : x1 - ($("#"+connDiv).width());
			xy_txt[i].css('top', y1+'px').css('left',left+'px');
		}
		else if(which[i] == 'x2_y2'){
			line[i].attr('x2', lineX).attr('y2',lineY);
			var connDiv = mapElem.get(line_nm[i]).x2_y2;
			var left = x2 < x1 ? x2 + ($("#"+connDiv).width()) : x2 - ($("#"+connDiv).width());
			xy_txt[i].css('top', y2+'px').css('left',left+'px');
		}
		
		//line_text
		let x = (x1+x2)/2;
		let y = (y1+y2)/2;
		text[i].css('top', y+'px').css('left', x+'px');
	}
	
	chgCursorStyle(1);
}

function mMoveDrawLine(ev){
	_top = $(".header").height()+$(".content_header").height();
	_left = $(".nav").width();
	
	x = ev.pageX - _left;
	y = ev.pageY - _top;

	$("#"+curLine).attr("x2",x).attr("y2",y);
	x2 = x; y2 = y;
	chgCursorStyle(1);
}

function select(check){
	$(".chkSel").each(function(){
		var sel = $(this);
		var x = sel.offset().left;
		var y = sel.offset().top;
		var w = sel.width();
		var h = sel.height();
		
		check.call(this, x>=left_ && y>=top_ && x+w <= left_+width_ && y+h <= top_+height_);
	});
}

window.addEventListener('mousemove',function(ev){
	if(isSelected == true && isLine == false){			//beginning (clone the element)
		mMoveDiv(ev);
	}
	else if(isSelinCanv == true && isLine == false && isMoving == true){	//moving all elements which are connected to the moving div
		mMoveConnElement(ev);
	}
	else if(isLine == true && linemode == 1 && isLineStart == true){	//for drawing line
		mMoveDrawLine(ev);
	}else if(isRectStart == true){
		var pageX = ev.clientX - $(".nav").width();
		var pageY = ev.clientY - ($('.header').height() + $(".content_header").height());
		
		var l = startX < pageX ? startX : pageX;
		var t = startY < pageY ? startY : pageY;
		var width = pageX > startX ? pageX - startX : startX - pageX;
		var height = pageY < startY ? startY - pageY : pageY-startY;
		$("#rect").css("width",width+"px").css("height", height+"px").css('left',l).css('top',t);
		
		left_ = l; top_ = t; width_ = width; height_ = height;
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

	if(isRectStart == true){
		select(function(include){
			if(include){
				$(this).css("border","3px solid yellow");
				$(this).attr("stroke","yellow").attr("stroke-width","0.5");
				isRectSel = true;
			}else{
				$(this).css("border","none");
				$(this).attr("stroke","black").attr("stroke-width","0.5");
			}
		})
		isRectStart = false;
		$("#rect").remove();
	}
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
			elem = RtempDiv.split("_").length<3 ? RtempDiv+"_" : RtempDiv;
			
			if(element.x1_y1 == elem) return;
			
			isLineStart = false;
			isDivSel = false;
			
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
	
	if(isRect == true){
		isRectStart = true;
		startX = ev.pageX - $(".nav").width();
		startY = ev.pageY - ($(".header").height() + $(".content_header").height());
		html = '<div id="rect" style="position:absolute; background-color:blue; opacity:0.1;"></div>';
		$(".lineContainer").append(html)
	}
	if(isRectSel == true){
		$(this).css("border","none");
		$(this).attr("stroke","black").attr("stroke-width","0.5");
		isRectSel = false;
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