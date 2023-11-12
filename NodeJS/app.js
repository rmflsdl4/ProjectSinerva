// 사용 모듈 로드
const express = require('express');
const session = require('express-session');
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');
const login = require('./JavaScript/Login.js');
const findAccount = require('./JavaScript/Find.js');
const database = require('./database.js');
const setInterval = require('timers').setInterval;
const tf = require('./JavaScript/tfjsNode.js');
const MemoryStore = require('memorystore')(session);
const MainSys = require('./JavaScript/MainSys.js');
const reqComment = require('./JavaScript/reqComment.js');
//유저 기능
var bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const changeUserInfo = require('./JavaScript/changeUserInfo.js');
//관리자 기능
const AdminSys = require('./JavaScript/AdminSys.js');


// 데이터베이스 연결
database.Connect();
// 모듈에서 사용할 로직들
const app = express();
var fs = require('fs');

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
    store: new MemoryStore({
        checkPeriod: 86400000,
    }),
}));

// 서버 구동
app.listen(3000, function(){
    console.log('서버 구동');
});

// 서버 오류 처리
process.on('uncaughtException', (err) => {
    console.error('오류가 발생했습니다:', err);
  
    database.Close();
    
    process.exit(1); // 0이 아닌 값은 비정상적인 종료를 나타냄
});


// 라우팅 설정

