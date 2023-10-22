
const form = document.querySelector("form");
const fileInput = document.querySelector(".fileInput");
const selectArea = document.querySelector(".selectArea");      // 부모 요소인 selectArea에 클릭 이벤트 리스너를 추가
const checkBtn = document.querySelector(".checkBtn");

// 파일 업로드 form 태그 클릭시
form.addEventListener("click", ()=>{
    fileInput.click();
})

// 가져온 이미지 파일들 리스트 생성 함수에 보내는 함수
fileInput.onchange = ({target}) =>{
    let files = target.files;
    
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // 파일이 선택되었을 떼
        if (file) {
            readAndCreateListItem(file);
        }
    }
}

// 파일을 읽고 이미지를 생성하여 화면에 추가하는 함수
function readAndCreateListItem(file) {
    const reader = new FileReader();

    // FileReader의 'onload' 이벤트 핸들러 설정
    reader.onload = (e) => {
        const fileName = file.name;
        createListItem(fileName, e.target.result);
    };

    // 파일을 Data URL로 읽어들임 (이미지로 변환)
    reader.readAsDataURL(file);
}

// 새 리스트 아이템을 생성하고 목록에 추가
function createListItem(fileName, imageUrl) {
    const newList = document.getElementsByClassName("selectArea")[0];
    const newItem = document.createElement("li");
    newItem.classList.add("row");       // li 태그에 'row'라는 클래스 이름 넣어주기

    newItem.innerHTML = `
        <div class="imgContent">
            <img src="${imageUrl}" alt="${fileName}"/>
        </div>
        <div class="content">
            <div class="details">
                <span class="name">${fileName}</span>
            </div>
        </div>
        <button class="removeBtn">삭제</button>
    `;

    newList.appendChild(newItem);   
}

// 모든 삭제 버튼에 대한 클릭 이벤트 처리
selectArea.addEventListener("click", (e) => {
    // 클릭된 요소 클래스 중 removeBtn이 포함되어 있는지 검사
    if(e.target.classList.contains("removeBtn")) {
        // 클릭된 요소가 삭제 버튼인 경우
        const listItem = e.target.closest('li');        // 클릭된 요소에서 가장 가까운 'li' 태그 찾기
        if(listItem) {
            listItem.remove();
        }
    }
})

// 검사 버튼 클릭시 검사할 이미지 주소들 저장 및 전송
checkBtn.addEventListener("click", () =>{
    const nameElements = document.querySelectorAll('.name'); // 모든 .name 클래스를 가진 요소를 선택
    let checkImgTest = []; // 텍스트 내용을 저장할 배열

    nameElements.forEach(e => {
        const nameValue = e.textContent; // 각 요소의 텍스트 내용을 가져옴
        // 해당 이미지 요소 찾기
        // 해당 요소의 부모 중에서 li 요소 찾기
        // .imgContent 클래스를 가진 하위 요소 중 img 태그 찾기
        const imgElement = e.closest('li').querySelector('.imgContent img'); 
        if (imgElement) {
            const imageUrl = imgElement.src; // 이미지의 URL 가져오기
            // 이미지 url 저장이 아닌 url을 이용해서 서버 파일 디렉토리에 이미지들 저장
            checkImgTest.push({ name: nameValue, url: imageUrl }); // 배열에 객체로 저장
        }
    })
    console.log(checkImgTest);
    
    SetImage(checkImgTest);
})
async function SetImage(checkImgTest){
    console.log("SetImage 함수 실행");
    return new  Promise((resolve, reject) => {
        fetch('/checkImg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({ checkImgTest })
        })
            .then(data => {
                resolve(data);
                console.log(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}