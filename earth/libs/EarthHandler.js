var EarthHandler = function(scene, engine){
	this.scene = scene;
	this.engine = engine;
	this.target = new BABYLON.Vector3(5,-3,-4);
	this.hLight = undefined;
	this.dLight = undefined;
	this.earth = undefined;
	this.camera = undefined;
	this.camera2 = undefined;
	this.cloud = undefined;
	this.map = undefined;
	this.path = [];
	this.endPoint = [];
	this.lines = [];
	this.gui = {};
	this.root = new BABYLON.TransformNode();
	this.korea = new BABYLON.Vector3(3.5,2.75,-4.87);	//korea
	this.points = {AREA1: {middle : new BABYLON.Vector3(4.2,0.8,-4), end : new BABYLON.Vector3(8.36, -2.64, -0.95)},
				  AREA2: {middle : new BABYLON.Vector3(2.94, 0, -7.47), end : new BABYLON.Vector3(3.1, -2.81, -7.06)},
				  AREA3: {middle : new BABYLON.Vector3(4.14, 0, -6), end : new BABYLON.Vector3(9.22, -2.23, -1.18)},
				  AREA4: {middle : new BABYLON.Vector3(3.7, -2.29, -8), end : new BABYLON.Vector3(4.53, -2.02, -7.73)},
				  AREA5: {middle : new BABYLON.Vector3(2.27, -0.85, -4.43), end : new BABYLON.Vector3(3.9, -0.93, -1.39)}};
	this.nationCode = {KOREA : {code:410}, 
					   "UNITED STATES" : {code:840,position:new BABYLON.Vector3(5.62,-8.86,-17.23)}, 
					   INDONESIA : {code:360, position:new BABYLON.Vector3(-0.18,5.32,6.65)}, 
					   CHINA : {code:156, position:new BABYLON.Vector3(12.79,8.87,-1.2)}, 
					   'UNITED KINGDOM' : {code:826, position:new BABYLON.Vector3(18.23,-2.24,-9.82)},
					   PHILIPPINE : {code:608, position:new BABYLON.Vector3(0.81,7.78,4.77)}};
					   
	
	// rotate earth
	{
		this.clicked = false;
		this.currentPosition = { x: 0, y: 0 };
		this.currentRotation = { x: 0, y: 0 };
		this.lastAngleDiff = { x: 0, y: 0 };
		this.oldAngle = { x: 0, y: 0 };
		this.newAngle = { x: 0, y: 0 };
		this.mousemov = false;
		this.framecount = 0;
		this.mxframecount = 120; //4 secs at 60 fps
	}				  
	this.init.call(this);
}

EarthHandler.prototype.init = function(){
	var handler = this;
	var background = Background(this.scene);
	handler.scene.clearColor = new BABYLON.Color3(0,0,0);
	handler.cameraSetting();
	handler.lightSetting();
	handler.meshSetting();
	handler.MouseEvent();
	handler.showAxis(10);
	
	/*handler.scene.beforeRender = function () {
		handler.mousemov = false;
	}

	handler.scene.afterRender = function () { 
		if (!handler.mousemov && handler.framecount < handler.mxframecount) {
			handler.lastAngleDiff.x = handler.lastAngleDiff.x / 1.1;
			handler.lastAngleDiff.y = handler.lastAngleDiff.y / 1.1;
			
			handler.earth.rotation.x += handler.lastAngleDiff.x;
			handler.earth.rotation.y += handler.lastAngleDiff.y
			
			handler.framecount++;
			handler.currentRotation.x = handler.earth.rotation.x;
            handler.currentRotation.y = handler.earth.rotation.y;
		} else if(handler.framecount >= handler.mxframecount) {
			handler.framecount = 0;
		}
	};
	
	handler.rotateEvent();*/
}

EarthHandler.prototype.cameraSetting = function(){
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
			pointers.buttons = [0];
		}
		camera.inputs.remove(camera.inputs.attached.mousewheel);
	}
	handler.camera = camera;
	handler.camera2 = camera2;
};

EarthHandler.prototype.lightSetting = function(){
	var handler = this;
	handler.hLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(2, 10, 3), handler.scene);
	handler.dlight = new BABYLON.HemisphericLight("dlight", new BABYLON.Vector3(0, -3, 0), handler.scene);
	handler.hLight.intensity = 1.9;
	handler.dlight.intensity = 1.9;
}

