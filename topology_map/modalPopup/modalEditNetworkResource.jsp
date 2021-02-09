<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="modal_network_body">
	<div class='edit_network'>
		<div class='net_header'>장비 추가<span id='close_btn' onclick='close_modal()'>❌</span></div>
		<div class='net_container'>
			<div class='tab'>
				<button id='custom_rsc_btn' class='active' onclick="onchangeTap(this.id)">장비 설정</button>
				<button id='get_rsc_btn' onclick='onchangeTap(this.id)'>장비 가져오기</button>
				<button id='detail_rsc_btn' onclick='onchangeTap(this.id)'>상세설정</button>
			</div>
			<div class='net_contents' id="custom_rsc">
				<div class='content_wrapper'>
					<table>
						<tr>
							<th colspan=2>장비설정</th>
						</tr>
						<tr>
							<td><div class='txt_wrapper'><span>장비명 : </span></div><input type='text' id='rsc_name' class='info' placeholder='장비명'/></td>
							<td><div class='txt_wrapper'><span>IP Address : </span></div><input type='text' id='rsc_ip' class='info' placeholder='127.0.0.1'/></td>
						</tr>
					</table>
					<table style="margin-top:30px">
						<tr>
							<th colspan=2>*위치 설정(필수)</th>
						</tr>
						<tr>
							<td><div class='txt_wrapper'><span>COMPANY : </span></div><input type='text' id='company' class='info' placeholder='company'/></td><div>
							<td><div class='txt_wrapper'><span>BUILDING : </span></div><input type='text' id='building' class='info' placeholder='building'/></td><div>
						</tr>
						<tr>
							<td><div class='txt_wrapper'><span>FLOOR : </span></div><input type='text' id='floor' class='info' placeholder='floor'/></td><div>
							<td><div class='txt_wrapper'><span>ROOM : </span></div><input type='text' id='room' class='info' placeholder='room'/></td>
						</tr>
					</table>
				</div>
			</div>
			<div class='net_contents' id="get_rsc">
				<div class='content_wrapper'>
					<table>
						<tr>
							<th>장비 선택</th>
						</tr>
						<td id='table_td'>
							<div class='table_wrapper'>
								<table id='rsc_table'>
								</table>
							</div>
						</td>
					</table>
				</div>
			</div>
			<div class='net_contents' id="detail_rsc">
			</div>
			<div class='confirm_grp'>
				<div class='btn_grp'>
					<button id="cancel" onclick='onConfirm(this.id)'>취소</button>
					<button id="confirm" onclick='onConfirm(this.id)'>확인</button>
				</div>
			</div>
		</div>
	</div>
</div>


