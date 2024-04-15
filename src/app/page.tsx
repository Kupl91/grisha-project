'use client';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    async function getPokemon() {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      const data = await response.json();
      // Сохраняем name и url для каждого покемона
      setPokemons(data.results.map(pokemon => ({ name: pokemon.name, url: pokemon.url })));
    }

    getPokemon();
  }, []);

  const handleDetailsClick = async (url) => {
    setSelectedDetail(null);
    try {
      const response = await fetch(url);
      if(response.ok){
        const pokemonData = await response.json();
        
        setSelectedDetail({
          name: pokemonData.name,
          abilities: pokemonData.abilities.map(a => a.ability.name).join(', '),
          experience: pokemonData.base_experience,
          height: pokemonData.height,
          url: url     
        });
      } else {
         throw new Error('Не удалось получить информацию о покемоне');
       }
      
    } catch (error) {
       console.error("Ошибка при загрузке данных:", error);
     }
   };

   return (
     <div>
       {pokemons.map(({ name, url }) => (
         <div key={name} style={{ display: 'flex', alignItems: 'center', marginBottom:'10px' }}>
           <span>{`${name}:${url}`}</span>
           {/* Передача URL как параметра */}
           <button onClick={() => handleDetailsClick(url)}>Детали</button>
           
            {/* Использование данных из selectedDetail */}
           {selectedDetail && selectedDetail.name === name && 
             (<span style={{ marginLeft:"20px" }}>{`Имя:${selectedDetail.name}, Способности:${selectedDetail.abilities}, Опыт:${selectedDetail.experience}, Рост:${selectedDetail.height}`}</span>)
            }
            
         </div>
       ))}
     </div>
   );
};

export default Page;