EarthHandler.prototype.sunSetting = function(){
	var scene = this.scene;
	var egine = this.engine;

	//SUN MATERIAL
	{
		var sunlight = new BABYLON.PointLight("sunLight", new BABYLON.Vector3(27,-14,-1), scene);
		var sun = new BABYLON.MeshBuilder.CreateSphere("astre", {diameter:4}, scene);
		var solar = new BABYLON.StandardMaterial("solar", scene);
		solar.emissiveTexture = new BABYLON.Texture("./imgs/sun.png", scene, true, false);
		sun.material = solar;
		sun.position = sunlight.position;
		var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, this.camera2, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);

		godrays._volumetricLightScatteringRTT.renderParticles = true;

		godrays.exposure = 0.5;
		godrays.decay = 0.96815;
		godrays.weight = 0.7;
		godrays.density = 0.996;
		
		godrays.mesh.material.diffuseTexture = new BABYLON.Texture('imgs/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
		godrays.mesh.material.diffuseTexture.hasAlpha = true;
		godrays.mesh.position = new BABYLON.Vector3(27, -14,-1);
		godrays.mesh.scaling = new BABYLON.Vector3(3,3,3);
		
		var mat = new BABYLON.StandardMaterial("mat", scene);
		mat.diffuseColor = new BABYLON.Color3.White();
		mat.emissiveColor = new BABYLON.Color3.White();
		
		var sun = new BABYLON.MeshBuilder.CreateSphere("sun", {diameter:4}, scene);
		sun.position = new BABYLON.Vector3(27,-14,-1);
		sun.material = mat;
		
		var gl = new BABYLON.GlowLayer("glow", scene, { 
			mainTextureSamples: 4,
			blurKernelSize: 80
		});
		gl.addIncludedOnlyMesh(sun);
		gl.intensity = 1;
		
	}
	
	//LENS FLARE (SIZE, POSITION, COLOR, TEXTURE, SYSTEM)
	{
		var light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(28, -10,0), scene);
		var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light0, scene);
		var flare01 = new BABYLON.LensFlare(0.1, 0.4, new BABYLON.Color3(1, 1, 1), "imgs/Flare2.png", lensFlareSystem);
		var flare01 = new BABYLON.LensFlare(0.05, 0.3, new BABYLON.Color3(1, 1, 1), "imgs/Flare2.png", lensFlareSystem);
		var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "imgs/Flare3.png", lensFlareSystem);
		var flare03 = new BABYLON.LensFlare(0.3, 0.2, new BABYLON.Color3(1, 1, 1), "imgs/Flare3.png", lensFlareSystem);
		var flare04 = new BABYLON.LensFlare(0.1, 0.9, new BABYLON.Color3(1, 1, 1), "imgs/Flare.png", lensFlareSystem);
		var flare04 = new BABYLON.LensFlare(0.2, 0.7, new BABYLON.Color3(1, 1, 1), "imgs/Flare.png", lensFlareSystem);
		var flare04 = new BABYLON.LensFlare(0.1, 0.1, new BABYLON.Color3(1, 1, 1), "imgs/Flare.png", lensFlareSystem);
		var flare05 = new BABYLON.LensFlare(0.4, 0.5, new BABYLON.Color3(1, 1, 1), "imgs/Flare3.png", lensFlareSystem);
	}
}

EarthHandler.prototype.meshSetting = function(){
	var handler = this;
	
	//EARTH MATERIAL
	{
		var earthMap = new BABYLON.StandardMaterial('earthMap', handler.scene);
		earthMap.diffuseTexture = new BABYLON.Texture("imgs/earthMap3.jpg", handler.scene);
		earthMap.bumpTexture = new BABYLON.Texture("imgs/earth_bump.jpg", handler.scene);
		earthMap.specularColor = new BABYLON.Color3(0,0,0);
	}
	
	//CREATE EARTH MESH
	{
		handler.earth = BABYLON.Mesh.CreateSphere('earth', 120, 12, handler.scene);
		handler.earth.material = earthMap;
		handler.earth.position = handler.target;
		handler.earth.rotation.x = Math.PI*1.25;
		handler.earth.rotation.y = Math.PI/2*1.8;
		handler.earth.rotation.z = -Math.PI/2*0.2;
	}
		
	//CLOUD
	{	
		var cloudMat = new BABYLON.StandardMaterial('cloudMat', handler.scene);
		cloudMat.opacityTexture = new BABYLON.Texture("imgs/earth_cloud2.png", handler.scene);
		cloudMat.diffuseColor = new BABYLON.Color3.White();
		
		var cloud = BABYLON.Mesh.CreateSphere("cloud", 120, 12.05, handler.scene);
		cloud.material = cloudMat;
		cloud.isPickable = false;
		cloud.visibility = 0.8;
		cloud.parent = handler.earth;
		handler.cloud = cloud;
	}
	//CREATE EARTH'S ATMOSPHERE
	{
		var atmosphere = new BABYLON.HighlightLayer("hl", scene);
		atmosphere.addMesh(handler.earth, new BABYLON.Color3.FromHexString('#3498db'));
		atmosphere.blurVerticalSize = 5;
		atmosphere.blurHorizontalSize = 5;
		atmosphere.outerGlow = false;
	}
	
	handler.EarthAnimation();
};

