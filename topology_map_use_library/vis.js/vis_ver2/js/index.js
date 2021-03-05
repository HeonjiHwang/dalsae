var prevTab = 'server';
var prevModalTab = {tab : 'equip-setting', div:'equip-setting-tab'}
var server = ['server.svg'];
var hub = ['accesshub.svg', 'basehub.svg', 'ciscohub.svg', 'disthub.svg', 'switch.svg', 'switchinghub.svg'];
var router = ['router.svg', 'firewall.svg'];
var line = ['plane_red.png', 'plane_green.png', 'plane_black.png', 'dashed_orange.png', 'dashed_black.png'];
var figures = ['building.png', 'client.svg', 'internet.png', 'drive.png', 'text_icon.png'];

var equips = {
	server:[{name : 'server1', ip : '1.1.1.1', stat:'enable', comment : ''},{name : 'server2', ip : '1.1.1.2', stat:'enable', comment : ''},{name : 'server3', ip : '1.1.1.3', stat:'enable', comment : ''}],
	accesshub : [{name : 'accesshub1', ip : '1.1.1.4', stat:'enable', comment : ''},{name : 'accesshub2', ip : '1.1.1.5', stat:'enable', comment : ''},{name : 'accesshub3', ip : '1.1.1.6', stat:'enable', comment : ''}],
	basehub : [{name : 'basehub1', ip : '1.1.1.7', stat:'enable', comment : ''},{name : 'basehub2', ip : '1.1.1.8', stat:'enable', comment : ''},{name : 'basehub3', ip : '1.1.1.9', stat:'enable', comment : ''}],
	ciscohub : [{name : 'ciscohub1', ip : '1.1.1.10', stat:'enable', comment : ''},{name : 'ciscohub2', ip : '1.1.1.11', stat:'enable', comment : ''},{name : 'ciscohub3', ip : '1.1.1.12', stat:'enable', comment : ''}],
	disthub : [{name : 'disthub1', ip : '1.1.1.13', stat:'enable', comment : ''},{name : 'disthub2', ip : '1.1.1.14', stat:'enable', comment : ''},{name : 'disthub3', ip : '1.1.1.15', stat:'enable', comment : ''}],
	'switch' : [{name : 'switch1', ip : '1.1.1.16', stat:'enable', comment : ''},{name : 'switch2', ip : '1.1.1.17', stat:'enable', comment : ''},{name : 'switch3', ip : '1.1.1.18', stat:'enable', comment : ''}],
	switchinghub : [{name : 'switchinghub1', ip : '1.1.1.19', stat:'enable', comment : ''},{name : 'switchinghub2', ip : '1.1.1.20', stat:'enable', comment : ''},{name : 'switchinghub3', ip : '1.1.1.21', stat:'enable', comment : ''}],
	router : [{name : 'router1', ip : '1.1.1.22', stat:'enable', comment : ''},{name : 'router2', ip : '1.1.1.23', stat:'enable', comment : ''},{name : 'router3', ip : '1.1.1.24', stat:'enable', comment : ''}],
	firewall : [{name : 'firewall1', ip : '1.1.1.23', stat:'enable', comment : ''},{name : 'firewall2', ip : '1.1.1.24', stat:'enable', comment : ''},{name : 'firewall3', ip : '1.1.1.25', stat:'enable', comment : ''}]
}


var addNodeMode = false;
var selDiv = undefined;
var clonediv = undefined;
var isMove = false;
var idx = 0;
var isShow = false;
var prevDropDiv = undefined;
var prevTr = undefined;
var saveData = {};
var curID = undefined;
var coordinate = undefined;
var tab = {server:server, hub:hub, router:router, line:line, figures:figures};
var elem = [];
var isEdit = false;
var SEL_TYPE = 1;
var isTreeOpen = false;

document.addEventListener("DOMContentLoaded", function(){
	Topo.start();
	main();

	onTab('server');

	//treeview bind
	$(function(){
		$("#browser").treeview({
			animated:'fast',
			collapsed:true,
			unique:true,
			persist:'cookie'
		});
		$("#browser").bind("contextmenu", function(ev){
			$(".contextmenu-treeview").css("top", ev.clientY).css("left", ev.clientX);
			$(".contextmenu-treeview").show();
			isTreeOpen = true;
		});
	});
});

