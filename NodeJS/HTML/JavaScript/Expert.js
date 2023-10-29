var currPageNum;
var posts; 
var prePage;
var nextPage;
var pageCount;
var pageNum;

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

    // 해당 사용자 과거 기록 select 요청
    let id = 'test';
    return new  Promise((resolve, reject) => {
        fetch('/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
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
        tableHTML += "<tr id='commentListHeader'>";
        tableHTML += `<td>${i + 1}</td>`;
        for (const key in row) {
            tableHTML += `<td>${row[key]}</td>`;
        }
        tableHTML += "<td><a href='#'>상세보기</a></td>";
        tableHTML += "</tr>";
    }

    table.innerHTML = tableHTML;
}

