import Firings from "./Firings";
import { useFiringMotion } from "./useFiringMotion";

export default function App() {
  useFiringMotion();

  return (
    <>
      <header className="band ground-dry hero">
        <div className="wrap">
          <p className="brand reveal">Atelier Grès</p>
          <h1 className="reveal">Stoneware, thrown and fired by hand.</h1>
          <p className="hero-text reveal">
            Bowls, cups and plates for everyday use, made in small batches and fired in our own gas kiln.
          </p>
        </div>
      </header>

      <main>
        <Firings />
      </main>

      <footer className="band ground-celadon seam seam-kiln-celadon footer">
        <div className="wrap">
          <p>Atelier Grès. Stoneware, thrown and fired by hand.</p>
        </div>
      </footer>
    </>
  );
}
