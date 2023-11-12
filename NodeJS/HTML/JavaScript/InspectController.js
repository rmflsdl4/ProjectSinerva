var currPageNum;
var posts; 
var prePage;
var nextPage;
var pageCount;
var pageNum;
var itemsPerPage = 5;
let imgId = [];
let requestDate;
let commentImgId = [];
let MenuValue;

function InitPage(){
    currPageNum = 1;

    posts = document.getElementsByClassName("commentRequest");
    prePage = document.getElementById("prePage");
    nextPage = document.getElementById("nextPage");
    pageNum = document.getElementById("pageNum");
    pageCount = Math.ceil(posts.length / 5);
    PageLoad();
    

    if(posts.length < 6){
        nextPage.style.visibility = "hidden";
    }

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
// 날짜 포맷
function DateFormat(dateStr){
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const upload_date = `${year}-${month}-${day} ${hour}:${minute}`;
    return upload_date;
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
    const popUp = document.getElementById('buildingList');
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
                reqDate.textContent = DateFormat(row['requestDate']);

                const uploadDate = document.createElement('td');
                uploadDate.className = 'add_td_Tag';
                uploadDate.textContent = DateFormat(row['imgUploadDate']);

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

                    seeMore(row['imgUploadDate'])
                    .then(value => {
                        console.log(value.length);
                        for (let i = 0; i < value.length; i++) {
                            image.src = value[i].file_route;

                            // 이미지를 복제하여 모달 팝업에 추가
                            const imageClone = image.cloneNode(true);
                            modal.querySelector('.modal-content').appendChild(imageClone);
                        }
                    });
                });
                
                const closeImageButton = document.querySelector('.close-modal-btn');
                closeImageButton.addEventListener('click', function () {
                    const modal = document.querySelector('.modal');
                    modal.style.display = 'none';
                    image.style.width = '50px';
                
                    // 모달 팝업 내용을 비우지 않고 복제된 이미지만 제거
                    const modalContent = modal.querySelector('.modal-content');
                    const clonedImages = modalContent.querySelectorAll('img');
                    if (clonedImages.length > 0) {
                        clonedImages.forEach((img) => {
                            modalContent.removeChild(img);
                        });
                    }
                });

                const reqDeniedButton = document.createElement('button');
                reqDeniedButton.className = 'add_td_Tag';
                reqDeniedButton.textContent = '거절';

                reqDeniedButton.addEventListener('click', () => {
                    reqDenied(row['imgUploadDate'], row['user_id']);
                });

                const submit = document.createElement('button');
                submit.className = 'add_td_Tag';
                submit.textContent = '승인';

                submit.addEventListener('click', () => {
                    reqAccept(row['imgUploadDate'], row['user_id']);
                });
                
                const more = document.createElement('button');
                more.className = 'add_td_Tag';
                more.textContent = '더보기';

                more.addEventListener('click', () => {
                    seeMore(row['imgUploadDate'])
                    .then(value => {
                        const seeMoreTable = document.createElement('table');
                        seeMoreTable.className = 'seeMoreTable';
                        
                        console.log(value);
                        for (let i = 0; i < value.length; i++) {
                            const modal = document.querySelector('.modal');
                            modal.style.display = 'block';

                            const tr = document.createElement('tr');
                            tr.className = 'seeMoreTr';

                            const userId = document.createElement('td');
                            userId.className = 'more';
                            userId.textContent = value[i].user_id;
                            userId.style.width = '20%';

                            const reqDate = document.createElement('td');
                            reqDate.className = 'more';
                            reqDate.textContent = DateFormat(value[i].requestDate);
                            reqDate.style.width = '20%';

                            const uploadDate = document.createElement('td');
                            uploadDate.className = 'more';
                            uploadDate.textContent = DateFormat(value[i].imgUploadDate);
                            uploadDate.style.width = '30%';

                            const imageCell = document.createElement('td');
                            imageCell.className = 'more';

                            const image = document.createElement('img');
                            image.src = value[i].file_route;
                            image.style.width = '200px';

                            imageCell.appendChild(image);

                            tr.appendChild(userId);
                            tr.appendChild(reqDate);
                            tr.appendChild(uploadDate);
                            tr.appendChild(imageCell);

                            seeMoreTable.appendChild(tr);
                        }

                        const closeSeeMoreButton = document.querySelector('.close-modal-btn');
                        closeSeeMoreButton.addEventListener('click', function () {
                            const modal = document.querySelector('.modal');
                            modal.style.display = 'none';
                            const seeMoreTable = document.querySelector('.seeMoreTable');
                            if (seeMoreTable) {
                                seeMoreTable.remove();
                            }
                        });

                        popUp.appendChild(seeMoreTable);
                    });
                });

                tr.appendChild(num);
                tr.appendChild(userId);
                tr.appendChild(reqDate);
                tr.appendChild(uploadDate);
                tr.appendChild(imageCell);
                tr.appendChild(reqDeniedButton);
                tr.appendChild(submit);
                tr.appendChild(more);

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
            reqDate.textContent = DateFormat(row['requestDate']);

            const uploadDate = document.createElement('td');
            uploadDate.className = 'add_td_Tag';
            uploadDate.textContent = DateFormat(row['imgUploadDate']);

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
            
                seeMore(row['imgUploadDate'])
                .then(value => {
                    console.log(value.length);
                    for (let i = 0; i < value.length; i++) {
                        image.src = value[i].file_route;

                        // 이미지를 복제하여 모달 팝업에 추가
                        const imageClone = image.cloneNode(true);
                        modal.querySelector('.modal-content').appendChild(imageClone);
                    }
                });
            });
            
            document.querySelector('.close-modal-btn').addEventListener('click', function () {
                const modal = document.querySelector('.modal');
                modal.style.display = 'none';
                image.style.width = '50px';
            
                // 모달 팝업 내용을 비우지 않고 복제된 이미지만 제거
                const modalContent = modal.querySelector('.modal-content');
                const clonedImages = modalContent.querySelectorAll('img');
                if (clonedImages.length > 0) {
                    clonedImages.forEach((img) => {
                        modalContent.removeChild(img);
                    });
                }
            });

            const commentButton = document.createElement('td');
            const showCommentButton = document.createElement('td');

            if (!row['comment']) {
                commentButton.className = 'commentButton';
                commentButton.textContent = '코멘트 달기';
                
                showCommentButton.style.display = 'none';
            }
            else {
                commentButton.className = 'commentButton';
                commentButton.textContent = '수정하기';

                showCommentButton.className = 'showComment';
                showCommentButton.textContent = '보기';
            }

            //코멘트 입력 및 수정
            commentButton.addEventListener('click', () => {
                seeMore(row['imgUploadDate'])
                    .then(value => {
                        const seeMoreTable = document.createElement('table');
                        seeMoreTable.className = 'seeMoreTable';
                        
                        console.log(value);
                        for (let i = 0; i < value.length; i++) {
                            const modal = document.querySelector('.modal');
                            modal.style.display = 'block';

                            const tr = document.createElement('tr');
                            tr.className = 'seeMoreTr';

                            const userId = document.createElement('td');
                            userId.className = 'more';
                            userId.textContent = value[i].user_id;
                            userId.style.width = '20%';

                            const uploadDate = document.createElement('td');
                            uploadDate.className = 'more';
                            uploadDate.textContent = DateFormat(value[i].imgUploadDate);
                            uploadDate.style.width = '30%';

                            const imageCell = document.createElement('td');
                            imageCell.className = 'more';

                            const image = document.createElement('img');
                            image.src = value[i].file_route;
                            image.style.width = '200px';

                            imageCell.appendChild(image);

                            const textareaCell = document.createElement('td');
                            textareaCell.className = 'more';

                            const commentInput = document.createElement('textarea');
                            commentInput.className = 'commentTextarea';
                            if (value[i].comment) {
                                commentInput.value = value[i].comment;
                            }
                            else {
                                commentInput.placeholder = '코멘트를 달아주세요';   
                            }
                            commentInput.style.width = '300px';
                            commentInput.style.height = '120px';
                            commentInput.style.resize = 'none';

                            textareaCell.appendChild(commentInput);

                            const buttonCell = document.createElement('td');
                            buttonCell.className = 'more';

                            const submitButton = document.createElement('button');
                            submitButton.className = 'commentSubmit';
                            submitButton.textContent = '작성 완료';
                        
                            submitButton.addEventListener('click', () => {
                                let commentValue = commentInput.value; // textarea의 값을 가져옵니다
                                console.log(value[i].img_id, commentValue);
                                submitComment(value[i].img_id, value[i].user_id, commentValue);
                            });

                            buttonCell.appendChild(submitButton);

                            tr.appendChild(userId);
                            tr.appendChild(uploadDate);
                            tr.appendChild(imageCell);
                            tr.appendChild(textareaCell);
                            tr.appendChild(buttonCell);

                            seeMoreTable.appendChild(tr);
                        }

                        const closeCommitModelButton = document.querySelector('.close-modal-btn');
                        closeCommitModelButton.addEventListener('click', function () {
                            const modal = document.querySelector('.modal');
                            modal.style.display = 'none';
                            const seeMoreTable = document.querySelector('.seeMoreTable');
                            if (seeMoreTable) {
                                seeMoreTable.remove();
                            }
                            Posts_Output('코멘트 관리');
                        });

                        popUp.appendChild(seeMoreTable);
                    });
            });

            //코멘트 출력
            showCommentButton.addEventListener('click', () => {
                seeMore(row['imgUploadDate'])
                    .then(value => {
                        const seeMoreTable = document.createElement('table');
                        seeMoreTable.className = 'seeMoreTable';
                        
                        console.log(value);
                        for (let i = 0; i < value.length; i++) {
                            const modal = document.querySelector('.modal');
                            modal.style.display = 'block';

                            const tr = document.createElement('tr');
                            tr.className = 'seeMoreTr';

                            const userId = document.createElement('td');
                            userId.className = 'more';
                            userId.textContent = value[i].user_id;
                            userId.style.width = '20%';

                            const reqDate = document.createElement('td');
                            reqDate.className = 'more';
                            reqDate.textContent = DateFormat(value[i].requestDate);
                            reqDate.style.width = '20%';

                            const uploadDate = document.createElement('td');
                            uploadDate.className = 'more';
                            uploadDate.textContent = DateFormat(value[i].imgUploadDate);
                            uploadDate.style.width = '30%';

                            const imageCell = document.createElement('td');
                            imageCell.className = 'more';

                            const image = document.createElement('img');
                            image.src = value[i].file_route;
                            image.style.width = '200px';

                            imageCell.appendChild(image);

                            const comment = document.createElement('td');
                            comment.className = 'more';
                            comment.textContent = value[i].comment;
                            comment.style.width = '30%';

                            tr.appendChild(userId);
                            tr.appendChild(reqDate);
                            tr.appendChild(uploadDate);
                            tr.appendChild(imageCell);
                            tr.appendChild(comment);

                            seeMoreTable.appendChild(tr);
                        }

                        const closeViewCommentModelButton = document.querySelector('.close-modal-btn');
                        closeViewCommentModelButton.addEventListener('click', function () {
                            const modal = document.querySelector('.modal');
                            modal.style.display = 'none';
                            const seeMoreTable = document.querySelector('.seeMoreTable');
                            if (seeMoreTable) {
                                seeMoreTable.remove();
                            }
                        });

                        popUp.appendChild(seeMoreTable);
                    });
            });
            
            const closeModalButton = document.querySelector('.close-modal-btn');
            closeModalButton.addEventListener('click', function () {
                const modal = document.querySelector('.modal');
                modal.style.display = 'none';
                // 모달이 닫힐 때 입력란을 초기화합니다.
                const commentTextarea = document.querySelector('.commentTextarea');
                const commentSubmit = document.querySelector('.commentSubmit');
                if (commentTextarea) {
                    commentTextarea.remove();
                    commentSubmit.remove();
                }
            });

            tr.appendChild(num);
            tr.appendChild(userId);
            tr.appendChild(reqDate);
            tr.appendChild(uploadDate);
            tr.appendChild(imageCell);
            tr.appendChild(commentButton);
            tr.appendChild(showCommentButton);

            board.appendChild(tr);
        }
        else {
            console.log('무언가 오류가 났어요 ㅠㅠㅠㅠㅠ');
        }
        console.log(board_type);
    }
}
//모든 코멘트 요청 가져오기 (업로드 날짜별로)
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