EarthHandler.prototype.EarthAnimation = function(){
	var handler = this;
	
	//EARTH ANIMATION WHEN LOADING ALL FINISHED
	{
		var frameRate = 1500;
		var yrot = new BABYLON.Animation('yrot', 'rotation.y', frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
		
		var key = [];
		for(var i=0;i<8;i++){
			key.push({
				frame : i * frameRate,
				value : (i* (Math.PI)) + (Math.PI/2*1.8)
			});
		}
		yrot.setKeys(key);
		var animation = handler.scene.beginDirectAnimation(handler.earth, [yrot], frameRate*2, false);
		animation.onAnimationEnd = function(){
			setTimeout(function(){
				var observer = handler.scene.onBeforeRenderObservable.add(function(){
					handler.cloud.rotation.y += 0.003;
					handler.cloud.rotation.x -= 0.001;
					handler.cloud.rotation.z += 0.001;
					if(handler.endPoint[0] != undefined){
						if(BABYLON.Vector3.Distance(handler.camera.position, handler.endPoint[0].position) > 15){
							var code = handler.endPoint[0].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 0;
							}
						}else{
							var code = handler.endPoint[0].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 1;
							}
						}
					}
					if(handler.endPoint[1] != undefined){
						if(BABYLON.Vector3.Distance(handler.camera.position, handler.endPoint[1].position) > 15){
							var code = handler.endPoint[1].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 0;
							}
						}else{
							var code = handler.endPoint[1].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 1;
							}
						}
					}
					if(handler.endPoint[2] != undefined){
						if(BABYLON.Vector3.Distance(handler.camera.position, handler.endPoint[2].position) > 15){
							var code = handler.endPoint[2].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 0;
							}
						}else{
							var code = handler.endPoint[2].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 1;
							}
						}
					}
					if(handler.endPoint[3] != undefined){
						if(BABYLON.Vector3.Distance(handler.camera.position, handler.endPoint[3].position) > 15){
							var code = handler.endPoint[3].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 0;
							}
						}else{
							var code = handler.endPoint[3].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 1;
							}
						}
					}
					if(handler.endPoint[4] != undefined){
						if(BABYLON.Vector3.Distance(handler.camera.position, handler.endPoint[4].position) > 15){
							var code = handler.endPoint[4].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 0;
							}
						}else{
							var code = handler.endPoint[4].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 1;
							}
						}
					}
					if(handler.endPoint[5] != undefined){
						if(BABYLON.Vector3.Distance(handler.camera.position, handler.endPoint[5].position) > 15){
							var code = handler.endPoint[5].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 0;
							}
						}else{
							var code = handler.endPoint[5].name.split("_")[1];
							var arr = handler.gui[code];
							for(var i=0;i<arr.length;i++){
								arr[i].alpha = 1;
							}
						}
					}
				});
				handler.setLine();
			},300);
			
		}
	}
};

