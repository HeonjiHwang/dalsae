var GlobeHandler = function(scene, engine){
	this.scene = scene;
	this.engine = engine;
	this.target = new BABYLON.Vector3(5,-3,-4);
	this.camPos = new BABYLON.Vector3(1.0113382223450738, 1.3821677073420818, 9.224115735823032);
	
	//light
	this.hLight = undefined;
	this.dLight = undefined;
	//default mesh and value of globe
	this.earth = undefined;
	this.night = undefined;
	this.cloud = undefined;
	this.parentS = undefined;
	this.radius = 13;
	this.isCenter = false;
	//camera
	this.camera = undefined;
	this.camera2 = undefined;
	//gui
	this.gui = {};
	this.disc = [];
	//event
    this.lastPosition = BABYLON.Vector3();
	this.isDown = false;
	//animation
	this.fLine = [];
	this.nPoints = {};
	this.focusS = [];
	this.count = 0;
	this.mapLines = new Map();
	//longitude and latitude
	this.LonLat = {};
	this.allLonLat = {"California(north)":{lat:36.778259,lon: -119.417931, aws:'Y',gcp:'N'},Sydney:{lat:-33.865143,lon:151.209900, aws:'Y', gcp:'Y'}
				 ,Ohio:{lat:40.367474,lon:-82.996216, aws:'Y', gcp:'N'}, Beijing:{lat:39.916668,lon:116.383331, aws:'Y', gcp:'N'}
				 ,Melbourne:{lat:-37.8082,lon:144.9578, aws:'N', gcp:'Y'},Toronto:{lat:43.651070,lon:-79.347015, aws:'N', gcp:'Y'}
				 ,Tokyo:{lat:35.652832,lon:139.839478, aws:'Y', gcp:'Y'},"Virginia(north)":{lat:37.926868,lon:-78.024902, aws:'Y', gcp:'Y'}
				 ,Montreal:{lat:45.630001,lon:73.519997, aws:'N', gcp:'Y'},"Salt Lake City":{lat:40.758701,lon:-111.876183, aws:'N', gcp:'Y'}
				 ,"Canada(centeral)":{lat:50,lon:-79, aws:'Y', gcp:'N'},"Hong Kong":{lat:22.302711,lon:114.177216, aws:'Y', gcp:'Y'}
				 ,Stockholm:{lat:59.3326,lon:18.0649, aws:'Y', gcp:'N'},Ireland:{lat:53.350140,lon:-6.266155, aws:'Y', gcp:'N'}
				 ,London:{lat:51.5073509,lon:-0.1277583, aws:'Y', gcp:'Y'},Paris:{lat:48.864716,lon:2.349014, aws:'Y', gcp:'Y'}
				 ,Frankfurt:{lat:50.110924,lon:8.682127, aws:'Y', gcp:'Y'},Zurich:{lat:47.3667,lon:8.5500, aws:'Y', gcp:'Y'}
				 ,Milan:{lat:45.464664,lon:9.188540, aws:'Y', gcp:'N'},Spain:{lat:40.2085,lon:-3.7130, aws:'Y', gcp:'N'}
				 ,"Sao Paulo":{lat:-23.533773,lon:-46.625290, aws:'Y', gcp:'Y'},"Cape Town":{lat:-33.918861,lon:18.423300, aws:'Y', gcp:'N'}
				 ,Bahrain:{lat:25.9434256,lon:50.6014985, aws:'Y', gcp:'N'},Mumbai:{lat:19.076090,lon:72.877426, aws:'Y', gcp:'Y'}
				 ,Hyderabad:{lat:17.387140,lon:78.491684, aws:'Y', gcp:'N'},Singapore:{lat:1.290270,lon:103.851959, aws:'Y', gcp:'N'}
				 ,Indonesia:{lat:-6.200000,lon:106.816666, aws:'Y', gcp:'N'},Ningxia:{lat:36.015854,lon:106.242607, aws:'Y', gcp:'N'}
				 ,Osaka:{lat:34.669529,lon:135.497009, aws:'Y', gcp:'Y'},"Asia Pacific(Melbourne)":{lat:-37.8082,lon:144.9578, aws:'Y', gcp:'N'}
				 ,"Las Vegas":{lat:36.114647,lon:-115.172813, aws:'N', gcp:'Y'},"Los Angeles":{lat:34.052235,lon:-118.243683, aws:'N', gcp:'Y'}
				 ,"Carolina(south)":{lat:33.836082,lon:-81.163727, aws:'N', gcp:'Y'},Netherland:{lat:52.2130,lon:5.2794, aws:'N', gcp:'Y'}
				 ,Belgium:{lat:51.260197,lon:4.402771, aws:'N', gcp:'Y'},Warsaw:{lat:52.237049,lon:21.017532, aws:'N', gcp:'Y'}
				 ,Finland:{lat:60.192059,lon:24.945831, aws:'N', gcp:'Y'},Doha:{lat:25.286106,lon:51.534817, aws:'N', gcp:'Y'}
				 ,Delhi:{lat:28.610001,lon:77.230003, aws:'N', gcp:'Y'},Taiwan:{lat:25.105497,lon:121.597366, aws:'N', gcp:'Y'}
				 ,Jakarta:{lat:-6.121435,lon:106.774124, aws:'N', gcp:'Y'},Seoul:{lat:37.532600,lon:127.024612, aws:'Y', gcp:'Y'}
				 ,Oregon:{lat:44,lon:-120.5, aws:'Y', gcp:'N'}};
	
	//temp
	this.focusPos = {Moscow:new BABYLON.Vector3(15.77,6.6,-2.73),London:new BABYLON.Vector3(13.89,6.31,-10.62),Paris:new BABYLON.Vector3(15.06,5.76,-9.62)
					,"New York":new BABYLON.Vector3(3.06,4.00,-16.53),Chille:new BABYLON.Vector3(5.31,-14.03,-13.39), Beijing:new BABYLON.Vector3(3.91,3.67,8.81)
					,Tokyo:new BABYLON.Vector3(-1.1,2.7,7.83),Vancouver:new BABYLON.Vector3(-4.98,5.58,-10.04),Sydney:new BABYLON.Vector3(-1.12,-13.88,3.35)
					,"Los Angeles":new BABYLON.Vector3(-4.88,2.02,-13.33),Dubai:new BABYLON.Vector3(16.50,-0.45,4.43),HongKong:new BABYLON.Vector3(3.28,-0.86,10.23)}
	
	this.init.call(this);
}

