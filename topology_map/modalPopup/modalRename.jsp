<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<div class="modal_rename">
	<div class='edit_name'>
		<div class='rename_header'>이름 변경<span id='close_btn' onclick='close_modal()'>❌</span></div>
		<div class='rename_container'>
			<div class='rename'>
				<span>변경할 이름 : </span>
				<input type='text' placeholder='Rename' id='rename_area'/>
			</div>
			<div class='rename_btn_container'>
				<button id='cancle_rename' onclick="renameConfirm(this.id)">취소</button>
				<button id='confirm_rename' onclick="renameConfirm(this.id)">수정</button>
			</div>
		</div>
	</div>
</div>