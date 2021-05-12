const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = {
  Pergunta: "Provas de matematica",
  Usuario: "Pedro",
  Data_de_cadastro: "12/5/2021, 08:02:05",
};

const envios = [
  {
    Pergunta: "Provas de matematica",
    Usuario: "Pedro",
    Data_de_cadastro: "12/5/2021, 08:02:05",
    Disponibilidade: true,
  },
  {
    Pergunta: "Provas de UX-UI",
    Usuario: "Fernanda",
    Data_de_cadastro: "12/5/2021, 08:22:31",
    Disponibilidade: true,
  },
  {
    Pergunta: "Versionamento em dia",
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
    startingContent: homeStartingContent,
    envios: envios,
  });
});

app.get("/questionarios", function (req, res) {
  res.json(envios);
});

app.get("/questionarios/:temp", function (req, res) {
  const perguntaRequisitado = req.params.temp;

  envios.forEach(function (questionario) {
    const perguntaArmazenado = questionario.Pergunta;
    if (perguntaArmazenado === perguntaRequisitado) {
      res.render("questionario", {
        title: questionario.Pergunta,
      });
    }
  });
  // console.log(req.params.Pergunta);
});

app.get("/criar", function (req, res) {
  res.render("criar");
});

// app.post("/login", function (req, res) {
//   var usuario = req.body.usuarioQuestionario;
//   console.log(usuario);
//   res.redirect("criar");
//   app.get("/criar", function (req, res) {
//     res.render("criar", {
//       Usuario: usuario,
//     });
//   });
// });

app.post("/criar", function (req, res) {
  const pergunta = req.body.perguntaQuestionario;
  const usuario = req.body.usuarioQuestionario;
  const data = new Date().toLocaleString("pt-BR");

  const questionario = {
    Pergunta: pergunta,
    Usuario: usuario,
    Data_de_cadastro: data,
    Disponibilidade: true,
  };
  const jsonData = JSON.stringify(questionario);
  console.log(jsonData);
  envios.push(questionario);
  res.redirect("/");
});

app.post("/responder", function (req, res) {
  const pergunta = req.body.perguntaQuestionario;
  const resposta = req.body.respostaQuestionario;
  const data = new Date().toLocaleString("pt-BR");
  const lat = req.body.LAT;
  const long = req.body.LONG;
  // const disponibilidade = req.body.disponibilidadeQuestionario;

  console.log(resposta);
  const questionarioRespondido = {
    Disponibilidade: false,
    Resposta: resposta,
    Data: data,
    Localizacao: {
      Latitude: lat,
      Longitude: long,
    },
  };

  for (index = 0; index < envios.length; index++) {
    // console.log(envios[index]);
    if (envios[index].Pergunta === pergunta) {
      const newTest = { ...envios[index], ...questionarioRespondido };
      // envios[index].Disponibilidade = { Disponibilidade: false };
      // console.log(envios[index].Disponibilidade);
      envios[index] = newTest;
      // console.log(newTest);
    }
  }

  const jsonData = JSON.stringify(questionarioRespondido);
  console.log(envios);

  res.redirect("/");
});
// var test = envios.includes("Pedro");
// if (envios.some((e) => e.Usuario === "Pedro")) {
//   /* vendors contains the element we're looking for */
//   console.log("Tem sim");
// }

app.listen(3000, function () {
  console.log("Servidor rodando em http://localhost:3000");
});