EarthHandler.prototype.setLine = function(){
	var handler = this;
	
	var mat = new BABYLON.StandardMaterial('mat', handler.scene);
	mat.specularColor = new BABYLON.Color3(0,0,0);
	mat.diffuseColor = new BABYLON.Color3(1,1,1);
	//START POSITION : KOREA
	{
		var sphere = BABYLON.Mesh.CreateSphere('KOREA_410', 32, 0.2, handler.scene);
		sphere.position = handler.korea;
		sphere.material = mat;
		sphere.visibility = 0;
		handler.endPoint.push(sphere);
		handler.flagSetting(sphere, 'KOREA', 410);
	}
	
	//MIDDLE POINTS (2), END POINT SETTING(TEMP)
	{
		var end = new BABYLON.Vector3(5.42,2.87,-2.79);
		var m1 = handler.getPointinLine(end, handler.korea, 0.8);
		var m2 = handler.getPointinLine(handler.korea, end, 0.8);
		handler.createLine(m1,m2,end, "156");
		
		var end = new BABYLON.Vector3(2.22,2.24,-3.01);
		var m1 = handler.getPointinLine(end, handler.korea, 0.8);
		var m2 = handler.getPointinLine(handler.korea, end, 0.8);
		handler.createLine(m1,m2,end, "608");
		
		var end = new BABYLON.Vector3(6.91,-2.56,-9.66);
		var percentage = BABYLON.Vector3.Distance(handler.korea, end) > 7 ? 1 : 0.8
		var m1 = handler.getPointinLine(end, handler.korea, 0.8);
		var m2 = handler.getPointinLine(handler.korea, end, percentage);
		handler.createLine(m1,m2,end, "840");
		
		var end = new BABYLON.Vector3(10.48,-0.66,-4.82);
		var m1 = handler.getPointinLine(end, handler.korea, 0.8);
		var m2 = handler.getPointinLine(handler.korea, end, 0.8);
		handler.createLine(m1,m2,end, "826");
		
		var end = new BABYLON.Vector3(1.82,1.45,-1.56);
		var m1 = handler.getPointinLine(end, handler.korea, 0.8);
		var m2 = handler.getPointinLine(handler.korea, end, 0.8);
		handler.createLine(m1,m2,end, "360");
	}
}

EarthHandler.prototype.createLine = function(p1, p2, p3, nationCode){
	var handler = this;
	
	var sphere = BABYLON.Mesh.CreateSphere('end_'+nationCode, 32, 0.12, handler.scene);
	sphere.position = p3;
	sphere.visibility = 0;
	handler.endPoint.push(sphere);
	for(k in handler.nationCode){
		if(handler.nationCode[k].code == nationCode)
			handler.flagSetting(sphere, k, nationCode);
	}
	
	var dot = BABYLON.Vector3.Distance(handler.korea, p3)*20;
	var bezier = BABYLON.Curve3.CreateCubicBezier(handler.korea, p1, p2, p3, dot);
	var points = bezier.getPoints();
	
	var material = new BABYLON.StandardMaterial("map_mat", handler.scene);
	material.specularColor = new BABYLON.Color3(0, 0, 0);
	material.fogEnable = false;
	material.forceDepthWrite = true;
	material.diffuseColor = new BABYLON.Color3.FromHexString('#3498db');
	
	handler.flightLineAnimation(points);
	
	var i=0;
	var arr = [];
	var line;
	var observer = handler.scene.onBeforeRenderObservable.add(function(){
		var point = [points[i],points[i+1]];
		line = BABYLON.Mesh.CreateTube("line"+nationCode, point, 0.02, 10, null, 3, handler.scene, false, BABYLON.Mesh.FRONTSIDE);
		line.material = material;
		arr.push(line);
		i++;
		if(i == points.length-2 && handler.scene.onBeforeRenderObservable.hasObservers){
			handler.scene.onBeforeRenderObservable.remove(observer);
			for(var j=0;j<arr.length;j++){
				arr[j].dispose();
			}
			line = BABYLON.Mesh.CreateTube("path_"+nationCode, points, 0.02, 10, null, 3, handler.scene, false, BABYLON.Mesh.FRONTSIDE);
			line.material = material;
		}
	});
}

EarthHandler.prototype.latlonToVec = function(latitude, longitude, radiusEarth){
   let latitude_rad = latitude * Math.PI / 180;
   let longitude_rad = longitude * Math.PI / 180;

   let xPos= radiusEarth * Math.cos(latitude_rad) * Math.cos(longitude_rad);
   let zPos = radiusEarth * Math.cos(latitude_rad) * Math.sin(longitude_rad);
   let yPos = radiusEarth * Math.sin(latitude_rad);
   return new BABYLON.Vector3(xPos, yPos, zPos);
}

