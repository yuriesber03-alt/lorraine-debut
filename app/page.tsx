import { AudioProvider } from "@/components/AudioProvider";
import { FxProvider } from "@/components/FxLayer";
import { ArtDefs } from "@/components/Art";
import Cover from "@/components/Cover";
import Sparkles from "@/components/Sparkles";
import ScrollVars from "@/components/ScrollVars";
import ChapterNav from "@/components/ChapterNav";
import Hero from "@/components/Hero";
import DateSection from "@/components/DateSection";
import Message from "@/components/Message";
import Program from "@/components/Program";
import Gallery from "@/components/Gallery";
import Venue from "@/components/Venue";
import Details from "@/components/Details";
import Eighteens from "@/components/Eighteens";
import Wish from "@/components/Wish";
import Rsvp from "@/components/Rsvp";
import SaveTheDate from "@/components/SaveTheDate";
import MusicToggle from "@/components/MusicToggle";
import { invitation } from "@/config/invitation";
import { getPhotos } from "@/lib/photos";

export const dynamic = "force-static";

export default function Page() {
  const photos = getPhotos();
  return (
    <AudioProvider src={invitation.music.src} title={invitation.music.title}>
      <FxProvider>
        <ArtDefs />
        <ScrollVars />
        <Sparkles />
        <Cover />
        <ChapterNav />
        <main className="main stage">
          <Hero photo={photos.hero} />
          <DateSection />
          <Message photo={photos.note} />
          <Program />
          <Gallery photos={photos.gallery} />
          <Venue photo={photos.venue} />
          <Details />
          <Eighteens />
          <Wish />
          <Rsvp />
          <SaveTheDate photo={photos.finale} />
        </main>
        <footer className="footer">{invitation.footer}</footer>
        <MusicToggle />
      </FxProvider>
    </AudioProvider>
  );
}
