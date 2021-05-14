const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const envios = [
  {
    Titulo: "Plantacao de milho",
    Pergunta: ["Ja verificou se o milha passa no teste?", "Qual e a extensao do seu milharal?"],
    Usuario: "Pedro",
    Data_de_cadastro: "12/5/2021, 08:02:05",
    Disponibilidade: true,
    Status: "Disponível",
    Id: "Plantacaodemilho",
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
    Titulo: "Gestão de rebanho",
    Pergunta: [
      "Seu gado tem chip?",
      "Qual e a quantidade do seu gado?",
    ],
    Usuario: "Isabela",
    Data_de_cadastro: "12/5/2021, 08:27:03",
    Disponibilidade: true,
    Status: "Disponível",
    Id: "Gestãoderebanho",
    Posicao: 3,
  },
  {
    Titulo: "Extensão territorial",
    Pergunta: ["Quantos metros quadrados tem sua fazenda?", "Qual é area útil do seu território?"],
    Usuario: "Pedro",
    Data_de_cadastro: "12/5/2021, 08:02:05",
    Disponibilidade: true,
    Status: "Disponível",
    Id: "Extensãoterritorial",
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
  const perguntas = [];
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
  console.log(questionario);
  envios.push(questionario);
  res.redirect("/");
});

app.post("/responder", function (req, res) {
  const titulo = req.body.tituloQuestionario;
  const data = new Date().toLocaleString("pt-BR");
  const lat = req.body.LAT;
  const long = req.body.LONG;
  const novasRespostas = req.body.novaResposta;
  const respostas = [];
  novasRespostas.forEach(function (value) {
    respostas.push(value);
  });
  const questionarioRespondido = {
    Disponibilidade: false,
    Resposta: respostas,
    Data_de_resposta: data,
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
  res.redirect("/");
});
let port = 9000

app.listen(port, function () {
  console.log("Servidor rodando em http://localhost:" + port);
});
