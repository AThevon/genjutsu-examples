import Firings from "./Firings";

export default function App() {
  return (
    <>
      <header className="hero">
        <p className="brand">Atelier Grès</p>
        <h1>Stoneware, thrown and fired by hand.</h1>
        <p className="hero-text">
          Bowls, cups and plates for everyday use, made in small batches and fired in our own gas kiln.
        </p>
      </header>

      <main>
        <Firings />
      </main>

      <footer className="footer">
        <p>Atelier Grès. Stoneware, thrown and fired by hand.</p>
      </footer>
    </>
  );
}
