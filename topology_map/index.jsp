<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<html>
<head>
	<title>TOPOLOGY_DEMO</title>
</head>
<script src="../../resources/js/dist/jquery-3.1.1.min.js"></script>
<script src="../../resources/js/dist/jquery.minicolors.min.js"></script>
<link href="../../resources/css/index.css" rel="stylesheet">
<link href="../../resources/css/modal.css" rel="stylesheet">
<link href="../../resources/css/dist/topo_dropdown.css" rel="stylesheet">
<link href="../../resources/css/dist/jquery.minicolors.css" rel="stylesheet">
<script src="../../resources/js/dashboard/index.js"></script>
<script src="../../resources/js/dashboard/topo_dropdown.js"></script>

<body>
	<div class="frame">
		<div class="header">
			<span>TOPOLOGY DEMO</span>
		</div>
		<div class="container">
			<div class="nav"></div>
			<div class="contents">
				<div class="content_header">
					<div class="func_menu">
						<div class="menu" id='modify_menu'>
							<ul class='upMenu' id="modkfy_menu">
								<li><button id='modify' class='header_btn' onclick="onEditMode()">🛠</button></li>
							</ul>
						</div>
						<div class="menu" id='select_menu'>
							<ul class='upMenu' id="select">
								<li><button id='sl_one' class='header_btn selected' onclick='selectedMode("one")'>☝</button></li>
								<li><button id='sl_group' class='header_btn' onclick='selectedMode("group")'>⬜</button></li>
							</ul>
						</div>
						<div class="menu" id='zoom_menu'>
							<ul class='upMenu' id="zoom">
								<li><button id='zoomIn' class='header_btn'>🔍+</button></li>
								<li><button id='zoomOut' class='header_btn'>🔍-</button></li>
								<li><button id='zoomO' class='header_btn'>🔍1</button></li>
								<li><button id='zoomA' class='header_btn'>💢</button></li>
							</ul>
						</div>
						<div class="menu" id='line_menu'>
							<ul class='upMenu' id="line">
								<li><button id='straight' class='header_btn' onclick='drawLine(this.id)'>➖</button></li>
								<li><button id='poly' class='header_btn' onclick='drawLine(this.id)'>📐</button></li>
							</ul>
						</div>
						<div class="menu" id='search_menu'>
							<ul class="upMenu" id="search">
								<li><input id='searchbox' class='header_btn' type='text' placeholder='Name'/></li>
								<li><button id='post' class='header_btn'>🔍</button></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="canvas" id="topology_map">
					<!-- elements div -->
					<div class='element'>
						<button class='el_menu'>장비</button>
						<div id='els'>
							<ul>
								<li><div id="accesshub" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="basehub" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="group" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="client" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="filewall" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="router" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="server" onmousedown='cloneElem(this.id)'></div></li>
								<li><div id="switch" onmousedown='cloneElem(this.id)'></div></li>
							</ul>
						</div>
						<button class='el_menu'>도형</button>
						<div id='els'>
							<ul>
								<li><div id="circle"></div></li>
								<li><div id="rectangle"></div></li>
								<li><div id="triangle"></div></li>
								<li><div id="polygon"></div></li>
								<li><div id="star"></div></li>
								<li><div id="thunder"></div></li>
							</ul>
						</div>
						<button class='el_menu'>텍스트</button>
						<div id='els'>
							<ul>
								<li><div id="text" onmousedown='cloneElem(this.id)'></div></li>
							</ul>
						</div>
						<button class='el_menu'>이미지</button>
						<div id='els'>
							<ul>
								<li><div>이미지추가</div></li>
							</ul>
						</div>
					</div>
					<div class='lineContainer' style="width:100%;height:100%;position:relative;"></div>
				</div>
			</div>
		</div>
	</div>
	<!-- context menu -->
	<div class='context_menu'>
		<div class='context' id='chgset'onclick="chgElement(this.id)">&nbsp;장비설정 변경(modify)</div>
		<div class='context' id='rename'onclick="chgElement(this.id)">&nbsp;이름 바꾸기(rename)</div>
		<div class='context' id='remove' onclick="chgElement(this.id)">&nbsp;제거(remove)</div>
		<hr></hr>
		<div class='context' id='toTop'onclick="chgElement(this.id)">&nbsp;앞으로(to top)</div>
		<div class='context' id='toBelow'onclick="chgElement(this.id)">&nbsp;뒤로(to below)</div>
	</div>
</body>

<jsp:include page="modalPopup/modalEditNetworkResource.jsp" />
<jsp:include page="modalPopup/modalRename.jsp" />
<jsp:include page="modalPopup/modalEditLine.jsp" />


<script>	
	$( document ).ready(function() {
		var acc = document.getElementsByClassName("el_menu");
		for(var i=0;i<acc.length;i++){
			acc[i].addEventListener('click', function(){
				var panel = this.nextElementSibling;
				if(panel.style.display === 'block')
					panel.style.display = 'none';
				else
					panel.style.display = 'block';
			})
		}
		
		$("#rsc_table").empty();
		var rsc = ['Cisco','HPE','Extreme','Huawei','Juniper','Cisco-2500','Huawei-2000','HPE-1101'];
		var ip = ['127.0.0.1','101.1.0.8','192.168.0.1','1.1.1.1','2.2.2.2','15.248.112.5','3.3.3.3','5.5.1.3'];
		var stat = ['✔','','✔','✔','✔','✔','','✔'];
		
		html = '<tr><th>장비명</th><th>IP</th><th>사용가능</th><th>비고</th><th>비고</th></tr>';
		for(var i=0;i<rsc.length;i++){
			html+='<tr id="_net_rsc'+i+'" class="select_net_rsc" onclick="getSaveData(this.id)"><td>'+rsc[i]+'</td><td>'+ip[i]+'</td><td>'+stat[i]+'</td><td>/</td><td>/</td></tr>'
		}
		$('#rsc_table').append(html);
		

		var html = '';
		for(var i=2;i<=100;i+=2){
			html += "<div id='size_"+i+"' class='topoDiv' onclick='chgTopoVal(this.id, 4)'><span>"+i+"</span></div>"
		}
		
		$("#topo_dropDown4").append(html);

		//color picker
		$(".colorPicker").each(function(){
			$(this).minicolors({
				letterCase: $(this).attr('data-letterCase') || 'uppercase',
				change:function(hex){
					$(activePal).css('background-color',hex);
				}
			});
			$(".minicolors-swatch").hide()
			$(".minicolors-panel").css("left","0px")
		})
	});
</script>
</html>


