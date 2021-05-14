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
    Status: "Disponível",
    Id: "Provasdematematica",
    Posicao: 1,
  },
  {
    Titulo: "Design UX-UI",
    Pergunta: ["A interface e responsiva?"],
    Usuario: "Fernanda",
    Data_de_cadastro: "12/5/2021, 08:22:31",
    Disponibilidade: true,
    Status: "Disponível",
    Id: "DesignUX-UI",
    Posicao: 2,
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
    Status: "Disponível",
    Id: "Versionamentoemdia",
    Posicao: 3,
  },
  {
    Titulo: "Prove",
    Pergunta: ["Calculo 2 foi dificil?", "Como foi seu ciclo basico?"],
    Usuario: "Pedro",
    Data_de_cadastro: "12/5/2021, 08:02:05",
    Disponibilidade: true,
    Status: "Disponível",
    Id: "Prove",
    Posicao: 4,
  },
];

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
const totalQuestionarios = envios.length;
  res.render("home", {
    envios: envios,
    total: totalQuestionarios,
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

function removeSpaces(text) {
  originalText = text;
  newText = originalText.replace(/ /g, "");
  return newText;
}


app.post("/criar", function (req, res) {
  const titulo = req.body.tituloQuestionario;
  const usuario = req.body.usuarioQuestionario;
  const data = new Date().toLocaleString("pt-BR");
  const novasPerguntas = req.body.novaPergunta;
  var perguntas = [];
  novasPerguntas.forEach(function (value) {
    perguntas.push(value);
  });
  const id = removeSpaces(req.body.tituloQuestionario);
  let counter = 1;
  for (let i = 0; i < envios.length; i++) {
    if (envios[i].status === "Disponível" || "Indisponível") counter++;
  }
  const questionario = {
    Titulo: titulo,
    Pergunta: perguntas,
    Usuario: usuario,
    Id: id,
    Posicao: counter,
    Data_de_cadastro: data,
    Disponibilidade: true,
    Status: "Disponível",
  };
  // const jsonData = JSON.stringify(questionario);
  // console.log(jsonData);
  console.log(questionario);
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
    Status: "Indisponível",
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
let port = 9000

app.listen(port, function () {
  console.log("Servidor rodando em http://localhost:" + port);
});
