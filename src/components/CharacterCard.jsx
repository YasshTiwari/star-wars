import React, { useState } from 'react'

export default function CharacterCard({ character, index, onClick }) {
  const [showInfo, setShowInfo] = useState(false) // track visibility of info
  const imgSeed = encodeURIComponent(character.name + index)

  const handleCardClick = () => {
    setShowInfo(!showInfo) // toggle visibility on click
    if (onClick) onClick() // keep parent click behavior if any
  }

  return (
   <div className="">
  <div
    onClick={handleCardClick}
    className="card"
  >

    <img
      src={`https://picsum.photos/seed/${imgSeed}/400/220`}
      alt={character.name}
      className="w-full h-44 object-cover"
    />

    {/* Show this only when clicked */}
    {showInfo && (
      <div className="card-data">
        <h4 className="text-lg font-bold text-white">{character.name}</h4>
        <p className="text-sm text-gray-300">Birth Year: {character.birth_year}</p>
        <p className="text-sm text-gray-300">Gender: {character.gender}</p>
      </div>
    )}
  </div>

</div>

  )
}
