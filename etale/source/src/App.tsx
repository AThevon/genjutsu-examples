import Closing, { SiteFooter } from "./Closing";
import DaySection from "./DaySection";
import Hero from "./Hero";

export default function App() {
  return (
    <>
      <header className="site-header">
        <p className="wordmark">Étale</p>
        <p className="header-note">iPhone app · TestFlight beta</p>
      </header>
      <main className="page">
        <Hero />
        <DaySection />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
