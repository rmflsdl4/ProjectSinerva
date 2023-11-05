

var currPageNum;
var posts; 
var prePage;
var nextPage;
var pageCount;
var pageNum;
var itemsPerPage = 5;

function InitPage(){
    currPageNum = 1;

    posts = document.getElementsByClassName("commentRequest");
    prePage = document.getElementById("prePage");
    nextPage = document.getElementById("nextPage");
    pageNum = document.getElementById("pageNum");
    pageCount = Math.ceil(posts.length / 5);
    console.log(pageCount);
    PageLoad();
    
    prePage.style.visibility = "hidden";
}
function SetPost(){
    var posts = document.getElementsByClassName("commentRequest");
    for(let i = 0; i < posts.length; i++){
        posts[i].style.display = "none";
    }
}
function PageLoad(){
    SetPost();

    var startPageNum;

    if(currPageNum == 1){
        startPageNum = 0;
    }
    else{
        startPageNum = (currPageNum - 1) * 5 ;
    }
    for(let i = startPageNum; i < currPageNum * 5; i++){
        if(i >= posts.length){
            break;
        }
        posts[i].style.display = "";
    }
}
function SetPreNum(){
    currPageNum -= 1;
    PageLoad();
    SetCurrentPageText(currPageNum);

    if(currPageNum === 1){
        prePage.style.visibility = "hidden";
        nextPage.style.visibility = "visible";
    }
    else{
        prePage.style.visibility = "visible";
        nextPage.style.visibility = "visible";
    }
}
function SetNextNum(){
    currPageNum += 1;
    console.log(currPageNum >= pageCount);
    PageLoad();
    SetCurrentPageText(currPageNum);
    if(pageCount <= currPageNum){
        nextPage.style.visibility = "hidden";
        prePage.style.visibility = "visible";
    }
    else {
        prePage.style.visibility = "visible";
        nextPage.style.visibility = "visible";
    }
}
function SetCurrentPageText(currentPageNum){
    pageNum.textContent = currentPageNum;
}

