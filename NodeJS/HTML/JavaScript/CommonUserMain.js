const form = document.querySelector("form");
const fileInput = document.querySelector("#fileInput");
const checkBtn = document.querySelector(".checkBtn");
const formData = new FormData();

// 가져온 이미지 파일들 리스트 생성 함수에 보내는 함수
fileInput.addEventListener('change', () => {
    formData.delete("images");
    const files = fileInput.files;
    
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    console.log("SetImage 함수 실행");
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