GlobeHandler.prototype.init = function(){
	var handler = this;
	
	//latitude sorting
	{
		var lat = [], name = [];
		for(k in handler.allLonLat){
			var use = handler.allLonLat[k];
			if(use.aws == 'Y'){
				lat.push(use.lat);
			}
		}
		lat.sort(function(a, b){ return b-a;});
		
		for(var i=0;i<lat.length;i++){
			for(k in handler.allLonLat){
				var use = handler.allLonLat[k];
				if(use.lat == lat[i] && use.aws == 'Y'){
					name.push(k);
				}
			}
		}
		for(var i=0;i<name.length; i++){
			for(k in handler.allLonLat){
				if(k == name[i]){
					var use = handler.allLonLat[k];
					handler.LonLat[k] = use;
				}
			}
		}
	}
	
	//background
	var layer = new BABYLON.Layer('','./imgs/earth_map_background.jpg',handler.scene, true);
	handler.scene.clearColor = new BABYLON.Color3(0,0,0);
	
	//settings
	{
		handler.lightSetting();
		handler.testCamera();
		handler.setMaterials();
		handler.testMesh();
		handler.MouseEvent();
		//handler.cameraSetting();
		//handler.meshSetting();
		//handler.event();
	}
}

GlobeHandler.prototype.testCamera = function(){
	var handler = this;
	
	handler.camPos = new BABYLON.Vector3(-2.477365150779833, 10.885810482200009, 0.8450788396640672);
	handler.isCenter = true;
	
	//TARGET CAMERA FOR BACKGROUND & ARCROTATECAMERA FOR TARGETSSSSSS
	{
		var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), handler.scene);
		
		handler.scene.activeCameras.push(camera);
		handler.scene.activeCamera = camera;
		
		camera.position = handler.camPos;
		camera.attachControl(canvas, true);
		camera.inertia = 0.7;
		camera.lowerRadiusLimit = 10;
		camera.upperRadiusLimit = 1000;
		camera.upperBetaLimit = Math.PI / 2*2;
		camera.angularSensibilityX = camera.angularSensibilityY = 500;
		camera.checkCollisions = true;
	}
	
	//RIGHT CLICK DISABLE & ZOOM IN AND OUT DISABLE ON ARCROTATECAMERA
	{
		var pointers = camera.inputs.attached["pointers"];
		if(pointers){
			pointers.buttons = [0]
		}
		camera.inputs.remove(camera.inputs.attached.mousewheel);
	}
	handler.camera = camera;
};

GlobeHandler.prototype.testMesh = function(){
	var handler = this;	
	
	//EARTH MATERIAL
	{
		var earthMap = new BABYLON.StandardMaterial('earthMap', handler.scene);
		earthMap.diffuseTexture = new BABYLON.Texture("imgs/earthmap.jpg", handler.scene);
		//earthMap.bumpTexture = new BABYLON.Texture("imgs/earth_bumpmap.jpg", handler.scene);
		earthMap.specularColor = new BABYLON.Color3(0,0,0);
	}
	
	//CREATE EARTH MESH
	{
		handler.earth = BABYLON.Mesh.CreateSphere('earth', 120, handler.radius, handler.scene);
		handler.earth.material = earthMap;
		handler.earth.position = new BABYLON.Vector3(0,0,15);
		handler.earth.rotation.z = Math.PI;
		handler.earth.rotation.y = Math.PI*3;
		handler.earth.visibility = 1;
		handler.earth.checkCollisions = true;
		handler.camera.setTarget(new BABYLON.Vector3(0,0,15))
	}
	//PARENT SPHERE(LON & LAT)
	{
		var Psphere = BABYLON.Mesh.CreateSphere('Psphere', 120, handler.radius, handler.scene);
		Psphere.position = new BABYLON.Vector3(0,0,15);
		Psphere.rotation.y = Math.PI*5+Math.PI/2*0.5;
		Psphere.visibility = 0;
		handler.parentS = Psphere;
	}
	//NIGHT
	/*{
		var nightMap = new BABYLON.StandardMaterial('nightMap', handler.scene);
		nightMap.diffuseTexture = new BABYLON.Texture("imgs/earth_lightsmap.jpg", handler.scene);
		nightMap.bumpTexture = new BABYLON.Texture("imgs/earth_bumpmap.jpg", handler.scene);
		nightMap.specularColor = new BABYLON.Color3(0,0,0);
		
		handler.night = BABYLON.Mesh.CreateSphere('night', 120, handler.radius, handler.scene);
		handler.night.material = nightMap;
		handler.night.parent = handler.earth;
		handler.night.visibility = 0;
		handler.night.checkCollisions = true;
	}
		
	//CLOUD
	{	
		var cloudMat = new BABYLON.StandardMaterial('cloudMat', handler.scene);
		cloudMat.opacityTexture = new BABYLON.Texture("imgs/earth_cloud2.png", handler.scene);
		cloudMat.specularColor = new BABYLON.Color3(0,0,0);
		cloudMat.alpha = 0.8
		
		var cloud = BABYLON.Mesh.CreateSphere("cloud", 120, handler.radius+0.1, handler.scene);
		cloud.material = cloudMat;
		cloud.isPickable = false;
		cloud.parent = handler.earth;
		cloud.checkCollisions = true;
		handler.cloud = cloud;
	}
	
	//CREATE EARTH'S ATMOSPHERE
	{
		var at = BABYLON.Mesh.CreateSphere("cloud", 120, handler.radius+0.05, handler.scene);
		at.parent = handler.earth;
		var atmosphere2 = new BABYLON.HighlightLayer("hl", scene);
		atmosphere2.addMesh(at, new BABYLON.Color3.FromHexString('#5aadff'));
		atmosphere2.blurVerticalSize = 2;
		atmosphere2.blurHorizontalSize = 2;
		atmosphere2.innerGlow = false;
		
		at.onBeforeRenderObservable.add(function(){
			handler.scene.getEngine().setColorWrite(false);
		});
		at.onAfterRenderObservable.add(function(){
			handler.scene.getEngine().setColorWrite(true);
		});
		
		var atmosphere1 = new BABYLON.HighlightLayer("hl", scene);
		atmosphere1.addMesh(handler.earth, new BABYLON.Color3.FromHexString('#f0fcff'));
		atmosphere1.outerGlow = false;
	}*/
	handler.EarthAnimation();
}