app.get('/', function(req, res){
    fs.readFile('HTML/Main.html', function(error, data){
        if(error){
            console.log(error);
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
});
// 회원가입 입력값 검사 및 계정 찾기 입력값 검사
app.post('/check-input', (req, res) => {
    const { name, value1, value2 } = req.body;
    
    // 분기별로 처리 로직 수행
    if (name === 'id') {                //회원가입 분기
        normalization.ID_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'pw') {
        normalization.PW_Check(value1, value2)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'confirm_pw') {
        normalization.Confirm_Pw_Check(value1, value2)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'nick_name') {
        //console.log(value1);
        normalization.Nick_Name_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'phone_num') {
        //console.log(value1);
        normalization.Phone_Num_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'email') {
        //console.log(value1);
        normalization.Email_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'address') {
        //console.log(value1);
        normalization.Address_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findId') {         //계정 찾기 분기
        //console.log(value1);
        normalization.FindId_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findNickName') {
        //console.log(value1);
        normalization.FindNickName_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findPhone_num') {
        //console.log(value1);
        normalization.FindPhone_num_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findEmail') {
        //console.log(value1);
        normalization.FindEmail_Check(value1)
            .then(result => {
                res.json({ result });
            });
    }
});
//회원가입
app.post('/sign-up', (req, res) => {
    const { id, pw, nick_name, phone_num, email, address, userType} = req.body;

    try{
        signup.Add_User(id, pw, nick_name, phone_num, email, address, userType);
    
        console.log(`신규 회원 정보 [ ID - ${id} / NAME - ${nick_name} / userType - ${userType} ]`);

        res.send("<script>alert('회원가입이 완료되었습니다.'); location.href='Login.html';</script>");
    }
    catch(error){
        console.error('회원가입 오류:', error);
        res.status(500).send("<script>alert('회원가입에 실패하였습니다.'); location.href='SignUp.html';</script>");
    }
});
//로그인
app.post('/login', (req, res) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;

    const { id, pw } = req.body;

    login.Login(id, pw)
        .then((arr) => {
            const state = arr[0];
            const userType = arr[1];
            const waitOk = arr[2];
            if(state === 1 && waitOk === 1){
                req.session.userId = id;
                req.session.userType = userType;
                console.log(`세션 유저 저장 값: ${req.session.userId}`);
                console.log(`세션 타입 저장 값: ${req.session.userType}`);
                res.send("<script>alert('로그인에 성공하였습니다.'); location.href='Main.html';</script>");
            }
            else{
                if (waitOk === 0) {
                    res.send("<script>alert('승인 대기중입니다.'); location.href='Main.html';</script>");
                }
                else {
                    res.send("<script>alert('로그인에 실패하였습니다.'); location.href='Login.html';</script>");
                }
            }
        })
        .catch(error => {
            res.send("<script>alert('로그인에 실패하였습니다.'); location.href='Login.html';</script>");
        });
})
//로그아웃
app.post('/logout', (req, res) => {
    delete req.session.userId;
    delete req.session.userType;

    res.send("<script>alert('로그아웃 되었습니다.'); location.href='Main.html';</script>");
})
//계정찾기
app.post('/findAccount', (req,res) => {
    const { findId, findNickName, userType, findPhone_num, findEmail } = req.body;

    if (findNickName) {
        findAccount.FindId( findNickName, userType, findPhone_num, findEmail )
        .then((arr) => {
            const userId = arr[0];
            const userNickName = arr[1];

            if(userId !== null && userNickName !== null){
                console.log(`ID: ${userId}`);
                console.log(`Nick_Name: ${userNickName}`);
                const message = `${userNickName}님의 계정을 찾았습니다.
ID: ${userId}입니다.`;
                res.json({ message });
            }
            else{
                const message = `계정을 찾을 수 없습니다.`;
                res.json({ message });
            }
        })
    }
    else if (findId) {
        findAccount.FindPw( findId, userType, findPhone_num, findEmail )
        .then((arr) => {
            const userPw = arr[0];
            const userNickName = arr[1];

            if(userPw !== null && userNickName !== null){
                console.log(`PW: ${userPw}`);
                console.log(`Nick_Name: ${userNickName}`);
                const message = `${userNickName}님의 계정을 찾았습니다.
PW: ${userPw}입니다.`;
                res.json({ message });
            }
            else{
                const message = `계정을 찾을 수 없습니다.`;
                res.json({ message });
            }
        })
    }
})
//모든 유저 가져옴
app.post('/users-import', async (req, res) => {
	const data = await AdminSys.get_users();
	
    res.send(data);
})

//로그인한 유저 반환
app.post('/login-user', async (req, res) => {
    const userId = req.session.userId;
    const userType = req.session.userType;
	
    res.send({ userId, userType });
})

// **이미지 파일 폴더에 저장**
const IMAGE_NUMBER_FILE = './image_number.txt';
let dataTime;
let folder;
let buildingName;

// 이미지 번호 파일에서 읽어오기
try {
    const data = fs.readFileSync(IMAGE_NUMBER_FILE, 'utf8');
    imageNumber = parseInt(data);
} catch (err) {
    console.error('이미지 번호 파일을 읽어올 수 없습니다. 이미지 번호는 0으로 초기화됩니다.');
}
  
let randomNumbers = new Set();

function InitSet() {
    randomNumbers = new Set();
    console.log(`세트 초기화! 현재 세트 길이: ${randomNumbers.size}`);
}
setInterval(InitSet, 60000);

let randomNumber = 0; // 랜덤 값 변수 초기화

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1이 필요하며, 두 자리로 포맷
        const day = date.getDate().toString().padStart(2, '0'); // 일은 두 자리로 포맷
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const userId = req.session.userId;
        
        console.log("고유 넘버: " + randomNumber);
        dataTime = `${year}${month}${day}${hour}${minute}${randomNumber}`;
        console.log("전체 경로: " + dataTime + randomNumber);
        folder = `images/${userId}/${buildingName}/${dataTime}/`;

        // 해당 유저 아이디 폴더가 없으면 생성
        if (!fs.existsSync(`images/${userId}`)) {
            fs.mkdirSync(`images/${userId}`, { recursive: true });
        }

        // 해당 건물명 폴더가 없으면 생성
        if (!fs.existsSync(`images/${userId}/${buildingName}`)) {
            fs.mkdirSync(`images/${userId}/${buildingName}`, { recursive: true });
        }

        // 해당 날짜 폴더가 없으면 생성
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        // 이미지 파일을 해당 날짜 폴더에 저장
        cb(null, folder);
    }, 
    filename: (req, file, cb) => {
        // 이미지 번호 증가
        imageNumber++;
        console.log(file)
        cb(null, "img" + imageNumber + path.extname(file.originalname))

        // 이미지 번호 파일에 업데이트
        fs.writeFileSync(IMAGE_NUMBER_FILE, imageNumber.toString(), 'utf8');
    }
});

const upload = multer({storage: storage});

app.use('/images', express.static('./images/'));

