<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<div class="modal_edit_line">
	<div class='edit_interface'>
		<div class='inter_header'>인터페이스<span id='close_btn' onclick='cls_modal()'>❌</span></div>
		<div class='line_container'>
			<div class='tab'>
				<button id='interface_btn' class='active' onclick="interfaceTab(this.id)">인터페이스</button>
				<button id='style_btn' onclick='interfaceTab(this.id)'>스타일</button>
				<button id='detail_btn' onclick='interfaceTab(this.id)'>상세설정</button>
			</div>
			<div class='net_contents' id="interface">
				<div class='content_wrapper'>
					<table style='margin-top:20px;'>
						<tr>
							<th colspan=2>인터페이스 1</th>
						</tr>
						<tr>
							<td>
								<div class='txt_wrapper'><span id='inter1'></span></div>
								<div class='topo_select' id='topo_select1'>
									<input class='topo_selectedTxt' id='topo_selectedTxt1' type='text' value='선택해주세요' onclick='doDropdown(1)' readonly/>
									<div id='topo_arrow'>🔽</div>
								</div>
								<div class = 'topo_dropDown' id='topo_dropDown1'>
									<div id='f0' class='topoDiv' onclick='chgTopoVal(this.id, 1)'><span>f 0/0</span></div>
									<div id='f1' class='topoDiv' onclick='chgTopoVal(this.id, 1)'><span>f 0/1</span></div>
									<div id='f2' class='topoDiv' onclick='chgTopoVal(this.id, 1)'><span>f 0/2</span></div>
									<div id='f3' class='topoDiv' onclick='chgTopoVal(this.id, 1)'><span>f 0/3</span></div>
								</div>
							</td>
							<td><div class='txt_wrapper'><span>IP Address : </span></div><input type='text' id='ethernet_ip1' class='info' placeholder='127.0.0.1'/></td>
						</tr>
					</table>
					<table style="margin-top:30px">
						<tr>
							<th colspan=2>인터페이스 2</th>
						</tr>
						<tr>
							<td>
								<div class='txt_wrapper'><span id='inter2'></span></div>
								<div class='topo_select' id='topo_select2'>
									<input class='topo_selectedTxt' id='topo_selectedTxt2' type='text' value='선택해주세요' onclick='doDropdown(2)' readonly/>
									<div id='topo_arrow'>🔽</div>
								</div>
								<div class = 'topo_dropDown' id='topo_dropDown2'>
									<div id='f00' class='topoDiv' onclick='chgTopoVal(this.id, 2)'><span>f 0/0</span></div>
									<div id='f11' class='topoDiv' onclick='chgTopoVal(this.id, 2)'><span>f 0/1</span></div>
									<div id='f22' class='topoDiv' onclick='chgTopoVal(this.id, 2)'><span>f 0/2</span></div>
									<div id='f33' class='topoDiv' onclick='chgTopoVal(this.id, 2)'><span>f 0/3</span></div>
								</div>
							</td>
							<td><div class='txt_wrapper'><span>IP Address : </span></div><input type='text' id='ethernet_ip2' class='info' placeholder='127.0.0.1'/></td>
						</tr>
					</table>
				</div>
			</div>
			<div class='net_contents' id="style">
				<div class='content_wrapper'>
					<table style='margin-top:20px;'>
						<tr>
							<th colspan=2>라인 스타일</th>
						</tr>
						<tr>
							<td>
								<div class='txt_wrapper'><span id='thickness'>굵기 : </span></div>
								<div class='topo_select' id='topo_select3'>
									<input class='topo_selectedTxt' id='topo_selectedTxt3' type='text' value='선택해주세요' onclick='doDropdown(3)' readonly/>
									<div id='topo_arrow'>🔽</div>
								</div>
								<div class = 'topo_dropDown' id='topo_dropDown3'>
									<div id='thin' class='topoDiv' onclick='chgTopoVal(this.id, 3)'><span>얇게</span></div>
									<div id='normal' class='topoDiv' onclick='chgTopoVal(this.id, 3)'><span>중간</span></div>
									<div id='bold' class='topoDiv' onclick='chgTopoVal(this.id, 3)'><span>두껍게</span></div>
								</div>
							</td>
							<td>
								<div class='txt_wrapper'><span>Color : </span></div>
								<input type='text' id='lineColor' class='colorPicker info' data-control="hue" value='#FFFFFF' onclick='cp(1)'/>
								<div id='palette1' class='palette'></div>
							</td>
						</tr>
					</table>
					<table style="margin-top:30px">
						<tr>
							<th colspan=2>폰트 스타일</th>
						</tr>
						<tr>
							<td>
								<div class='txt_wrapper'><span id='fontSize'>폰트 사이즈</span></div>
								<div class='topo_select' id='topo_select4'>
									<input class='topo_selectedTxt' id='topo_selectedTxt4' type='text' value='선택해주세요' onclick='doDropdown(4)' readonly/>
									<div id='topo_arrow'>🔽</div>
								</div>
								<div class = 'topo_dropDown' id='topo_dropDown4'></div>
							</td>
							<td>
								<div class='txt_wrapper' id='test'><span>폰트 색깔 : </span></div>
								<input type='text' id='fontColor' class='colorPicker info' data-control="hue" value='#FFFFFF' onclick='cp(2)'/>
								<div id='palette2' class='palette'></div>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div class='net_contents' id="detail">
			</div>
			<div class='confirm_grp'>
				<div class='btn_grp'>
					<button id="cancel" >취소</button>
					<button id="confirm" >확인</button>
				</div>
			</div>
		</div>
	</div>
</div>
 

<script>
	var preInterTab = {btn:'interface_btn', div:'interface'};
	var preInterTr = undefined;
	var activePal = undefined;
	function cls_modal(){
		$('.modal_edit_line').hide();
	}
	
	function interfaceTab(id){
		var preId = preInterTab.btn;
		var preDiv = preInterTab.div;
		var curDiv = id.split('_btn')[0];
		$('#'+preId).attr('class', '');
		$('#'+preDiv).hide();
		$('#'+id).attr('class', 'active');
		$('#'+curDiv).show();
		preInterTab.btn = id;
		preInterTab.div = curDiv;
	}
	
	function cp(idx){
		activePal = idx == 1 ? '#palette1' : '#palette2';
	}
	
	$( document ).ready(function() {
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