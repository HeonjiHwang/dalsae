var TopoUtil = function(){
	this.nodes = [];
	this.edges = [];
	this.DIR = "./imgs/network/";
	this.EDGE_LENGTH_MAIN = 800;
	this.EDGE_LENGTH_SUB = 500; 
	this.EDGE_LEGNTH_SUB_SUB = 200;
	this.locale = {};
	this.networkData = {};
	this.cluster_id = 1;
	this.groups = [];
	this.nodesDt = undefined;
	this.edgesDt = undefined;
	this.options = undefined;
	this.dragView = true;
	this.dragok = false;
	this.startX;
	this.startY;
	this.offsetX = $(".nav").width();
	this.offsetY = $(".header").height();
	this.tmpShape = {};
	
	this.img_definition = {
		"root" : "building.png",
		"workstation" : "desktop.png",
		"server" : "server.svg",
		"firewall" : "firewall.svg",
		"internet" : "internet.png",
		"core switch" : "disthub.svg",
		"access switch" : "accesshub.svg",
		"router" : "router.svg", 
		"switch" : "accesshub.svg"
	}
	
	this.defaultOptions = {
		locale : 'en',
		locales : this.locale,
		edges : {
			smooth : false,
			color:{
				highlight:"#6996ff",
				hover:"#6996ff"
			},
			dashes:false,
			font:{
				color:"#181a3d",
				size:12,
				align:"top",
				multi:true
			},
			physics : false,
		},
		nodes:{
			font:{
				size:14,
				color:"#444444",
				background:"#ffffff"
			},
			color:{
				background:"#ffffff",
				border:"#008bc7"
			},
			size:15,
			physics : false
		},
		configure:"nodes,edges",
		interaction:{
			hover : true,
			keyboard : true,
			multiselect : true,
			navigationButtons : true,
			tooltipDelay : 200,
			zoomView : true,
			selectable : true,
			selectConnectedEdges : true,
		},
		layout:{
			randomSeed:"0.7849996573287203:1614824922108"
		},
		groups:{
			'External Servers' :{background:"#ffffff", border:"#008bc7"},
			'server Farms' :{background:"#ffffff", border:"#008bc7"},
			'External Firewall' :{background:"#ffffff", border:"#008bc7"},
			'Core Switches' :{background:"#ffffff", border:"#008bc7"},
			'Access Switches' :{background:"#ffffff", border:"#008bc7"},
			'Campus Edge Routers' :{background:"#ffffff", border:"#008bc7"}
		},
		physics:false
	};
	
	//동작
	this.network = undefined;
}

//1. get data
TopoUtil.prototype.setData = function(data_, img_){
	if(data_ == undefined || img_ == undefined) return;
	
	var handler = this;
	handler.networkData = data_;
	handler.img_definition = img_ || handler.img_definition;
	
	for(k in handler.networkData){
		for(img in handler.img_definition){
			var key = k.toLowerCase();
			if(key.includes(img)){
				handler.networkData[k].img = handler.img_definition[img];
			}
			if(handler.networkData[k].group != undefined && handler.networkData[k].ip != undefined && handler.networkData[k].group.toLowerCase().includes(img)){
				handler.networkData[k].img = handler.img_definition[img];
			}
		}
	}
}

TopoUtil.prototype.drawMap = function(container, options_){
	var handler = this;
	//setting locale (영어 -> 한국어)
	handler.locale.en = handler.getLocale();
	
	//setting node and edge
	handler.setNodeEdgeData();
	
	handler.options = options_ || handler.defaultOptions;
	
	handler.nodesDt = new vis.DataSet();
	handler.edgesDt = new vis.DataSet();
	
	handler.nodesDt.add(handler.nodes);
	handler.edgesDt.add(handler.edges);
	
	var data = {
		nodes : handler.nodesDt,
		edges : handler.edgesDt
	};
	
	handler.network = new vis.Network(container, data, handler.options);
	
	setTimeout(function(){
		//custom vis.js UI
		$(".vis-navigation").hide();
		//$(".vis-navigation").css("position", "absolute").css("top",0).css("left",0).css("width","100%").css("height","10%");
		$(".vis-configuration-wrapper").hide();
		handler.eventListener();
		handler.chartDelay();
		//cluster
		handler.createGroupBox();
		handler.makeMultiSelect();
	},200);
}

TopoUtil.prototype.chartDelay = function(){
	var handler = this;
	
	var scale = 0.8;
	var options = {
		position : handler.network.getViewPosition(),
		scale : scale,
		animation : true
	}
	
	handler.network.moveTo(options);
}

