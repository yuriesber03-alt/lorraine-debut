"use client";

import Panel from "./Panel";
import Frame from "./Frame";
import PhotoSlot from "./PhotoSlot";
import Letters from "./Letters";
import { invitation } from "@/config/invitation";
import { useGuest } from "@/lib/hooks";

export default function Message({ photo }: { photo?: string }) {
  const { message, firstName } = invitation;
  const guest = useGuest();

  return (
    <Panel id="note" tone="velvet" clusters={["tl", "br"]} butterflies={1}>
      <div className="cameo">
        <PhotoSlot src={photo} name="note" alt={firstName} shape="round" optional sizes="200px" />
      </div>
      <Frame crest={!photo}>
        <p className="eyebrow">{guest ? `For ${guest}` : "From my heart"}</p>
        <h2 className="script-title">
          <Letters text={message.title} />
        </h2>
        <div className="note__body">
          {message.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="note__sign">{message.signature}</p>
      </Frame>
    </Panel>
  );
}
