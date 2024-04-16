'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const DetailPage = ({ pokeName }) => {
  return <div>{pokeName}</div>;
};

const PageCounter = ({ currentPage, totalPages }) => {
  return (
    <div>
      Страница {currentPage} из {totalPages}.
    </div>
  );
};

const Page = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => {
    async function getPokemon() {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(currentPage - 1) * 10}`);
      const data = await response.json();
      setPokemons(data.results.map(pokemon => ({ name: pokemon.name, url: pokemon.url })));
    }

    getPokemon();
  }, [currentPage]);

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
          height: pokemonData.height
        });
      } else {
         throw new Error('Не удалось получить информацию о покемоне');
       }
      
    } catch (error) {
       console.error("Ошибка при загрузке данных:", error);
     }
   };

   const nextPage = () => setCurrentPage(currentPage + 1);
   const previousPage = () => setCurrentPage(currentPage - 1);

   return (
    <div>
      {pokemons.map(({ name, url }) => (
        <div key={name} style={{ marginBottom:'10px' }}>
          <span>{name}</span>
          <button onClick={() => handleDetailsClick(url)} style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Детали</button>
          
          <Link href={`/${name}`} legacyBehavior>
            <a target="_blank" style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Подробно</a>
           </Link>

           {selectedDetail && selectedDetail.name === name && 
             (<span style={{ marginLeft:"20px" }}>{`Имя:${selectedDetail.name}, Способности:${selectedDetail.abilities}, Опыт:${selectedDetail.experience}, Рост:${selectedDetail.height}`}</span>)
           }
        </div>
      ))}
      <button onClick={previousPage}>Предыдущая</button>
      <button onClick={nextPage}>Следующая</button>
      <PageCounter currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default Page;