export type ServiceAreaCluster = {
  name: string;
  areas: readonly string[];
};

export const serviceAreaClusters = [
  {
    name: "Sandton / Johannesburg North",
    areas: ["Sandton", "Bryanston", "Morningside", "Rivonia", "Sandown", "Hyde Park", "Parkmore", "Fourways", "Lonehill", "Sunninghill", "Paulshof", "Douglasdale", "Dainfern"],
  },
  {
    name: "Randburg",
    areas: ["Randburg", "Ferndale", "Blairgowrie", "Linden", "Northcliff", "Robindale", "Bromhof", "Boskruin", "North Riding", "Honeydew", "Olivedale", "Randpark Ridge"],
  },
  {
    name: "Rosebank / Central-North Johannesburg",
    areas: ["Rosebank", "Parkhurst", "Parkwood", "Greenside", "Emmarentia", "Melrose", "Saxonwold", "Houghton", "Parkview", "Melville", "Illovo", "Craighall Park", "Westcliff"],
  },
  {
    name: "Roodepoort / Johannesburg West",
    areas: ["Roodepoort", "Weltevreden Park", "Constantia Kloof", "Little Falls", "Ruimsig", "Florida", "Florida Park", "Helderkruin", "Wilro Park", "Strubens Valley", "Radiokop", "Allen's Nek", "Roodekrans"],
  },
  {
    name: "Midrand / Waterfall / Kyalami",
    areas: ["Midrand", "Waterfall", "Kyalami", "Halfway Gardens", "Halfway House", "Carlswald", "Noordwyk", "Vorna Valley", "Barbeque Downs", "Crowthorne", "Blue Hills", "Kyalami Estate", "Waterfall Estate", "Summerset", "Glen Austin"],
  },
] as const satisfies readonly ServiceAreaCluster[];

export const approvedServiceAreas = serviceAreaClusters.flatMap((cluster) => [...cluster.areas]);

export const approvedServiceAreaSet = new Set<string>(approvedServiceAreas);
