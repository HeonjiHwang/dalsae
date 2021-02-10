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