function onTab(id){
	$("#elements").empty();
	$("#"+prevTab).attr('class', 'edit');
	$("#"+id).attr('class', 'edit active');
	prevTab = id;

	var click_event = (id === 'line') ? 'drawEdge(this.id)' : (id==='figure') ? '' : 'selectElem(this.id)' ;
	var arr = tab[id];
	var dir = './imgs/network/';

	if(id == 'figures'){
		src = './imgs/add_image.png';
		html = '<div id="addImage" class="add-image" style="background-image:url('+src+');" onclick="addImage()"></div>'
	}
	$(".edit-element").append(html);
	var html = '';
	for(var i=0;i<arr.length;i++){
		var id = arr[i].split('.')[0];
		var width = (id.length >= 10) ? '25%' : '23%'
		html += '<li class="elem-btn-wrapper" id="wrap_'+id+'_'+i+'" style="width:'+width+';">'
		html += '<div id="'+id+'_'+i+'" class="elem-btn" style="width:100%;height:85%;background-image:url('+dir+arr[i]+')" onclick="'+click_event+'"></div>'
		html += '<span id="span_'+id+'">'+id+'</span></li>'
	}
	$("#elements").append(html);
}

//이미지 추가
function addImage(){

}

//엣지 그리기
function drawEdge(id){
	var handler = Topo.getHandler();

	//선택한 div 클래스명 추가 -> 테두리+
	if(selDiv != undefined)
		selDiv.attr('class', 'elem-btn-wrapper');
	$("#wrap_"+id).attr('class', 'elem-btn-wrapper select');
	selDiv = $("#wrap_"+id);

	var type = id.split("_")[0];
	var color = id.split("_")[1];
	var options = {};
	handler.editEdges(options);
}

function selectElem(id){
	if(selDiv != undefined)
		selDiv.attr('class', 'elem-btn-wrapper');
	$("#wrap_"+id).attr('class', 'elem-btn-wrapper select');
	selDiv = $("#wrap_"+id);
	isMove = true;

	var id = selDiv[0].id.split("wrap_")[1]
	cloneDiv = $("#"+id).clone();
	curID = id;
	var css = {
		'position':'absolute',
		'height':'40px',
		'width':'40px',
		'background-repeat':'no-repeat',
		'background-position': 'center',
		'background-size': 'contain',
		'opacity':'0.7'
	}
	cloneDiv.attr('class', '');
	cloneDiv.css(css);
	cloneDiv.appendTo('#network');
}
function modal_tab(id){
	//reset
	$("#"+prevModalTab.tab).attr('class', 'modal-tab');
	$("#"+id).attr('class', 'modal-tab modal-active');
	$("#"+prevModalTab.div).hide();
	$("#"+id+"-tab").show();
	prevModalTab.tab = id;
	prevModalTab.div = id+"-tab";
}

function close_edit(){
	$(".edit-elem").hide();
	$("#edit-background").css("background","#ffffff");
}
//call when the document is loaded
function main() {
	Topo.handler.setData();
}

function clearAll(){
	var clear = confirm("Are you sure to clear topology map??");
	if(clear == true)
		Topo.TopoUtil.clear();
}
function save(){
	var handler = Topo.getHandler();
	handler.exportNetwork();
}

function selectType(type){
	if(type == SEL_TYPE){
		$("#sel-multi").css("background-color", "#fff");
		$("#sel-one").css("background-color", "#eee");
		var options = {interaction : {dragView : true}}
		Topo.TopoUtil.network.setOptions(options);
		Topo.TopoUtil.dragView = true;
	}
	else{
		$("#sel-one").css("background-color", "#fff");
		$("#sel-multi").css("background-color", "#eee");
		var options = {interaction : {dragView : false}}
		Topo.TopoUtil.network.setOptions(options);
		Topo.TopoUtil.dragView = false;
	}
}

function edit(){
	$(".edit-elem").show();
	$("#edit-background").css("background","#eee");
}

function remove(){
	var handler = Topo.getHandler();
	handler.removeElement();
}

function zoom(type){
	if(type == 'in'){
		Topo.TopoUtil.zoomIn();
	}else if(type == 'out'){
		Topo.TopoUtil.zoomOut();
	}
}

function viewAll(){
	Topo.TopoUtil.viewAllNodes();
}

function drawRect(x, y){
	var width = 300;
	var height = 300;

	x = x-(width/2);
	y = y-(height/2);

	var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle='#'+Math.floor(Math.random()*16777215).toString(16);
	ctx.fillRect(x,y,width,height);
}

function dragMouseDown(e) {
	e = e || window.event;
	e.preventDefault();
	// get the mouse cursor position at startup:
	pos3 = e.clientX;
	pos4 = e.clientY;
	document.onmouseup = closeDragElement;
	// call a function whenever the cursor moves:
	document.onmousemove = elementDrag;
}
function elementDrag(e) {
	var elmnt = document.getElementById('modal');
	e = e || window.event;
	e.preventDefault();
	// calculate the new cursor position:
	pos1 = pos3 - e.clientX;
	pos2 = pos4 - e.clientY;
	pos3 = e.clientX;
	pos4 = e.clientY;
	// set the element's new position:
	elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	elmnt.style.cursor = 'move';
}
function closeDragElement() {
	/* stop moving when mouse button is released:*/
	document.onmouseup = null;
	document.onmousemove = null;
}

