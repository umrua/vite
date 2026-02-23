import { useState } from 'react'
import './App.css'


// Pokemon Card Component (the AI I used: Claude Sonnet 4.5)
function PokemonCard({ pokemon }) {
  if (!pokemon) {
    return <p className="empty-message">Click the button to roll a pokemon!</p>;
  }

  let cardClass = 'pokemon-card';
  if (pokemon.isShiny) cardClass += ' shiny';
  if (pokemon.isLegendary) cardClass += ' legendary';
  if (pokemon.isMythical) cardClass += ' mythical';

  return (
    <div className={cardClass}>
      {pokemon.isShiny && pokemon.isLegendary && <div className="shiny-legendary-badge">SHINY LEGENDARY!</div>}
      {pokemon.isShiny && pokemon.isMythical && !pokemon.isLegendary && <div className="shiny-mythical-badge">SHINY MYTHICAL</div>}
      {pokemon.isShiny && !pokemon.isLegendary && !pokemon.isMythical && <div className="shiny-badge">SHINY!</div>}
      {pokemon.isLegendary && !pokemon.isShiny && <div className="legendary-badge">LEGENDARY</div>}
      {pokemon.isMythical && !pokemon.isShiny && <div className="mythical-badge">MYTHICAL</div>}
      <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-sprite" />
      <h2 className="pokemon-name">{pokemon.name}</h2>
      <p className="pokemon-id"><strong>ID:</strong> #{pokemon.id}</p>
      <p className="pokemon-generation"><strong>Generation:</strong> {pokemon.generation}</p>
      <div className="pokemon-types">
        {pokemon.types.map((type, index) => (
          <span key={index} className="type-badge">
            {type}
          </span>
        ))}
      </div>
      <div className="pokemon-stats">
        <p><span><strong>HP:</strong> {pokemon.stats.hp}</span> <span><strong>Attack:</strong> {pokemon.stats.attack}</span></p>
        <p><span><strong>Defense:</strong> {pokemon.stats.defense}</span> <span><strong>Sp. Atk:</strong> {pokemon.stats.specialAttack}</span></p>
        <p><span><strong>Sp. Def:</strong> {pokemon.stats.specialDefense}</span> <span><strong>Speed:</strong> {pokemon.stats.speed}</span></p>
      </div>
      {pokemon.flavorText && (
        <div className="pokemon-flavor-text">
          <p>{pokemon.flavorText}</p>
        </div>
      )}
    </div>
  );
}

// Roll History Component (the AI I used: Claude Sonnet 4.5)
function PokemonHistory({ history }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="history-container">
      <h3 className="history-title">Past 50 Rolls</h3>
      <div className="history-grid">
        {history.map((pokemon, index) => {
          let itemClass = 'history-item';
          if (pokemon.isShiny) itemClass += ' shiny';
          if (pokemon.isLegendary) itemClass += ' legendary';
          if (pokemon.isMythical) itemClass += ' mythical';

          return (
            <div key={index} className={itemClass} title={pokemon.name}>
              {pokemon.isShiny && pokemon.isLegendary && <div className="history-special-badge">SL</div>}
              {pokemon.isShiny && pokemon.isMythical && !pokemon.isLegendary && <div className="history-special-badge">SM</div>}
              {pokemon.isShiny && !pokemon.isLegendary && !pokemon.isMythical && <div className="history-special-badge">S</div>}
              {pokemon.isLegendary && !pokemon.isShiny && <div className="history-special-badge">L</div>}
              {pokemon.isMythical && !pokemon.isShiny && <div className="history-special-badge">M</div>}
              <img src={pokemon.sprite} alt={pokemon.name} className="history-sprite" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Random Button Component (the AI I used: Claude Sonnet 4.5)
function PokemonRoller({ onRoll }) {
  const rollPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
    const speciesData = await speciesResponse.json();
    
    const shiny = Math.random() < 0.125;
    const gen = speciesData.generation.name.split('-')[1].toUpperCase();
    
    const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    const flavor = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : '';
    
    // Card Data (the AI I used: Claude Sonnet 4.5)
    const pokemonData = {
      id: data.id,
      name: data.name,
      sprite: shiny ? data.sprites.front_shiny : data.sprites.front_default,
      isShiny: shiny,
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical,
      generation: gen,
      flavorText: flavor,
      types: data.types.map(t => t.type.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat
      }
    };
    
    onRoll(pokemonData);
  };

  return (
    <div className="roller-container">
      <button onClick={rollPokemon} className="roll-button">
        Roll Pokemon
      </button>
    </div>
  );
}

function App() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [pokemonHistory, setPokemonHistory] = useState([]);

  const handleRoll = (newPokemon) => {
    setCurrentPokemon(newPokemon);
    setPokemonHistory([newPokemon, ...pokemonHistory].slice(0, 50));
  };

  return (
    <>
      <h1 className="app-title">Random Pokemon Roller</h1>
      <PokemonRoller onRoll={handleRoll} />
      <PokemonCard pokemon={currentPokemon} />
      <PokemonHistory history={pokemonHistory} />
    </>
  )
}

export default App