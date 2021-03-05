var TopoHandler = function(){
	this.networkData = {
		"root" : {"name" : "company", "ip" : "1.1.1.1", x:-248, y:-468},
		"workstation" : {"name" : "Management WorkStation", "ip" : "1.1.1.8", "parent":"company", x:-478, y:-429},
		"group0" :{"name" : "Server Farms", "group":"Server Farms", "parent":"company", x:141, y:-151},
		"group1" :{"name" : "External Servers", "group":"External Servers", "parent":"company", x:-598, y:-215},
		"group2" : {"name" : "Core Switches", "group":"Core Switches", "parent":"Server Farm Switch,External Servers", x:-282, y:213},
		"group3" : {"name" : "Distribution Access Switches", "group":"Distribution Access Switches", "parent":"Core Switches", x:-731, y:379},
		"group4" : {"name" : "Campus Edge Routers", "group":"Campus Edge Routers", "parent":"Core Switches", x:-9, y:517},
		"group5" : {"name" : "External Firewall", "group":"External Firewall", "parent":"External Servers", x:-807, y:93},
		"server0" : {"name" : "EHR", "group":"Server Farms", "ip" : "1.1.1.2", "parent":"", x:251, y:-130},
		"server1" : {"name" : "PACS", "group":"Server Farms", "ip" : "1.1.1.3", "parent":"", x:181, y:-130},
		"server2" : {"name" : "LDAP", "group":"Server Farms","ip" : "1.1.1.4", "parent":"", x:111, y:-130},
		"server3" : {"name" : "App Servers", "group":"Server Farms", "ip" : "1.1.1.5", "parent":"", x:41, y:-130},
		"server4" : {"name" : "Web", "group":"External Servers", "ip" : "1.1.1.6", "parent":"", x:-666, y:-200},
		"server5" : {"name" : "Extranet", "group":"External Servers", "ip" : "1.1.1.7", "parent":"", x:-532, y:-200},
		"switch0" : {"name" : "Server Farm Switch", "group":"", "ip" : "1.1.1.9", "parent":"Server Farms", x:145, y:126},
		"switch1" : {"name" : "Core Switch0", "group":"Core Switches", "ip" : "1.1.1.12", "parent":"", x:-346, y:226},
		"switch2" : {"name" : "Core Switch1", "group":"Core Switches", "ip" : "1.1.1.13", "parent":"", x:-212, y:226},
		"switch3" : {"name" : "Access Switch0", "group":"Distribution Access Switches", "ip" : "1.1.1.14", "parent":"", x:-622, y:395},
		"switch4" : {"name" : "Access Switch1", "group":"Distribution Access Switches", "ip" : "1.1.1.15", "parent":"", x:-733, y:395},
		"switch5" : {"name" : "Access Switch2", "group":"Distribution Access Switches", "ip" : "1.1.1.16", "parent":"", x:-843, y:395},
		"router0" : {"name" : "Router0", "group":"Campus Edge Routers", "ip" : "1.1.1.17", "parent":"", x:68, y:526},
		"router1" : {"name" : "Router1", "group":"Campus Edge Routers", "ip" : "1.1.1.18", "parent":"", x:-76, y:526},
		"firewall0" : {"name" : "Core firewall", "group":"External Firewall", "ip" : "1.1.1.10", "parent":"", x:-809, y:100},
		"internet0" : {"name" : "Internet", "group":"", "ip" : "1.1.1.11", "parent":"External Firewall", x:-1300, y:100}
	}
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

	this.id = {
		group : 6, server:6, switch:6, router:2, firewall:1, internet:1
	}
}

TopoHandler.prototype.setData = function(){
	var handler = this;

	var container = document.getElementById("network");

	//getdata(real data here for now fake data)
	var data = handler.networkData;
	var img = handler.img_definition;

	handler.initTreeView();
	Topo.TopoUtil.setData(data, img);

	//draw topology map by data
	Topo.TopoUtil.drawMap(container, undefined);

	/*var canvas = $("canvas");
	canvas.mousedown((ev)=>{
		Topo.TopoUtil.mouseDown(ev);
	});
	canvas.mouseup((ev)=>{
		Topo.TopoUtil.mouseUp(ev);
	});
	canvas.mousemove((ev)=>{
		Topo.TopoUtil.mouseMove(ev);
	});*/
}

