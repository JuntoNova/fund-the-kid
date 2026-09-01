export const NAME_TO_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN",
  Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA",
  "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  "District of Columbia": "DC",
};

export const ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(NAME_TO_ABBR).map(([n, a]) => [a, n])
);

export const STATE_CENTERS: Record<string, [number, number]> = {
  AL: [-86.9, 32.8], AK: [-154.5, 64.2], AZ: [-111.6, 34.3], AR: [-92.2, 34.9],
  CA: [-119.4, 37.2], CO: [-105.5, 39.0], CT: [-72.7, 41.6], DE: [-75.5, 39.0],
  FL: [-81.7, 27.8], GA: [-83.4, 32.7], HI: [-157.5, 20.8], ID: [-114.5, 44.4],
  IL: [-89.2, 40.0], IN: [-86.3, 39.8], IA: [-93.5, 42.1], KS: [-98.3, 38.5],
  KY: [-84.9, 37.5], LA: [-91.8, 31.0], ME: [-69.2, 45.3], MD: [-76.7, 39.0],
  MA: [-71.8, 42.3], MI: [-84.6, 44.3], MN: [-94.3, 46.0], MS: [-89.7, 32.7],
  MO: [-92.5, 38.4], MT: [-110.4, 47.0], NE: [-99.8, 41.5], NV: [-116.6, 39.3],
  NH: [-71.6, 43.7], NJ: [-74.6, 40.2], NM: [-106.1, 34.3], NY: [-75.5, 43.0],
  NC: [-79.4, 35.5], ND: [-100.5, 47.5], OH: [-82.8, 40.3], OK: [-97.5, 35.5],
  OR: [-120.6, 44.0], PA: [-77.7, 40.9], RI: [-71.5, 41.7], SC: [-80.9, 33.9],
  SD: [-100.2, 44.4], TN: [-86.3, 35.8], TX: [-99.3, 31.4], UT: [-111.7, 39.3],
  VT: [-72.7, 44.1], VA: [-78.2, 37.5], WA: [-120.5, 47.4], WV: [-80.6, 38.6],
  WI: [-89.8, 44.6], WY: [-107.6, 43.0], DC: [-77.0, 38.9],
};