// ** 검사 **
// 검사 결과 페이지 select 요청
function InspectRecordInitPage(){
    // 해당 사용자 과거 기록 select 요청
    return new  Promise((resolve, reject) => {
        fetch('/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            console.log(data); // 파싱된 JSON 데이터 출력
            InspectRecordRow(data)
        })
        .catch(error => {
            reject(error);
        });
    });
}
// 검사 결과 상세 페이지 select 요청
function InspectDetailsRecordInitPage(date){
    console.log(date);

    // 해당 사용자 과거 기록 select 요청
    return new  Promise((resolve, reject) => {
        fetch('/detailsRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            console.log(data); // 파싱된 JSON 데이터 출력
            InspectDetailsRecordRow(data)
        })
        .catch(error => {
            reject(error);
        });
    });
}
// 검사 결과 페이지 select 결과 출력
function InspectRecordRow(data) {
    // 테이블 요소를 가져옴
    const table = document.getElementById("commentListTable");
    let tableHTML = "";

    tableHTML += "<tr id='commentListHeader'>";
    tableHTML += "<th width='10%'>번호</th>";
    tableHTML += "<th width='30%'>요청 날짜</th>";
    tableHTML += "<th width='15%'>사진</th>";
    tableHTML += "<th width='15%'>정상</th>";
    tableHTML += "<th width='15%'>비정상</th>";
    tableHTML += "<th width='15%'>상세보기</th>";
    tableHTML += "</tr>";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        tableHTML += "<tr class='commentRequest'>";
        tableHTML += `<td><button class="checkBtn">${i + 1}</button></td>`;
        for (const key in row) {
            tableHTML += `<td>${row[key]}</td>`;
        }
        console.log(row.upload_date);
        tableHTML += `<td><a href="../InspectResultDetails.html?param1=${row.upload_date}">상세보기</a></td>`;
        tableHTML += "</tr>";
    }

    table.innerHTML = tableHTML;
    InitPage();
    PageLoad();
}
// 유저 타입 반환
async function getUserSession() {
    return await new Promise((resolve, reject) => {
        fetch('/login-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
  }

// 검사 결과 상세 페이지 select 결과 출력
function InspectDetailsRecordRow(data) {
    getUserSession().then(type => {
        console.log("유저타입: " + type.userType);

        // 테이블 요소를 가져옴
        const table = document.getElementById("commentListTable");
        let tableHTML = "";

        tableHTML += "<tr id='commentListHeader'>";
        tableHTML += "<th width='10%'>번호</th>";
        tableHTML += "<th width='30%'>요청 날짜</th>";
        tableHTML += "<th width='20%'>사진</th>";
        tableHTML += "<th width='10%'>상태</th>";
        tableHTML += "<th width='30%'>코멘트</th>";
        tableHTML += "</tr>";
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            tableHTML += "<tr class='commentRequest'>";
            tableHTML += `<td>${i + 1}</td>`;
            tableHTML += `<td>${row.upload_date}</td>`;
            tableHTML += `<td><img src="${row.file_route}" style="width: 50px;"></td>`;
            tableHTML += `<td>${row.result}</td>`;
            if(type.userType === "user"){
                tableHTML += `<td><button class='InspectBtn'>요청</button></td>`;
            }
            else{
                tableHTML += `<td><button class='InspectBtn'>수락</button></td>`;
            }
            tableHTML += "</tr>";
        }

        table.innerHTML = tableHTML;
    });
    
    InitPage();
    PageLoad();
}

// ** 불러오기 **
// 불러오기 페이지 select 요청
function RecordInitPage(){
    // 해당 사용자 과거 기록 select 요청
    return new  Promise((resolve, reject) => {
        fetch('/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {

            resolve(data);
            console.log(data); // 파싱된 JSON 데이터 출력
            recordRow(data)
        })
        .catch(error => {
            reject(error);
        });
    });
}
// 불러오기 상세 페이지 select 요청
function DetailsRecordInitPage(date){
    console.log(date);

    // 해당 사용자 과거 기록 select 요청
    return new  Promise((resolve, reject) => {
        fetch('/detailsRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            console.log(data); // 파싱된 JSON 데이터 출력
            DetailsRecordRow(data)
        })
        .catch(error => {
            reject(error);
        });
    });
}
// 불러오기 페이지 select 결과 출력
function recordRow(data) {
    // 테이블 요소를 가져옴
    const table = document.getElementById("commentListTable");
    let tableHTML = "";

    tableHTML += "<tr id='commentListHeader'>";
    tableHTML += "<th width='10%'>번호</th>";
    tableHTML += "<th width='30%'>요청 날짜</th>";
    tableHTML += "<th width='15%'>사진</th>";
    tableHTML += "<th width='15%'>정상</th>";
    tableHTML += "<th width='15%'>비정상</th>";
    tableHTML += "<th width='15%'>상세보기</th>";
    tableHTML += "</tr>";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        tableHTML += "<tr class='commentRequest'>";
        tableHTML += `<td><button class="checkBtn">${i + 1}</button></td>`;
        for (const key in row) {
            tableHTML += `<td>${row[key]}</td>`;
        }
        tableHTML += `<td><a href="../viewDetails.html?param1=${row.added}">상세보기</a></td>`;
        tableHTML += "</tr>";
    }

    table.innerHTML = tableHTML;
    InitPage();
    PageLoad();
}
// 불러오기 상세 페이지 select 결과 출력
function DetailsRecordRow(data) {
    // 테이블 요소를 가져옴
    const table = document.getElementById("commentListTable");
    let tableHTML = "";

    tableHTML += "<tr id='commentListHeader'>";
    tableHTML += "<th width='10%'>번호</th>";
    tableHTML += "<th width='30%'>요청 날짜</th>";
    tableHTML += "<th width='20%'>사진</th>";
    tableHTML += "<th width='10%'>상태</th>";
    tableHTML += "<th width='30%'>코멘트</th>";
    tableHTML += "</tr>";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        tableHTML += "<tr class='commentRequest'>";
        tableHTML += `<td>${i + 1}</td>`;
        tableHTML += `<td>${row.added}</td>`;
        tableHTML += `<td><img src="./images/${row.added}/${row.file_name}" style="width: 100%;"></td>`;
        tableHTML += `<td>${row.result}</td>`;
        tableHTML += "<td>코멘트</td>";
        tableHTML += "</tr>";
    }

    table.innerHTML = tableHTML;
    InitPage();
    PageLoad();
}

//관리자 코멘트 기능 ExpertRequestComment.html
const menu = document.getElementsByClassName('Board_Menu');

