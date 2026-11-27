/* =====================================================================
   Edit everything here. Components read from this file only.
   Anything marked TODO is a placeholder, so replace it before sharing.
   ===================================================================== */

export type Person = { name: string; role?: string };
export type EighteenGroup = {
  title: string;
  subtitle?: string;
  people: Person[];
};
export type Swatch = { name: string; hex: string };
export type ProgramItem = { time: string; title: string; note?: string };

export type InvitationConfig = {
  age: number;
  firstName: string;
  headline: string;
  middleName?: string;
  lastName?: string;
  coverText: string;
  tagline: string;
  heroPhoto?: string; // path in /public, e.g. "/hero.jpg"
  timeZone: string;
  event: { title: string; start: string; end: string };
  /** Leave src empty to use the built-in generated music-box lullaby.
   *  To use your own song: put it in /public and set src: "/song.mp3" */
  music: { src: string; title: string };
  venue: { name: string; address: string; mapsQuery: string };
  message: { title: string; body: string[]; signature: string };
  program: ProgramItem[];
  gallery: string[]; // e.g. ["/photos/1.jpg", "/photos/2.jpg"], hidden when empty
  dressCode: { guests: string; roses: string; girls: string };
  palette: Swatch[];
  gifts: string;
  eighteens: EighteenGroup[];
  wish: { idle: string; lit: string; blown: string };
  rsvp: { deadline: string; url: string };
  footer: string;
};

export const invitation: InvitationConfig = {
  age: 18,
  firstName: "Stacey",
  headline: "Fabulous Stacey at 18th",
  middleName: "",
  lastName: "",
  coverText: "You are cordially invited",
  tagline: "The journey to eighteen begins",
  heroPhoto: "", // "/hero.jpg"
  timeZone: "Asia/Manila",

  event: {
    title: "Fabulous Stacey at 18th",
    start: "2026-12-21T15:00:00+08:00",
    end: "2026-12-21T20:00:00+08:00", // TODO: confirm end time
  },

  music: { title: "Blooming at Eighteen", src: "/audio/song.mp3" },

  venue: {
    name: "Manuel's Restaurant",
    address: "Full address here", // TODO
    mapsQuery: "Manuel's Restaurant", // TODO: add the city so the pin lands on the right branch
  },

  message: {
    title: "A little note",
    body: [
      "Eighteen years of laughter, growing up and being loved by people like you.",
      "This chapter feels brighter with you in it, so come celebrate with me.",
    ], // TODO: replace with Stacey's own words
    signature: "Stacey",
  },

  // TODO: confirm the real program and times
  program: [
    {
      time: "3:00 PM",
      title: "Guest arrival",
      note: "Registration and welcome drinks",
    },
    {
      time: "3:30 PM",
      title: "Grand entrance",
      note: "The celebrant makes her entrance",
    },
    { time: "4:00 PM", title: "Dinner", note: "Good food, better company" },
    {
      time: "5:00 PM",
      title: "18 Roses",
      note: "Dances with the special men in her life",
    },
    {
      time: "6:00 PM",
      title: "18 Candles",
      note: "Messages and wishes from loved ones",
    },
    { time: "7:00 PM", title: "Cake & toast", note: "Make a wish with us" },
    {
      time: "7:30 PM",
      title: "Party time",
      note: "Photos, games and the dance floor",
    },
  ],

  gallery: [],

  dressCode: {
    guests:
      "Semi-formal attire in blush pink, black, or gold. Polished and elegant, please.",
    roses: "Black suit or tuxedo, with a blush pink or gold accent.",
    girls: "Blush pink or gold semi-formal dress.",
  },

  palette: [
    { name: "Blush Pink", hex: "#f4c6cf" },
    { name: "Black", hex: "#0a0a0a" },
    { name: "Gold", hex: "#c9a14a" },
  ],

  gifts:
    "Your presence is the greatest gift. But if you wish to give something, a little note of what Stacey would appreciate goes here.", // TODO

  eighteens: [
    {
      title: "Candles",
      subtitle: "Wishes",
      people: [
        { name: "Guest One" },
        { name: "Guest Two" },
        { name: "Guest Three", role: "Mother" },
      ],
    },
    {
      title: "Treasures",
      subtitle: "Gifts",
      people: [{ name: "Guest One" }, { name: "Guest Two" }],
    },
    {
      title: "Roses",
      subtitle: "Dances",
      people: [
        { name: "Guest One" },
        { name: "Guest Two", role: "Grandfather" },
        { name: "Guest Three", role: "Father" },
      ],
    },
    {
      title: "Blue Bills",
      subtitle: "Blessings",
      people: [
        { name: "Guest One" },
        { name: "Guest Two", role: "Grandmother" },
      ],
    },
    {
      title: "Cheers",
      subtitle: "Toasts",
      people: [{ name: "Guest One" }, { name: "Guest Two" }],
    },
  ],

  wish: {
    idle: "Light the candles and make a wish with me.",
    lit: "Close your eyes. Make a wish. Then blow.",
    blown: "Your wish is on its way. See you on the 21st.",
  },

  rsvp: {
    deadline: "December 7, 2026", // TODO
    url: "https://forms.gle/your-form-id", // TODO
  },

  footer: "With love, Stacey",
};