TopoHandler.prototype.initTreeView = function(){
	var handler = this;
	var html = '';
	var p1 = [];

	for(k in handler.networkData){
		var data = handler.networkData[k];

		if(data.name == 'company'){
			html = "<li class='root'><span class='folder'>"+data.name.toUpperCase()+"</span></li>"
			$("#browser").append(html);
		}else if(data.parent == 'company'){
			var id = data.name.replaceAll(' ','_')
			html = "<ul id='browser' class='filetree'><li id='"+id+"'><span class='folder'>"+data.name.toUpperCase()+"</span></li></ul>"
			$(".root").append(html);
			p1.push(data.name);

		}
		if(data.name == 'Core Switches'){
			html = "<li class='Core_Switches'><span class='folder'>"+data.name.toUpperCase()+"</span></li>"
			$("#browser").append(html);
		}else if(data.parent == 'Core Switches'){
			var id = data.name.replaceAll(' ','_');
			var cls = 'file';
			for(key in handler.networkData){
				if(handler.networkData[key].parent == data.name)
					cls = 'folder'
			}
			html = "<ul id='browser' class='filetree'><li id='"+id+"'><span class='"+cls+"'>"+data.name.toUpperCase()+"</span></li></ul>"
			$(".Core_Switches").append(html);
			p1.push(data.name);
		}
	}
	var p2 = [];
	for(k in handler.networkData){
		var data = handler.networkData[k];
		for(var i=0;i<p1.length;i++){
			if(data.parent == p1[i]){
				var cls = 'file';
				for (key in handler.networkData){
					if(handler.networkData[key].parent != undefined){
						var p = handler.networkData[key].parent.includes(',') ? handler.networkData[key].parent.split(','): [handler.networkData[key].parent];
						if(p.indexOf(data.name) != -1){
							cls = 'folder';
						}
					}
				}
				html = "<ul id='browser' class='filetree'><li id='"+k+"'><span class='"+cls+"'>"+data.name.toUpperCase()+"</span></li>";
				var id = data.parent.replaceAll(' ','_');
				$("#"+id).append(html);
				if(cls == 'folder'){
					p2.push({name : data.name, id:k});
				}
			}

		}
	}
	for(k in handler.networkData){
		var data = handler.networkData[k];
		for(var i=0;i<p2.length;i++){
			if(data.parent == p2[i].name){
				var cls = 'file';
				for(key in handler.networkData){
					if(handler.networkData[key].parent != undefined && handler.networkData[key].parent == data.name)
						cls = 'folder';
				}
				html = "<ul id='browser' class='filetree'><li id='"+k+"'><span class='"+cls+"'>"+data.name.toUpperCase()+"</span></li>";
				$("#"+p2[i].id).append(html);
			}
		}
	}
}

TopoHandler.prototype.exportNetwork = function(){
	var handler = this;
	var network = Topo.TopoUtil.getNetwork();

	var obj = network.getPositions();
	for(k in obj){
		obj[k].id = k;
		obj[k].connections = network.getConnectedNodes(k);
	}

	var exportValue = JSON.stringify(obj, undefined, 2);
}
TopoHandler.prototype.leftMouseDown = function(ev){
}

TopoHandler.prototype.rightMouseDown = function(ev){

}
TopoHandler.prototype.keyDownEvent = function(ev){
	if(ev.keyCode == 46){
		var network = Topo.TopoUtil.getNetwork();
		network.deleteSelected();
	}
}

TopoHandler.prototype.removeElement = function(){
	if(!Topo.TopoUtil.isSelected()){
		alert("삭제할 노드 또는 엣지를 선택해주세요.");
		return;
	}
	Topo.TopoUtil.remove();
}

TopoHandler.prototype.editElement = function(data){
	if(data == undefined) return;

	var handler = this;
	saveData = {};
	var ids = data.id.split("_")[0];
	idx = handler.id[ids];
	data.image = ids+'.svg';
	data.id = ids+idx;

	Topo.TopoUtil.addNode(data)
	handler.id[ids]++;
}

TopoHandler.prototype.editEdges = function(data){
	Topo.TopoUtil.addEdge();
}
