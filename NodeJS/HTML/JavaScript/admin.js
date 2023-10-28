const menu = document.getElementsByClassName('Board_Menu');

let selected_board = "승인 요청";
//메뉴 누르면 작동
function Board_Select(){
    const clickElement = event.target;
	
    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
            Posts_Output(menu[idx].textContent);
			selected_board = menu[idx].textContent;
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
            menu[idx].style.backgroundColor = '#e6e6e6';
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
    import('./Expert.js')
    .then((module) => {
        InitPage();
    })
    .catch((error) => {
        console.log('오류');
    });
    
    Posts_Output('승인 요청');
}
//Board_Menu에 따라 리스트를 다르게 표시
async function Posts_Output(board_type){
    const board = document.getElementById('usersMenu');	//목록
    const tds = document.getElementsByClassName('add_td_Tag');	//게시물
	
	let users = await Users_Import();	//모든 유저 가져오기
    console.log(users);
	
    while(tds.length > 0){	//기존 게시물 삭제
        tds[0].remove();
		if(postCheck.length > 0){
            postCheck[0].remove();
        }
    }
    
    for (let idx = 0; idx < users.length; idx++) { // 게시물 표시
        const tr = document.createElement('tr'); // 새로운 테이블 행 생성
        tr.className = 'commentRequest';
        const row = users[idx]; // rows를 nowPagePosts로 변경

        const number = document.createElement('td');
        number.textContent = idx + 1;

        const id = document.createElement('td');
        id.textContent = row['id'];

        const nickName = document.createElement('td');
        nickName.textContent = row['nick_name'];

        const waitOk = document.createElement('td');
        waitOk.textContent = row['waitOk'];

        const commit = document.createElement('button');
        commit.className = 'commitButton';
        commit.textContent = '승인';

        commit.addEventListener('click', () => {
            alert('버튼을 클릭했습니다.');
        });

        tr.appendChild(number);
        tr.appendChild(id);
        tr.appendChild(nickName);
        tr.appendChild(waitOk);
        tr.appendChild(commit);

        board.appendChild(tr);
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