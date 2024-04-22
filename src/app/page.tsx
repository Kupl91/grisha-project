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
  const [sortType, setSortType] = useState('id');
  const [filterType, setFilterType] = useState('name');
  const [filterValue, setFilterValue] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    async function getAllPokemon() {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`);
      const data = await response.json();
      const pokemonsData = await Promise.all(data.results.map(async (pokemon, index) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return { 
          id: index + 1,
          name: pokemon.name, 
          url: pokemon.url,
          height: pokemonData.height
        };
      }));

      setPokemons(pokemonsData);
      setTotalPages(Math.ceil(pokemonsData.length / itemsPerPage));
    }

    getAllPokemon();
  }, []);

  const [sortedPokemons, setSortedPokemons] = useState([]);

useEffect(() => {
  sortPokemons();
}, [pokemons, sortType]);

const sortPokemons = () => {
  let sorted;
  switch(sortType) {
    case 'id' :
      sorted = [...pokemons].sort((a , b) => a.id - b.id);
      break;
    case 'name' :
      sorted = [...pokemons].sort((a , b) => a.name.localeCompare(b.name));
      break;
    case 'height':
      sorted = [...pokemons].sort((a , b) => a.height - b.height);
      break;
      default:
        sorted = pokemons;
  }
  setSortedPokemons(sorted);
}

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

   const nextPage = () => {
     if (currentPage < totalPages) {
       setCurrentPage(currentPage + 1);
     }
   };
   
   const previousPage = () => {
     if (currentPage > 1) {
       setCurrentPage(currentPage - 1);
     }
   };
   
   const handleSortChange = (event) => {
    setSortType(event.target.value);
   };

   const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
   };

   const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value.toLowerCase()); 
   };

  return (
    <div>
      <input type="text" onChange={handleFilterValueChange} placeholder="Фильтр..." /> 
      <select onChange={handleFilterTypeChange}>
        <option value="name">Имя</option>
        <option value="id">ID</option>
        <option value="height">Высота</option>
      </select>
      <select onChange={handleSortChange}>
        <option value="id">ID</option>
        <option value="name">Имя</option>
        <option value="height">Высота</option>
      </select>
      {pokemons
        .filter((pokemon) => pokemon[filterType].toString().toLowerCase().includes(filterValue)) 
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map(({ id, name, url }) => (
          <div key={id} style={{ marginBottom:'10px' }}>
            <span>{name}</span>
            <button onClick={() => handleDetailsClick(url)} style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Детали</button>
            
            <Link href={`/${name}`} legacyBehavior>
              <a target="_blank" style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Подробно</a>
             </Link>

             {selectedDetail && selectedDetail.name === name && 
               (<span style={{ marginLeft:"20px" }}>{`Имя:${selectedDetail.name}, Способности:${selectedDetail.abilities}, Опыт:${selectedDetail.experience}, Высота:${selectedDetail.height}`}</span>)
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
