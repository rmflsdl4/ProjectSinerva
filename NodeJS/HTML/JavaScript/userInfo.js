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

        userInfo.then(data => {
            if (loginUser.userType === 'user') {
                id.value = data[0].id;
                pw.value = data[0].pw;
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
            } 
            else if (loginUser.userType === 'expert') {
                nick_name.placeholder = data[0].name;
                phone_num.placeholder = data[0].phone_num;
                email.placeholder = data[0].email;
                address.placeholder = data[0].address;
            }
            else {
                console.log('nope');
            }
        });
    });
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
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
