import React, { useEffect, useState } from "react";
import { fetchPeople, fetchResource } from "./api";
import CharacterCard from "./components/CharacterCard";

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query,setQuery]=useState();

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

  // Fetch character details when selected
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white p-6">
      <h1 className="header">
        🌟 Star Wars Characters
      </h1>
    {/* text-4xl font-bold mb-8 text-center text-yellow-400 */}

      {loading ? (
        <p className="text-center text-gray-400">Loading characters...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
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
          <div>
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
              className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700"
            >
              Next ➡
            </button>
          </div>


      

  
        </>
      )
    }
    </div>
  )}
  