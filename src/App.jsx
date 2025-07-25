import { useState, useEffect, useRef } from "react";
import "./App.css";
import DataHoraAtual from "./DataHoraAtual";


function App() {
  const [modo, setModo] = useState("cronometro"); 
  const audioRef = useRef(null)
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);

  const [tempInput, setTempInput] = useState({ minutos: "", segundos: "" });
  const [tempSegundos, setTempSegundos] = useState(0);
  const [contando, setContando] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    } else if (!ativo && segundos !== 0) {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [ativo, segundos]);

  useEffect(() => {
    let intervalo = null;
    if (contando && tempSegundos > 0) {
      intervalo = setInterval(() => {
        setTempSegundos((prev) => prev - 1);
      }, 1000);
    } else if (contando && tempSegundos === 0) {
      clearInterval(intervalo);
      setContando(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      alert("⏰ O tempo acabou!");
    }
    return () => clearInterval(intervalo);
  }, [contando, tempSegundos]);

  const formatarTempo = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const iniciarTemporizador = () => {
    const min = parseInt(tempInput.minutos) || 0;
    const sec = parseInt(tempInput.segundos) || 0;
    const total = min * 60 + sec;
    setTempSegundos(total);
    ;
    setContando(true);
  };

  const resetarTemporizador = () => {
    setTempInput({ minutos: "", segundos: "" });
    setTempSegundos(0);
    setContando(false);
  };

  return (
    <div className="app melhorada">
      <audio ref={audioRef} src="/alarme1.wav" preload="auto" />
      <div className="container">
        <DataHoraAtual /> {/* Exibe a data e hora atual */}
        <h1 className="titulo">
          <span role="img" aria-label="cronômetro">⏱</span> TimeNest
        </h1>
        <div className="modo-selector">
          <button className={modo === "cronometro" ? "ativo" : ""} onClick={() => setModo("cronometro")}>Cronômetro</button>
          <button className={modo === "temporizador" ? "ativo" : ""} onClick={() => setModo("temporizador")}>Temporizador</button>
        </div>
        {modo === "cronometro" && (
          <div className="cronometro bloco">
            <h2 className="tempo-digital">{formatarTempo(segundos)}</h2>
            <div className="botoes">
              <button onClick={() => setAtivo(!ativo)}>
                {ativo ? "Pausar" : "Iniciar"}
              </button>
              <button onClick={() => { setSegundos(0); setAtivo(false); }}>Resetar</button>
            </div>
          </div>
        )}
        {modo === "temporizador" && (
          <div className="temporizador bloco">
            <div className="input-area">
              <input
                type="number"
                placeholder="Minutos"
                value={tempInput.minutos}
                onChange={(e) => setTempInput({ ...tempInput, minutos: e.target.value })}
              />
              <input
                type="number"
                placeholder="Segundos"
                value={tempInput.segundos}
                onChange={(e) => setTempInput({ ...tempInput, segundos: e.target.value })}
              />
            </div>
            <h2 className="tempo-digital">{formatarTempo(tempSegundos)}</h2>
            <div className="botoes">
              <button onClick={iniciarTemporizador}>Iniciar</button>
              <button onClick={resetarTemporizador}>Resetar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
