'use client';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function getPokemon() {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      const pashadata = await response.json();
      setPokemons(pashadata.results.map(pokemon => ({ name: pokemon.name, url: pokemon.url })));
    }

    getPokemon();
  }, []); 

  return (
    <div>
      {pokemons.map(({ name, url }) => (
        <div key={name}>
          key={name}{`${name}:${url}`}
          <button>Детали</button>
        </div>
      ))}
    </div>
  );
};

export default Page;
// хуита