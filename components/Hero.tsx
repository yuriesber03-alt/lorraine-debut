import Panel from "./Panel";
import PhotoSlot from "./PhotoSlot";
import Letters from "./Letters";
import CountUp from "./CountUp";
import { invitation } from "@/config/invitation";
import { longDate, startDate } from "@/lib/format";

export default function Hero({ photo }: { photo?: string }) {
  const { age, firstName, headline, venue } = invitation;

  return (
    <Panel id="top" tone="velvet" live chandelier clusters={["bl", "br"]} butterflies={2}>
      <div className="hero">
        <p className="caps hero__pre">You&apos;re invited to</p>

        <div className="hero__arch">
          <PhotoSlot src={photo} name="hero" alt={firstName} shape="arch" priority sizes="(max-width: 640px) 86vw, 420px" />
          <div className="hero__veil" aria-hidden />
          <div className="hero__over">
            <p className="caps hero__fab">
              <Letters text="Fabulous" base={200} />
            </p>
            <h1 className="hero__name" aria-label={headline}>
              <Letters text={firstName} base={700} />
            </h1>
            <p className="hero__age">
              <span className="hero__at">at</span>
              <b className="gold-text">
                <CountUp to={age} />
                <sup>th</sup>
              </b>
            </p>
            <p className="hero__bday">Birthday</p>
          </div>
        </div>

        <p className="caps hero__date">
          {longDate(startDate)} <i>•</i> {venue.name}
        </p>
      </div>

      <a href="#date" className="scroll-cue" aria-label="Scroll down">
        <span />
      </a>
    </Panel>
  );
}