GlobeHandler.prototype.setMaterials = function(){
	var handler = this;
	
	if(handler._blue_mat == undefined){
		var mat = new BABYLON.StandardMaterial("blueMat", handler.scene);
		mat.specularColor = new BABYLON.Color3(0, 0, 0);
		mat.diffuseColor = new BABYLON.Color3.FromHexString('#3498db');
		mat.emessiveColor = new BABYLON.Color3.FromHexString('#3498db');
		mat.fogEnable = false;
		mat.forceDepthWrite = true;
		handler._blue_mat = mat;
	}
	
	if(handler._orange_mat == undefined){
		var mat = new BABYLON.StandardMaterial("orangeMat", handler.scene);
		mat.specularColor = new BABYLON.Color3(0, 0, 0);
		mat.diffuseColor = new BABYLON.Color3.FromHexString('#ffa54b');
		mat.emessiveColor = new BABYLON.Color3.FromHexString('#ffa54b');
		mat.fogEnable = false;
		mat.forceDepthWrite = true;
		handler._orange_mat = mat;
	}	

	if(handler._white_mat == undefined){
		var mat = new BABYLON.StandardMaterial("whiteMat", handler.scene);
		mat.specularColor = new BABYLON.Color3(0, 0, 0);
		mat.diffuseColor = new BABYLON.Color3.FromHexString('#ffffff');
		mat.emessiveColor = new BABYLON.Color3.FromHexString('#ffffff');
		mat.fogEnable = false;
		mat.forceDepthWrite = true;
		handler._white_mat = mat;
	}
}

GlobeHandler.prototype.lightSetting = function(){
	var handler = this;
	handler.hLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(2, 10, 3), handler.scene);
	handler.dlight = new BABYLON.HemisphericLight("dlight", new BABYLON.Vector3(0, -3, 0), handler.scene);
	handler.hLight.intensity = 1.2;
	handler.dlight.intensity = 1.1;
}

GlobeHandler.prototype.changeMesh = function(){
	var handler = this;
	
	var max = 14.5;
	var min = 13.5;
	
	var pos = new BABYLON.Vector3(0,0,0);
	
	var observer = handler.scene.onBeforeRenderObservable.add(function(){
		
		var lonlat = handler.LonLat["Seoul"];
		var korea = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 0, handler.radius/2);
		
		var sphere = BABYLON.Mesh.CreateSphere('k', 30, 0.2, handler.scene);
		sphere.position = korea;
		sphere.parent = handler.parentS;
		sphere.getBoundingInfo().boundingBox._update(sphere.computeWorldMatrix(true));
		pos = sphere.absolutePosition;
		sphere.dispose();
		
		var dis = BABYLON.Vector3.Distance(handler.camera.position, pos);
		if(dis >= min && dis < min+0.4){
			handler.earth.visibility = 0.7;
			handler.night.visibility = 0.2;
		}else if(dis >= min+0.4 && dis < min+0.8){
			handler.earth.visibility = 0.44;
			handler.night.visibility = 0.5;
		}else if(dis >= min+0.8 && dis < max){
			handler.earth.visibility = 0.2;
			handler.night.visibility = 0.7;
		}else if(dis >= max){
			handler.earth.visibility = 0;
			handler.night.visibility = 1;
		}else{
			handler.earth.visibility = 1;
			handler.night.visibility = 0;
		}
	});
}

GlobeHandler.prototype.EarthAnimation = function(){ //animation 수정
	var handler = this;
	
	//var max = Math.PI*4;
	var max = Math.PI*5+Math.PI/2*0.5
	//EARTH ANIMATION WHEN LOADING ALL FINISHED
	{
		var startOb = handler.scene.onBeforeRenderObservable.add(function(){
			handler.earth.rotation.y += 0.05;
			if(max - handler.earth.rotation.y <= 0.005 && handler.scene.onBeforeRenderObservable.hasObservers){
				handler.scene.onBeforeRenderObservable.remove(startOb);
				handler.earth.rotation.y = max;
				handler.setLinks();
				/*handler.changeMesh();
				var observer = handler.scene.onBeforeRenderObservable.add(function(){
					handler.cloud.rotation.y += 0.003;
					handler.cloud.rotation.x -= 0.001;
					handler.cloud.rotation.z += 0.001;
				});*/
			}
		});
	}
};

GlobeHandler.prototype.setLinks = function(){
	var handler = this;
	//get all position from LonLat and create sphere to link the flags
	{
		var lonlat = handler.LonLat["Seoul"];
		var korea = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 0, handler.radius/2);
		
		for(k in handler.LonLat){
			var coor = handler.LonLat[k];
			var pos = handler.llarToWorld(handler.toRadians(coor.lat), handler.toRadians(coor.lon), 0, handler.radius/2);
			var sphere = BABYLON.Mesh.CreateSphere(k, 30, 0.2, handler.scene);
			sphere.position = pos;
			sphere.parent = handler.parentS;
			sphere.visibility = 0;
			
			//createLine - korea to others
			if(k != "Seoul"){
				handler.createLine(korea, lonlat, handler.LonLat[k], k, sphere);
			}else{
				handler.flagSetting(sphere, k);
			}
		}
	}
}

