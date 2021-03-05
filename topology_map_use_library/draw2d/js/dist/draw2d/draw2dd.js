/**
 * @class example.connection_labeledit.LabelConnection
 * 
 * A simple Connection with a label wehich sticks in the middle of the connection..
 *
 * @author Andreas Herz
 * @extend draw2d.Connection
 */
var LabelConnection= draw2d.Connection.extend({
    
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
          text:"I'm a Label",
          color:"#0d0d0d",
          fontColor:"#0d0d0d",
          bgColor:"#f0f0f0"
      });
     
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator());
      
      // Register a label editor with a dialog
      //
      this.label.installEditor(new draw2d.ui.LabelEditor());
      
      this.attr({
          router:new draw2d.layout.connection.InteractiveManhattanConnectionRouter(),
          outlineStroke:1,
          outlineColor:"#303030",
          stroke:2,
          color:"#00a8f0",
          radius:4
      });
    }
});

// declare the namespace for this example
var example = {};

/**
 * 
 * The **GraphicalEditor** is responsible for layout and dialog handling.
 * 
 * @author Andreas Herz
 */
example.Application = Class.extend({
    NAME : "example.Application",

    /**
     * @constructor
     * 
     */
    init : function() 
    {
        var router = new draw2d.layout.connection.CircuitConnectionRouter();
        router.abortRoutingOnFirstVertexNode=false;

        this.canvas = new example.Canvas("network");
        this.toolbar = new example.Toolbar("toolbar", this.canvas);
        this.properties = new example.EventPane( this.canvas);

        // install a custome ConnectionCreate policy into the canvas
        this.canvas.installEditPolicy(  new draw2d.policy.connection.DragConnectionCreatePolicy({
            createConnection: function(){

                var c = new draw2d.Connection({
                    outlineColor:"#ffffff",
                    outlineStroke:1,
                    router: router,
                    stroke:2
                });

                return c;
            }
        }));

    }

});


example.Toolbar = Class.extend({
	
	init:function(elementId, view){
		this.html = $("#"+elementId);
		this.view = view;
		
		// register this class as event listener for the canvas
		// CommandStack. This is required to update the state of 
		// the Undo/Redo Buttons.
		//
		view.getCommandStack().addEventListener(this);

		// Register a Selection listener for the state hnadling
		// of the Delete Button
		//
        view.on("select", $.proxy(this.onSelectionChanged,this));
		
		// Inject the UNDO Button and the callbacks
		//
		this.undoButton  = $("<button class='gray'>Undo</button>");
		this.html.append(this.undoButton);
		this.undoButton.click($.proxy(function(){
		       this.view.getCommandStack().undo();
		},this));

		// Inject the REDO Button and the callback
		//
		this.redoButton  = $("<button class='gray'>Redo</button>");
		this.html.append(this.redoButton);
		this.redoButton.click($.proxy(function(){
		    this.view.getCommandStack().redo();
		},this));
		
		this.delimiter  = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the DELETE Button
		//
		this.deleteButton  = $("<button class='gray'>Delete</button>");
		this.html.append(this.deleteButton);
		this.deleteButton.click($.proxy(function(){
			var node = this.view.getPrimarySelection();
			var command= new draw2d.command.CommandDelete(node);
			this.view.getCommandStack().execute(command);
		},this));
		
        this.disableButton(this.undoButton, true);
        this.disableButton(this.redoButton, true);
        this.disableButton(this.deleteButton, true);

        this.html.append($("<div id='toolbar_hint'>Listening on canvas events</div>"));
    },

	/**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 *
	 * @param {draw2d.Canvas} emitter
	 * @param {Object} event
	 * @param {draw2d.Figure} event.figure
	 */
	onSelectionChanged : function(emitter, event){
        this.disableButton(this.deleteButton,event.figure===null );
	},
	
	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
	 * can be used to identify the type of event which has occurred.
	 * 
	 * @template
	 * 
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	stackChanged:function(event)
	{
        this.disableButton(this.undoButton, !event.getStack().canUndo());
        this.disableButton(this.redoButton, !event.getStack().canRedo());
	},
	
	disableButton:function(button, flag)
	{
	   button.prop("disabled", flag);
       if(flag){
            button.addClass("disabled");
        }
        else{
            button.removeClass("disabled");
        }
	}
});
example.EventPane = Class.extend({
	
	init:function( canvas)
	{
	    var log= function(msg){
	        $("#events").prepend($("<div>"+new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")+" - "+msg+"</div>"));
	    };
	    
		canvas.on("figure:add", function(emitter, event){
            log("Figure added");
        });
        
        canvas.on("figure:remove", function(emitter, event){
            log("Figure removed");
        });

        canvas.on("select", function(emitter, event){
            log("Figure selected: "+event);
        });

        canvas.on("unselect", function(emitter, event){
            log("Figure unselected: "+event);
        });

        canvas.on("dblclick", function(emitter, event){
            log("double click: "+event);
        });

        canvas.on("click", function(emitter, event){
            log("click: "+event);
        });

        canvas.on("contextmenu", function(emitter, event){
            log("Context Menu: "+event);
        });
    }
    
});

example.Canvas = draw2d.Canvas.extend({
	
	init:function(id){
		this._super(id, 2000,2000);
		
		this.setScrollArea("#"+id);

		this.on("select", function(emitter, event){
			if(event.figure instanceof draw2d.Connection) {
				event.figure.addCssClass("connection_highlight");
			}
		});

		this.on("unselect", function(emitter, event){
			if(event.figure instanceof draw2d.Connection) {
				event.figure.removeCssClass("connection_highlight");
			}
		});
	}
});

