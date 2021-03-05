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
var RIGHT_CLICK = 3;
var LAYOUT_TYPE = 1;

/**************************
 : use draw2D.js library
 
 
 ::data FORM
 1.TYPE		4.Y			7.PATH(IF IT IS IMAGE)
 2.ID		5.WIDTH		8.PORTS
 3.X		6.HEIGHT
***************************/
var topo;
var layoutApp;
document.addEventListener("DOMContentLoaded", function(){
	onTab('server');
	
	var canvas = new draw2d.Canvas("network");
	//set layout
	layoutApp = new custom.layoutApplication(canvas);
	
	topo = new TopoHandler(canvas);
	//read data
	topo.readData();
	//install policy
	topo.installPolicies();	
	//make group btn
	topo.makeGroupingBtn();
	main(canvas);
});

function main(canvas){
	//load an JSON document into the canvas (test용)
	//
	var i=0;
	data = [
	  {
		  'type' : 'custom.LabeledEnd',
		  'id' : 'image'+i,
		  'x' : Math.floor(Math.random()*2800),
		  'y' : Math.floor(Math.random()*2800),
		  'width' : 50,
		  'height' : 50,
		  'path' : './imgs/network/router.svg',
		  'userData' : {},
		  'ports' : [
			{
				'name' : 'port'+i,
				'port' : 'draw2d.HybridPort',
				'color' : '#ff00000',
				'stroke' : 2,
				'locator' : 'draw2d.layout.locator.InputPortLocator'
			},
			{
				name : 'port_'+i,
				port : 'draw2d.HybridPort',
				color : '#000000',
				stroke : 2,
				locator : 'draw2d.layout.locator.OutputPortLocator'
			}
		  ],
		  //label 배열로 들어가야됨!!!!!
		  'labels':[{
				type:'draw2d.shape.basic.Label',
				id:'router_label_'+i,
				locator : 'draw2d.layout.locator.BottomLocator',
				editor : 'draw2d.ui.LabelInplaceEditor',
				draggable:false,
				selectable:false,
				userData :{},
				text:'router'+i,
				stroke:0,
				outlineStroke:0,
				outlineColor:'none',
				fontSize:12,
				fontColor:'#444444'
		  }]
	  }
	];
	topo.addNodes(data);
	
}

function update(canvas){
	setTimeout(function(){
		updatePreview(canvas);
	}, 1);
	canvas.getCommandStack().addEventListener((ev)=>{
		if(ev.isPostChangeEvent())
			updatePreview(canvas);
	});
}

function updatePreview(canvas){
	
}
/************************************
 : default HTML&CSS Event
 : Heonji (should Add draw2D Events)
*************************************/

function onTab(id){
	$("#elements").empty();
	$("#"+prevTab).attr('class', 'edit');
	$("#"+id).attr('class', 'edit active');
	prevTab = id;
	
	var click_event = (id === 'line') ? 'drawEdge(this.id)' : (id==='figure') ? '' : 'selectElem(this.id)' ;
	var arr = tab[id];
	var html = '';
	var dir = './imgs/network/';
	
	for(var i=0;i<arr.length;i++){
		var id = arr[i].split('.')[0];
		var width = (id.length >= 10) ? '25%' : '23%'
		html += '<li class="elem-btn-wrapper" id="wrap_'+id+'_'+i+'" style="width:'+width+';">'
		html += '<div id="'+id+'_'+i+'" class="elem-btn" style="width:100%;height:85%;background-image:url('+dir+arr[i]+')" onclick="'+click_event+'"></div>'
		html += '<span id="span_'+id+'">'+id+'</span></li>'
	}
	$("#elements").append(html);
}

function drawEdge(id){
	
	if(selDiv != undefined)
		selDiv.attr('class', 'elem-btn-wrapper');
	$("#wrap_"+id).attr('class', 'elem-btn-wrapper select');
	selDiv = $("#wrap_"+id);
	
	var type = id.split("_")[0];
	var color = id.split("_")[1];
	
	var options = {};
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
	$("#sel-multi").css("background-color", "#fff");
	$("#sel-one").css("background-color", "#eee");
	
	
	var canvas = topo.getCanvas();
	canvas.installEditPolicy(new draw2d.policy.canvas.ReadOnlySelectionPolicy());
}

function clearAll(){
	var clear = confirm("Are you sure to clear topology map??");
	if(clear == true)
		console.log('clear')
}
function save(){
	var canvas = topo.getCanvas();
	var writer = new draw2d.io.json.Writer();
	writer.marshal(canvas, (json)=>{
		var txt = JSON.stringify(json, null, 2);
		$("#jsonWrapper").text(txt);
		$("#jsonWrapper").show();
	});
}

function selectType(type){
	var canvas = topo.getCanvas();
	
	if(type == SEL_TYPE){
		$("#sel-multi").css("background-color", "#fff");
		$("#sel-one").css("background-color", "#eee");
		canvas.installEditPolicy(new draw2d.policy.canvas.PanningSelectionPolicy());
	}
	else{
		$("#sel-one").css("background-color", "#fff");
		$("#sel-multi").css("background-color", "#eee");
		canvas.installEditPolicy(new draw2d.policy.canvas.BoundingboxSelectionPolicy());
	}
	LAYOUT_TYPE = type;
}

function edit(){
	isEdit = true;
	$(".edit-elem").show();
	$("#edit-background").css("background","#eee");
	
	/**
		edit mode
		@left mouse  : select(single) & panning
		@right mouse : select(multiple)
	**/
	var canvas = topo.getCanvas();
	
	if(LAYOUT_TYPE == 1)
		canvas.installEditPolicy(new draw2d.policy.canvas.PanningSelectionPolicy());
	else
		canvas.installEditPolicy(new draw2d.policy.canvas.BoundingboxSelectionPolicy());
}

function historyEvent(type){
	var canvas = topo.getCanvas();
	if(type == 1){
		canvas.getCommandStack().undo();
	}else{
		canvas.getCommandStack().redo();
	}
}
function remove(){
}

function zoom(type){
	var canvas = topo.getCanvas();
	if(type == 1){
		canvas.setZoom(canvas.getZoom()*0.7, true);
		layoutApp.layout();
	}else if(type == 2){
		canvas.setZoom(canvas.getZoom()*1.3, true);
		layoutApp.layout();
	}else if(type == 3){
		canvas.setZoom(1.0, true);
		layoutApp.layout();
	}
}

function viewAll(){
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


window.addEventListener('mousedown', (ev)=>{
	var name = ev.target.className;
	if(typeof(name) != 'object'){
		if(name != 'elem-btn'){
			if(selDiv != undefined){
				selDiv.attr('class', 'elem-btn-wrapper');
			}
			selDiv = undefined;
		}
		if(!name.includes("drop")){
			$(".dropdown-content").hide();
			isShow = false;
		}
		if(isTreeOpen === true && name != '_tree'){
			console.log("?");
			$(".contextmenu-treeview").hide();
			isTreeOpen = false;
		}
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
});

window.addEventListener("contextmenu", (ev)=>{
	ev.preventDefault();
});
window.addEventListener('mousemove', (ev)=>{
	if(isMove == true){
		var xPos = ev.clientX - $(".nav").width();
		var yPos = ev.clientY - $(".header").height();
		cloneDiv.css('top',yPos+'px').css('left',xPos+'px');
	}
});