<script>
	var preTab = {btn:'custom_rsc_btn', div:'custom_rsc'};
	var prevTr = undefined;
	var saveData = {};
	function close_modal(){
		$('.modal_network_body').hide();
	}
	
	function onchangeTap(id){
		preId = preTab.btn;
		preDiv = preTab.div;
		curDiv = id.split('_btn')[0];
		$('#'+preId).attr('class', '');
		$('#'+preDiv).hide();
		$('#'+id).attr('class', 'active');
		$('#'+curDiv).show();
		preTab.btn = id;
		preTab.div = curDiv;		
	}
	
	function getSaveData(id){
		var elem;
		
		if(prevTr != undefined)
			prevTr.css('background-color','white');
		$('#'+id).css('background-color','#d8e5f1');
		var name = $('#'+id+' > td:eq(0)').text()
		var ip = $('#'+id+' > td:eq(1)').text()
		var stat = $('#'+id+'>td:eq(2)').text()
		var els1 = $('#'+id+' > td:eq(3)').text()
		var els2 = $('#'+id+' > td:eq(4)').text()
		
		var status = stat == '' ? '사용불가능' : '사용가능';
		
		$("#rsc_name").val('');
		$("#rsc_ip").val('');
		$("#rsc_name").val(name);
		$("#rsc_ip").val(ip);

		if($("#confirm").text() == '수정'){
			elem = RtempDiv.split("_").length<3 ? RtempDiv+'_' : RtempDiv; 
		}
		
		saveData.id = div!= undefined ? div[0].id : elem;
		saveData.name = name
		saveData.ip = ip;
		saveData.status = status;
		
		prevTr = $('#'+id);
	}
	
	function checklocation(){
		var needs = ['company', 'building', 'floor', 'room'];
		
		for(var i=0;i<needs.length;i++){
			if($("#"+needs[i]).val() == ""){
				alert('위치 정보가 필요합니다. 작성해주세요.\n[장비설정 > 위치 설정]');
				return;
			}
			saveData[needs[i]] = $("#"+needs[i]).val()
		}
		return true;
	}
	
	function checkData(){
		if(saveData.name != undefined && saveData.ip != undefined)
			return true;
		
		var name = $('#rsc_name').val();
		var ip = $('#rsc_ip').val();
		if(name == undefined || name == '' || ip == undefined || ip == ''){
			alert('장비와 IP정보를 설정해주세요');
			return false;
		}
		saveData.name = name;
		saveData.ip = ip;
	}
	
	function onConfirm(id){
		if(id == 'cancel'){
			if($("#confirm").text() == '확인')
				div.remove();
			close_modal();
		}else{
			if($("#"+id).text() == '확인'){
				makeNewElem();
			}
			else if($("#"+id).text() == '수정'){
				chgElemData();
			}
		}
	}
	
	function makeNewElem(){
		var datCheck = checkData();		//장비명,ip input 체크
		//var locCheck = datCheck == true ? checklocation() : undefined;	//위치 정보 검사
		locCheck = true;
		if(locCheck == true && datCheck == true){
			if(saveData.status == '사용불가능'){
				alert('해당 장비는 사용이 불가능합니다.');
				return;
			}
			if(saveData.name == '' || saveData.ip == ''){
				alert("장비 또는 IP 정보가 불명확합니다.");
			}
			var data = 'NAME : '+saveData.name+'\nIP : '+saveData.ip;
			isSave = confirm(data+'\n데이터를 저장하시겠습니까?');
			if(isSave == true){
				alert('데이터가 저장되었습니다.');
				setData(saveData);
				saveData = {};
				close_modal();
			}
		}
	}
	
	function chgElemData(){
		elem = RtempDiv.split("_").length<3 ? RtempDiv+'_' : RtempDiv;
		data = mapData.get(elem);
		
		data.name = $("#rsc_name").val();
		data.ip = $("#rsc_ip").val();
		if(checklocation() == true){
			data.company = $('#company').val();
			data.building = $("#building").val();
			data.floor = $("#floor").val();
			data.room = $("#room").val();
			
			$("#"+elem+">div>span").text('')
			$("#"+elem+">div>span").text(data.name+'\n'+data.ip);
			close_modal();
		}
	}
	
	$( document ).ready(function() {
		$("#rsc_table").empty();
		var rsc = ['Cisco 2500','HPE','Extreme Networks','Huawei','Juniper Networks','Cisco-2500','Huawei-2000','HPE-1101'];
		var ip = ['127.0.0.1','101.1.0.8','192.168.0.1','1.1.1.1','2.2.2.2','15.248.112.5','3.3.3.3','5.5.1.3'];
		var stat = ['✔','','✔','✔','✔','✔','','✔'];
		
		html = '<tr><th>장비명</th><th>IP</th><th>사용가능</th><th>비고</th><th>비고</th></tr>';
		for(var i=0;i<rsc.length;i++){
			html+='<tr id="_net_rsc'+i+'" class="select_net_rsc" onclick="getSaveData(this.id)"><td>'+rsc[i]+'</td><td>'+ip[i]+'</td><td>'+stat[i]+'</td><td>/</td><td>/</td></tr>'
		}
		$('#rsc_table').append(html);
	});
</script>