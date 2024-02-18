// (1) 必要なパッケージをインポートする
const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Prisma Clientを読み込む
const calc = require('./src/service/calcService');

// (2) 新しくインスタンスをつくる
const prisma = new PrismaClient();
const app = express(); // アプリのインスタンス

// (3) Expressアプリケーションにミドルウェアを追加
// HTTPリクエストのボディを解析してJSONとして利用できるようにする
// このように書くことで、JSON形式で送信されたPOSTリクエストのデータを扱うことができる
app.use(express.json());

// (4) Expressアプリケーションをポート3000で起動する。サーバーが起動したら、コンソールにメッセージを表示する。
app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
);

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  res.json(user);
});

app.get('/calc/ticket/:boxNum/', async (req, res) => {
  const { boxNum } = req.params;
  const calcItem = calc(boxNum, true);
  res.json({requireItem: calcItem});
});

app.get('/calc/noTicket/:boxNum/', async (req, res) => {
  const { boxNum } = req.params;
  const calcItem = calc(boxNum, false);
  res.json(calcItem);
});

app.post('/user', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });
  res.json(user);
});

app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email },
  });
  res.json(user);
});

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({ where: { id: Number(id) } });
  res.json(user);
});