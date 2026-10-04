const stages = [
  {
    name: "Drying",
    measure: "About a week",
    text: "Freshly thrown pieces dry slowly, first under plastic, then in the open air, until they are bone dry. Water left in the clay turns to steam in the kiln and can burst a pot.",
  },
  {
    name: "Bisque firing",
    measure: "Around 950 °C",
    text: "The first firing turns dry clay into ceramic for good. The pieces come out hard but still porous, so they can take up the glaze.",
  },
  {
    name: "Glaze firing",
    measure: "Around 1280 °C, in reduction",
    text: "The second firing melts the glaze and vitrifies the stoneware body. Near the top of the firing the kiln is starved of oxygen; this reduction changes how the iron in the clay and the glazes colours.",
  },
  {
    name: "Cooling",
    measure: "Slowly, over about 24 hours",
    text: "The kiln stays shut while it cools. Opening it too early would crack the work with thermal shock.",
  },
];

export default function Firings() {
  return (
    <section className="firings" aria-labelledby="firings-title">
      <h2 id="firings-title">The four firings</h2>
      <p className="lede">Every piece goes through the same four stages before it leaves the studio.</p>
      <ol className="stages">
        {stages.map((stage, index) => (
          <li key={stage.name} className="stage">
            <span className="stage-index">{index + 1}</span>
            <h3>{stage.name}</h3>
            <p className="stage-measure">{stage.measure}</p>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
