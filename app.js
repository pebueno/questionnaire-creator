const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const startingContent = {
  Titulo_criado: "Provas de matematica",
  Usuario: "Pedro",
  Dados: "5/12/2021, 12:02:05 PM",
};

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/criar", function (req, res) {
  res.sendFile(__dirname + "/criar.html");
});

app.post("/login", function (req, res) {
  const usuario = req.body.usuarioQuestionario;
  console.log(usuario);
  res.redirect("criar");
});

app.post("/criar", function (req, res) {
  const titulo = req.body.tituloQuestionario;
  // const usuario = req.body.usuarioQuestionario;
  const data = new Date().toLocaleString("pt-BR");

  const questionario = {
    Titulo_criado: titulo,
    Usuario: usuario,
    Dados: data,
  };

  const jsonData = JSON.stringify(questionario);
  console.log(jsonData);
});

app.post("/responder", function (req, res) {
  const titulo = req.body.tituloQuestionario;
  const usuario = req.body.usuarioQuestionario;
  const data = new Date().toLocaleString("pt-BR");

  const questionario = {
    Titulo_criado: titulo,
    Usuario: usuario,
    Dados: data,
  };

  const jsonData = JSON.stringify(questionario);
  console.log(jsonData);
});

app.listen(3000, function () {
  console.log("Servidor rodando em http://localhost:3000");
});
