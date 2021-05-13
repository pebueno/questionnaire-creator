const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const envios = [
  {
    Titulo: "Provas de matematica",
    Pergunta: ["Calculo 2 foi dificil?", "Como foi seu ciclo basico?"],
    Usuario: "Pedro",
    Data_de_cadastro: "12/5/2021, 08:02:05",
    Disponibilidade: true,
  },
  {
    Titulo: "Design UX-UI",
    Pergunta: ["A interface e responsiva?"],
    Usuario: "Fernanda",
    Data_de_cadastro: "12/5/2021, 08:22:31",
    Disponibilidade: true,
  },
  {
    Titulo: "Versionamento em dia",
    Pergunta: [
      "Quais sao as melhores praticas ao versionar seu codigo?",
      "O que e branch no Git?",
    ],
    Usuario: "Isabela",
    Data_de_cadastro: "12/5/2021, 08:27:03",
    Disponibilidade: true,
  },
];

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home", {
    envios: envios,
  });
});

app.get("/questionarios", function (req, res) {
  res.json(envios);
});

app.get("/questionarios/:temp", function (req, res) {
  const tituloRequisitado = req.params.temp;

  envios.forEach(function (questionario) {
    const tituloArmazenado = questionario.Titulo;
    if (tituloArmazenado === tituloRequisitado) {
      res.render("questionario", {
        title: questionario.Titulo,
        listaDePerguntas: questionario.Pergunta,
      });
    }
  });
});

app.get("/criar", function (req, res) {
  res.render("criar");
});

app.post("/criar", function (req, res) {
  const titulo = req.body.tituloQuestionario;
  const usuario = req.body.usuarioQuestionario;
  const data = new Date().toLocaleString("pt-BR");
  const novasPerguntas = req.body.novaPergunta;
  var perguntas = [];
  novasPerguntas.forEach(function (value) {
    perguntas.push(value);
  });
  const questionario = {
    Titulo: titulo,
    Pergunta: perguntas,
    Usuario: usuario,
    Data_de_cadastro: data,
    Disponibilidade: true,
  };
  const jsonData = JSON.stringify(questionario);
  console.log(jsonData);
  envios.push(questionario);
  res.redirect("/");
});

const respostas = [];
app.post("/responder", function (req, res) {
  const titulo = req.body.tituloQuestionario;
  // const pergunta = req.body.perguntaQuestionario;
  const resposta = req.body.respostaQuestionario;
  const data = new Date().toLocaleString("pt-BR");
  const lat = req.body.LAT;
  const long = req.body.LONG;

  const maisResposta = req.body.novaResposta;
  respostas.push(maisResposta);
  var respostasFiltradas = respostas.filter(function (el) {
    return el != null;
  });
  // console.log(resposta);
  const questionarioRespondido = {
    Disponibilidade: false,
    Resposta: resposta || respostasFiltradas,
    Data: data,
    Localizacao: {
      Latitude: lat,
      Longitude: long,
    },
  };

  for (index = 0; index < envios.length; index++) {
    if (envios[index].Titulo === titulo) {
      const newTest = { ...envios[index], ...questionarioRespondido };
      envios[index] = newTest;
    }
  }
  // console.log(envios);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Servidor rodando em http://localhost:3000");
});