function dropdown(me){
	var showDiv = me.parentElement.children[1];
	if(prevDropDiv != undefined && prevDropDiv != showDiv){
		prevDropDiv.style.display = 'none';
		isShow = false;
	}
	if(isShow == false){
		showDiv.style.display = 'block';
	}else{
		showDiv.style.display = 'none';
	}
	prevDropDiv = showDiv;
	isShow = isShow == false ? true : false;
}
function selectContent(me, name){
	var changeTxt = me.parentElement.parentElement.children[0];
	changeTxt.textContent = '';
	changeTxt.textContent = name;
	changeTxt.style.color = 'black';
	me.parentElement.style.display = 'none'
	isShow = false;
}

function setPopup(id){
	$(".tempTr").remove();
	var id = id.split('_')[0];
	var arr = equips[id];
	var html = '';

	for(var i=0;i<arr.length;i++){
		html+='<tr class="tempTr" onclick="selectEquip(this)">';
		for(k in arr[i]){
			var txt = arr[i][k] == '' ? '-' : arr[i][k];
			html += '<td>' + txt + '</td>';
		}
		html+='</tr>';
	}

	$("#get-equips").append(html);
	$(".modal-popup").show();
}

function selectEquip(info){
	if(prevTr != undefined){
		prevTr.style.background = 'white'
	}
	info.style.background = '#d3e3fb';
	prevTr = info;
	var arr = info.children;

	$("#equip-name").val("");
	$("#equip-ip").val("");
	$("#equip-name").val(arr[0].textContent);
	$("#equip-ip").val(arr[1].textContent);

	saveData.status = arr[2].textContent;
	saveData.comment = arr[3].textContent;
}
function onConfirm(){
	var handler = Topo.getHandler();

	if(saveData.name == undefined){
		saveData.name = $("#equip-name").val();
		saveData.ip = $("#equip-ip").val();
		saveData.status = 'enable';
	}
	if(saveData.status != 'enable'){
		alert("사용 불가능한 장비입니다.");
		saveData = {};
		return;
	}

	saveData.name = $("#equip-name").val();
	saveData.ip = $("#equip-ip").val();
	saveData.company = (!$("#company").text().includes('선택하세요')) ? $("#company").text() : '';
	saveData.building = (!$("#building").text().includes('선택하세요')) ? $("#building").text() : '';
	saveData.floor = (!$("#floor").text().includes('선택하세요')) ? $("#floor").text() : '';
	saveData.room = (!$("#company").text().includes('선택하세요')) ? $("#room").text() : '';
	saveData.type = prevTab;
	saveData.id = curID;
	saveData.coordinate = coordinate;

	handler.editElement(saveData);

	close_modal();
}

function close_modal(type){
	if(type == 1){
		cloneDiv.remove();
	}
	//text, dropdown boxes reset
	$("#equip-name").val("");
	$("#equip-ip").val("");
	$(".dropbtn").text("선택하세요");

	//tr 선택 reset
	if(prevTr != undefined){
		prevTr.style.background = 'white';
		prevTr = undefined;
	}

	//tab reset
	var id = 'equip-setting';
	$("#"+prevModalTab.tab).attr('class', 'modal-tab');
	$("#"+id).attr('class', 'modal-tab modal-active');
	$("#"+prevModalTab.div).hide();
	$("#"+id+"-tab").show();

	prevModalTab.tab = id;
	prevModalTab.div = id+"-tab";

	//modal hide
	$(".modal-popup").hide();
}

function chgTreeview(mode){
	$(".contextmenu-treeview").hide();
}

window.addEventListener('contextmenu', (ev)=>{
	ev.preventDefault();
});
window.addEventListener('mousedown', (ev)=>{
	var name = ev.target.className;
	if(name != 'elem-btn'){
		if(selDiv != undefined){
			selDiv.attr('class', 'elem-btn-wrapper');
		}
		selDiv = undefined;
	}
	if(isMove == true){
		var xPos = ev.clientX - $(".nav").width();
		var yPos = ev.clientY - $(".header").height();
		coordinate = {x:xPos, y:yPos};
		setPopup(cloneDiv.attr('id'));
		isMove = false;
		selDiv = undefined;
		saveData.tempDiv = cloneDiv;
	}
	if(!name.includes("drop")){
		$(".dropdown-content").hide();
		isShow = false;
	}
	if(isTreeOpen === true && name != '_tree'){
		$(".contextmenu-treeview").hide();
		isTreeOpen = false;
	}
});

window.addEventListener('mousemove', (ev)=>{
	if(isMove == true){
		var xPos = ev.clientX - $(".nav").width();
		var yPos = ev.clientY - $(".header").height();
		cloneDiv.css('top',yPos+'px').css('left',xPos+'px');
	}
});