GlobeHandler.prototype.createLine = function(korea, benchMark, lonlat, nation, sphere){
	var handler = this;
	var max = Object.keys(handler.LonLat).length-1;
	//get middle points 
	{
		var other = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 0, handler.radius/2);	//endPoint
		var distance = BABYLON.Vector3.Distance(korea, other);
		var alt = distance >=10 ? 5 : distance >=8 ? 2.8 : distance >= 3 ? 2 : 0.5; 		//altitude
		var mid = handler.getMidPoint(benchMark, lonlat, alt);								//get middle points (src{lon,lat}, dst{lon,lat}, altitude)
	}
	
	//create lines
	{
		var points = [];
		var dot = distance*15;
		var bezier = BABYLON.Curve3.CreateCubicBezier(korea, mid[0], mid[1], other, dot);
		var roundedPoints = bezier.getPoints();
		for(var j=0;j<roundedPoints.length;j++){
			points.push(roundedPoints[j]);
		}
		handler.nPoints[nation] = points;
		
		var i=0, arr = [], line;
		var observer = handler.scene.onBeforeRenderObservable.add(function(){
			var point = distance >=8 ? [points[i],points[i+1],points[i+2]] : [points[i],points[i+1]];
			line = BABYLON.Mesh.CreateTube(nation, point, 0.01, 10, null, 3, handler.scene, false, BABYLON.Mesh.FRONTSIDE);
			line.material = handler._blue_mat;
			line.parent = handler.parentS;
			arr.push(line);
			i++;
			if(i == points.length-3 && handler.scene.onBeforeRenderObservable.hasObservers){
				handler.scene.onBeforeRenderObservable.remove(observer);
				for(var j=0;j<arr.length;j++){
					arr[j].dispose();
				}
				line = BABYLON.Mesh.CreateTube("path_"+nation, points, 0.01, 10, null, 3, handler.scene, false, BABYLON.Mesh.FRONTSIDE);
				line.material = handler._blue_mat;
				line.parent = handler.parentS;
				handler.fLine.push(line);
				handler.flightLineAnimation(points, nation);
				
				line2 = BABYLON.Mesh.CreateTube("path_"+nation, points, 0.05, 10, null, 3, handler.scene, false, BABYLON.Mesh.FRONTSIDE);
				line2.parent = handler.parentS;
				line2.visibility = 0;
				
				var obj = {};
				obj.activeMesh = line;
				obj.onMesh = line2;
				handler.mapLines.set(nation, obj);
				
				//LOADING
				handler.count++;
				$("#text").text('');
				var str = handler.count+"/"+max+" "+nation.split("(")[0]+" Connected";
				$("#text").text(str);
				handler.flagSetting(sphere, nation);
				if(handler.count == max){
					setTimeout(function(){
						$("#loader").css("display","none");
					},1200);
				}
			}
		});
	}
}

GlobeHandler.prototype.distanceObserver = function(mesh){
	var handler = this;
	
	var len = Object.keys(handler.LonLat).length-1;
	var max = 16.1;
	var min = 15.5;
	
	var observer = handler.scene.onBeforeRenderObservable.add(function(){
		var dis = BABYLON.Vector3.Distance(handler.camera.position, mesh.absolutePosition);
		var code = mesh.name;
		var arr = handler.gui[code];
		if(dis >= min && dis < min+0.2){
			for(var i=0;i<arr.length;i++){
				arr[i].alpha = 0.7;
			}
		}else if(dis >= min+0.2 && dis < min+0.4){
			for(var i=0;i<arr.length;i++){
				arr[i].alpha = 0.4;
			}
		}else if(dis >= min+0.4 && dis < max){
			for(var i=0;i<arr.length;i++){
				arr[i].alpha = 0.2;
			}
		}else if(dis >= max){
			for(var i=0;i<arr.length;i++){
				arr[i].alpha = 0;
			}
		}else{
			for(var i=0;i<arr.length;i++){
				arr[i].alpha = 1;
			}
		}
	});
}

GlobeHandler.prototype.MouseEvent = function(){
	var handler = this;
	
	var overmat = handler._white_mat;
	var outmat = handler._blue_mat;
	
	handler.scene.onPointerObservable.add((pointerInfo)=>{
		switch(pointerInfo.type){
			case BABYLON.PointerEventTypes.POINTERMOVE:
				var pickInfo = handler.scene.pick(handler.scene.pointerX, handler.scene.pointerY, function(mesh){return mesh.isPickable;});
				if(pickInfo != undefined && pickInfo.pickedMesh != null){
					if(pickInfo.pickedMesh.name.includes("path") && pickInfo.pickedMesh.isVisible == true){
						$("#viewport").css("cursor", "pointer");
						if(handler.recentMesh == undefined){
							var meshName = pickInfo.pickedMesh.name.split("_")[1];
							var mesh = handler.mapLines.get(meshName).activeMesh;
							mesh.material = overmat;
							handler.recentMesh = mesh;
							$("#toolTip").text('');
							$("#toolTip").css("left",scene.pointerX+15+"px");
							$("#toolTip").css("top",scene.pointerY-0.1+"px");
							$("#toolTip").text(pickInfo.pickedMesh.name.split("_")[1]);
						}
					}else{
						$("#viewport").css("cursor", "default");
						if(handler.recentMesh != undefined){
							handler.recentMesh.material = outmat;
							handler.recentMesh = undefined;
							$("#toolTip").text('');
						}
					}
				}
				break;
			case BABYLON.PointerEventTypes.POINTERDOWN:
				var pickInfo = handler.scene.pick(handler.scene.pointerX, handler.scene.pointerY, function(mesh){return mesh.isPickable;});
				if(pickInfo != undefined && pickInfo.pickedMesh != null){
					$("#toolTip").text('');
					if(pickInfo.pickedMesh.name.includes("path") && pickInfo.pickedMesh.isVisible == true){
						handler.hideCountry(pickInfo.pickedMesh.name.split("_")[1]);
					}
				}
				break;
		}
	});
}

GlobeHandler.prototype.hideCountry = function(nation){
	var handler = this;
	
	$("#closeBtn").css("display","block");
	handler.showLine(nation);
	
	if(handler.isCenter == true){
		var animation = handler.cameraAction(1, undefined, nation);
		animation.onAnimationEnd = function(){
			handler.createDisc(nation);
		}
		handler.focusAction();
	}
	for(key in handler.gui){
		if(key != nation && key != 'Seoul'){
			var arr = handler.gui[key];
			for(var i=0;i<arr.length;i++){arr[i].isVisible = false;}
		}
	}
	for(var i=0;i<handler.fLine.length;i++){
		handler.fLine[i].isVisible = false;
	}
}

GlobeHandler.prototype.showLine = function(nation){
	var handler = this;
	
	var points = handler.nPoints[nation];
	
	for(var i=0;i<points.length;i++){
		var sphere = new BABYLON.MeshBuilder.CreateSphere("lines", {diameter:0.03}, handler.scene);
		sphere.position = points[i];
		sphere.material = handler._orange_mat;
		sphere.parent = handler.parentS;
		handler.focusS.push(sphere);
	}
	handler.sAnimation(0);
}

