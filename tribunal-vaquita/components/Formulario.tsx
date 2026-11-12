"use client";

import { useState } from "react";
import { Participante } from "@/lib/tipos";

export function Formulario({ onSubmit }: { onSubmit: (ps: Participante[]) => void }) {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [lista, setLista] = useState<Participante[]>([]);

  const agregar = () => {
    if (!nombre.trim() || !monto.trim()) return;
    const nuevo: Participante = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      aportado: parseFloat(monto),
    };
    setLista([...lista, nuevo]);
    setNombre("");
    setMonto("");
  };

  const cargarEjemplo = () => {
    const ejemplo: Participante[] = [
      { id: "1", nombre: "Ana", aportado: 500 },
      { id: "2", nombre: "Beto", aportado: 300 },
      { id: "3", nombre: "Carlos", aportado: 200 },
    ];
    setLista(ejemplo);
  };

  return (
    <div className="formulario">
      <h2>Formulario de Participantes</h2>
      <div className="fila">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="input"
        />
        <input
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          type="number"
          placeholder="Monto"
          className="input"
        />
        <button className="btn-agregar" onClick={agregar}>
          Agregar
        </button>
      </div>

      <button className="btn-ejemplo" onClick={cargarEjemplo}>
        Cargar ejemplo
      </button>

      <h3>Participantes ({lista.length})</h3>
      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.nombre}: $${p.aportado}
          </li>
        ))}
      </ul>

      <button className="btn-convocar" onClick={() => onSubmit(lista)}>
        Convocar al tribunal
      </button>
    </div>
  );
}