function calcularPsicrometria(t, urPercent) {
  const ur = urPercent / 100;
  const patm = 101.325;
  const psat = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
  const pv = ur * psat;
  const omega = 0.622 * pv / (patm - pv);
  const h = 1.006 * t + omega * (2501 + 1.86 * t);
  const volumeEspecifico = 0.287 * (t + 273.15) * (1 + 1.6078 * omega) / patm; // m³/kg
  return { omega, h, volumeEspecifico };
}

function calcular() {
  const t = parseFloat(document.getElementById("temperatura").value);
  const ur = parseFloat(document.getElementById("umidade").value);
  const { omega, h } = calcularPsicrometria(t, ur);

  document.getElementById("resultado").innerHTML = `
    <p>Umidade absoluta: <strong>${omega.toFixed(4)} kg vapor/kg ar seco</strong></p>
    <p>Entalpia específica: <strong>${h.toFixed(2)} kJ/kg</strong></p>
  `;
}

function calcularCiclo() {
  const v1 = parseFloat(document.getElementById("v1").value);
  const t1 = parseFloat(document.getElementById("t1").value);
  const ur1 = parseFloat(document.getElementById("ur1").value);

  const v2 = parseFloat(document.getElementById("v2").value);
  const t2 = parseFloat(document.getElementById("t2").value);
  const ur2 = parseFloat(document.getElementById("ur2").value);

  const { h: h1 } = calcularPsicrometria(t1, ur1);
  const { h: h2 } = calcularPsicrometria(t2, ur2);

  const hMistura = (v1 * h1 + v2 * h2) / (v1 + v2);

  document.getElementById("cicloResultado").innerHTML = `
    <p>Entalpia da mistura: <strong>${hMistura.toFixed(2)} kJ/kg de ar seco</strong></p>
  `;
}

function calcularSaidaSerpentina() {
  const capacidade = parseFloat(document.getElementById("capacidade").value); // kW
  const vazaoVol = parseFloat(document.getElementById("vazao").value); // m³/h
  const tEntrada = parseFloat(document.getElementById("tEntrada").value);
  const urEntrada = parseFloat(document.getElementById("urEntrada").value);
  const hEntrada = parseFloat(document.getElementById("hEntrada").value); // kJ/kg

  const { volumeEspecifico } = calcularPsicrometria(tEntrada, urEntrada);

  const vazaoMassica = (vazaoVol / 3600) / volumeEspecifico; // kg/s

  const hSaida = hEntrada - (capacidade * 1000) / vazaoMassica; // kJ/kg

  document.getElementById("entalpiaSaidaResultado").innerHTML = `
    <p>Volume específico de entrada: <strong>${volumeEspecifico.toFixed(4)} m³/kg</strong></p>
    <p>Vazão mássica: <strong>${vazaoMassica.toFixed(2)} kg/s</strong></p>
    <p>Entalpia de saída: <strong>${hSaida.toFixed(2)} kJ/kg</strong></p>
  `;
}