//console.log(menu);
let selected_board = "코멘트 요청";
//메뉴 누르면 작동
function Board_Select(){
    const clickElement = event.target;
	
    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = 'none';
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
            menu[idx].style.backgroundColor = 'none';
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
    
    Posts_Output('코멘트 요청');
}
//Board_Menu에 따라 리스트를 다르게 표시
async function Posts_Output(board_type){
    const board = document.getElementById('commentListTable');	//목록
    const tds = document.getElementsByClassName('add_td_Tag');	//게시물
    const imagePopUp = document.getElementById('buildingList');
	//console.log(tds);

	let comments = await commentImport();	//모든 코멘트 가져오기
    console.log(comments);
    let reqComment = [];

    if (board_type === '코멘트 요청') {
        comments.forEach(element => {
            if (element['reqDependingOn'] === 'N') {
                reqComment.push(element);
            }
        });
    }
    else {
        comments.forEach(element => {
            if (element['reqDependingOn'] === 'Y') {
                reqComment.push(element);
            }
        });
    }
	console.log(reqComment);

    while (tds.length > 0) {
        tds[0].parentNode.remove(); // 부모 노드를 통해 tr 요소를 삭제합니다.
    }
    
    for (let idx = 0; idx < reqComment.length; idx++) { // 게시물 표시
        const tr = document.createElement('tr'); // 새로운 테이블 행 생성
        tr.className = 'commentRequest';

        // tr.addEventListener('click', () => {
        //     userInfo(row);
        // });

        const row = reqComment[idx]; // rows를 nowPagePosts로 변경
        const userTypeTh = document.querySelector('.title[width="20%"]');

        if (row['userType'] === 'admin') {
            continue;
        }
        //코멘트 요청
        if (board_type === '코멘트 요청') {
            // userTypeTh.textContent = '코멘트 요청';
            if (row['reqDependingOn'] === 'N') {
                const noRequestsMessage = document.getElementById('noRequestsMessage');
                noRequestsMessage.style.display = 'none';

                const num = document.createElement('td');
                num.className = 'add_td_Tag';
                num.textContent = idx + 1;

                const userId = document.createElement('td');
                userId.className = 'add_td_Tag';
                userId.textContent = row['user_id'];

                const reqDate = document.createElement('td');
                reqDate.className = 'add_td_Tag';
                reqDate.textContent = row['requestDate'];

                const uploadDate = document.createElement('td');
                uploadDate.className = 'add_td_Tag';
                uploadDate.textContent = row['imgUploadDate'];

                const imageCell = document.createElement('td');
                imageCell.className = 'add_td_Tag';

                const image = document.createElement('img');
                image.src = row['file_route'];
                image.style.width = '50px';

                imageCell.appendChild(image);

                imageCell.addEventListener('click', () => {
                    const modal = document.querySelector('.modal');
                    modal.style.display = 'block';
                    image.style.width = '100%';
                
                    // 이미지를 복제하여 모달 팝업에 추가
                    const imageClone = image.cloneNode(true);
                    modal.querySelector('.modal-content').appendChild(imageClone);
                });
                
                document.querySelector('.close-modal-btn').addEventListener('click', function () {
                    const modal = document.querySelector('.modal');
                    modal.style.display = 'none';
                    image.style.width = '50px';
                
                    // 모달 팝업 내용을 비우지 않고 복제된 이미지만 제거
                    const modalContent = modal.querySelector('.modal-content');
                    const clonedImage = modalContent.querySelector('img');
                    if (clonedImage) {
                        modalContent.removeChild(clonedImage);
                    }
                });

                const reqDeniedButton = document.createElement('button');
                reqDeniedButton.className = 'add_td_Tag';
                reqDeniedButton.textContent = '거절';

                reqDeniedButton.addEventListener('click', () => {
                    reqDenied(row['img_id'], row['user_id']);
                });

                const commit = document.createElement('button');
                commit.className = 'add_td_Tag';
                commit.textContent = '승인';

                commit.addEventListener('click', () => {
                    reqAccept(row['img_id'], row['user_id']);
                });

                tr.appendChild(num);
                tr.appendChild(userId);
                tr.appendChild(reqDate);
                tr.appendChild(uploadDate);
                tr.appendChild(imageCell);
                tr.appendChild(reqDeniedButton);
                tr.appendChild(commit);

                board.appendChild(tr);
            }
        } 
        //코멘트 완료
        else if (row['waitOk'] !== 0) {
            // userTypeTh.textContent = '코멘트 완료';
            const noRequestsMessage = document.getElementById('noRequestsMessage');
            noRequestsMessage.style.display = 'none';

            const num = document.createElement('td');
            num.className = 'add_td_Tag';
            num.textContent = idx + 1;

            const userId = document.createElement('td');
            userId.className = 'add_td_Tag';
            userId.textContent = row['user_id'];

            const reqDate = document.createElement('td');
            reqDate.className = 'add_td_Tag';
            reqDate.textContent = row['requestDate'];

            const uploadDate = document.createElement('td');
            uploadDate.className = 'add_td_Tag';
            uploadDate.textContent = row['imgUploadDate'];

            const imageCell = document.createElement('td');
            imageCell.className = 'add_td_Tag';

            const image = document.createElement('img');
            image.src = row['file_route'];
            image.style.width = '50px';

            imageCell.appendChild(image);

            imageCell.addEventListener('click', () => {
                const modal = document.querySelector('.modal');
                modal.style.display = 'block';
                image.style.width = '100%';
            
                // 이미지를 복제하여 모달 팝업에 추가
                const imageClone = image.cloneNode(true);
                modal.querySelector('.modal-content').appendChild(imageClone);
            });
            
            document.querySelector('.close-modal-btn').addEventListener('click', function () {
                const modal = document.querySelector('.modal');
                modal.style.display = 'none';
                image.style.width = '50px';
            
                // 모달 팝업 내용을 비우지 않고 복제된 이미지만 제거
                const modalContent = modal.querySelector('.modal-content');
                const clonedImage = modalContent.querySelector('img');
                if (clonedImage) {
                    modalContent.removeChild(clonedImage);
                }
            });

            const commentButton = document.createElement('td');
            commentButton.className = 'add_td_Tag';
            commentButton.textContent = '코멘트 달기';

            commentButton.addEventListener('click', () => {
                const modal = document.querySelector('.modal');
                modal.style.display = 'block';

                const commentInput = document.createElement('textarea');
                commentInput.className = 'add_td_Tag';
                commentInput.placeholder = '코멘트를 달아주세요';
                commentInput.style.width = '500px';
                commentInput.style.height = '200px';
                commentInput.style.resize = 'none';

                const commitButton = document.createElement('button');
                commitButton.className = 'add_td_Tag';
                commitButton.textContent = '작성 완료';

                commitButton.addEventListener('click', () => {
                    const commentValue = commentInput.value; // textarea의 값을 가져옵니다
                    console.log(commentValue);
                    commitComment(row['img_id'], row['user_id'], commentValue);
                });

                buildingList.appendChild(commentInput);
                buildingList.appendChild(commitButton);
            });

            const closeModalButton = document.querySelector('.close-modal-btn');
            closeModalButton.addEventListener('click', function () {
                const modal = document.querySelector('.modal');
                modal.style.display = 'none';
            });

            // const deleteUserButton = document.createElement('button');
            // deleteUserButton.className = 'add_td_Tag';
            // deleteUserButton.textContent = '삭제';

            // deleteUserButton.addEventListener('click', () => {
            //     deleteUser(row['id'], row['userType']);
            // });

            tr.appendChild(num);
            tr.appendChild(userId);
            tr.appendChild(reqDate);
            tr.appendChild(uploadDate);
            tr.appendChild(imageCell);
            tr.appendChild(commentButton);
            
            // tr.appendChild(deleteUserButton);

            // if (row['userType'] === 'expert' && row['waitOk'] === 1) {
            //     const unCommitButton = document.createElement('button');
            //     unCommitButton.className = 'unCommitButtonClass';
            //     unCommitButton.textContent = '권한수정';

            //     unCommitButton.addEventListener('click', () => {
            //         unCommit(row['id']);
            //     });

            //     tr.appendChild(unCommitButton);
            // }

            board.appendChild(tr);
        }
        else {
            console.log('무언가 오류가 났어요 ㅠㅠㅠㅠㅠ');
        }
        console.log(board_type);
    }
}
//모든 코멘트 가져오기
function commentImport() {
	return new Promise((resolve, reject) => {
        fetch('/reqCommentImport', {
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

function reqAccept(imgId, userId) {
    fetch('/reqAccept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgId })
    })
    .then(res => {
        alert(userId + ' 님의 요청을 수락했습니다.');
        location.href = 'ExpertRequestComment.html?userId=' + userId;
        console.log(res);
    })
    .catch(error => {
        alert('commitExpert 오류');
        location.href = 'ExpertRequestComment.html';
        console.log(error);
    });
}

function reqDenied(imgId, userId) {
    fetch('/reqDenied', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgId })
    })
    .then(res => {
        alert(userId + ' 님의 요청을 거절했습니다.');
        location.href = 'ExpertRequestComment.html';
        console.log(res);
    })
    .catch(error => {
        alert('commitExpert 오류');
        location.href = 'ExpertRequestComment.html';
        console.log(error);
    });
}

function commitComment(imgId, userId, value) {
    fetch('/commitComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgId, value })
    })
    .then(res => {
        alert(userId + ' 님에게 코멘트를 달았습니다.');
        location.href = 'ExpertRequestComment.html';
        console.log(res);
    })
    .catch(error => {
        alert('commitExpert 오류');
        location.href = 'ExpertRequestComment.html';
        console.log(error);
    });
}