TopoUtil.prototype.setNodeEdgeData = function(){
	var handler = this;
	
	for(k in handler.networkData){
		var data = handler.networkData[k];
		var shape = k.includes('group')||k.includes("text") ? 'box' : 'circularImage';
		var title = k.includes('group') ? '' : 'NAME : ' + data.name + '\nIP : ' + data.ip;
			title += (data.parent != undefined && data.parent != 'root') ? '\nZONE : ' + data.parent : '';
		var img = shape == 'image' ? handler.DIR + data.img : '';
		var len = k.includes('group') || data.group == '' ? handler.EDGE_LENGTH_MAIN : handler.EDGE_LENGTH_SUB;
		var group = data.group != '' ? data.group : '';
		var toID = [];
		for(key in handler.networkData){
			var parent = data.parent != undefined && data.parent.includes(",") ? data.parent.split(',') : [data.parent];
			for(var i=0;i<parent.length;i++){
				if(parent[i] == handler.networkData[key].name){
					toID.push(key);
				}
			}
		}
		
		var node = shape == 'circularImage' ? {id : k, label : data.name, image : handler.DIR + data.img, shape : shape, title : title, group:group, x:data.x, y:data.y, size:25,borderWidth:1, shapeProperties:{useImageSize:false}}
									: {id : k, label : data.name, shape : shape, title : title, group:group, x:data.x, y:data.y}
		//node & edge setting
		handler.nodes.push(node)
		for(var i=0;i<toID.length;i++){
			var num = Math.floor(Math.random()*1000);
			var val = (num >= 0 && num < 200) ? 1 : (num >= 200 && num < 400) ? 2 : (num >= 400 && num < 600) ? 3 : (num >=600) ? 4 : 0;
			var color = val == 1 ? '#dc7070' : val == 2 ? '#f3f717' : val == 3 ? '#f7c717' : val == 4 ? '#0bbd08' : '#ff0000';
			var txt = 'FROM:'+k+"\nTO:"+toID[i]+"\n회선속도:"+num.toString()+"Mbps"
			handler.edges.push({
				from:k,
				to:toID[i],
				length:len,
				label:num.toString()+"Mbps",
				width:val,
				//labelFrom:'from',
				//labelTo:'to',
				title:txt,
				color:{color:color}
			});
		}
	
		if(group != '') 
			this.groups.push(group);
	}
}

TopoUtil.prototype.getNetwork = function(){
	var handler = this;
	
	if(handler.network == undefined){
		console.log('network is not defined');
		return;
	}
	
	return handler.network;
}

TopoUtil.prototype.getData = function(){
	var handler = this;
	return {nodes:handler.nodesDt, edges:handler.edgesDt};
}

TopoUtil.prototype.getLocale = function(){
	var locale = {
		edit: '수정',
		del: '삭제',
		back : '뒤로가기',
		close : '닫기',
		addNode : '노드 추가',
		addEdge : '엣지 추가',
		deleteNode : '노드 삭제',
		deleteEdge : '엣지 삭제',
		editNode : '노드 수정',
		editEdge : '엣지 수정',
		addDescription : '새로운 노드를 추가 하기 위해 빈 공간을 클릭해주세요',
		edgeDescription : '노드를 선택 후 드래그해 다른 노드로 연결해주세요',
		editEdgeDescription : '컨트롤 포인트를 클릭 후 드래그해 다른 노드로 연결해주세요',
		createEdgeError : '클러스터에 엣지를 연결할 수 없습니다.',
		deleteClusterError : '클러스터는 삭제될 수 없습니다.',
		editClusterError : '클러스터는 수정될 수 없습니다.'
	}
	return locale
}

TopoUtil.prototype.isSelected = function(){
	var handler = this;
	var {nodes, edges} = handler.network.getSelection();
	
	if(nodes.length == 0 && edges.length == 0)
		return false;
	else
		return true;
}

TopoUtil.prototype.clear = function(){
	var handler = this;
	if(handler.network == undefined) return;
	handler.network.destroy();
}

TopoUtil.prototype.zoomIn = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	var scale = handler.network.getScale() + 0.1;
	var options = {
		position : handler.network.getViewPosition(),
		scale : scale
	}
	
	handler.network.moveTo(options);
}
TopoUtil.prototype.zoomOut = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	var scale = handler.network.getScale() - 0.1;
	var options = {
		position : handler.network.getViewPosition(),
		scale : scale
	}
	
	handler.network.moveTo(options);
}
TopoUtil.prototype.viewAllNodes = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	handler.network.fit();
}
TopoUtil.prototype.dispose = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	handler.network.destroy();
}

