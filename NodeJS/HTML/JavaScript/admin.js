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
    const userTypeTh = document.querySelector('.title[width="20%"]');
	//console.log(tds);

	let users = await Users_Import();	//모든 유저 가져오기
    //console.log(users);
    let experts = [];

    if (board_type === '승인요청') {
        users.forEach(element => {
            if (element['userType'] === 'expert' && element['waitOk'] === 0) {
                experts.push(element);
            }
        });
    }
    else {
        users.forEach(element => {
            if (element['waitOk'] !== 0) {
                experts.push(element);
            }
        });
    }
	console.log(experts);

    

    while (tds.length > 0) {
        tds[0].parentNode.remove(); // 부모 노드를 통해 tr 요소를 삭제합니다.
    }
    
    let pageSize = 6;	//5개씩 - 1개 해야함 admin을 제외해야 해서
	let pageCount = Math.ceil(experts.length / pageSize); // 게시물 전체 크기
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
	let endIndex = Math.min(startIndex + pageSize, experts.length);	//마지막 페이지
	let nowPagePosts = experts.slice(startIndex, endIndex);	//페이지에 맞는 게시물
    
    for (let idx = 0; idx < nowPagePosts.length; idx++) { // 게시물 표시
        const tr = document.createElement('tr'); // 새로운 테이블 행 생성
        tr.className = 'userInfo';

        // tr.addEventListener('click', () => {
        //     userInfo(nowPagePosts);
        // });

        const row = nowPagePosts[idx]; // rows를 nowPagePosts로 변경

        if (row['userType'] === 'admin') {
            continue;
        }

        const id = document.createElement('td');
        id.className = 'add_td_Tag';
        id.textContent = row['id'];

        const nickName = document.createElement('td');
        nickName.className = 'add_td_Tag';
        nickName.textContent = row['nick_name'];

        if (board_type === '승인요청') {
            userTypeTh.textContent = '승인 상태';
            if (row['userType'] === 'expert' && row['waitOk'] === 0) {
                const noRequestsMessage = document.getElementById('noRequestsMessage');
                noRequestsMessage.style.display = 'none';

                const waitOk = document.createElement('td');
                waitOk.className = 'add_td_Tag';
                waitOk.textContent = row['waitOk'];

                const deleteUserButton = document.createElement('button');
                deleteUserButton.className = 'add_td_Tag';
                deleteUserButton.textContent = '거절';

                deleteUserButton.addEventListener('click', () => {
                    deleteUser(row['id'], row['userType']);
                });

                const commit = document.createElement('button');
                commit.className = 'add_td_Tag';
                commit.textContent = '승인';

                commit.addEventListener('click', () => {
                    commitExpert(row['id']);
                });

                tr.appendChild(id);
                tr.appendChild(nickName);
                tr.appendChild(waitOk);
                tr.appendChild(deleteUserButton);
                tr.appendChild(commit);

                board.appendChild(tr);
            }
            else {
                console.log('오류');
            }
        } 
        else if (row['waitOk'] !== 0) {
            userTypeTh.textContent = '유저타입';
            const noRequestsMessage = document.getElementById('noRequestsMessage');
            noRequestsMessage.style.display = 'none';

            const userType = document.createElement('td');
            userType.className = 'add_td_Tag';
            userType.textContent = row['userType'];

            const deleteUserButton = document.createElement('button');
            deleteUserButton.className = 'add_td_Tag';
            deleteUserButton.textContent = '삭제';

            deleteUserButton.addEventListener('click', () => {
                deleteUser(row['id'], row['userType']);
            });

            tr.appendChild(id);
            tr.appendChild(nickName);
            tr.appendChild(userType);
            tr.appendChild(deleteUserButton);

            if (row['userType'] === 'expert' && row['waitOk'] === 1) {
                const unCommitButton = document.createElement('button');
                unCommitButton.className = 'unCommitButtonClass';
                unCommitButton.textContent = '권한수정';

                unCommitButton.addEventListener('click', () => {
                    unCommit(row['id']);
                });

                tr.appendChild(unCommitButton);
            }

            board.appendChild(tr);
        }
        else {
            console.log('오류');
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

    if (experts.length === 0) {
        console.log('값이 없어요');
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
//삭제 버튼 누르면 실행
function deleteUser(id, userType) {
    fetch('/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, userType })
    })
    .then(res => {
        alert(id + ' 님을 삭제 하였습니다.');
        location.href = 'Admin.html';
    })
    .catch(error => {
        alert('deleteUser 오류');
        location.href = 'Admin.html';
        console.log(error);
    });
} 
//권한 수정 버튼을 누르면 실행
function unCommit(id) {
    fetch('/unCommit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(res => {
        alert(id + ' 님의 권한을 수정했습니다.');
        location.href = 'Admin.html';
    })
    .catch(error => {
        alert('unCommit 오류');
        location.href = 'Admin.html';
        console.log(error);
    });
} 
//유저 상세 정보 표시
// function userInfo(user) {
    
// }

// function userInfo(userId) {
//     // 팝업 창 엘리먼트 생성
//     const popup = document.createElement('div');
//     popup.className = 'popup'; // 스타일링을 위한 클래스 지정

//     // 팝업 내용 추가 (예: 사용자 ID)
//     const popupContent = document.createElement('div');
//     popupContent.textContent = '사용자 ID: ' + userId;

//     // 팝업 닫기 버튼 추가
//     const closeButton = document.createElement('button');
//     closeButton.textContent = '닫기';

//     // 팝업 외부 클릭 시 팝업 닫기
//     popup.addEventListener('click', (event) => {
//         if (event.target === popup) {
//             closePopup();
//         }
//     });

//     closeButton.addEventListener('click', () => {
//         closePopup();
//     });

//     // 팝업에 내용과 닫기 버튼 추가
//     popup.appendChild(popupContent);
//     popup.appendChild(closeButton);

//     // 팝업을 body에 추가하여 화면에 보이게 함
//     document.body.appendChild(popup);

//     // 팝업을 화면 중앙으로 정렬
//     const popupRect = popup.getBoundingClientRect();
//     const top = (window.innerHeight - popupRect.height) / 2;
//     const left = (window.innerWidth - popupRect.width) / 2;
//     popup.style.top = top + 'px';
//     popup.style.left = left + 'px';

//     // 팝업 닫는 함수
//     function closePopup() {
//         document.body.removeChild(popup);
//     }
// }