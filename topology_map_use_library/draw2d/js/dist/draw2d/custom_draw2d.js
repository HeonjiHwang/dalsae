var LabelConnection = draw2d.Connection.extend({
	init(txt, attr){
		this._super(attr);
		
		this.label = new draw2d.shape.basic.Label({
			text : txt,
			fontColor:'#0d0d0d',
			bgColor:'#ffffff',
			stroke:0
		});
		
		//ManhattanMidpointLocator(가운데)
		this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator());
		
		this.label.installEditor(new draw2d.ui.LabelEditor());
		
		//선 bridge로 만들기 위한 라우터 설정
		var router = new draw2d.layout.connection.CircuitConnectionRouter();
		router.absortRoutingOnFirstVertexNode = false;
		
		this.attr({
			router : router,
			outlineStroke:1,
			outlineColor: '#ffffff',
			stroke:3,
			color:'#444444',
			radius:2
		});
	}
});

var custom = {};

custom.Application = Class.extend({
	NAME : 'custom.Application',
	init(canvasID, toobarID){
		var router = new draw2d.layout.connection.circuitConnectionRouter();
		router.abortRoutingOnFirstVertexNode = false;
		
		if(canvasID != undefined)
			this.canvas = new custom.Canvas(canvasID);
		else
			return;
		
		this.toolbar = toolbarID != undefined ? new custom.Toolbar(toobarID, this.canvas) : undefined;
		this.properties = new custom.EventPane(this.canvas);
		
		this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
			createConnection(){
				var c = new draw2d.Connection({
					outlineColor:"#444444",
					outlineStroke:1,
					router:router,
					stroke:2
				});
				
				return c;
			}
		}));
	}
});

custom.layoutApplication = Class.extend({
	NAME : 'custom.layoutApplication',
	init(canvas){
		this.view = canvas;
		this.view.setScrollArea("#network");
		
		this.appLayout = $('.network-wrapper').layout({
			center:{
				resizable : false,
				closable: false,
				spacing_open:0,
				spacing_closed:0,
				paneSelector:"#network"
			}
		});
	},
	layout(){
		this.appLayout.resizeAll();
	}
});

custom.LabeledEnd = draw2d.shape.basic.Image.extend({
	NAME : 'custom.LabeledEnd',
	init(){
		this._super();
	},
	getPersistentAttributes(){
		var memento = this._super();
		
		memento.labels = [];
		this.children.each(function(i,e){
			var labelJSON = e.figure.getPersistentAttributes();
			labelJSON.locator = e.locator.NAME;
			memento.labels.push(labelJSON);
		});
		return memento;
	},
	setPersistentAttributes(memento){
		this._super(memento);
		this.resetChildren();
		
		$.each(memento.labels, $.proxy(function(i,json){
			var figure = eval("new "+json.type+"()");
			figure.attr(json);
			var locator = eval("new "+json.locator+"()");
			this.add(figure, locator);
		}, this));
	}
});
/***
	@extend   :: Jailhouse
	@purpose  :: for opening & closing the group box 
***/
var CardJailhouse = draw2d.shape.composite.Jailhouse.extend({
	NAME: "CardJailhouse",

    init:function(attr, setter, getter)
    {
        this._super( $.extend({stroke:0, bgColor:null, width:270,height:184},attr), setter, getter);
        var port;
    },

    createShapeElement : function()
    {
        var shape = this._super();
        this.originalWidth = 270;
        this.originalHeight= 184;
        return shape;
    },

    createSet: function(){
        var set= this.canvas.paper.set();

        // BoundingBox
        shape = this.canvas.paper.path("M0,0 L270,0 L270,184 L0,184");
        shape.attr({"stroke":"none","stroke-width":0,"fill":"none"});
        set.push(shape);

        // Rectangle
        shape = this.canvas.paper.path('M0.5 24.5L0.5 184.5L270.5 184.5L270.5 0.5L81.5 0.5L0.5 24.5Z');
        shape.attr({"stroke":"#303030","stroke-width":1,"fill":"#EFFFEB","opacity":1});
        set.push(shape);

        return set;
    },

    applyAlpha: function(){
    }
});

