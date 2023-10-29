const menu = document.getElementsByClassName('Board_Menu');

//console.log(menu);
let selected_board = "승인요청";
//메뉴 누르면 작동
function Board_Select(){
    const clickElement = event.target;
	
    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = 'none';
            Posts_Output(menu[idx].textContent);
			selected_board = menu[idx].textContent;
            nowPage = 1;
			window.history.pushState({ page: nowPage }, '', `?page=1`);
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
}
//초기화
function Board_State_Init(){
    for(let idx = 0; idx < menu.length; idx++){
        if(idx === 0){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = 'none';
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
    
    Posts_Output('승인요청');
}
//Board_Menu에 따라 리스트를 다르게 표시
async function Posts_Output(board_type){
    const board = document.getElementById('usersMenu');	//목록
    const tds = document.getElementsByClassName('add_td_Tag');	//게시물
    const pageContainer = document.getElementById('pageLink');
	//console.log(tds);

	let users = await Users_Import();	//모든 유저 가져오기
    //console.log(users);
	
    while (tds.length > 0) {
        tds[0].parentNode.remove(); // 부모 노드를 통해 tr 요소를 삭제합니다.
    }
    
    let pageSize = 6;	//5개씩 - 1개 해야함 admin을 제외해야 해서
	let pageCount = Math.ceil(users.length / pageSize); // 게시물 전체 크기
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
	let endIndex = Math.min(startIndex + pageSize, users.length);	//마지막 페이지
	let nowPagePosts = users.slice(startIndex, endIndex);	//페이지에 맞는 게시물
    
    for (let idx = 0; idx < nowPagePosts.length; idx++) { // 게시물 표시
        const tr = document.createElement('tr'); // 새로운 테이블 행 생성
        tr.className = 'commentRequest';
        const row = nowPagePosts[idx]; // rows를 nowPagePosts로 변경
        const userTypeTh = document.querySelector('.title[width="20%"]');

        if (row['userType'] === 'admin') {
            continue;
        }
        
        if (board_type === '승인요청') {
            userTypeTh.textContent = '승인요청';
            if (row['userType'] === 'expert') {
                const noRequestsMessage = document.getElementById('noRequestsMessage');
                noRequestsMessage.style.display = 'none';

                const id = document.createElement('td');
                id.className = 'add_td_Tag';
                id.textContent = row['id'];
        
                const nickName = document.createElement('td');
                nickName.className = 'add_td_Tag';
                nickName.textContent = row['nick_name'];

                const waitOk = document.createElement('td');
                waitOk.className = 'add_td_Tag';
                waitOk.textContent = row['waitOk'];

                const commit = document.createElement('button');
                commit.className = 'add_td_Tag';
                commit.textContent = '승인';

                commit.addEventListener('click', () => {
                    commitExpert(row['id']);
                });

                tr.appendChild(id);
                tr.appendChild(nickName);
                tr.appendChild(waitOk);
                tr.appendChild(commit);

                board.appendChild(tr);
            }
        } 
        else {
            const id = document.createElement('td');
            id.className = 'add_td_Tag';
            id.textContent = row['id'];
    
            const nickName = document.createElement('td');
            nickName.className = 'add_td_Tag';
            nickName.textContent = row['nick_name'];

            userTypeTh.textContent = '유저타입';
            const userType = document.createElement('td');
            userType.className = 'add_td_Tag';
            userType.textContent = row['userType'];

            tr.appendChild(id);
            tr.appendChild(nickName);
            tr.appendChild(userType);

            board.appendChild(tr);
        }
        console.log(board_type);
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
}
//모든 유저 가져오기
function Users_Import() {
	return new Promise((resolve, reject) => {
        fetch('/users-import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
        })
			.then(response => response.json())
            .then(data => {
                const result = data;
                
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}
//승인 버튼 누르면 실행
function commitExpert(id) {
    fetch('/commitExpert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(res => {
        alert(id + ' 님의 요청을 수락했습니다.');
        location.href = 'Admin.html';
    })
    .catch(error => {
        alert('commitExpert 오류');
        location.href = 'Admin.html';
        console.log(error);
    });
} 