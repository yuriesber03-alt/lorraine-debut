import Image from "next/image";
import { invitation } from "@/config/invitation";

type Props = {
  src?: string;
  /** file name the user should drop into /public/photos (without extension) */
  name: string;
  alt: string;
  shape?: "arch" | "oval" | "round" | "wide";
  sizes?: string;
  priority?: boolean;
  /** when true, renders nothing in production if there is no photo */
  optional?: boolean;
  className?: string;
};

const isDev = process.env.NODE_ENV !== "production";

/** A framed photo. With no photo yet it shows an elegant monogram placeholder. */
export default function PhotoSlot({ src, name, alt, shape = "arch", sizes = "(max-width: 640px) 80vw, 380px", priority, optional, className = "" }: Props) {
  if (!src && optional && !isDev) return null;

  return (
    <div className={`photo photo--${shape} ${src ? "" : "photo--empty"} ${className}`}>
      <div className="photo__mat">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="photo__img" />
        ) : (
          <div className="photo__placeholder">
            <span className="photo__mono">{invitation.firstName.charAt(0)}</span>
            {isDev && <small>Add public/photos/{name}.jpg</small>}
          </div>
        )}
      </div>
    </div>
  );
}
