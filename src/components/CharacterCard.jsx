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
        <h4 className="chname">{character.name}</h4>
        <p className="chbirth">Birth Year: {character.birth_year}</p>
        <p className="chgender">Gender: {character.gender}</p>
        <p className="chheight">Height:{character.height}</p>
        <p className="chmass">Mass:{character.mass}</p>
      </div>
    )}
  </div>

</div>

  )
}
