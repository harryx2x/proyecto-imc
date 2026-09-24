const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // sirve frontend/index.html en la raíz

function clasificar(imc) {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidad";
}

function recomendaciones(cat) {
  const map = {
    "Bajo peso": ["Aumenta calorías con alimentos densos en nutrientes.", "Suma proteína en cada comida.", "Entrenamiento de fuerza."],
    "Peso normal": ["Mantén alimentación variada.", "150 min/semana de actividad moderada.", "Chequeos periódicos."],
    "Sobrepeso": ["Reduce ultraprocesados.", "Actividad física progresiva.", "Evita dietas extremas."],
    "Obesidad": ["Consulta un profesional de salud.", "Cambios sostenibles.", "Actividad de bajo impacto."]
  };
  return map[cat];
}

app.get('/api/health', (req, res) => res.json({ status: "ok" }));

app.post('/api/imc', (req, res) => {
  const { peso, altura } = req.body; // kg, cm
  if (!peso || !altura) return res.status(400).json({ error: "Faltan datos" });
  const a = altura / 100;
  const imc = +(peso / (a * a)).toFixed(1);
  const categoria = clasificar(imc);
  res.json({ imc, categoria, recomendaciones: recomendaciones(categoria) });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