// 검사 페이지 건물명 입력
app.post("/buildingNameInput", async (req, res) => {
    buildingName = req.body.buildingName;
    const query = 'SELECT COUNT(*) as count FROM building WHERE address = ? AND user_id = ?';
    const values = [buildingName, req.session.userId];
    const result = await database.Query(query, values);
    if(!result[0].count){
        const query = 'INSERT INTO building(address, user_id) VALUES (?, ?)';
        const values = [buildingName, req.session.userId];
        await database.Query(query, values);
    }

    console.log(buildingName);
    res.send();
})


// 검사 페이지 이미지 업로드
app.post('/image-discrimination', upload.array('images'), async (req, res) => {
    do {
        randomNumber = Math.floor(Math.random() * 10000) + 1;
    } while (randomNumbers.has(randomNumber));
    randomNumbers.add(randomNumber);
    console.log(`현재 세트에 추가된 값: ${randomNumber}`);
    console.log(`현재 세트의 크기: ${randomNumbers.size}`);
    // req.files는 업로드한 파일에 대한 정보를 가지고 있는 배열
    const uploadTasks = req.files.map(async (file) => {
        // console.log('업로드한 파일 이름:', file.originalname);
        // console.log('서버에 저장된 파일 이름:', file.filename);
        
        const building_query = 'SELECT id FROM building WHERE address = ? AND user_id = ?';
        const building_values = [buildingName, req.session.userId];
        let building_num = await database.Query(building_query, building_values);
        const img_query = 'INSERT INTO image(file_route, upload_date, building_id, user_id) VALUES (?, ?, ?, ?)';
        let image_route = folder + file.filename;
        const img_values = [image_route, dataTime, building_num[0].id, req.session.userId];
        await database.Query(img_query, img_values);
        await tf.Predict(image_route, file.filename);

        return Promise.resolve(); 
    });
    try {
        await Promise.all(uploadTasks);
        console.log(req.session.userId + " 사용자 검사 완료!!");
        
        res.send(); // 응답을 보냅니다.
    }
    catch (error) {
        console.error(error);
        res.status(500).send("서버 오류 발생");
    }
});
// 과거 검사한 기록 select
app.post("/record", async (req, res) => {
    const query = `SELECT 
                        image.upload_date as upload_date,
                        count(*) as total,
                        SUM(CASE WHEN image.result = '정상' THEN 1 ELSE 0 END) AS normal_count,
                        SUM(CASE WHEN image.result <> '정상' THEN 1 ELSE 0 END) AS abnormality_count,
                        building.address as address,
                        commentRequest.reqDependingOn as reqDependingOn
                    FROM image
                    INNER JOIN building ON image.building_id = building.id
                    LEFT OUTER JOIN commentRequest ON image.img_id = commentRequest.img_id
                    WHERE image.user_id = ?
                    GROUP BY image.upload_date, building.address
                    ORDER BY image.upload_date DESC, building.address DESC`;

    const values = [req.session.userId];

    const result = await database.Query(query, values);

    console.log(result);

    res.send(result);
});
// 선택한 주소에 대한 레코들들만 불러오기
app.post("/selected-record", async (req, res) => {
    const {selectedAddress, MenuValue} = req.body;
    if(selectedAddress == ""){
        var sqlStr = "";
    }
    else{
        if(MenuValue === "전체보기") {
            var sqlStr = "AND (commentRequest.reqDependingOn IS NULL OR commentRequest.reqDependingOn = 'N') AND building.address = ?";
        }
        else if(MenuValue === "코멘트 요청완료") {
            var sqlStr = "AND commentRequest.reqDependingOn = 'Y' AND building.address = ?";
        }
        else {
            var sqlStr = "AND (commentRequest.reqDependingOn IS NULL OR commentRequest.reqDependingOn = 'N') AND building.address = ?";
        }
    }

    const query = `SELECT 
                        image.upload_date as upload_date,
                        count(*) as total,
                        SUM(CASE WHEN image.result = '정상' THEN 1 ELSE 0 END) AS normal_count,
                        SUM(CASE WHEN image.result <> '정상' THEN 1 ELSE 0 END) AS abnormality_count,
                        building.address as address,
                        commentRequest.reqDependingOn as reqDependingOn
                    FROM image
                    INNER JOIN building ON image.building_id = building.id
                    LEFT OUTER JOIN commentRequest ON image.img_id = commentRequest.img_id
                    WHERE image.user_id = ? ${sqlStr} 
                    GROUP BY image.upload_date, building.address
                    ORDER BY image.upload_date DESC, building.address DESC`;
        const values = [req.session.userId, selectedAddress];
        const result = await database.Query(query, values);

        res.send(result);
});

