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

// Ground and seam per stage, in firing order. Glaze firing and cooling carry the spy-hole.
const looks = [
  { band: "ground-dry", spyhole: null },
  { band: "ground-bisque seam seam-dry-bisque", spyhole: null },
  { band: "ground-kiln seam seam-bisque-kiln stage-glaze", spyhole: "glaze" },
  { band: "ground-kiln stage-cooling", spyhole: "cooling" },
] as const;

export default function Firings() {
  return (
    <section className="firings" aria-labelledby="firings-title">
      <div className="band ground-dry firings-intro">
        <div className="wrap">
          <h2 id="firings-title" className="reveal">The four firings</h2>
          <p className="lede reveal">Every piece goes through the same four stages before it leaves the studio.</p>
        </div>
      </div>
      <ol className="stages">
        {stages.map((stage, index) => {
          const look = looks[index];
          return (
            <li key={stage.name} className={`band stage ${look.band}`}>
              <div className="wrap">
                <div>
                  <span className="stage-index reveal">{index + 1}</span>
                  <h3 className="reveal">{stage.name}</h3>
                  <p className="stage-measure reveal">{stage.measure}</p>
                  <p className="stage-text reveal">{stage.text}</p>
                </div>
                {look.spyhole && (
                  <div className="spyhole-cell" aria-hidden="true">
                    <div className="spyhole" data-spyhole={look.spyhole}>
                      <div className="spyhole-hot" />
                      <div className="spyhole-ember" />
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
