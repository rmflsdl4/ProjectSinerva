const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

// 파일 업로드 form 태그 클릭시
form.addEventListener("click", ()=>{
    fileInput.click();
})

fileInput.onchange = ({target}) =>{
    let file = target.files[0];
    // 파일이 선택되었을 때
    if(file){
        let fileName = file.name;
        uploadFile(fileName)
    }
}

function uploadFile(name) {
    
}