TopoUtil.prototype.addNode = function(data){
	var handler = this;
	if(handler.network == undefined) return;
	
	var nodes = handler.nodesDt;
	
	try{
		nodes.add({
			id : data.id,
			label : data.name+"\n"+data.ip,
			title : data.name+"\n"+data.ip,
			shape : 'image',
			image : handler.DIR + data.image
		});
		
		//node재배치
		var pos = handler.network.DOMtoCanvas({x:data.coordinate.x, y:data.coordinate.y});
		handler.network.moveNode(data.id, pos.x, pos.y);
		//div삭제
		data.tempDiv.remove();
		
	}catch(err){
		alert(err);
	}
}

TopoUtil.prototype.editNode = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	handler.network.editNode();
}

TopoUtil.prototype.addEdge = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	handler.network.addEdgeMode();
}

TopoUtil.prototype.editEdge = function(){
	var handler = this;
	if(handler.network == undefined) return;
	
	handler.network.editEdgeMode();
}

TopoUtil.prototype.remove = function(){
	var handler = this;
	if(handler.network == undefined) return;
	handler.network.deleteSelected();
}

TopoUtil.prototype.getBoundingInfo = function(nodeID){
	var handler = this;
	if(handler.network == undefined) return;
	
	handler.network.getBoundingBox(nodeID);
}

TopoUtil.prototype.createGroupBox = function(group){
	var handler = this;
	
	/**
		[usage]
		::options {background(string), 
				   font(fontSize(int), 
				   color(string)), 
				   border(width(int),color(string),style(string :: dash, solid)), 
				   name(string), 
				   group(string)
				  }
	**/
	var groups = ['server Farms','Core Switches','External Servers','Access Switches','Campus Edge Routers','External Firewall'];
	var groupOption = [];
	for(var i=0;i<groups.length;i++){
		var options = {
			background:"#ffffff",
			font:{
				fontSize:"20px",
				fontColor:"#ffffff"
			},
			border:{
				borderColor:"#bbbaba",
				borderWidth:1
			},
			name:groups[i],
			group:groups[i]
		}
		
		groupOption.push(options);
	}
	
	handler.network.on('afterDrawing', (ev)=>{
		for(var i=0;i<groupOption.length;i++){
			handler.network.setGroup(groupOption[i], handler.network);
		}
	});
}

TopoUtil.prototype.canvasify = function(DOMx, DOMy){
	var handler = this;
	const {x,y} = handler.network.DOMtoCanvas({x:DOMx, y:DOMy});
	return [x,y];
}
TopoUtil.prototype.domfy = function(canvasX, canvasY){
	var handler = this;
	const {x,y} = handler.network.canvasToDOM({x:canvasX, y:canvasY});
	return [x,y];
}

TopoUtil.prototype.makeMultiSelect = function(){
	var handler = this;
	
	var container = $("#network");
	var nodes = handler.nodesDt;
	const NO_CLICK = 0;
	const CLICK = 1;
	var drag = false, DOMRect = {};
	
	const correctRange = (start, end)=>
		start < end ? [start,end] : [end,start];
	
	const selectFromDOMRect = ()=>{
		const [sX, sY] = handler.canvasify(DOMRect.startX, DOMRect.startY);
		const [eX, eY] = handler.canvasify(DOMRect.endX, DOMRect.endY);
		const [startX, endX] = correctRange(sX, eX);
		const [startY, endY] = correctRange(sY, eY);
		
		handler.network.selectNodes(nodes.get().reduce(
			(selected, {id})=>{
				const {x,y} = handler.network.getPositions(id)[id];
				return (startX <= x && x <= endX && startY <= y && y <= endY) ? selected.concat(id) : selected;
			},[]
		));
	}
	
	//event listener activated when dragView is false
	container.on("mousedown", ({which, pageX, pageY})=>{
		if(which === CLICK && handler.dragView === false){
			Object.assign(DOMRect,{
				startX : pageX - $(".nav").width(),
				startY : pageY - $(".header").height(),
				endX : pageX - $(".nav").width(),
				endY : pageY - $(".header").height()
			});
			drag = true;
		}
	});
	
	container.on("mousemove", ({which, pageX, pageY})=>{
		//make selection rectangle disappear when accidently mouseupped outside of container
		if(which === NO_CLICK && drag && handler.dragView === false){
			drag = false;
			handler.network.redraw();
		}
		//when mousemove, update the rectangle state
		else if(drag && handler.dragView === false){
			Object.assign(DOMRect, {
				endX : pageX - $(".nav").width(),
				endY : pageY - $(".header").height()
			});
			handler.network.redraw();
		}
	});
	
	container.on("mouseup", ({which})=>{
		//when mouseup select the nodes in the rectangle state
		if(which === CLICK && handler.dragView === false){
			drag = false;
			handler.network.redraw();
			selectFromDOMRect();
		}
	});
	
	handler.network.on('afterDrawing', ctx => {
		if(drag){
			const [startX, startY] = handler.canvasify(DOMRect.startX, DOMRect.startY);
			const [endX, endY] = handler.canvasify(DOMRect.endX, DOMRect.endY);
			
			ctx.setLineDash([5]);
			ctx.strokeStyle = 'rgba(78, 146, 237, 0.75)';
			ctx.strokeRect(startX, startY, endX-startX, endY-startY);
			ctx.setLineDash([]);
			ctx.fillStyle = 'rgba(151,194,252,0.45)';
			ctx.fillRect(startX, startY, endX-startX, endY-startY);
		}
	});
}

