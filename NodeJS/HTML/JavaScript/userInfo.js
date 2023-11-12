let pwc, cpwc;

function userInfoInit(){
    const id = document.getElementById('id');
    const pw = document.getElementById('pw');
    const nick_name = document.getElementById('nick_name');
    const phone_num = document.getElementById('phone_num');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const introduction = document.getElementById('introduction');
    const showPswButton = document.getElementById('showPswButton');

    getUserSession()
    .then(loginUser => {
        console.log(loginUser);

        let userInfo = getUserInfo(loginUser.userId, loginUser.userType);
        console.log(userInfo);

    userInfo.then(data => {
            console.log(data);
        if (loginUser.userType === 'user') {
                introduction.style.display = 'none';
                id.value = data[0].id;
                pw.value = data[0].password;
                nick_name.value = data[0].nick_name;

                var expertProfileDiv = document.querySelector('.expertProfile');
                if (expertProfileDiv) {
                    expertProfileDiv.style.display = 'none';
                }

                if (!data[0].phone_num) {
                    phone_num.placeholder = 'xxx-xxxx-xxxx';
                }
                else {
                    phone_num.value = data[0].phone_num;
                }
                if (!data[0].email) {
                    email.placeholder = '이메일';
                }
                else {
                    email.value = data[0].email;
                }
                if (!data[0].address) {
                    address.placeholder = '주소';
                }
                else {
                    address.value = data[0].address;
                }
                
                showPswButton.addEventListener('click', function() {
                    if (pw.type === 'password') {
                        pw.type = 'text';
                        showPswButton.textContent = '비밀번호 숨기기';
                    } else {
                        pw.type = 'password';
                        showPswButton.textContent = '비밀번호 보기';
                    }
                });
        } 
        else if (loginUser.userType === 'expert') {
                id.value = data[0].id;
                pw.value = data[0].password;
                nick_name.value = data[0].name;
                if (!data[0].phone_num) {
                    phone_num.placeholder = 'xxx-xxxx-xxxx';
                }
                else {
                    phone_num.value = data[0].phone_num;
                }
                if (!data[0].email) {
                    email.placeholder = '이메일';
                }
                else {
                    email.value = data[0].email;
                }
                if (!data[0].address) {
                    address.placeholder = '주소';
                }
                else {
                    address.value = data[0].address;
                }
                if (!data[0].introduction) {
                    introduction.placeholder = '소개글';
                }
                else {
                    introduction.value = data[0].introduction;
                }
                
                showPswButton.addEventListener('click', function() {
                    if (pw.type === 'password') {
                        pw.type = 'text';
                        showPswButton.textContent = '비밀번호 숨기기';
                    } else {
                        pw.type = 'password';
                        showPswButton.textContent = '비밀번호 보기';
                    }
                });
            }
            else {
                console.log('nope');
            }
        });
    });

    let arr = document.getElementsByTagName("input");
    
    for(let i = 0; i < arr.length; i++){
        arr[i].style.marginBottom = "10px";
    }
    Exit_Check();
}

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

