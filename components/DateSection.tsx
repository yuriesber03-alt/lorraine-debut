import Panel from "./Panel";
import Frame from "./Frame";
import Letters from "./Letters";
import Countdown from "./Countdown";
import MiniCalendar from "./MiniCalendar";
import AddToCalendar from "./AddToCalendar";
import MusicPlayer from "./MusicPlayer";
import { invitation } from "@/config/invitation";
import { endDate, longDate, startDate, time, weekday } from "@/lib/format";

export default function DateSection() {
  return (
    <Panel id="date" tone="rose" rouge clusters={["tr", "bl"]} butterflies={1}>
      <Frame>
        <p className="eyebrow">A Special Day</p>
        <h2 className="script-title">
          <Letters text={invitation.tagline} />
        </h2>
        <MiniCalendar />
        <p className="date-big">{longDate(startDate)}</p>
        <p className="date-sub">
          {weekday(startDate)} <span className="dot">•</span> {time(startDate)} to {time(endDate)}
        </p>
        <div className="divider" />
        <Countdown start={invitation.event.start} end={invitation.event.end} />
        <p className="eyebrow mt">We can&apos;t wait to celebrate with you!</p>
        <AddToCalendar />
        <MusicPlayer />
      </Frame>
    </Panel>
  );
}
