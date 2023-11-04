const form = document.querySelector("form");
const fileInput = document.querySelector(".fileInput");
const selectArea = document.querySelector(".selectArea");      // 부모 요소인 selectArea에 클릭 이벤트 리스너를 추가
const checkBtn = document.querySelector(".checkBtn");
const formData = new FormData();

// 파일 업로드 form 태그 클릭시
form.addEventListener("click", ()=>{
    fileInput.click();
})

// 가져온 이미지 파일들 리스트 생성 함수에 보내는 함수
fileInput.onchange = ({target}) =>{
    let files = target.files;
    
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('images', files[i]);
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
    `;

    newList.appendChild(newItem);   
}

// 검사 버튼 클릭시 검사할 이미지 주소들 저장 및 전송
checkBtn.addEventListener("click", () =>{
    // HTML에서 input 요소 값 가져오기.
    const buildingName = document.querySelector('.buildingWrite').value;
    const errorMessage = document.querySelector('.error-message');

    if (!buildingName) {
        errorMessage.textContent = "건물 이름을 입력하세요.";
        errorMessage.style.color = "red";
        return; // 함수 종료
    }

    // 건물 이름 입력란이 비어있지 않다면 에러 메시지를 초기화합니다.
    errorMessage.textContent = "";

    // 변수에 저장된 값을 출력합니다.
    console.log("SetImage 함수 실행");
    console.log(buildingName);
    buildingNamePost(buildingName);

    return new  Promise((resolve, reject) => {
        fetch('/image-discrimination', {
            method: 'POST',
            headers: {
                
            },
			body: formData
        })
            .then(data => {
                resolve(data);
                console.log(data);
            })
            .catch(error => {
                reject(error);
            });
    });
})

function buildingNamePost(buildingName) {
    // buildingName를 객체로 감싸서 전송
    const data = { buildingName };
    
    return new  Promise((resolve, reject) => {
        fetch('/buildingNameInput', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // JSON 형식으로 보내기 위한 헤더 설정
            },
			body: JSON.stringify(data) // 객체를 JSON 문자열로 변환하여 전송
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

// 파일 리셋 버튼을 클릭할 때
document.querySelector('.resetBtn').addEventListener('click', function () {
    // 파일 입력 필드 초기화
    const fileInput = document.querySelector('.fileInput');

    // 파일 입력 필드에서 선택한 파일 목록을 초기화
    fileInput.value = '';

    // 선택한 파일들을 초기화한 후, 파일 목록을 확인하여 모든 파일을 제거
    const selectedFiles = fileInput.files;
    const numSelectedFiles = selectedFiles.length; // 선택한 파일의 수

    console.log(`선택한 파일의 수: ${numSelectedFiles}`);
    for (let i = 0; i < numSelectedFiles; i++) {
        selectedFiles[i] = null;
    }

    const selectArea = document.querySelector('.selectArea');
    while (selectArea.firstChild) {
        selectArea.removeChild(selectArea.firstChild);
    }

    // 이미지 파일을 모두 삭제
    formData.delete('images');
});