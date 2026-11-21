import Panel from "./Panel";
import PhotoSlot from "./PhotoSlot";
import Letters from "./Letters";
import { invitation } from "@/config/invitation";

const isDev = process.env.NODE_ENV !== "production";

export default function Gallery({ photos }: { photos: string[] }) {
  if (photos.length === 0 && !isDev) return null;
  const items: (string | undefined)[] = photos.length ? photos : [undefined, undefined, undefined];

  return (
    <Panel id="moments" tone="noir" clusters={["bl", "tr"]} butterflies={1}>
      <div className="gal">
        <p className="eyebrow">a few</p>
        <h2 className="script-title">
          <Letters text="Moments" />
        </h2>
        <div className="gal__track" tabIndex={0} aria-label="Photo gallery">
          {items.map((src, i) => (
            <PhotoSlot key={src ?? i} src={src} name={`gallery-${i + 1}`} alt={`${invitation.firstName}, moment ${i + 1}`} shape="arch" className="gal__item" sizes="(max-width: 640px) 64vw, 280px" />
          ))}
        </div>
        <p className="muted gal__hint">Swipe →</p>
      </div>
    </Panel>
  );
}
