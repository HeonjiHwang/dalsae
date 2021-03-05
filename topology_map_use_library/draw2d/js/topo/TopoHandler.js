var TopoHandler = function(canvas){
	var canvas = canvas;
	
	return{
		installPolicies(){
			
			//install some additional edit policies
			//
			canvas.installEditPolicy(new draw2d.policy.canvas.FadeoutDecorationPolicy());
			canvas.installEditPolicy(new draw2d.policy.canvas.ExtendedKeyboardPolicy());
			canvas.installEditPolicy(new draw2d.policy.canvas.ReadOnlySelectionPolicy());
			
			//zoom in and out
			//canvas.installEditPolicy(new draw2d.policy.canvas.SnapToGeometryEditPolicy());
			//canvas.installEditPolicy(new draw2d.policy.canvas.SnapToInBetweenEditPolicy());
			//canvas.installEditPolicy(new draw2d.policy.canvas.SnapToCenterEditPolicy());
			
			canvas.installEditPolicy(new draw2d.policy.connection.ComposedConnectionCreatePolicy([
				new draw2d.policy.connection.DragConnectionCreatePolicy({
					createConnection(srcPort, trgPort){
						return new LabelConnection('new text');
					}
				})
			]));
			
			this.setLabelInject()
			//Add custom Jailhouse Class (custom.CollapsibleJailhouse)
		},
		setLabelInject(){
			draw2d.shape.basic.Label.inject({
				clearCache(){
					this.portRelayoutRequired = true;
					this.cachedMinWidth = null;
					this.cachedMinHeight = null;
					this.cachedWidth = null;
					this.cachedHeight = null;
					this.lastAppliedTextAttributes = {};
					return this;
				}
			});
		},
		readData(){
			var reader = new draw2d.io.json.Reader();
			reader.unmarshal(canvas, jsonDocument);
		},
		makeGroupingBtn(){
			var buttonGroup = $("#tools > ul");
	
			//inject the group button and the callbacks
			//
			var groupButton = $('<li><button title="Group figures" class=\"btn btn-default\" style="outline:none; background-image:url(./imgs/icons/group.png)"></button></li>');
			buttonGroup.append(groupButton);
			var btn = buttonGroup.children();
			btn.on("click", $.proxy( ()=>{
				canvas.getCommandStack().execute(new draw2d.command.CommandGroup(canvas, canvas.getSelection()));
			}, this)).button().prop('disabled', true);
			
			//injact the ungroup button and the callbacks
			var ungroupButton = $('<li><button title="Ungroup figures" class=\"btn btn-default\" style="outline:none; background-image:url(./imgs/icons/ungroup.png)"></button></li>');
			buttonGroup.append(ungroupButton);
			var unbtn = ungroupButton.children();
			unbtn.on("click", $.proxy( ()=>{
				canvas.getCommandStack().execute(new draw2d.command.CommandUngroup(canvas, canvas.getSelection()));
			}, this)).button().prop('disabled', true);
			
			buttonGroup.find(".btn").button();
			
			canvas.on('select', (emitter, event)=>{
				unbtn.prop("disabled", !(event.figure instanceof draw2d.shape.composite.Group));
				btn.prop("disabled", !(canvas.getSelection().getSize() >= 2));
			});
		},
		addNodes(data){
			var reader = new draw2d.io.json.Reader();
			reader.unmarshal(canvas, data);
			//data.add(new draw2d.shape.basic.Label({text:txt}), new draw2d.layout.locator.BottomLocator());
		},
		setReadnWriteMode(){
			canvas.installEditPolicy(new draw2d.policy.canvas.ReadOnlySelectionPolicy());
			canvas.installEditPolicy(new draw2d.policy.canvas.ReadOnlySelectionPolicy());
		},
		setText(){
			var a = canvas.getFigure('image1').getChildren().data[0];
			a.setText("라우터");
		},
		unComposite(){
			var figure = canvas.getSelection().getAll().data[0];
			var data = figure.userData.parent;
			data.unassignFigure(figure);
			figure.userData = {};
		},
		getCanvas(){
			return canvas;
		},
		getPosition(){
			if(canvas.getSelection().all.data.length === 0 || canvas.getSelection().all.data.length > 1)
				return null;
			
			var xPos = canvas.getSelection().all.data[0].x;
			var yPos = canvas.getSelection().all.data[0].y;
			
			return {x:xPos, y:yPos};
		},
		getSelectedID(){
			if(canvas.getSelection().all.data.length === 0)
				return null;
			
			var arr = canvas.getSelection().all.data;
			var id = [];
			for(var i=0;i<arr.length;i++){
				var tmp = {id:arr[i].id}
				id.push(tmp);
			}
			
			return id;
		},
	}
}