// express 모듈 셋팅
const express = require("express");
const router = express.Router(); // express의 Router로 사용할 수 있게 해준다.

// app은 app.js가 가져갔으니 이제 router를 써야한다.
router.use(express.json()); // http 외의 모듈을 사용할 때 써줘야 한다.

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함 (primaryb  key로 사용)

// 로그인
router.post("/login", function (req, res) {
  console.log(req.body);

  // userId가 db에 저장된 회원인지 확인
  const { userId, password } = req.body;
  var loginUser = {};

  // 메서드 추출해보기
  db.forEach(function (user, id) {
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  // userId 값을 찾았을 때
  if (isExist(loginUser)) {
    // pwd도 맞는지 비교
    if (loginUser.password === password) {
      res.status(200).json({
        message: `${loginUser.name}님 로그인 되었습니다.`,
      });
    } else {
      res.status(400).json({
        message: `비밀번호가 틀렸습니다.`,
      });
    }
  } else {
    res.status(404).json({
      message: `회원정보가 없습니다.`,
    });
  }
});

function isExist(obj) {
  if (Object.keys(obj).length) {
    return true;
  } else {
    return false;
  }
}

// 회원가입
router.post("/join", function (req, res) {
  console.log(req.body);

  if (req.body) {
    const { userId } = req.body;
    console.log(userId);
    db.set(userId, req.body);

    res.status(201).json({
      message: `${db.get(userId).name}님 환영합니다.`,
    });
  } else {
    res.status(400).json({
      message: "입력 값을 다시 확인해주세요.",
    });
  }
});

router
  .route("/users")
  // 회원 개별 조회
  .get(function (req, res) {
    let { userId } = req.body;

    const user = db.get(userId);
    console.log(user);
    if (user) {
      res.status(200).json({
        userId: user.userId,
        name: user.name,
      });
    } else {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    }
  })
  // 회원 개별 삭제
  .delete(function (req, res) {
    let { userId } = req.body;

    const user = db.get(userId);
    if (user) {
      db.delete(id);
      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다.`,
      });
    } else {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    }
  });

module.exports = router;
