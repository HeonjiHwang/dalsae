var Topo = {
	handler : undefined,
	TopoUtil : undefined,
	groupShape : new Map(),
	defaultGroupOption:{
		background : "#"+Math.floor(Math.random()*16777215).toString(16),
		font :{
			fontColor:"#000000",
			fontSize:15
		},
		border:{
			borderWidth:1,
			borderColor:"#ccc"
		},
		name:"GROUP",
		group:undefined
	},
	start(){
		var html = '<script src="./js/topo/TopoUtil.js" type="text/javascript"></script>'
		html += '<script src="./js/topo/TopoHandler.js" type="text/javascript"></script>'
		$('head').append(html);
		this.handler = new TopoHandler();
		this.TopoUtil = new TopoUtil();
		
		//override
		this.addNetworkProtoFunction();
	},
	redrawGroupBox(){
		var network = Topo.TopoUtil.getNetwork();
		network.moveGroup();
	},
	/**
		@customized network functions
	**/
	addNetworkProtoFunction(){
		vis.Network.prototype.closeGroup = function(){
			
		},
		vis.Network.prototype.openGroup = function(){
			
		},
		vis.Network.prototype.moveGroup = function(){
			var network = Topo.TopoUtil.getNetwork();
			var shape = Topo.groupShape;
			var width, height, x, y;
		},
		vis.Network.prototype.setGroup = function(options, network){
			//ctx prototype 추가
			CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r){
				if(w<2*r) r=w/2;
				if(h<2*r) r=h/2;
				
				this.beginPath();
				this.moveTo(x+r, y);
				this.arcTo(x+w, y, x+w, y+h, r);
				this.arcTo(x+w, y+h, x, y+h, r);
				this.arcTo(x, y+h, x, y, r);
				this.arcTo(x, y, x+w, y, r);
				this.closePath();
				return this;
			}
			if(network == undefined) return;
			var options = options || Topo.defaultGroupOption;
			
			var {background, font, border, name, group} = options;
			var {fontColor, fontSize} = font;
			var {borderWidth, borderStyle, borderColor} = border;
		
			var dataG = [], xPos = [], yPos = [];
			var isSwitch = false;
			for(k in Topo.TopoUtil.networkData){
				var data = Topo.TopoUtil.networkData[k];
				if(data.group != undefined && data.group == group){
					dataG.push(k);
					xPos.push(network.getPosition(k).x);
					yPos.push(network.getPosition(k).y);
					if(k.includes("switch")) isSwitch = true;
				}
			}
			var maxX = Math.max.apply(null, xPos), maxY = Math.max.apply(null, yPos);
			var minX = Math.min.apply(null, xPos), minY = Math.min.apply(null, yPos);
			var width = isSwitch === true ? maxX-minX + 120 : maxX - minX + 90;
			var height = maxY - minY + 70;
			var x = isSwitch === true ? minX-60 : minX-45
			var y = minY-20
			//for mouse events!!!
			var shape = {width:width, height:height, x:x, y:y, isDrag:false};
			Topo.groupShape.set(name, shape);
			
			var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
			ctx.globalCompositeOperation = 'destination-over';
			ctx.lineWidth = borderWidth === 0 ? 0 : borderWidth;
			ctx.strokeStyle = borderWidth === 0 ? '#3330' : borderColor;
			ctx.fillStyle = background;
			ctx.lineCap = 'square';
			ctx.beginPath();
			ctx.roundRect(x,y,width,height,10).stroke();
			ctx.fill();
			if(borderStyle == 'dashed')
				ctx.setLineDash([5]);
		},
		vis.Network.prototype.removeFromGroup = function(nodeID){
			if(nodeID === undefined) return;
			node = Topo.TopoUtil.getData().nodes;
			node.update({id:nodeID, group:''});
			Topo.TopoUtil.networkData[nodeID].group = '';
		},
		vis.Network.prototype.addToGroup = function(nodes){
			if(!Array.isArray(nodes))
				return;
			
			for(var i=0;i<nodes.length;i++){
				var nodeID = nodes[i].nodeID;
				var group = nodes[i].group;
				var data = Topo.TopoUtil.getData().nodes;
				data.update({id:nodeID, group:group});
				for(k in Topo.TopoUtil.networkData){
					if(nodeID === k){
						Topo.TopoUtil.networkData[k].group = group;
					}
				}
			}
		},
		//@param : groupbox Option
		vis.Network.prototype.addGroup = function(groupID){
			
			var network = Topo.TopoUtil.getNetwork();
			var group = groupID || Topo.guid();
			var nodes = network.getSelectedNodes();
			var data = Topo.TopoUtil.getData().nodes;
			if(nodes.length <= 0)
				return;
			
			for(var i=0;i<nodes.length;i++){
				data.update({id:nodes[i], group:group});
				for(k in Topo.TopoUtil.networkData){
					if(nodes[i] === k){
						Topo.TopoUtil.networkData[k].group = group;
					}
				}
			}
					
			//temporary options (default) :: will make groupbox popup
			var options = {
				background:"#"+Math.floor(Math.random()*16777215).toString(16)+'63',
				font:{
					fontSize:"20px",
					fontColor:"#ffffff"
				},
				border:{
					borderColor:"#444444",
					borderWidth:0
				},
				name:group,
				group:group
			}
			network.on('afterDrawing', (ev)=>{
				network.setGroup(options, network);
			});
		},
		vis.Network.prototype.removeGroup = function(groupID){
			
		},
		vis.Network.prototype.updateGroup = function({groupID, options}){
			
		},
		vis.Network.prototype.getGroupOption = function(){
			
		},
		vis.Network.prototype.updateGroup = function(){
			 
		}
	},
	guid(){
		function _s4() {
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		}
		return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
	},
	getHandler(){
		return this.handler;
	},
	getUtil(){
		return this.TopoUtil;
	}
}