EarthHandler.prototype.MouseEvent = function(){
	var handler = this;
	
	var overmat = new BABYLON.StandardMaterial("mat", handler.scene);
	overmat.specularColor = new BABYLON.Color3(0,0,0);
	overmat.diffuseColor = new BABYLON.Color3.Red();
	var outmat = new BABYLON.StandardMaterial("mat", handler.scene);
	outmat.diffuseColor = new BABYLON.Color3.FromHexString('#3498db');
	outmat.specularColor = new BABYLON.Color3(0, 0, 0);
	outmat.fogEnable = false;
	outmat.forceDepthWrite = true;
	
	handler.scene.onPointerObservable.add((pointerInfo)=>{
		switch(pointerInfo.type){
			case BABYLON.PointerEventTypes.POINTERMOVE:
				var pickInfo = handler.scene.pick(handler.scene.pointerX, handler.scene.pointerY, function(mesh){return mesh.isPickable;});
				if(pickInfo != undefined){
					if(pickInfo.pickedMesh.name.includes("path")){
						$("#renderCanvas").css("cursor", "pointer");
						if(handler.recentMesh == undefined){
							handler.recentMesh = pickInfo.pickedMesh;
							pickInfo.pickedMesh.material = overmat;
						}
					}else{
						$("#renderCanvas").css("cursor", "default");
						if(handler.recentMesh != undefined){
							handler.recentMesh.material = outmat;
							handler.recentMesh = undefined;
						}
					}
				}
				break;
			case BABYLON.PointerEventTypes.POINTERDOWN:
				var pickInfo = handler.scene.pick(handler.scene.pointerX, handler.scene.pointerY, function(mesh){return mesh.isPickable;});
				if(pickInfo != undefined || pickInfo != null){
					if(pickInfo.pickedMesh.name.includes("path")){
						for(k in handler.nationCode){
							if(handler.nationCode[k].code == pickInfo.pickedMesh.name.split("_")[1]){
								$('#title').empty();
								$('#title').text(k);
								animation = handler.cameraAction(100, handler.camera.position.clone(), handler.nationCode[k].position);
								animation.onAnimationEnd = function(){
									$("#shadow").css("display","block");
								}
							}
						}
					}
				}
				break;
		}
	});
}