/**
	//canvas groupbox events

TopoUtil.prototype.mouseDown = function(e){
	var handler = this;
	
	e.preventDefault();
	e.stopPropagation();
		
	var cx = parseInt(e.clientX-handler.offsetX);
	var cy = parseInt(e.clientY-handler.offsetY);
	
	var [mx, my] = handler.canvasify(cx,cy);
	
	handler.dragok=false;
	
	Topo.groupShape.forEach((val,key) => {
		if(mx > val.x && mx < (val.x+val.width) && my > val.y && my < (val.y+val.height)){
			handler.dragok = true;
			val.isDrag = true;
		}
	});
	
	handler.startX = mx;
	handler.startY = my;
}
TopoUtil.prototype.mouseUp = function(e){
	e.preventDefault();
	e.stopPropagation();

	this.dragok = false;
	
	
	Topo.groupShape.forEach((val)=>{
		//val.isDrag = false;
	});
}
TopoUtil.prototype.mouseMove = function(e){
	var handler = this;
	if(handler.dragok){
		e.preventDefault();
		e.stopPropagation();
		
		var cx = parseInt(e.clientX-handler.offsetX);
		var cy = parseInt(e.clientY-handler.offsetY);
		
		var [mx, my] = handler.canvasify(cx,cy);
		
		var dx = mx - handler.startX;
		var dy = my - handler.startY;
		Topo.groupShape.forEach((val, key)=>{
			if(val.isDrag){
				val.x+=dx;
				val.y+=dy;
				handler.tmpShape[key] = val;
			}
		});
		
		Topo.redrawGroupBox();
		startX = mx;
		startY = my;
	}
}**/

/**
	vis.js events
**/
TopoUtil.prototype.eventListener = function(){
	var handler = this;
	
	handler.network.on('click', (ev)=>{
		Topo.handler.leftMouseDown(ev);
		//var edge = ev.edges;
		//handler.edgesDt.update({id:edge[0], color:'red'});
	});
	handler.network.on('doubleClick', (ev)=>{
	});
	handler.network.on('oncontext', (ev)=>{
		ev.event.preventDefault();
		Topo.handler.rightMouseDown(ev.event);
		$(".contextMenu").show();
	});
	handler.network.on('beforeDrawing', (ev)=>{
		
	});
	handler.network.on('afterDrawing', (ev)=>{
	});
	handler.network.on('release', (ev) => {
	});
	handler.network.on('select', (ev) => {
	});
	handler.network.on('selectNode', (ev) => {
	});
	handler.network.on('selectEdge', (ev) => {
	});
	handler.network.on('deselectNode', (ev) => {
	});
	handler.network.on('deselectEdge', (ev) => {
	});
	handler.network.on('dragStart', (ev) => {
	});
	handler.network.on('dragging', (ev) => {
	});
	handler.network.on('dragEnd', (ev) => {
	});
	handler.network.on('controlNodeDragging', (ev) => {
	});
	handler.network.on('controlNodeDragEnd', (ev) => {
	});
	handler.network.on('zoom', (ev) => {
	});
	window.addEventListener('keydown', (ev)=>{
		Topo.handler.keyDownEvent(ev);
	});
}