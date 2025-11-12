import React, { useEffect, useState } from "react";
import { fetchPeople, fetchResource } from "./api";
import CharacterCard from "./components/CharacterCard";

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query,setQuery]=useState();
  const [searchTerm, setSearchTerm] = useState("");

  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch character list
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPeople(page);
        if (cancelled) return;
        setData(res);
      } catch (err) {
        setError("Failed to load characters. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  
  useEffect(() => {
    if (!selected) return;
    let cancelled = false;

    async function loadDetails() {
      setDetailsLoading(true);
      try {
        const char = await fetchResource(selected.url);
        const home = await (char.homeworld
          ? fetchResource(char.homeworld)
          : Promise.resolve(null));
        const filmsCount = (char.films || []).length;
        const species = char.species || [];
        if (cancelled) return;
        setDetails({ char, home, filmsCount, species });
      } catch (e) {
        setDetails({ error: "Failed to load details." });
      } finally {
        setDetailsLoading(false);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [selected]);


  const totalPages = Math.ceil(data.count / 10) || 1;

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const filteredCharacters = data.results.filter((char) =>
  char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="header">
        🌟 Star Wars Characters 🌟
      </h1>
      <h2 className="head3">
        Explore the star world.....!
      </h2>
    
      <div className="search-container">
          <input
            type="text"
            placeholder="Search by character name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
      </div>

      <div className="filter">
        {searchTerm === "" ? (
          <p className="chno">Start typing to search for a character...</p>
        ) : filteredCharacters.length > 0 ? (
          filteredCharacters.map((char, index) => (
            <div key={index} className="card">
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(char.name)}/200/200`}
                alt={char.name}
                className="card-img"
              />
              <div className="card-data">
                <h3>{char.name}</h3>
                <p><strong>Height:</strong> {char.height} cm</p>
                <p><strong>Mass:</strong> {char.mass} kg</p>
                <p><strong>Birth Year:</strong> {char.birth_year}</p>
                <p><strong>Gender:</strong> {char.gender}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="chno">No characters found.</p>
        )}
      </div>


      
      {loading ? (
        <p className="errorhandling">Loading characters...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
        <div className="hello">
          {data.results.map((char) => (
            <CharacterCard
              key={char.name}
              character={char}
              onClick={() => setSelected(char)}
            />
          ))}
        </div>
          
          <div className="pagination">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="buttonprev"
            >
              ⬅ Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="buttonnext"
            >
              Next ➡
            </button>
          </div>
        </>
      )
    }
    </div>
  )}
  