//더 보기 버튼을 누르면 실행
function seeMore(imgUploadDate) {
	return new Promise((resolve, reject) => {
        fetch('/seeMore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imgUploadDate })
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

//검사 요청 수락
function reqAccept(imgUploadDate, userId) {
    fetch('/reqAccept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgUploadDate })
    })
    .then(res => {
        alert(userId + ' 님의 요청을 수락했습니다.');
        location.href = 'ExpertRequestComment.html?userId=' + userId;
        console.log(res);
    })
    .catch(error => {
        alert('submitExpert 오류');
        location.href = 'ExpertRequestComment.html';
        console.log(error);
    });
}

//검사 요청 거절
function reqDenied(imgUploadDate, userId) {
    fetch('/reqDenied', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgUploadDate })
    })
    .then(res => {
        alert(userId + ' 님의 요청을 거절했습니다.');
        location.href = 'ExpertRequestComment.html';
        console.log(res);
    })
    .catch(error => {
        alert('submitExpert 오류');
        location.href = 'ExpertRequestComment.html';
        console.log(error);
    });
}

//코멘트 달기
function submitComment(imgId, userId, value) {
    fetch('/submitComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgId, value })
    })
    .then(res => {
        alert(imgId + ' 번 이미지의 ' +userId + ' 님에게 코멘트를 달았습니다.');
        console.log(res);
    })
    .catch(error => {
        alert('submitExpert 오류');
        console.log(error);
    });
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
function InspectDetailsRecordInitPage(date, requestResult, buildingAddress){
    console.log(date);
    requestDate = date;

    // 해당 사용자 과거 기록 select 요청
    return new  Promise((resolve, reject) => {
        fetch('/detailsRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, buildingAddress })
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
            InspectDetailsRecordRow(data, requestResult)
        })
        .catch(error => {
            reject(error);
        });
    });
}
// 검사 결과 페이지 select 결과 출력
function InspectRecordRow(data, state = false) {
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

    var preAddress = data[0][0];
    var sequenceNum = 1;
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const upload_date = DateFormat(row.upload_date);

        if(state === true){
            if(row.address !== preAddress){
                tableHTML += "<tr class='commentRequest'>";
                tableHTML += `<th colspan='6' style='font-size:20px;'>${row.address}</th>`;
                tableHTML += "</tr>";
                sequenceNum = 1;
            }
        }
        tableHTML += "<tr class='commentRequest'>";
        tableHTML += `<td>${sequenceNum}</td>`;
        tableHTML += `<td>${upload_date}</td>`;
        tableHTML += `<td>${row.total}</td>`;
        tableHTML += `<td>${row.normal_count}</td>`;
        tableHTML += `<td>${row.abnormality_count}</td>`;
        // for (const key in row) {
        //     tableHTML += `<td>${row[key]}</td>`;
        // }
        console.log(row.upload_date);
        tableHTML += `<td><a href="../InspectResultDetails.html?param1=${row.upload_date}&param2=${row.reqDependingOn}&param3=${row.address}">상세보기</a></td>`;
        tableHTML += "</tr>";
        preAddress = row.address;
        sequenceNum++;
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
function InspectDetailsRecordRow(data, requestResult) {
    getUserSession().then(type => {
        console.log("유저타입: " + type.userType);
        console.log("코멘트 결과: " + requestResult);

        if (requestResult === "Y") {
            // 테이블 요소를 가져옴
            const table = document.getElementById("commentListTable");
            let tableHTML = "";

            // div 요소 가져오기
            const expertNameDiv = document.querySelector('.expertNameTitle');
            // 전문가 이름 배열 가져오기
            const expertNames = data.map(row => row.expert_name); // data는 여러 행을 포함하는 배열
            // 중복된 이름 제거
            const uniqueExpertNames = [...new Set(expertNames)];

            // 가져온 div 요소가 존재하고 전문가 이름이 존재한다면 처리
            if (expertNameDiv && uniqueExpertNames.length > 0) {
                // div 요소를 보이게 설정
                expertNameDiv.style.display = 'block';
                // div 요소에 전문가 이름 설정
                expertNameDiv.textContent = `전문가 : ${uniqueExpertNames.join(', ')}`;
            }


            tableHTML += "<tr id='commentListHeader'>";
            tableHTML += "<th width='10%'>번호</th>";
            tableHTML += "<th width='30%'>요청 날짜</th>";
            tableHTML += "<th width='20%'>사진</th>";
            tableHTML += "<th width='10%'>상태</th>";
            tableHTML += "<th width='30%'>코멘트</th>";
            tableHTML += "</tr>";
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                const upload_date = DateFormat(row.upload_date);

                commentImgId[i] = row.img_id;
                tableHTML += "<tr class='commentRequest'>";
                tableHTML += `<td>${i + 1}</td>`;
                tableHTML += `<td>${upload_date}</td>`;
                tableHTML += `<td><img src="${row.file_route}" style="width: 50px;"></td>`;
                tableHTML += `<td>${row.result}</td>`;
                if(row.comment !== null) {
                    tableHTML += `<td>${row.comment}</td>`;
                }
                if(type.userType !== "user"){
                    tableHTML += "<td><button class='InspectBtn'>수락</button></td>";
                }
                tableHTML += "</tr>";
            }

            table.innerHTML = tableHTML;

            // **평가 버튼 생성 및 별점 기능 추가**
            const expertRequestBtns = document.getElementsByClassName("expertRequestBtn");
            for (const btn of expertRequestBtns) {
                btn.style.display = "none";
            }
        
            const btnDivs = document.getElementsByClassName("requestBtn");
        
            for (const btnDiv of btnDivs) {
                const newButton = document.createElement("button");
                newButton.textContent = "평가";
                // 버튼에 클래스 이름 추가
                newButton.classList.add("ratingBtn");
                
                // 전문가 평가 버튼 이벤트
                newButton.addEventListener("click", function() {
                    document.querySelector('.star-modal').style.display = 'block';

                    // 별점 주기
                    const ratingStars = [...document.getElementsByClassName("rating__star")];
                    const ratingResult = document.querySelector(".rating__result");
                    const ratingView = document.querySelector(".ratingResult");
                    let starRating = 0;

                    printRatingResult(ratingResult);

                    function executeRating(stars, result) {
                        const starClassActive = "rating__star fas fa-star"; // 선택된 별
                        const starClassHalf = "rating__star fas fa-star-half-alt"; // 반 별
                        const starClassUnactive = "rating__star far fa-star"; // 선택되지 않은 별
                        const starsLength = stars.length; // 별 요소를 담고 있는 배열의 길이
                        let i;
                        let halfSelected = false; // 반 별이 선택된 상태인지 나타내는 변수
                    
                        stars.map((star) => {
                            star.onclick = () => {
                                i = stars.indexOf(star); // 클릭된 별의 인덱스
                                if (star.className.indexOf(starClassUnactive) !== -1) {
                                    if (halfSelected) {
                                        halfSelected = false;
                                        printRatingResult(result, i + 0.5);
                                        stars[i].className = starClassHalf;
                                    } else {
                                        printRatingResult(result, i + 1);
                                        stars[i].className = starClassActive;
                                    }
                                    for (i; i >= 0; --i) {
                                        if (halfSelected) {
                                            stars[i].className = starClassHalf;
                                        } else {
                                            stars[i].className = starClassActive;
                                        }
                                    }
                                } else {
                                    halfSelected = !halfSelected;
                                    if (halfSelected) {
                                        printRatingResult(result, i + 0.5);
                                        stars[i].className = starClassHalf;
                                    } else {
                                        printRatingResult(result, i);
                                        for (i; i < starsLength; ++i) {
                                            stars[i].className = starClassUnactive;
                                        }
                                    }
                                }
                            };
                        });
                    }

                    function printRatingResult(result, num = 0) {
                        result.textContent = `${num}/5`;
                        starRating = num;
                        ratingView.textContent = ` / ${starRating}`;
                    }

                    executeRating(ratingStars, ratingResult);

                    // 전문가 평가 테이블 insert
                    document.querySelector('.expertStarBtn').addEventListener('click', function () {
                        return new Promise((resolve, reject) => {
                            fetch('/ratingInput', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ starRating, requestDate })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.text(); // 응답 텍스트로 받기
                            })
                            .then(data => {
                                resolve(data);
                                if (data === "duplicate") {
                                    alert("이미 평가를 진행한 전문가입니다.");
                                } else {
                                    alert("평가가 완료되었습니다.");
                                    // JSON 형식의 응답을 처리할 수 있다면 이곳에서 처리
                                    console.log(data);
                                }
                                document.querySelector('.modal').style.display = 'none';
                                // 현재 페이지를 검사 결과 페이지 이동
                                window.location.href = '../InspectResult.html';
                            })
                            .catch(error => {
                                reject(error);
                            });
                        });
                    });
                });
    
                btnDiv.appendChild(newButton);
            }
        }
        else {
            // 코멘트가 안 달렸을 때 테이블 요소를 가져옴
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
                commentImgId[i] = row.img_id;
                const upload_date = DateFormat(row.upload_date);

                tableHTML += "<tr class='commentRequest'>";
                tableHTML += `<td>${i + 1}</td>`;
                tableHTML += `<td>${upload_date}</td>`;
                tableHTML += `<td><img src="${row.file_route}" style="width: 50px;"></td>`;
                tableHTML += `<td>${row.result}</td>`;
                if(row.comment !== null) {
                    tableHTML += `<td>${row.comment}</td>`;
                }
                if(type.userType !== "user"){
                    tableHTML += "<td><button class='InspectBtn'>수락</button></td>";
                }
                tableHTML += "</tr>";
            }

            table.innerHTML = tableHTML;
        } 
        InitPage();
        PageLoad();
    });
}