// 과거 검사한 기록 상세보기
app.post("/detailsRecord", async (req, res) => {
    const { date, buildingAddress } = req.body;

    console.log(date); // value 변수에 저장된 값 출력
    console.log(buildingAddress); // value 변수에 저장된 값 출력

    const query = `select image.img_id as img_id, image.upload_date as upload_date, image.file_route as file_route, image.result as result, commentRequest.comment as comment, expert.id as expert_id, expert.name as expert_name, expert.expert_route as expert_route
                    FROM image
                    INNER JOIN building ON image.building_id = building.id
                    LEFT OUTER JOIN commentRequest ON image.img_id = commentRequest.img_id
                    LEFT OUTER JOIN expert ON commentRequest.expert_id = expert.id
                    where image.upload_date = ? and image.user_id = ? and building.address = ?`;

    const values = [date, req.session.userId, buildingAddress];

    const result = await database.Query(query, values);
    
    console.log(result);

    res.send(result);
});
// 건물 테이블 select
app.post("/buildingSearch", async (req, res) => {
    const query = 'SELECT address FROM building WHERE user_id = ?';
    const values = [req.session.userId];
    const result = await database.Query(query, values);

    console.log(result);
    res.send(result);
})

// 건물명 종류 선택
app.post("/selectedBuildingSearch", async (req, res) => {
    const { MenuValue } = req.body;

    if(MenuValue === "전체보기") {
        var sqlStr = "";
    }
    else if(MenuValue === "코멘트 요청완료") {
        var sqlStr = "AND commentRequest.reqDependingOn = 'Y'";
    }
    else if(MenuValue === "코멘트 요청미완료") {
        var sqlStr = "AND (commentRequest.reqDependingOn IS NULL OR commentRequest.reqDependingOn = 'N')";
    }
    else {
        var sqlStr = "";
    }

    const query = `SELECT DISTINCT building.address as address
                        FROM building
                        INNER JOIN image ON building.id = image.building_id
                        LEFT OUTER JOIN commentRequest ON image.img_id = commentRequest.img_id
                        WHERE building.user_id = ? ${sqlStr}`;
    const values = [req.session.userId];
    const result = await database.Query(query, values);

    res.send(result);
})

app.post('/commitExpert', async (req, res) => {
    const { id } = req.body;
    try {
        await AdminSys.updateWaitOk(id);
        res.send();
    }
    catch(error){
        console.log(error);
    }
});

//유저 삭제
app.post('/deleteUser', async (req, res) => {
    const { id, userType } = req.body;
    try {
        await AdminSys.deleteUser(id, userType);
        res.send();
    }
    catch(error){
        console.log(error);
    }
});

//전문가 요청 수정
app.post('/unCommit', async (req, res) => {
    const { id } = req.body;
    try {
        await AdminSys.unCommit(id);
        res.send();
    }
    catch(error){
        console.log(error);
    }
});

// ** 전문가 사진 폴더에 저장 **
const EXPERT_IMAGE_NUMBER_FILE = './expert_image_number.txt';
let expertFolder;
let ExpertImageNumber;
let expertFileName = "";

// 이미지 번호 파일에서 읽어오기
try {
    const data = fs.readFileSync(EXPERT_IMAGE_NUMBER_FILE, 'utf8');
    ExpertImageNumber = parseInt(data);
} catch (err) {
    console.error('이미지 번호 파일을 읽어올 수 없습니다. 이미지 번호는 0으로 초기화됩니다.');
}

const exStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const expertId = req.session.userId;

        expertFolder = `ExpertImg/${expertId}/`;

        // 해당 전문가 아이디 폴더가 없으면 생성
        if (!fs.existsSync(`ExpertImg/${expertId}`)) {
            fs.mkdirSync(`ExpertImg/${expertId}`, { recursive: true });
        }

        // 이미지 파일을 해당 날짜 폴더에 저장
        cb(null, expertFolder);
    }, 
    filename: (req, file, cb) => {
        // 이미지 번호 증가
        expertFileName = "";
        ExpertImageNumber++;
        console.log(file);
        expertFileName += "img" + ExpertImageNumber + path.extname(file.originalname);
        cb(null, expertFileName);

        // 이미지 번호 파일에 업데이트
        fs.writeFileSync(EXPERT_IMAGE_NUMBER_FILE, ExpertImageNumber.toString(), 'utf8');
    }
});

const exUpload = multer({storage: exStorage});

app.use('/ExpertImg', express.static('./ExpertImg/'));

//정보수정 버튼을 누르면 실행
app.post('/changeCommit', exUpload.single('profile_picture'), async (req, res) => {
    const { id, pw, nick_name, phone_num, email, address, introduction} = req.body;
    // 파일 이름을 가져옵니다.
    console.log("폴더 : " + expertFolder);
    console.log("파일 이름 : " + expertFileName);
    let image_route = expertFolder + expertFileName;
    try{
        changeUserInfo.updateUserInfo(req.session.userId, req.session.userType, id, pw, nick_name, phone_num, email, address, introduction, image_route);
    
        if (id !== req.session.userId) {
            delete req.session.userId;
            req.session.userId = id;
        }

        res.send("<script>alert('정보수정이 완료되었습니다.'); location.href='changeUserInfo.html';</script>");
    }
    catch(error){
        console.error(error);
        res.status(500).send("<script>alert('잘못된 입력값이 있습니다.'); location.href='changeUserInfo.html';</script>");
    }
})

//로그인한 유저의 정보만 가져옴
app.post('/loginUserInfo', async (req, res) => {
    const { id, userType } = req.body;
	const data = await changeUserInfo.getUserInfo(id, userType);
	
    res.send(data);
})

//유저만 불러옴
app.post('/getUserInfo', async (req, res) => {
	const data = await MainSys.userInfo();
	
    res.send(data);
})

//전문가만 불러옴
app.post('/getExpertInfo', async (req, res) => {
	const data = await MainSys.expertInfo();
	
    res.send(data);
})

//모든 전문가 요청 가져옴
app.post('/reqCommentImport', async (req, res) => {
	const data = await reqComment.commentImport(req.session.userId);
	
    res.send(data);
})

//전문가 코멘트 요청 버튼을 누르면 실행
app.post('/reqAccept', async (req, res) => {
	const { imgUploadDate } = req.body;

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1이 필요하며, 두 자리로 포맷
    const day = date.getDate().toString().padStart(2, '0'); // 일은 두 자리로 포맷
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const userId = req.session.userId;
    dataTime = `${year}${month}${day}${hour}${minute}`;

    console.log("이미지 수락일자: " + dataTime);
    try {
        await reqComment.updateReqDependingOn(imgUploadDate, dataTime);
        res.send();
    }
    catch(error){
        console.log(error);
    }
})

//전문가 코멘트 거절 버튼을 누르면 실행
app.post('/reqDenied', async (req, res) => {
	const { imgUploadDate } = req.body;
    try {
        await reqComment.deleteReqDependingOn(imgUploadDate);
        res.send();
    }
    catch(error){
        console.log(error);
    }
})

app.post('/submitComment', async (req, res) => {
    const { imgId, value } = req.body;
    console.log(imgId, value);
    try {
        await reqComment.updateCommitComment(imgId, value);
        res.send();
    }
    catch(error){
        console.log(error);
    }
})

app.post('/seeMore', async (req, res) => {
    const { imgUploadDate } = req.body;
	const data = await reqComment.seeMore(imgUploadDate);
	
    res.send(data);
})

// 전문가 테이블 select
app.post("/expertSearch", async (req, res) => {
    const query = `SELECT e.id as expert_id, e.name AS name, e.phone_num AS phone_num, e.email AS email, e.address AS address, e.introduction, e.expert_route AS expert_route, COALESCE(ROUND(AVG(ue.rating), 1), 0) AS rating
                    FROM expert AS e
                    LEFT JOIN user_has_expert AS ue ON e.id = ue.expert_id
                    GROUP BY e.id`;
    const result = await database.Query(query);

    // console.log(result);
    res.send(result);
})

