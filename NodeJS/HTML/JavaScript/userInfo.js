function userInfoInit(){
    const id = document.getElementById('id');
    const pw = document.getElementById('pw');
    const nick_name = document.getElementById('nick_name');
    const phone_num = document.getElementById('phone_num');
    const email = document.getElementById('email');
    const address = document.getElementById('address');

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
