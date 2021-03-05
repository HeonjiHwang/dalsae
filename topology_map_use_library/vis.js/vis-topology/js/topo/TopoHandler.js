var TopoHandler = function(){
	this.networkData = {
		"root" : {"name" : "company", "ip" : "1.1.1.1", x:-333, y:-367},
		"workstation" : {"name" : "Management WorkStation", "ip" : "1.1.1.8", "parent":"company", x:-517, y:-367},
		"group0" :{"name" : "server Farms", "group":"server Farms", "parent":"company", x:-0, y:-225},
		"group1" :{"name" : "External Servers", "group":"External Servers", "parent":"company", x:-598, y:-215},
		"group2" : {"name" : "Core Switches", "group":"Core Switches", "parent":"Server Farm Switch,External Firewall", x:-417, y:127}, 
		"group3" : {"name" : "Distribution Access Switches", "group":"Access Switches", "parent":"Core Switch0,Core Switch1", x:-731, y:379}, 
		"group4" : {"name" : "Campus Edge Routers", "group":"Campus Edge Routers", "parent":"Core Switch0,Core Switch1", x:-255, y:381},
		"group5" : {"name" : "External Firewall", "group":"External Firewall", "parent":"Web,Extranet", x:-693, y:18},
		"server0" : {"name" : "EHR", "group":"server Farms", "ip" : "1.1.1.2", "parent":"server Farms", x:141, y:-90},
		"server1" : {"name" : "PACS", "group":"server Farms", "ip" : "1.1.1.3", "parent":"server Farms", x:15, y:-90},
		"server2" : {"name" : "LDAP", "group":"server Farms","ip" : "1.1.1.4", "parent":"server Farms", x:-204, y:-90},
		"server3" : {"name" : "App Servers", "group":"server Farms", "ip" : "1.1.1.5", "parent":"server Farms", x:-84, y:-90},
		"server4" : {"name" : "Web", "group":"External Servers", "ip" : "1.1.1.6", "parent":"External Servers", x:-714, y:-119},
		"server5" : {"name" : "Extranet", "group":"External Servers", "ip" : "1.1.1.7", "parent":"External Servers", x:-486, y:-119},
		"switch0" : {"name" : "Server Farm Switch", "group":"", "ip" : "1.1.1.9", "parent":"LDAP,App Servers,PACS,EHR", x:-33, y:36},
		"switch1" : {"name" : "Core Switch0", "group":"Core Switches", "ip" : "1.1.1.12", "parent":"Core Switches", x:-531, y:232},
		"switch2" : {"name" : "Core Switch1", "group":"Core Switches", "ip" : "1.1.1.13", "parent":"Core Switches", x:-296, y:232},
		"switch3" : {"name" : "Access Switch0", "group":"Access Switches", "ip" : "1.1.1.14", "parent":"Distribution Access Switches", x:-608, y:483},
		"switch4" : {"name" : "Access Switch1", "group":"Access Switches", "ip" : "1.1.1.15", "parent":"Distribution Access Switches", x:-731, y:483},
		"switch5" : {"name" : "Access Switch2", "group":"Access Switches", "ip" : "1.1.1.16", "parent":"Distribution Access Switches", x:-844, y:483},
		"router0" : {"name" : "Router0", "group":"Campus Edge Routers", "ip" : "1.1.1.17", "parent":"Campus Edge Routers", x:-321, y:477},
		"router1" : {"name" : "Router1", "group":"Campus Edge Routers", "ip" : "1.1.1.18", "parent":"Campus Edge Routers", x:-185, y:477},
		"firewall0" : {"name" : "Core firewall", "group":"External Firewall", "ip" : "1.1.1.10", "parent":"External Firewall", x:-800, y:118},
		"internet0" : {"name" : "Internet", "group":"External Firewall", "ip" : "1.1.1.11", "parent":"Core firewall", x:-957, y:118}
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