// 코멘트 요청 테이블 insert
app.post("/commentRequest", async (req, res) => {
    const { expertId, commentImgId, requestDate } = req.body;
    let value = 0;

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    dataTime = `${year}${month}${day}${hour}${minute}`;

    const query = 'SELECT COUNT(*) as count FROM commentRequest WHERE user_id = ? AND imgUploadDate = ?';

    const values = [req.session.userId, requestDate];
    const result = await database.Query(query, values);
    value += result[0].count;

    if (value === 0) {
        commentImgId.forEach(async (commentImgId) => {
            const query = `INSERT INTO commentRequest(img_id, user_id, expert_id, requestDate, imgUploadDate) VALUES (?, ?, ?, ?, ?)`;
            const values = [commentImgId, req.session.userId, expertId, dataTime, requestDate];
            await database.Query(query, values);
        });
        res.send('success');
    } else {
        res.send('duplicate');
    }
});

// 전문가 리스트 select
app.post("/expertList", async (req, res) => {
    const query = `SELECT e.name AS name, e.phone_num AS phone_num, e.email AS email, e.address AS address, e.introduction, e.expert_route AS expert_route, COALESCE(ROUND(AVG(ue.rating), 2), 0) AS rating
                    FROM expert AS e
                    LEFT JOIN user_has_expert AS ue ON e.id = ue.expert_id
                    where e.waitOk = 1
                    GROUP BY e.id`;

    const result = await database.Query(query);

    res.send(result);
});

// 사용자 코멘트 결과 확인
app.post("/commentResult", async (req, res) => {
    const { MenuValue } = req.body;
    
    if(MenuValue === "전체보기") {
        var sqlStr = "";
    }
    else if(MenuValue === "코멘트 요청완료") {
        var sqlStr = "AND commentRequest.reqDependingOn = 'Y'";
    }
    else {
        var sqlStr = "AND (commentRequest.reqDependingOn IS NULL OR commentRequest.reqDependingOn = 'N')";
    }

    const query = `SELECT 
                        image.upload_date as upload_date,
                        count(*) as total,
                        SUM(CASE WHEN image.result = '정상' THEN 1 ELSE 0 END) AS normal_count,
                        SUM(CASE WHEN image.result <> '정상' THEN 1 ELSE 0 END) AS abnormality_count,
                        building.address as address,
                        commentRequest.reqDependingOn as reqDependingOn
                    FROM image
                    INNER JOIN building ON image.building_id = building.id
                    LEFT OUTER JOIN commentRequest ON image.img_id = commentRequest.img_id
                    WHERE image.user_id = ? ${sqlStr}
                    GROUP BY image.upload_date, building.address
                    ORDER BY image.upload_date DESC, building.address DESC`;
        const values = [req.session.userId];
        const result = await database.Query(query, values);

        res.send(result);
});

// 전문가 평가 점수 insert
app.post("/ratingInput", async (req, res) => {
    const { starRating, requestDate } = req.body;
    let value = 0;
    
    const query = `select expert_id
                    from commentRequest
                    where imgUploadDate = ? and user_id = ?
                    group by imgUploadDate`;
    const values = [requestDate, req.session.userId];
    const result = await database.Query(query, values);
    let expertId = result[0].expert_id;

    // 이미 평가한 전문가인지 확인
    const duplQuery = 'SELECT COUNT(*) as count FROM user_has_expert WHERE user_id = ? AND imgUploadDate = ?';
    const duplValues = [req.session.userId, requestDate];
    const duplResult = await database.Query(duplQuery, duplValues);
    value += duplResult[0].count;
    console.log(value);

    if (value === 0) {
        const inQuery = `insert into user_has_expert(user_id, expert_id, imgUploadDate, rating) values(?, ?, ?, ?)`;
        const inValues = [req.session.userId, expertId, requestDate, starRating];
        await database.Query(inQuery, inValues);
        res.send('success');
    } else {
        res.send('duplicate');
    }
});