EarthHandler.prototype.cameraAction = function(frameRate, cameraPos, changePos){
	var handler = this;
	
	handler.camera.animations = [];
	var cameraAnimation = new BABYLON.Animation("camPos", "position", 100, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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

EarthHandler.prototype.restoreCamera = function(){
	var handler = this;
	
	var frameRate = 100;
	var cameraPos = handler.camera.position.clone();
	
	handler.camera.animations = [];
	var cameraAnimation = new BABYLON.Animation("camPos", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var key = [];
	key.push({
		frame:0,
		value:cameraPos
	});
	key.push({
		frame:frameRate,
		value:new BABYLON.Vector3(0.04205933825706776,10,0.050780837645508115)
	});
	
	cameraAnimation.setKeys(key);
	handler.camera.animations.push(cameraAnimation);
	animation = handler.scene.beginAnimation(handler.camera, 0, frameRate, false, 1);
	
	return animation;
}

EarthHandler.prototype.showAxis = function (size) {
	var makeTextPlane = function (text, color, size) {
		var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
		dynamicTexture.hasAlpha = true;
		dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
		var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
		plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
		plane.material.backFaceCulling = false;
		plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
		plane.material.diffuseTexture = dynamicTexture;
	return plane;
	};

	var axisX = BABYLON.Mesh.CreateLines("axisX", [
	new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
	new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
	], scene);
	axisX.color = new BABYLON.Color3(1, 0, 0);
	var xChar = makeTextPlane("X", "red", size / 10);
	xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
	var axisY = BABYLON.Mesh.CreateLines("axisY", [
	new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
	new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
	], scene);
	axisY.color = new BABYLON.Color3(0, 1, 0);
	var yChar = makeTextPlane("Y", "green", size / 10);
	yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
	var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
	new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
	new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
	], scene);
	axisZ.color = new BABYLON.Color3(0, 0, 1);
	var zChar = makeTextPlane("Z", "blue", size / 10);
	zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

EarthHandler.prototype.flightLineAnimation = function(points){
	var handler = this;
	var arr = [];
	
	var material = new BABYLON.StandardMaterial("map_mat", handler.scene);
	material.specularColor = new BABYLON.Color3(0, 0, 0);
	material.fogEnable = false;
	material.forceDepthWrite = true;
	material.diffuseColor = new BABYLON.Color3(1,1,1);
	material.diffuseColor = new BABYLON.Color3.FromHexString('#ffa54b');
	
	var sphere = new BABYLON.MeshBuilder.CreateSphere("flight_line", {diameter:0.065}, handler.scene);
	sphere.material = material;
	
	var i = 0, isSecond = false;
	var observer = handler.scene.onBeforeRenderObservable.add(function(){
		if(i == points.length-1 && handler.scene.onBeforeRenderObservable.hasObservers){
			//handler.scene.onBeforeRenderObservable.remove(observer);
			//sphere.dispose();
			i=0;
			isSecond = true;
		}
		sphere.position = points[i];
		i++;
	});
}

EarthHandler.prototype.getPointinLine = function(p1, p2, percentage){
	var dir = p2.clone().subtract(p1);
	var length = dir.length();
	dir = dir.normalize().scale(length*percentage);
	var val = p1.clone().add(dir);
	val.y = 4;
	return val;
}

EarthHandler.prototype.rotateEvent = function(){
	window.addEventListener("pointerdown", function (evt) {
		handler.currentPosition.x = evt.clientX;
		handler.currentPosition.y = evt.clientY;
		handler.currentRotation.x = handler.earth.rotation.x;
		handler.currentRotation.y = handler.earth.rotation.y;
		handler.clicked = true;
    });

    window.addEventListener("pointermove", function (evt) {
		
		if (handler.clicked) {
			//set mousemov as true if the pointer is still down and moved
			handler.mousemov = true;
		}
        if (!handler.clicked) {
            return;
        }
		//set last angle before changing the rotation
		handler.oldAngle.x = handler.earth.rotation.x;
		handler.oldAngle.y = handler.earth.rotation.y;
		//rotate the mesh
        handler.earth.rotation.y -= (evt.clientX - handler.currentPosition.x) / 300.0;
        handler.earth.rotation.x -= (evt.clientY - handler.currentPosition.y) / 300.0;
		//set the current angle after the rotation
		handler.newAngle.x = handler.earth.rotation.x;
		handler.newAngle.y = handler.earth.rotation.y;
		//calculate the anglediff
		handler.lastAngleDiff.x = handler.newAngle.x - handler.oldAngle.x;
		handler.lastAngleDiff.y = handler.newAngle.y - handler.oldAngle.y;
		handler.currentPosition.x = evt.clientX;
		handler.currentPosition.y = evt.clientY;
    });
	
    window.addEventListener("pointerup", function (evt) {
        handler.clicked = false;
    });
}

EarthHandler.prototype.flagSetting = function(mesh, region, code){
	var handler = this;
		
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	var width = region.length<=6 ? 100 : region.length*15;
	
	var rect = new BABYLON.GUI.Rectangle();
	rect.width = width+"px";
	rect.height = "40px";
	rect.color = "#ffa54b";
	rect.thickness = 3;
	rect.background = "black";
	advancedTexture.addControl(rect);
	rect.linkWithMesh(mesh);
	rect.linkOffsetY = -50;
	
    var button = BABYLON.GUI.Button.CreateSimpleButton(region, region);
    button.width = width+"px";
    button.height = "40px";
    button.color = "#ffa54b";
    rect.addControl(button);
    button.onPointerUpObservable.add(function(){
		if(button.name == 'KOREA')
			handler.restoreCamera();
		else{
			for(k in handler.nationCode){
				if(k == button.name)
					animation = handler.cameraAction(100, handler.camera.position.clone(), handler.nationCode[k].position);
			}
		}
		$('#title').empty();
		$('#title').text(button.name);
    });
	
	var target = new BABYLON.GUI.Ellipse();
	target.width = "20px";
	target.height = "20px";
	target.color = "#ffa54b";
	target.background = "#ffa54b";
	advancedTexture.addControl(target);
	target.linkWithMesh(mesh);
	
	var line = new BABYLON.GUI.Line();
	line.lineWidth = 4;
	line.color = "#ffa54b";
	line.y2 = 20;
	line.linkOffsetY = -10;
	advancedTexture.addControl(line);
	line.linkWithMesh(mesh);
	line.connectedControl = rect;
	
	handler.gui[code] = [rect, button, target, line];
}