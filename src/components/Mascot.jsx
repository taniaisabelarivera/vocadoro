export default function Mascot({ sprites, currentSprite, dialogue }) {
  return (
    <div className="mascot-container">
      {}
      <img
        src={sprites[currentSprite]}
        alt="Miku mascot"
        className="mascot-img"
      />
      {}
      <div className="dialogue-box">
        <p>{dialogue}</p>
      </div>
    </div>
  )
}