// 건물 가져오기
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

async function GetBuildingList(){
    return await new Promise((resolve, reject) => {
        fetch('/selectedBuildingSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ MenuValue })
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

function OutputBuildingList(){
    GetBuildingList().then(buildings => {
        const buildingSelect = document.getElementById('buildingSelect');
        // 이전에 생성된 옵션 요소를 모두 제거
        while (buildingSelect.firstChild) {
            buildingSelect.removeChild(buildingSelect.firstChild);
        }

        // "전체 보기" 옵션을 생성 및 추가
        var optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.text = "전체 보기";
        buildingSelect.appendChild(optionElement);

        for(var i = 0; i < buildings.length; i++){
            var optionElement = document.createElement("option");
            optionElement.value = buildings[i].address;
            optionElement.text = buildings[i].address;
            buildingSelect.appendChild(optionElement);
        }
    });
}

// 선택한 건물의 검사 기록을 봄
const buildingSelect = document.getElementById('buildingSelect');
buildingSelect.addEventListener('change', function() {
    if(buildingSelect.value === ""){
        InspectRecordInitPage();
        return;
    }
    else{
        SelectedBuilding(buildingSelect.value);
    }
})

function SelectedBuilding(selectedAddress){
    return new Promise((resolve, reject) => {
        fetch('/selected-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedAddress, MenuValue })
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
            InspectRecordRow(data, true)
        })
        .catch(error => {
            reject(error);
        });
    });
}

// 전문가 테이블 정보 select
function expertList(data) {
    // 테이블 요소를 가져옴
    const table = document.getElementById("expertListTable");
    let tableHTML = "";

    tableHTML += "<tr id='expertListHeader'>";
    tableHTML += "<th width='10%'>번호</th>";
    tableHTML += "<th width='10 %'>이름</th>";
    tableHTML += "<th width='20%'>평점</th>";
    tableHTML += "<th width='50%'>소개</th>";
    tableHTML += "<th width='10%'>선택</th>";
    tableHTML += "</tr>";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        let introduction = truncateText(row.introduction);

        tableHTML += "<tr class='expertRequest'>";
        tableHTML += `<td style="display: none;">${row.expert_id}</td>`; // 이 부분을 숨김 처리
        tableHTML += `<td>${i + 1}</td>`;
        tableHTML += `<td>${row.name}</td>`;
        tableHTML += `<td><div class="star-ratings" id="star-ratings-${i}">
                        <div class="star-ratings-fill space-x-2 text-lg" id="filled-stars-${i}">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <div class="star-ratings-base space-x-2 text-lg" id="base-stars-${i}">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                    </div> / ${row.rating}</td>`;
        tableHTML += `<td>${introduction}</td>`;
        tableHTML += `<td><button class="selectExpert" onclick="selectExpertBtn(this)">선택</button></td>`;
        tableHTML += "</tr>";
    }

    table.innerHTML = tableHTML;

    // 루프가 끝난 후에 별 업데이트
    for (let i = 0; i < data.length; i++) {
        updateStars(data[i].rating, i);
    }
}

// 코멘트 요청 테이블 insert
function selectExpertBtn(button) {
    const tr = button.closest('tr'); // 현재 버튼이 속한 tr 요소를 찾음
    const expertId = tr.querySelector('td:nth-child(1)').textContent; // 첫 번째 td 요소의 텍스트 내용을 가져옴
    console.log(commentImgId);
    
    return new Promise((resolve, reject) => {
        fetch('/commentRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expertId, commentImgId, requestDate })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // 응답 텍스트로 받기
            })
            .then(data => {
                resolve(data);
                if (data === "duplicate") {
                    alert("이미 요청된 이미지들 입니다.");
                } else {
                    alert("요청이 완료되었습니다.");
                    // JSON 형식의 응답을 처리할 수 있다면 이곳에서 처리
                    console.log(data);
                }
                document.querySelector('.modal').style.display = 'none';
                // 현재 페이지를 검사 결과 페이지 이동
                window.location.href = '../InspectResult.html';
            })
            .catch(error => {
                reject(error);
            });
    });
}

// 전문가 리스트 페이지 select 요청
function ExpertListInitPage(){
    // 해당 사용자 과거 기록 select 요청
    return new  Promise((resolve, reject) => {
        fetch('/expertList', {
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
            expertListRow(data)
        })
        .catch(error => {
            reject(error);
        });
    });
}

// 전문가 리스트 테이블 동적 생성
function expertListRow(data) {
    // 테이블 요소를 가져옴
    const table = document.getElementById("commentListTable");
    let tableHTML = "";

    tableHTML += "<tr id='commentListHeader'>";
    tableHTML += "<th width='5%'>번호</th>";
    tableHTML += "<th width='10%'>사진</th>";
    tableHTML += "<th width='10%'>이름</th>";
    tableHTML += "<th width='10%'>전화번호</th>";
    tableHTML += "<th width='20%'>이메일</th>";
    tableHTML += "<th width='20%'>주소</th>";
    tableHTML += "<th width='10%'>소개글</th>";
    tableHTML += "<th width='15%'>평점</th>";
    tableHTML += "</tr>";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        tableHTML += "<tr class='commentRequest'>";
        tableHTML += `<td>${i + 1}</td>`;
        tableHTML += `<td><img src="${row.expert_route}"></td>`;
        tableHTML += `<td>${row.name}</td>`;
        tableHTML += `<td>${row.phone_num}</td>`;
        tableHTML += `<td>${row.email}</td>`;
        tableHTML += `<td>${row.address}</td>`;
        tableHTML += `<td><a href="#" onclick="expertListIntroduction('${row.introduction}')">자세히 보기</a></td>`;
        tableHTML += `<td><div class="star-ratings" id="star-ratings-${i}">
                        <div class="star-ratings-fill space-x-2 text-lg" id="filled-stars-${i}">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <div class="star-ratings-base space-x-2 text-lg" id="base-stars-${i}">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                    </div> / ${row.rating}</td>`;
        tableHTML += "</tr>";
    }

    // 루프 외부에서 테이블 HTML 업데이트
    table.innerHTML = tableHTML;

    // 루프가 끝난 후에 별 업데이트
    for (let i = 0; i < data.length; i++) {
        updateStars(data[i].rating, i);
    }

    // 추가적인 함수 호출
    InitPage();
    PageLoad();
}

