// express 모듈 셋팅
const express = require("express");
const app = express();
app.use(express.json()); // http 외의 모듈을 사용할 때 써줘야 한다.
app.listen(7777);

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함 (primaryb  key로 사용)

app
  .route("/channels")

  // 채널 전체 조회
  .get((req, res) => {
    // json 형태로 배열을 만든 것.
    var channels = [];

    if (db.size) {
      db.forEach(function (value, key) {
        channels.push(value);
      });

      res.status(200).json(channels);
    } else {
      res.status(404).json({
        message: "조회할 채널이 없습니다.",
      });
    }
  })

  // 채널 개별 생성
  .post((req, res) => {
    if (req.body.channelTitle) {
      db.set(id++, req.body);

      res.status(201).json({
        message: `${db.get(id - 1).channelTitle} 채널을 응원합니다!`,
      });
    } else {
      res.status(400).json({
        message: `요청 값을 제대로 보내주세요.`,
      });
    }
  });

app
  .route("/channels/:id")
  // 채널 개별 조회
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    if (channel) {
      res.status(200).json(channel);
    } else {
      res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다.",
      });
    }
  })
  // 채널 개별 수정
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    var oldTitle = channel.channelTitle;

    if (channel) {
      var newTitle = req.body.channelTitle;
      channel.channelTitle = newTitle;
      db.set(id, channel);
      res.status(200).json({
        message: `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle} -> 수정 ${newTitle}`,
      });
    } else {
      res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다.",
      });
    }
  })
  // 채널 개별 삭제
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    if (channel) {
      db.delete(id);
      res.status(200).json({
        message: `${channel.channelTitle}님이 정상적으로 삭제되었습니다.`,
      });
    } else {
      res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다.",
      });
    }
  });