GlobeHandler.prototype.sAnimation = function(idx){
	var handler = this;
	
	if(handler.focusS.length == 0 || handler.focusS == undefined) return;
	
	for(var i=0;i<handler.focusS.length;i++){
		if(i%2 == idx){
			handler.focusS[i].isVisible = true;
		}else{
			handler.focusS[i].isVisible = false;
		}
	}
	setTimeout(function(){
		var i = idx == 0 ? 1 : 0;
		handler.sAnimation(i);
	},500);
}

GlobeHandler.prototype.showCountry = function(){
	var handler = this;
	
	$("#closeBtn").css("display","none");
	handler.restoreCamera(1);
	handler.disc = [];
	
	for(k in handler.gui){
		var arr = handler.gui[k];
		for(var i=0;i<arr.length;i++){
			arr[i].isVisible = true;
		}
	}
	for(var i=0;i<handler.fLine.length;i++){
		handler.fLine[i].isVisible = true;
	}
	for(var i=0;i<handler.focusS.length;i++){
		handler.focusS[i].dispose();
	}
	handler.focusS = [];
}

GlobeHandler.prototype.createDisc = function(nation){
	var handler = this;
	
	var lonlat = handler.LonLat[nation];
	var pos = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 0.02, handler.radius/2);
	
	var mat1 = new BABYLON.StandardMaterial("map_mat", handler.scene);
	mat1.opacityTexture = new BABYLON.Texture("imgs/sun.png", handler.scene);
	mat1.specularColor = new BABYLON.Color3(0, 0, 0);
	mat1.diffuseColor = new BABYLON.Color3.FromHexString('#ffffff');
	var mat2 = new BABYLON.StandardMaterial("map_mat", handler.scene);
	mat2.opacityTexture = new BABYLON.Texture("imgs/sun.png", handler.scene);
	mat2.specularColor = new BABYLON.Color3(0, 0, 0);
	mat2.diffuseColor = new BABYLON.Color3.FromHexString('#fffa6b');
	mat2.alpha = 0;
	
	var sphere = BABYLON.Mesh.CreateSphere('disc_parent', 30, 1, handler.scene);
	sphere.parent = handler.parentS;
	sphere.position = pos;
	sphere.visibility = 0;
	
	var disc1 = BABYLON.MeshBuilder.CreateDisc('disc1', {radius: 0.2, tessellation:100}, handler.scene);
	disc1.parent = sphere;
	disc1.material = mat1;
	disc1.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
	
	var disc2 = BABYLON.MeshBuilder.CreateDisc('disc1', {radius: 0.2, tessellation:100}, handler.scene);
	disc2.parent = sphere;
	disc2.material = mat2;
	disc2.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
	
	handler.disc.push(sphere);
	handler.disc.push(disc1);
	handler.disc.push(disc2);
	
	var observer = handler.scene.onBeforeRenderObservable.add(function(){
		mat2.alpha += 0.01;
		mat1.alpha -= 0.01;
		if(mat2.alpha >= 0.98){
			mat2.alpha = 0;
			mat1.alpha = 1;
		}
		if(handler.disc.length == 0 && handler.scene.onBeforeRenderObservable.hasObservers){
			sphere.dispose();
			disc1.dispose();
			disc2.dispose();
			handler.scene.onBeforeRenderObservable.remove(observer);
		}
	});
}

GlobeHandler.prototype.cameraAction = function(speedRatio, changePos, nation){
	var handler = this;
	
	var cameraPos = handler.camera.position.clone();
	
	if(handler.isCenter == true){
		var changePos = new BABYLON.Vector3();
		var lonlat = handler.LonLat[nation];
		var tmpTarget = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 0, handler.radius/2);
		var temp = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 8, handler.radius/2);
		
		var sphere = BABYLON.Mesh.CreateSphere('change', 30, 0.2, handler.scene);
		sphere.position = temp;
		sphere.parent = handler.parentS;
		sphere.getBoundingInfo().boundingBox._update(sphere.computeWorldMatrix(true));
		changePos = sphere.absolutePosition;
		sphere.dispose();
		
		var sphere2 = BABYLON.Mesh.CreateSphere('target', 30, 0.2, handler.scene);
		sphere2.position = tmpTarget;
		sphere2.parent = handler.parentS;
		sphere2.getBoundingInfo().boundingBox._update(sphere2.computeWorldMatrix(true));
		target = sphere2.absolutePosition;
		sphere2.dispose();
		handler.camera.setTarget(target);
	}
	
	
	var distance = BABYLON.Vector3.Distance(cameraPos, changePos);
	var frameRate = distance/speedRatio * 10;
	handler.camera.animations = [];
	
	var cameraAnimation = new BABYLON.Animation("camPos", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var key = [];
	key.push({
		frame:0,
		value:cameraPos
	});
	key.push({
		frame:frameRate,
		value:changePos
	});
	
	cameraAnimation.setKeys(key);
	handler.camera.animations.push(cameraAnimation);
	animation = handler.scene.beginAnimation(handler.camera, 0, frameRate*2, false, 1);
	
	return animation;
}

GlobeHandler.prototype.restoreCamera = function(speedRatio){
	var handler = this;
	
	
	handler.originAction();	//restore scale of the globe
	var changePos = handler.camPos;
	
	if(handler.isCenter == true){
		var lonlat = handler.LonLat["Seoul"];
		var tmpTarget = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 0, handler.radius/2);
		var temp = handler.llarToWorld(handler.toRadians(lonlat.lat), handler.toRadians(lonlat.lon), 7.5, handler.radius/2);
		
		var sphere = BABYLON.Mesh.CreateSphere('change', 30, 0.2, handler.scene);
		sphere.position = temp;
		sphere.parent = handler.parentS;
		sphere.getBoundingInfo().boundingBox._update(sphere.computeWorldMatrix(true));
		changePos = sphere.absolutePosition;
		sphere.dispose();
		
		var sphere2 = BABYLON.Mesh.CreateSphere('target', 30, 0.2, handler.scene);
		sphere2.position = tmpTarget;
		sphere2.parent = handler.parentS;
		sphere2.getBoundingInfo().boundingBox._update(sphere2.computeWorldMatrix(true));
		target = sphere2.absolutePosition;
		sphere2.dispose();
		
		//handler.camera.setTarget(target); //when event() is activated
		handler.camera.setTarget(new BABYLON.Vector3(0,0,15));
	}
	
	var cameraPos = handler.camera.position.clone();
	var distance = BABYLON.Vector3.Distance(cameraPos, handler.camPos);
	var frameRate = distance/speedRatio * 10;
	
	handler.camera.animations = [];
	var cameraAnimation = new BABYLON.Animation("camPos", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var key = [];
	key.push({
		frame:0,
		value:cameraPos
	});
	key.push({
		frame:frameRate,
		value:changePos
	});
	
	cameraAnimation.setKeys(key);
	handler.camera.animations.push(cameraAnimation);
	animation = handler.scene.beginAnimation(handler.camera, 0, frameRate, false, 1);
	
	return animation;
}

