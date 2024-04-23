"use client";
import React, { useState, useEffect } from "react";

interface PokemonDetail {
  name: string;
  abilities: string;
  image: string;
}

const PokemonDetailPage: React.FC = ({ params }) => {
  // const router = useRouter();
  const pokeName = params.id;
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(
    null
  );

  useEffect(() => {
    async function getPokemonDetail() {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokeName}`
      );
      const data = await response.json();
      setPokemonDetail({
        name: data.name,
        abilities: data.abilities
          .map((a: { ability: { name: string } }) => a.ability.name)
          .join(", "),
        image: data.sprites.front_default,
      });
    }

    getPokemonDetail();
  }, [pokeName]);

  return pokemonDetail ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img src={pokemonDetail.image} alt={pokemonDetail.name} />
      <h1>{pokemonDetail.name}</h1>
      <p>{pokemonDetail.abilities}</p>
    </div>
  ) : (
    <div>Загрузка...</div>
  );
};

export default PokemonDetailPage;
