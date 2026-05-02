export default function Mascot({ sprite, dialogue }) {
  return (
    <div className="mascot-container">
      <img
        src={sprite}
        alt="mascot"
        className="mascot-img"
      />
      <div className="dialogue-box">
        <p>{dialogue}</p>
      </div>
    </div>
  )
}