let CollapsibleJailhouse = draw2d.shape.composite.Jailhouse.extend({

  NAME: "CollapsibleJailhouse",

  init: function (attr, setter, getter) {
	  
	var stroke = this.stroke || 1;
	var radius = this.radius || 4;
	var color = this.color || "#1E88E5";
	var bgColor = this.bgColor || "#BBDEFB";
	
    this._super($.extend({stroke: stroke, radius:radius, color:color, bgColor:bgColor}, attr), setter, getter);
	
	//collapse setting
    this.expanded = true;
    this.collapsedWidth  = 150
    this.collapsedHeight = 35
	
	
    let absoluteLocator = new draw2d.layout.locator.XYAbsPortLocator({x:8, y:3})

    let img1 = new draw2d.shape.icon.Contract({width: 15, height: 15});
    let img2 = new draw2d.shape.icon.Expand({ width: 15, height: 15, visible: false});

    img1.addCssClass("cursor")
    img2.addCssClass("cursor")
	

    this.add(img1, absoluteLocator)
    this.add(img2, absoluteLocator)
	
	//toggle잘안됨! zoom In시에만 됨.
    let toggle=()=>{
      this.expanded = !this.expanded

      img1.setVisible( this.expanded)
      img2.setVisible(!this.expanded)

      if(this.expanded){
        this.installEditPolicy(new draw2d.policy.figure.RectangleSelectionFeedbackPolicy())
        this.assignedFigures.each((i, child)=>{
          child.setVisible(true)
          child.installEditPolicy(this.policy)
          child.getPorts().each( (i, port)=>{
            port.setLocator(port._originalLocator)
            port.setConnectionDirection(port._originalDirection)
            port.getConnections().each((i, conn) => {
              conn.setVisible(true)
            })
          })
          child.portRelayoutRequired = true
          child.layoutPorts()
        })
        this.attr(this.oldDim)
      }
      else{
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy())
        this.oldDim = { width:this.getWidth(), height:this.getHeight()}
        this.assignedFigures.each((i, child)=>{
          // offset of the child and jailhouse shape
          let offset = child.getAbsolutePosition().subtract(this.getAbsolutePosition())
          child.setVisible(false)
          child.uninstallEditPolicy(this.policy)
          child.getPorts().each( (i, port)=>{
            port._originalLocator = port.getLocator()
            // store the applied connection direction (if this used)
            port._originalDirection = port.preferredConnectionDirection
            // and force the current calculated direction
            port.setConnectionDirection(port.getConnectionDirection())
            if(port.getConnectionDirection() === draw2d.geo.Rectangle.DIRECTION_RIGHT) {
              port.setLocator({
                relocate: (index, figure) => {
                  figure.setPosition(-offset.x + this.collapsedWidth + 1, -offset.y + this.collapsedHeight / 2)
                },
              })
            }
            else {
              port.setLocator({
                relocate: (index, figure) => {
                  figure.setPosition(-offset.x - 1, -offset.y + this.collapsedHeight / 2)
                },
              })
            }
            port.getConnections().each((i, conn) => {
              let source = conn.getSource().getParent()
              let target = conn.getTarget().getParent()
              conn.setVisible(source.getComposite() !== target.getComposite())
            })
          })
          child.portRelayoutRequired = true
          child.layoutPorts()
        })
        this.attr({boundingBox: {x:this.getX(), y:this.getY(),width:this.collapsedWidth, height: this.collapsedHeight}})
      }
    }
	this.attr({resizable : true});
    img1.on("click",toggle);
    img2.on("click",toggle);
  },

  assignFigure: function (figure) {
    if(figure instanceof draw2d.Connection)
      return
	
	figure.userData.parent = this;
    this._super(figure)

    figure.getPorts().each((i, port) => {
      port.toFront()
      port.getConnections().each((i, connection) => {
        connection.toFront()})
    })

    return this
  },

  /**
   *
   * Return the minWidth of the jailhouse. The minWidth is calculated by care the assigned figures.
   *
   * @returns {Number} the minimum width for the figure
   */
  getMinWidth: function () {
    let width = 0
    this.assignedFigures.each(function (i, figure) {
      if(figure.isVisible()) {
        width = Math.max(width, figure.getBoundingBox().getRight())
      }
    })
    return width - this.getAbsoluteX()
  },

  /**
   *
   * @returns {Number} the minimum height of the figure
   */
  getMinHeight: function () {
    let height = 0
    this.assignedFigures.each(function (i, figure) {
      if(figure.isVisible()) {
        height = Math.max(height, figure.getBoundingBox().getBottom())
      }
    })
    return height - this.getAbsoluteY()
  },
  
  unassignFigure: function unassignFigure(figure) {
    if (this.assignedFigures.contains(figure)) {
      this.stickFigures = true;
      figure.setComposite(null);
      figure.uninstallEditPolicy(this.policy);
      this.assignedFigures.remove(figure);
      if (!this.assignedFigures.isEmpty()) {
        var box = this.assignedFigures.first().getBoundingBox();
        this.assignedFigures.each(function (i, figure) {
          box.merge(figure.getBoundingBox());
        });
        this.setBoundingBox(box);
      }
      this.stickFigures = false;
    }

    return this;
  },
});