GlobeHandler.prototype.focusAction = function(){
	var handler = this;
	
	var frameRate = 100;
	
	var scaleAnimation = new BABYLON.Animation("scale", "scaling", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	var key = [];
	for(var i=0;i<2;i++){
		var val = i==0 ? new BABYLON.Vector3(1,1,1) : new BABYLON.Vector3(1.3,1.3,1.3);
		key.push({
			frame:i*frameRate,
			value:val
		})
	}
	
	scaleAnimation.setKeys(key);
	
	handler.earth.animations.push(scaleAnimation);
	handler.parentS.animations.push(scaleAnimation);
	handler.scene.beginAnimation(handler.earth, 0, 2*frameRate, false);
	handler.scene.beginAnimation(handler.parentS, 0, 2*frameRate, false);
}

GlobeHandler.prototype.originAction = function(){
	var handler = this;
	
	var frameRate = 100;
	
	var scaleAnimation = new BABYLON.Animation("scale", "scaling", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	var key = [];
	for(var i=0;i<2;i++){
		var val = i==1 ? new BABYLON.Vector3(1,1,1) : new BABYLON.Vector3(1.3,1.3,1.3);
		key.push({
			frame:i*frameRate,
			value:val
		})
	}
	
	scaleAnimation.setKeys(key);
	
	handler.earth.animations.push(scaleAnimation);
	handler.parentS.animations.push(scaleAnimation);
	handler.scene.beginAnimation(handler.earth, 0, 2*frameRate, false);
	handler.scene.beginAnimation(handler.parentS, 0, 2*frameRate, false);
}

GlobeHandler.prototype.flightLineAnimation = function(points, nation){
	var handler = this;
	var arr = [];
	
	var sphere = new BABYLON.MeshBuilder.CreateSphere("flight_"+nation, {diameter:0.05}, handler.scene);
	sphere.material = handler._orange_mat;
	sphere.parent = handler.parentS;
	handler.fLine.push(sphere);
	
	var sphere2 = sphere.clone();
	sphere2.name = "flight2_"+nation;
	handler.fLine.push(sphere2);
	
	var sphere3 = sphere.clone();
	sphere3.name = "flight3_"+nation;
	handler.fLine.push(sphere3);
	
	var sphere4 = sphere.clone();
	sphere4.name = "flight4_"+nation;
	handler.fLine.push(sphere4);
	
	handler.updatePos(sphere, sphere2, sphere3, sphere4, points, 0);
}

GlobeHandler.prototype.updatePos = function(sphere, sphere2, sphere3, sphere4, points, i){
	var handler = this;
	
	var len = points.length;
	if(i > len-4){
		i=0;
	}
	sphere.position = points[i];
	sphere2.position = points[i+1];
	sphere3.position = points[i+2];
	sphere4.position = points[i+3];
	i++;
	
	setTimeout(function(){
		handler.updatePos(sphere, sphere2, sphere3, sphere4, points, i);
	},200);
}

GlobeHandler.prototype.flagSetting = function(mesh, region){
	var handler = this;
	
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	var width = region.length<=6 ? 80 : region.includes("(") ? region.length*8 : region.length*11;
	
	var rect = new BABYLON.GUI.Rectangle();
	rect.width = width+"px";
	rect.height = "25px";
	rect.color = "#ffa54b";
	rect.fontSize = "14px";
	rect.background = "black";
	rect.thickness = 2;
	advancedTexture.addControl(rect);
	rect.linkWithMesh(mesh);
	rect.linkOffsetY = -45;
	rect.alpha = 0;
	
    var button = BABYLON.GUI.Button.CreateSimpleButton(region, region);
    button.width = width+"px";
    button.height = "28px";
    button.color = "#ffa54b";
	button.alpha = 0;
    rect.addControl(button);
	
	var target = new BABYLON.GUI.Ellipse();
	target.width = "10px";
	target.height = "10px";
	target.color = "#ffa54b";
	target.background = "#ffa54b";
	advancedTexture.addControl(target);
	target.linkWithMesh(mesh);
	target.alpha = 0;
	
	var line = new BABYLON.GUI.Line();
	line.lineWidth = 4;
	line.color = "#ffa54b";
	line.y2 = 12;
	line.linkOffsetY = -5;
	advancedTexture.addControl(line);
	line.linkWithMesh(mesh);
	line.connectedControl = rect;
	line.alpha = 0;
	
	if(region == 'Tokyo' || region == 'Mumbai' || region == 'Ohio' || region == "Paris"){
		rect.linkOffsetY = -60;
	}
	if(region == 'Milan'){
		rect.linkOffsetY = -35;
	}
	if(region == 'Ireland'){
		rect.linkOffsetY = -95;
	}
	if(region == "London" || region == 'Salt Lake City'){
		rect.linkOffsetY = -90;
	}
	if(region == "Frankfurt" || region == 'Las Vegas'){
		rect.linkOffsetY = -77;
	}
	
	//event
    button.onPointerDownObservable.add(function(){
		if(button.alpha == 1){
			if(button.name == 'Seoul')
				handler.showCountry();
			else
				handler.hideCountry(button.name);
			
			$('#title').empty();
			$('#title').text(button.name);
		}
		
		button.color = "#ffa54b";
		button.background = "";
    });
	button.onPointerMoveObservable.add(function(){
		button.color = "black";
		button.background = "#ffa54b"
	});
	button.onPointerOutObservable.add(function(){
		button.color = "#ffa54b";
		button.background = "";
	});
	
	handler.gui[region] = [rect, button, target, line];
	
	var observer = handler.scene.onBeforeRenderObservable.add(function(){
		rect.alpha+=0.03;
		button.alpha+=0.03;
		target.alpha+=0.03;
		line.alpha+=0.03;
		if(rect.alpha >=0.99 && handler.scene.onBeforeRenderObservable.hasObservers){
			handler.scene.onBeforeRenderObservable.remove(observer);
			handler.distanceObserver(mesh);
		}
	});
}

GlobeHandler.prototype.toRadians = function(degree){
	return degree * (Math.PI/180);
}

GlobeHandler.prototype.reverseRadians = function(radian){
	return radian/(Math.PI/180);
}

GlobeHandler.prototype.llarToWorld = function(lat, lon, alt, rad){
	var x = rad*Math.cos(lat)*Math.cos(lon)+alt*Math.cos(lat)*Math.cos(lon);
	var z = rad*Math.cos(lat)*Math.sin(lon)+alt*Math.cos(lat)*Math.sin(lon);
	var y = rad*Math.sin(lat)+alt*Math.sin(lat);
	
	return new BABYLON.Vector3(x,y,z);
}

GlobeHandler.prototype.getMidPoint = function(src, dst, alt){
	var handler = this;
	
	var lat1 = src.lat;
	var lon1 = src.lon;
	var lat2 = dst.lat;
	var lon2 = dst.lon;
	
	var dLon = handler.toRadians(lon2-lon1);
	
	lat1 = handler.toRadians(lat1);
	lat2 = handler.toRadians(lat2);
	lon1 = handler.toRadians(lon1);
	
	var bx = Math.cos(lat2) * Math.cos(dLon);
	var by = Math.cos(lat2) * Math.sin(dLon);
	var lat3 = Math.atan2(Math.sin(lat1)+Math.sin(lat2), Math.sqrt((Math.cos(lat1)+bx)*(Math.cos(lat1)+bx)+by*by));
	var lon3 = lon1 +Math.atan2(by, Math.cos(lat1)+bx);
	
	var x = handler.reverseRadians(lat3);
	var y = handler.reverseRadians(lon3);
	var points = {lat:x, lon:y};
	
	var point1 = handler.getSecondMidPoint(src, points, alt);
	var point2 = handler.getSecondMidPoint(points, dst, alt);
	
	return [point1, point2];
}

GlobeHandler.prototype.getSecondMidPoint = function(src, dst, alt, i){
	var lat1 = src.lat;
	var lon1 = src.lon;
	var lat2 = dst.lat;
	var lon2 = dst.lon;
	
	var dLon = handler.toRadians(lon2-lon1);
	
	lat1 = handler.toRadians(lat1);
	lat2 = handler.toRadians(lat2);
	lon1 = handler.toRadians(lon1);
	
	var bx = Math.cos(lat2) * Math.cos(dLon);
	var by = Math.cos(lat2) * Math.sin(dLon);
	var lat3 = Math.atan2(Math.sin(lat1)+Math.sin(lat2), Math.sqrt((Math.cos(lat1)+bx)*(Math.cos(lat1)+bx)+by*by));
	var lon3 = lon1 +Math.atan2(by, Math.cos(lat1)+bx);
	var point = handler.llarToWorld(lat3, lon3, alt, handler.radius/2);
	
	return point;
}

GlobeHandler.prototype.handleRotation = function(){
	var handler = this;
	var radius = 6;
	
	var curentPosition = new BABYLON.Vector3(handler.scene.pointerX / 900, -handler.scene.pointerY/900, 0);
	console.log(curentPosition, handler.lastPosition);
     
	if (radius == 0) 
	{
		// can't rotate ball
		return; 
	}
	var currentToLast = curentPosition.subtract(handler.lastPosition);
	
	
	var segment = currentToLast.length();
	

	if (segment == 0) 
	{
		return;
	}
	var ballDown = new BABYLON.Vector3(0, 0, -1); 
	
	var axis = BABYLON.Vector3.Cross(ballDown, currentToLast);

	if (axis == BABYLON.Vector3.Zero()) 
	{
		return;
	}

	var theta = segment / radius;
	
	var thetaDegrees = theta * 180 / Math.PI;

	var q = BABYLON.Quaternion.RotationAxis(axis, thetaDegrees);
	
	var earthRotToQuaternion = handler.earth.rotation.toQuaternion();
	var earthRotation = q.multiply(earthRotToQuaternion).toEulerAngles();
	var parentSRotToQuaternion = handler.parentS.rotation.toQuaternion();
	var parentSRotation = q.multiply(parentSRotToQuaternion).toEulerAngles();
	handler.earth.rotation = new BABYLON.Vector3(earthRotation.x, earthRotation.y, earthRotation.z);
	handler.parentS.rotation = new BABYLON.Vector3(parentSRotation.x, parentSRotation.y, parentSRotation.z);
        
}

GlobeHandler.prototype.event = function(){
    var handler = this;
    window.addEventListener("pointerdown", function (event) {
		handler.isDown = true;
    });
    window.addEventListener("pointermove", function (event) {
        if(handler.isDown == true){
			handler.handleRotation();
        }
        handler.lastPosition = new BABYLON.Vector3(scene.pointerX/900, -scene.pointerY/900, 0);
    });
    window.addEventListener("pointerup", function (event) {
        handler.isDown = false;
    });
}

GlobeHandler.prototype.shaderMesh = function(){
	var scene = this.scene;
	
	this.target = new BABYLON.Vector3(0,0,15);
	planet = BABYLON.Mesh.CreateSphere("planet", 300, this.radius, scene, true);
	planet.position = this.target;
	planet.rotation.z = Math.PI;
	planet.rotation.y = Math.PI*2;
	this.camera.target = planet.position;
	

	var lightSourceMesh = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 10, 0), scene);
    lightSourceMesh.diffuse = new BABYLON.Color3(1, 1, 1);
	//lightSourceMesh.position = new BABYLON.Vector3(-100,-100,-100);
	
	var planetMat = new BABYLON.ShaderMaterial("planetMat", scene, {
		vertexElement: "vertexPlanet",
		fragmentElement: "fragmentPlanet",
	},
	{
		attributes: ["position", "normal", "uv"],
		uniforms: ["world", "worldView", "worldViewProjection", "diffuseTexture", "nightTexture"],

	});

	var diffuseTexture = new BABYLON.Texture("imgs/earth_map.jpg", scene);
	var nightTexture = new BABYLON.Texture("imgs/earth_lightsmap.jpg", scene);

	planetMat.setVector3("vLightPosition", lightSourceMesh.position); 
	planetMat.setTexture("diffuseTexture", diffuseTexture); 
	planetMat.setTexture("nightTexture", nightTexture);

	planetMat.backFaceCulling = false;
	planet.material = planetMat;
	
	this.earth = planet;
	
	{	
		var cloudMat = new BABYLON.StandardMaterial('cloudMat', scene);
		cloudMat.opacityTexture = new BABYLON.Texture("imgs/earth_cloud2.png", scene);
		cloudMat.specularColor = new BABYLON.Color3(0,0,0);
		cloudMat.alpha = 0.8
		
		var cloud = BABYLON.Mesh.CreateSphere("cloud", 300, this.radius+0.5, scene);
		cloud.visibility = 0;
		cloud.material = cloudMat;
		cloud.isPickable = false;
		cloud.parent = this.earth;
		this.cloud = cloud;
	}
	
	var Psphere = BABYLON.Mesh.CreateSphere('Psphere', 300, this.radius, scene);
	Psphere.visibility = 0;
	Psphere.rotation.y = Math.PI/2*2.5;
	Psphere.position = this.target;
	this.parentS = Psphere;	
	
	this.EarthAnimation();
}