async function getUserInfo(id, userType) {
    try {
        const response = await fetch('/loginUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, userType })
        });

        if (!response.ok) {
            throw new Error('데이터 가져오기 실패');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function Input_Check(element){
    PW_T();
    let div = document.createElement("div");
    let img = document.createElement("img");
    let span = document.createElement("span");
    let parentElement = element.parentNode;
    let textNode = document.createTextNode("");
    
    let childElement = parentElement.firstElementChild;

    var len = element.value.length;

    let pw = document.getElementById('pw');
    let confirm_pw = document.getElementById('confirm_pw');

    div.setAttribute('class', 'MessageBox');
    
    function MessageBox_Check(){
        const nextElement = childElement.nextElementSibling; // div 태그 id: MessageBox

        if(nextElement !== null){
            parentElement.removeChild(nextElement);
        }
        parentElement.appendChild(div);
        div.appendChild(img);
        div.appendChild(span);
        span.appendChild(textNode);
    }
    function PW_T(){
        let arr = document.getElementsByTagName("input");
        if(arr[1].value !== "" && arr[2].value !== ""){
            let msgBox = arr[2].nextElementSibling;
            if(msgBox !== null){
                if(arr[1].value !== arr[2].value){
                    msgBox.firstElementChild.src = "Image/dcheck.png";
                    msgBox.children[1].textContent = "비밀번호가 일치하지 않습니다.";
                    return;
                }
                msgBox.firstElementChild.src = "Image/check.png";
                msgBox.children[1].textContent = "비밀번호가 일치합니다.";
            }
        }
    }
    // 빈칸이면 더 이상 실행하지 않고 margin 값 주고 종료
    if(len <= 0){
        const nextElement = childElement.nextElementSibling; // div 태그 id: MessageBox
        parentElement.removeChild(nextElement);
        element.style.marginBottom = "10px";
        return;
    }
    else{
        element.style.marginBottom = "0px";
    }

    // 분기별 함수 실행
    if(element.name === "id"){
        Value_Check(element.name, element.value, null)
            .then(result => {
                idc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 아이디입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용 불가능한 아이디입니다.";
                }
                MessageBox_Check();
            });
    }
    else if(element.name === "pw"){
        pw.value = element.value;
        Value_Check(element.name, element.value, null)
            .then(result => {
                pwc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 비밀번호입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용 불가능한 비밀번호입니다.";
                }
                MessageBox_Check();
            });
    }
    else if(element.name === "confirm_pw"){
        confirm_pw = element.value;
        Value_Check(element.name, pw.value, element.value)
            .then(result => {
                cpwc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "비밀번호가 일치합니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "비밀번호가 일치하지 않습니다.";
                }
                MessageBox_Check();
            });
    }
    else if(element.name === "nick_name"){
        const spaceBar = / /;
        if(spaceBar.test(element.value)){
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "공백은 별명에 사용할 수 없습니다.";
            MessageBox_Check();
            return;
        }
        else{
            Value_Check(element.name, element.value, null)
            .then(result => {
                nnc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 별명입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "중복된 별명입니다.";
                }
                MessageBox_Check();
            });
        }
    }
    else if (element.name === "phone_num") {
        element.value = element.value.replace(/[^0-9]/g, '');
        const changeLength = document.getElementById("phone_num");
        
        if (element.value.startsWith("02")) {
            changeLength.maxLength = 12;

            element.value = element.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/(\-{1,2})$/g, "");
        } else {
            changeLength.maxLength = 13;

            element.value = element.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/(\-{1,2})$/g, "");
        }
        
        Value_Check(element.name, element.value, null)
        .then(result => {
            pnc = result;
            if(result){
                img.src = "Image/check.png";
                textNode.nodeValue = "사용 가능한 번호입니다.";
            }
            else{
                img.src = "Image/dcheck.png";
                textNode.nodeValue = "사용 불가능한 번호입니다.";
            }
            MessageBox_Check();
        });
    }
    else if (element.name === "email") {
        const spaceBar = / /;
        if(spaceBar.test(element.value)){
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "공백은 이메일에 사용할 수 없습니다.";
            MessageBox_Check();
            return;
        }
        else {
            Value_Check(element.name, element.value, null)
            .then(result => {
                emc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 이메일입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용할 수 없는 이메일입니다.";
                }
                MessageBox_Check();
            });
        }
    }
    else if (element.name === "address") {
        Value_Check(element.name, element.value, null)
            .then(result => {
                adc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 주소입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용 불가능한 주소입니다.";
                }
                MessageBox_Check();
            });
    }
    else if (element.value === "expert") {
        alert("안전 전문가는 승인을 받아야 로그인할 수 있습니다.");
        return;
    }

    if(pw.value !== confirm_pw.value && pw.value !== null && confirm_pw.value !== null){
        cpwc = false;
    }
    else{
        cpwc = true;
    }
}

function Exit_Check(){
    window.onbeforeunload = function(){
        return '변경사항이 저장되지 않을 수 있습니다.';
    }
}
function Value_Check(name, value1, value2) {
    return new Promise((resolve, reject) => {
        fetch('/check-input', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, value1, value2 })
        })
            .then(response => response.json())
            .then(data => {
                const result = data.result;
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function All_Values_Check(){
    if(pwc || cpwc){
        return true;
    }
    alert('수정을 완료할려면 비밀번호 확인을 입력해주세요.');
    return false;
}

function showImageContent(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var imageContainer = document.querySelector('.expertProfileImage');
            imageContainer.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}