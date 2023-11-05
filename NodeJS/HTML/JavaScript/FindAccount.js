let idc, nnc, pnc, emc;

function Input_Check(element){
    Input_Data_Check_To_Submit();
    // 패턴 체크
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
    if(element.name === "findId"){
        Value_Check(element.name, element.value, null)
            .then(result => {
                idc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "잘못된 입력값입니다.";
                }
                MessageBox_Check();
            });
    }
    else if(element.name === "findNickName"){
        const spaceBar = / /;
        if(spaceBar.test(element.value)){
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "공백을 사용할 수 없습니다.";
            MessageBox_Check();
            return;
        }
        else{
            Value_Check(element.name, element.value, null)
            .then(result => {
                nnc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "잘못된 입력값입니다.";
                }
                MessageBox_Check();
            });
        }
    }
    else if (element.name === "findPhone_num") {
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
            console.log(result);
            if(result){
                img.src = "Image/check.png";
                textNode.nodeValue = "";
            }
            else{
                img.src = "Image/dcheck.png";
                textNode.nodeValue = "잘못된 입력값입니다.";
            }
            MessageBox_Check();
        });
    }
    else if (element.name === "findEmail") {
        const spaceBar = / /;
        if(spaceBar.test(element.value)){
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "공백을 사용할 수 없습니다.";
            MessageBox_Check();
            return;
        }
        else {
            Value_Check(element.name, element.value, null)
            .then(result => {
                emc = result;
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "잘못된 입력값입니다.";
                }
                MessageBox_Check();
            });
        }
    }
}
function InitForm(){
    let arr = document.getElementsByTagName("input");
    
    for(let i = 0; i < arr.length; i++){
        arr[i].style.marginBottom = "10px";
    }
    Exit_Check();
}
function Exit_Check(){
    window.onbeforeunload = function(){
        return '변경사항이 저장되지 않을 수 있습니다.';
    }
}
function Input_Data_Check_To_Submit(){
    let inputData = document.getElementsByTagName("input");
    let submitButton = document.getElementById("find") ? document.getElementById("find"):document.getElementById("login");

    for(let i = 0; i < inputData.length; i++){
        if(inputData[i].value === ""){
            if (i == 0 || i == 2 || i == 3) {
                continue;
            }
            else if (i == 1 || i == 2 || 3) {
                continue;
            }
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#347236";
            return;
        }
    }
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#4CAF50";
    submitButton.style.cursor = "pointer";
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
    if(idc || nnc){
        return true;
    }
    alert('입력값을 다시 확인해 주세요.');
    return false;
}

function ShowAccountInfo() {
    const findId = document.getElementById('id').value;
    const findNickName = document.getElementById('nick_name').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const findPhone_num = document.getElementById('phone_num').value;
    const findEmail = document.getElementById('email').value;

    fetch('/findAccount', {
        method: 'POST',
        body: JSON.stringify({ findId, findNickName, userType, findPhone_num, findEmail }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('오류 발생:', error);
    });

    event.preventDefault();
}

//아이디와 비밀번호 구분
function Find_Select(type) {
    var idButton = document.querySelector(".findAc:nth-child(1)");
    var psButton = document.querySelector(".findAc:nth-child(2)");
    var messageBox = document.querySelectorAll('.MessageBox');

    if (type === 'id') {
        document.getElementById('id').style.display = 'none';
        document.getElementById('nick_name').style.display = 'block';
        document.getElementById('phone_num').style.display = 'block';
        document.getElementById('email').style.display = 'block';
        idButton.style.opacity = 1;
        psButton.style.opacity = 0.5;
    }
    else if (type === 'ps') {
        document.getElementById('id').style.display = 'block';
        document.getElementById('nick_name').style.display = 'none';
        document.getElementById('phone_num').style.display = 'block';
        document.getElementById('email').style.display = 'block';
        idButton.style.opacity = 0.5;
        psButton.style.opacity = 1;
    }

    if (type === 'id' || type === 'ps') {
        messageBox.forEach(function(messageBox) {
            messageBox.remove();
        });
        document.getElementById('id').value = '';
        document.getElementById('nick_name').value = '';
        document.getElementById('phone_num').value = '';
        document.getElementById('email').value = '';
        document.getElementById('id').style.marginBottom = '10px';
        document.getElementById('nick_name').style.marginBottom = '10px';
        document.getElementById('phone_num').style.marginBottom = '10px';
        document.getElementById('email').style.marginBottom = '10px';
    }
}