GlobeHandler.prototype.cameraSetting = function(){
	var handler = this;
	
	//TARGET CAMERA FOR BACKGROUND & ARCROTATECAMERA FOR TARGETSSSSSS
	{
		var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), handler.scene);
		var camera2 = new BABYLON.TargetCamera('camera2', BABYLON.Vector3.Zero(), handler.scene);
		
			camera2.parent = camera
		
		camera.attachControl(canvas, true);
		
		handler.scene.activeCameras.push(camera);
		handler.scene.activeCameras.push(camera2);
		handler.scene.activeCamera = camera;
		
		camera.setTarget(handler.target);
		
		camera2.position.x = 5.5
		camera2.position.y = 2.2
		
		camera.position = handler.camPos;
		camera.inertia = 0.7;
		camera.lowerRadiusLimit = 10;
		camera.upperRadiusLimit = 1000;
		camera.upperBetaLimit = Math.PI / 2 *8;
		camera.angularSensibilityX = camera.angularSensibilityY = 500;
	}
	
	//RIGHT CLICK DISABLE & ZOOM IN AND OUT DISABLE ON ARCROTATECAMERA
	{
		var pointers = camera.inputs.attached["pointers"];
		if(pointers){
			pointers.buttons = []
		}
		camera.inputs.remove(camera.inputs.attached.mousewheel);
	}
	handler.camera = camera;
	handler.camera2 = camera2;
};
GlobeHandler.prototype.meshSetting = function(){
	var handler = this;
	
	//EARTH MATERIAL
	{
		var earthMap = new BABYLON.StandardMaterial('earthMap', handler.scene);
		earthMap.diffuseTexture = new BABYLON.Texture("imgs/earth_map.jpg", handler.scene);
		earthMap.bumpTexture = new BABYLON.Texture("imgs/earth_bumpmap.jpg", handler.scene);
		earthMap.specularColor = new BABYLON.Color3(0,0,0);
	}
	
	//CREATE EARTH MESH
	{
		handler.earth = BABYLON.Mesh.CreateSphere('earth', 120, handler.radius, handler.scene);
		handler.earth.material = earthMap;
		handler.earth.position = handler.target;
		handler.earth.rotation.z = Math.PI;
		handler.earth.rotation.y = Math.PI*2;
		handler.earth.visibility = 1;
	}
	
	//NIGHT
	{
		var nightMap = new BABYLON.StandardMaterial('nightMap', handler.scene);
		nightMap.diffuseTexture = new BABYLON.Texture("imgs/earth_lightsmap.jpg", handler.scene);
		nightMap.bumpTexture = new BABYLON.Texture("imgs/earth_bumpmap.jpg", handler.scene);
		nightMap.specularColor = new BABYLON.Color3(0,0,0);
		
		handler.night = BABYLON.Mesh.CreateSphere('night', 120, handler.radius, handler.scene);
		handler.night.material = nightMap;
		handler.night.parent = handler.earth;
		handler.night.visibility = 0;
	}
		
	//CLOUD
	{	
		var cloudMat = new BABYLON.StandardMaterial('cloudMat', handler.scene);
		cloudMat.opacityTexture = new BABYLON.Texture("imgs/earth_cloud2.png", handler.scene);
		cloudMat.specularColor = new BABYLON.Color3(0,0,0);
		cloudMat.alpha = 0.8
		
		var cloud = BABYLON.Mesh.CreateSphere("cloud", 120, handler.radius+0.1, handler.scene);
		cloud.material = cloudMat;
		cloud.isPickable = false;
		cloud.parent = handler.earth;
		handler.cloud = cloud;
	}
	//CREATE EARTH'S ATMOSPHERE
	{
		var atmosphere1 = new BABYLON.HighlightLayer("hl", scene);
		atmosphere1.addMesh(handler.earth, new BABYLON.Color3.FromHexString('#f0fcff'));
		atmosphere1.blurVerticalSize = 2;
		atmosphere1.blurHorizontalSize = 2;
		atmosphere1.outerGlow = false;
	}
	/*{
		var at = BABYLON.Mesh.CreateSphere("cloud", 120, handler.radius+0.05, handler.scene);
		at.parent = handler.earth;
		var atmosphere2 = new BABYLON.HighlightLayer("hl", scene);
		atmosphere2.addMesh(at, new BABYLON.Color3.FromHexString('#5aadff'));
		atmosphere2.blurVerticalSize = 2;
		atmosphere2.blurHorizontalSize = 2;
		atmosphere2.innerGlow = false;
		
		at.onBeforeRenderObservable.add(function(){
			handler.scene.getEngine().setColorWrite(false);
		});
		at.onAfterRenderObservable.add(function(){
			handler.scene.getEngine().setColorWrite(true);
		});
	}*/
	
	//parent Sphere
	{
		var Psphere = BABYLON.Mesh.CreateSphere('Psphere', 120, handler.radius, handler.scene);
		Psphere.position = handler.target;
		Psphere.visibility = 0;
		handler.parentS = Psphere;
	}
	
	handler.EarthAnimation();
};
