

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
        tableHTML += `<td>${row.upload_date}</td>`;
        tableHTML += `<td>${row.total}</td>`;
        tableHTML += `<td>${row.normal_count}</td>`;
        tableHTML += `<td>${row.abnormality_count}</td>`;
        // for (const key in row) {
        //     tableHTML += `<td>${row[key]}</td>`;
        // }
        tableHTML += `<td><a href="../InspectResultDetails.html?param1=${row.upload_date}">상세보기</a></td>`;
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
                tableHTML += "<td><button class='InspectBtn'>요청</button></td>";
            }
            else{
                tableHTML += "<td><button class='InspectBtn'>수락</button></td>";
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
    tableHTML += "<th width='15%'>검사 개수</th>";
    tableHTML += "<th width='15%'>정상</th>";
    tableHTML += "<th width='15%'>비정상</th>";
    tableHTML += "<th width='15%'>상세보기</th>";
    tableHTML += "</tr>";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        tableHTML += "<tr class='commentRequest'>";
        tableHTML += `<td>${i + 1}</td>`;
        for (const key in row) {
            tableHTML += `<td>${row[key]}</td>`;
        }
        tableHTML += `<td><a href="../viewDetails.html?param1=${row.upload_date}">상세보기</a></td>`;
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
            body: JSON.stringify({ selectedAddress })
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