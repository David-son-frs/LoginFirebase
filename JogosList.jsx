import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JogosList() {
  const [busca, setBusca] = useState('');
  const [jogos, setJogos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  setErro(null);

  const url = busca
    ? `http://localhost:3000/api/jogos?nome=${encodeURIComponent(busca)}`
    : `http://localhost:3000/api/jogos`;

  axios.get(url)
    .then(response => {
      setJogos(response.data);
      setLoading(false);
    })
    .catch(error => {
      setErro('Erro ao carregar jogos');
      setLoading(false);
      console.error(error);
    });
}, [busca]);


  return (
    <div>
      <input 
        type="text" 
        value={busca} 
        onChange={e => setBusca(e.target.value)} 
        placeholder="Digite o nome do jogo..." 
        style={{ padding: '8px', width: '300px', marginBottom: '20px' }}
      />

      {loading && <p>Carregando jogos...</p>}
      {erro && <p>{erro}</p>}
      {!loading && !erro && busca && jogos.length === 0 && <p>Nenhum jogo encontrado.</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {jogos.map(jogo => (
          <div key={jogo.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            width: '200px',
            padding: '10px',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src={jogo.background_image || 'https://via.placeholder.com/200x120?text=Sem+Imagem'} 
              alt={jogo.name} 
              style={{ width: '100%', borderRadius: '5px', height: '120px', objectFit: 'cover' }} 
            />
            <h3 style={{ fontSize: '1.1rem', marginTop: '10px' }}>{jogo.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JogosList;