function expertListIntroduction(introduction) {
    // 모달 팝업 창 열기
    document.querySelector('.modal').style.display = 'block';

    // introduction 값을 모달에 추가
    const expertContent = document.getElementById('expertContent');
    expertContent.textContent = introduction;
}


// 사용자 코멘트 요청 결과에 따른 게시물 변화
function Board_Result(selectMenu) {
    const elements = document.getElementsByClassName("Board_Request_Menu");

    for (const element of elements) {
        element.style.opacity = '0.1'; // 선택되지 않은 요소의 투명도를 낮춥니다.
    }

    selectMenu.style.opacity = '1'; // 선택된 요소의 투명도를 기본값으로 설정.

    console.log(selectMenu.textContent);
    MenuValue = selectMenu.textContent;

    // 해당 사용자 코멘트 결과 확인 요청
    return new  Promise((resolve, reject) => {
        fetch('/commentResult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ MenuValue })
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
            selectMenuTable(data)
            OutputBuildingList();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function selectMenuTable(data, state = false) {
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

    if (data.length === 0) {
        // "코멘트 요청완료" 버튼을 누르거나 데이터가 없을 때 빈 테이블을 생성
        table.innerHTML = tableHTML;
    } else {
        var preAddress = data[0][0];
        var sequenceNum = 1;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const upload_date = DateFormat(row.upload_date);

            if (state === true) {
                if (row.address !== preAddress) {
                    tableHTML += "<tr class='commentRequest'>";
                    tableHTML += `<th colspan='6' style='font-size:20px;'>${row.address}</th>`;
                    tableHTML += "</tr>";
                    sequenceNum = 1;
                }
            }
            tableHTML += "<tr class='commentRequest'>";
            tableHTML += `<td>${sequenceNum}</td>`;
            tableHTML += `<td>${upload_date}</td>`;
            tableHTML += `<td>${row.total}</td>`;
            tableHTML += `<td>${row.normal_count}</td>`;
            tableHTML += `<td>${row.abnormality_count}</td>`;
            tableHTML += `<td><a href="../InspectResultDetails.html?param1=${row.upload_date}&param2=${row.reqDependingOn}&param3=${row.address}">상세보기</a></td>`;
            tableHTML += "</tr>";
            preAddress = row.address;
            sequenceNum++;
        }

        table.innerHTML = tableHTML;
    }

    InitPage();
    PageLoad();
}

// 소개글 제한걸기
function truncateText(text) {
    if (text) {
        const maxLength = 70; // 원하는 최대 길이로 수정
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    return '';
}

// updateStars 함수는 이전 예제와 동일하게 정의되었다고 가정합니다
function updateStars(score, index) {
    const STAR_COUNT = 5;
    const ratingToPercent = (score / STAR_COUNT) * 100;
    const filledStars = document.getElementById(`filled-stars-${index}`);
    filledStars.style.width = ratingToPercent + '%';
}

function closeModal(clickedButton) {
    // clickedButton에는 클릭된 버튼의 정보가 포함됩니다.
    // 이를 이용하여 해당 모달을 찾아서 display를 'none'으로 변경합니다.
    const modal = clickedButton.closest('.modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
