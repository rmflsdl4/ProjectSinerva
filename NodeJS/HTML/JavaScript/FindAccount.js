let idc, nnc, pnc, emc;

function Input_Check(element){
    Input_Data_Check_To_Submit();
    // 패턴 체크
    let div = document.createElement("div");
    let img = document.createElement("img");
    let span = document.createElement("span");
    let parentElement = element.parentNode;
    let textNode = document.createTextNode("");
    
    let childElement = parentElement.firstElementChild;

    var len = element.value.length;

    let pw = document.getElementById('pw');
    let confirm_pw = document.getElementById('confirm_pw');

    div.setAttribute('class', 'MessageBox');
    
    function MessageBox_Check(){
        const nextElement = childElement.nextElementSibling; // div 태그 id: MessageBox

        if(nextElement !== null){
            parentElement.removeChild(nextElement);
        }
        parentElement.appendChild(div);
        div.appendChild(img);
        div.appendChild(span);
        span.appendChild(textNode);
    }
    // 빈칸이면 더 이상 실행하지 않고 margin 값 주고 종료
    if(len <= 0){
        const nextElement = childElement.nextElementSibling; // div 태그 id: MessageBox
        parentElement.removeChild(nextElement);
        element.style.marginBottom = "10px";
        return;
    }
    else{
        element.style.marginBottom = "0px";
    }

    // 분기별 함수 실행
    if(element.name === "findId"){
        Value_Check(element.name, element.value, null)
            .then(result => {
                idc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 아이디입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용 불가능한 아이디입니다.";
                }
                MessageBox_Check();
            });
    }
    else if(element.name === "findNickName"){
        const spaceBar = / /;
        if(spaceBar.test(element.value)){
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "공백은 별명에 사용할 수 없습니다.";
            MessageBox_Check();
            return;
        }
        else{
            Value_Check(element.name, element.value, null)
            .then(result => {
                nnc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 별명입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "중복된 별명입니다.";
                }
                MessageBox_Check();
            });
        }
    }
    else if (element.name === "findPhone_num") {
        element.value = element.value.replace(/[^0-9]/g, '');
        const changeLength = document.getElementById("phone_num");
        
        if (element.value.startsWith("02")) {
            changeLength.maxLength = 12;

            element.value = element.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/(\-{1,2})$/g, "");
        } else {
            changeLength.maxLength = 13;

            element.value = element.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/(\-{1,2})$/g, "");
        }
        
        Value_Check(element.name, element.value, null)
        .then(result => {
            pnc = result;
            if(result){
                img.src = "Image/check.png";
                textNode.nodeValue = "사용 가능한 번호입니다.";
            }
            else{
                img.src = "Image/dcheck.png";
                textNode.nodeValue = "사용 불가능한 번호입니다.";
            }
            MessageBox_Check();
        });
    }
    else if (element.name === "findEmail") {
        const spaceBar = / /;
        if(spaceBar.test(element.value)){
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "공백은 이메일에 사용할 수 없습니다.";
            MessageBox_Check();
            return;
        }
        else {
            Value_Check(element.name, element.value, null)
            .then(result => {
                emc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 이메일입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용할 수 없는 이메일입니다.";
                }
                MessageBox_Check();
            });
        }
    }
}
function InitForm(){
    let arr = document.getElementsByTagName("input");
    
    for(let i = 0; i < arr.length; i++){
        arr[i].style.marginBottom = "10px";
    }
    Exit_Check();
}
function Exit_Check(){
    window.onbeforeunload = function(){
        return '변경사항이 저장되지 않을 수 있습니다.';
    }
}
function Input_Data_Check_To_Submit(){
    let inputData = document.getElementsByTagName("input");
    let submitButton = document.getElementById("find") ? document.getElementById("find"):document.getElementById("login");

    for(let i = 0; i < inputData.length; i++){
        if(inputData[i].value === ""){
            if (i == 0 || i == 2 || i == 3) {
                continue;
            }
            else if (i == 1 || i == 2 || 3) {
                continue;
            }
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#347236";
            return;
        }
    }
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#4CAF50";
    submitButton.style.cursor = "pointer";
}
function Value_Check(name, value1, value2) {
    return new Promise((resolve, reject) => {
        fetch('/check-input', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, value1, value2 })
        })
            .then(response => response.json())
            .then(data => {
                const result = data.result;
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function All_Values_Check(){
    if(idc || nnc){
        return true;
    }
    alert('입력값을 다시 확인해 주세요.');
    return false;
}

const menu = document.getElementsByClassName('findAc');

let selected_board = "공지사항";
function Board_Select(){
    const clickElement = event.target;
	
    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
            Posts_Output(menu[idx].textContent);
			selected_board = menu[idx].textContent;
            nowPage = 1; //현재 페이지를 1로 설정
			window.history.pushState({ page: nowPage }, '', `?page=1`); //목록을 누르면 page를 1로 업데이트
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
}
function Board_State_Init(){
    for(let idx = 0; idx < menu.length; idx++){
        if(idx === 0){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
    Posts_Output('공지사항');
}
async function Posts_Output(board_type){
	const user_type = await Get_User_Type();
    const board = document.getElementById('Board');	//목록
    const tds = document.getElementsByClassName('add_td_Tag');	//게시물
	const pageContainer = document.getElementById('pageLink');	//페이지링크
	const postCheck = document.getElementsByClassName('postCheck'); // 포스트 선택
	
    let posts = await Posts_Import();	//모든 게시물 가져오기
	let users = await Users_Import();	//모든 유저 가져오기
    let rows = posts.filter((post) => post.board_type === board_type);	//[]변경, 목록에 맞게 게시물 추출
	
	if (board_type === "유저관리") {
		rows = users;
	}
	
    while(tds.length > 0){	//기존 게시물 삭제
        tds[0].remove();
		if(postCheck.length > 0){
            postCheck[0].remove();
        }
    }
	
	let pageSize = 10;	//10개씩
	let pageCount = Math.ceil(rows.length / pageSize); // 게시물 전체 크기
	let nowPage = 1;	//현재 페이지
	
	if (window.location.search) {	
		const urlParams = new URLSearchParams(window.location.search);
		const urlBoardType = urlParams.get('board_type');
		nowPage = (board_type === urlBoardType) ? parseInt(urlParams.get('page')) || 1 : 1;	//게시물이 없다면 1로
		if (nowPage < 1) {	//페이지는 1이상
			nowPage = 1;
		}
		if (nowPage > pageCount) {	//현재페이지가 전체페이지 보다 큰경우 현재 페이지가 전체페이지가 된다
			nowPage = pageCount;
		}
	}
	else {
		nowPage = 1;
	}
	
	let startIndex = (nowPage - 1) * pageSize;	//첫 페이지
	let endIndex = Math.min(startIndex + pageSize, rows.length);	//마지막 페이지
	let nowPagePosts = rows.slice(startIndex, endIndex);	//페이지에 맞는 게시물
	
	const selectAll = document.getElementById('selectAll');
    for(let idx = 0; idx < nowPagePosts.length; idx++){		//게시물 표시	//rows를 nowPagePosts 변경
		const cangeTitle = document.querySelectorAll('.Board_Title');	//제목이름 변경을 위해서
		const inputElement = document.createElement('input');
        const tr = document.createElement('tr');
        const row = nowPagePosts[idx];	//rows를 nowPagePosts 변경
        tr.setAttribute('class', 'add_tr_tag');
        if(row['lock_bool'] === 'true'){
            tr.setAttribute('onclick', `Lock_Post_Check(${row['post_id']})`);
            row['title'] = '🔒︎ 비밀글입니다.';
        }
        else{
            if(user_type === "user"){
                tr.setAttribute('onclick', `window.location.href='Post.html?post_id=${row['post_id']}'`);
            }
        }
		
		let structure = ``;
        // structure에 admin과 user 및 유저관리 분기점 나누기
		if (board_type === "유저관리") {
			cangeTitle.forEach((element) => {
				switch (element.textContent) {
					case '번호':
						element.textContent = '';
						element.colSpan = 1;
						element.style.width = '10%';
						
						inputElement.type = 'checkbox';
						inputElement.id = 'selectAll';
						inputElement.style.display = 'none';
						inputElement.onclick = function() {
							SelectAll(this);
						};
						element.appendChild(inputElement);
						break;
					case '제목':
						element.textContent = '아이디';
						element.colSpan = 3;
						element.style.width = '30%';
						break;
					case '작성자':
						element.textContent = '별명';
						element.colSpan = 3;
						element.style.width = '30%';
						break;
					case '등록일':
						element.textContent = '타입';
						element.colSpan = 2;
						element.style.width = '20%';
						break;
					case '조회수':
						element.textContent = ' ';
						element.colSpan = 1;
						element.style.width = '20%';
						break;
				}
			})
			
			selectAll.style.display = 'none';
			structure = `
			<td class='add_td_Tag' onclick="manageUsers('${row['id']}', '${row['nick_name']}', '${row['user_type']}')" colspan='1'>관리</td>
			<td class='add_td_Tag' colspan='4'>${row['id']}</td>
			<td class='add_td_Tag' colspan='2'>${row['nick_name']}</td>
			<td class='add_td_Tag' colspan='2'>${row['user_type']}</td>
			<td class='add_td_Tag' colspan='1'></td>`;
		}
		else if(user_type === "admin"){
			cangeTitle.forEach((element) => {
				switch (element.textContent) {
					case '':
						element.textContent = '번호';
						element.colSpan = 1;
						element.style.width = '10%';
						
						inputElement.type = 'checkbox';
						inputElement.id = 'selectAll';
						inputElement.style.display = 'block';
						inputElement.onclick = function() {
							SelectAll(this);
						};
						element.appendChild(inputElement);
						break;
					case '아이디':
						element.textContent = '제목';
						element.colSpan = 3;
						element.style.width = '30%';
						break;
					case '별명':
						element.textContent = '작성자';
						element.colSpan = 3;
						element.style.width = '30%';
						break;
					case '타입':
						element.textContent = '등록일';
						element.colSpan = 2;
						element.style.width = '20%';
						break;
					case ' ':
						element.textContent = '조회수';
						element.colSpan = 1;
						element.style.width = '20%';
						break;
				}
			})
			
			selectAll.style.display = 'block';
            structure = `
            <td class='add_td_Tag' colspan='1'><input type='checkbox' class='postCheck' name='selectedPost' value='${row['post_id']}'>${startIndex + idx + 1}</td>
            <td class='add_td_Tag' colspan='4' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['view_count']}</td>`;
		}
		else {
			selectAll.style.display = 'none';
			structure = `
            <td class='add_td_Tag' colspan='1'>${startIndex + idx + 1}</td>
            <td class='add_td_Tag' colspan='4'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1'>${row['view_count']}</td>`;
		}

        board.appendChild(tr);
        tr.innerHTML = structure;
    }
    const tr = document.createElement('tr');
    tr.setAttribute('class', 'add_tr_tag');
    tr.setAttribute('onclick', `window.location.href='Add_Post.html'`);
    board.appendChild(tr);
    if(user_type === 'admin' && board_type !== '유저관리'){
        tr.innerHTML = `<td class='add_td_Tag' colspan='10'><img src='Image/add_post.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 작성하기</td>`;
		const tr2 = document.createElement('tr');
        tr2.setAttribute('class', 'add_tr_tag');
        tr2.setAttribute('onclick', `Checked_Post_To_Delete()`);
        board.appendChild(tr2);
        tr2.innerHTML = `
        <td class='add_td_Tag' colspan='10'><img src='Image/delete.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 삭제하기</td>`;
	}
    else{
        if(board_type !== "공지사항" && board_type !== '유저관리'){
            tr.innerHTML = `<td class='add_td_Tag' colspan='10'><img src='Image/add_post.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 작성하기</td>`;
        }
    }

	pageContainer.innerHTML = '';	//기존 페이지링크 삭제
	
	for (let i = 1; i <= pageCount; i++) {	//pageLink
		const pageLink = document.createElement('a');
		pageLink.classList.add('pageLink');
		pageLink.href = `?board_type=${board_type}&page=${i}`;
		pageLink.textContent = i;	//숫자를 텍스트로
		
		if (i === nowPage) {
			pageLink.classList.add('active');
		}
		
		pageLink.addEventListener('click', (event) => {
			event.preventDefault();		//기본동작 취소
			const urlParams = new URLSearchParams(event.target.href);
            nowPage = parseInt(urlParams.get('page')) || 1;
			window.history.pushState({ page: nowPage }, '', `?board_type=${board_type}&page=${nowPage}`);	//페이지 변경시 nowPage 업데이트 
			Posts_Output(board_type);	//게시물 불러옴
		});
		
		pageContainer.appendChild(pageLink);
	}
	console.log('지금 페이지:', nowPage);
	console.log('메뉴 타입:', board_type);
	console.log('지금 페이지 게시물:', nowPagePosts);
}