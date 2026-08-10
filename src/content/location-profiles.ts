export type LocationProfile = {
  localAngle: string;
  visualBrief: string;
};

export const locationProfiles: Record<string, LocationProfile> = {
  Sandton: {
    localAngle: "Apartment, townhouse and family-home cleaning with careful planning for building, complex or estate access.",
    visualBrief: "polished Sandton residential streetscape or apartment exterior; urban Johannesburg North character",
  },
  Bryanston: {
    localAngle: "Flexible cleaning for larger family homes, townhouses and apartments, with room-by-room priorities captured before the visit.",
    visualBrief: "leafy Bryanston residential streetscape or contemporary home exterior without a visible private address",
  },
  Morningside: {
    localAngle: "Home and apartment cleaning suited to regular upkeep, deeper resets and move-related cleaning.",
    visualBrief: "Morningside residential apartment or townhouse context with a calm, lived-in neighbourhood feel",
  },
  Rivonia: {
    localAngle: "Practical cleaning for apartments, townhouses and homes where access and timing details matter.",
    visualBrief: "Rivonia residential complex, townhouse or apartment streetscape",
  },
  Sandown: {
    localAngle: "Apartment and home cleaning with clear building-access, floor and scheduling details captured up front.",
    visualBrief: "Sandown apartment or residential building context, avoiding office-only imagery",
  },
  "Hyde Park": {
    localAngle: "Careful residential cleaning with attention to finishing details, special surfaces and household instructions.",
    visualBrief: "refined Hyde Park residential streetscape or elegant home context without implying a specific client property",
  },
  Parkmore: {
    localAngle: "Recurring and one-off home cleaning for households that want a straightforward, well-scoped service.",
    visualBrief: "Parkmore suburban residential street or family-home context",
  },
  Fourways: {
    localAngle: "Flexible cleaning for apartments, townhouses, complexes and family homes, including move-in and move-out needs.",
    visualBrief: "Fourways residential complex, townhouse or estate-style context",
  },
  Lonehill: {
    localAngle: "Residential cleaning with practical access planning for apartments, complexes, townhouses and family homes.",
    visualBrief: "Lonehill residential complex or suburban home context",
  },
  Sunninghill: {
    localAngle: "Apartment, townhouse and home cleaning with floor, access and recurring-service details captured where relevant.",
    visualBrief: "Sunninghill apartment or townhouse residential context",
  },
  Paulshof: {
    localAngle: "Regular and deep cleaning for apartments, townhouses and homes, with add-ons selected during quotation.",
    visualBrief: "Paulshof townhouse, apartment or suburban residential context",
  },
  Douglasdale: {
    localAngle: "Home cleaning for recurring routines, deeper resets and moving periods across different property layouts.",
    visualBrief: "Douglasdale family-home, townhouse or complex residential setting",
  },
  Dainfern: {
    localAngle: "Residential cleaning with estate-access, handover and household instructions captured before service.",
    visualBrief: "Dainfern estate-style residential streetscape or home exterior without security-sensitive details",
  },
  Randburg: {
    localAngle: "Flexible home cleaning across apartments, townhouses and family homes, from recurring upkeep to one-off deep cleaning.",
    visualBrief: "recognisable Randburg residential streetscape, apartment or townhouse context",
  },
  Ferndale: {
    localAngle: "Apartment, townhouse and home cleaning with clear scope, access and frequency choices.",
    visualBrief: "Ferndale residential apartment, townhouse or suburban street context",
  },
  Blairgowrie: {
    localAngle: "Practical cleaning for lived-in homes, recurring routines and occasional deeper resets.",
    visualBrief: "Blairgowrie suburban residential street or family-home setting",
  },
  Linden: {
    localAngle: "Careful home cleaning with room priorities, add-ons and special household notes captured in the quote.",
    visualBrief: "Linden residential streetscape with a warm established-neighbourhood feel",
  },
  Northcliff: {
    localAngle: "Residential cleaning for apartments, townhouses and multi-room homes, including move-related and deep-cleaning requests.",
    visualBrief: "Northcliff residential setting, hillside or suburban context without inventing a landmark",
  },
  Robindale: {
    localAngle: "Routine and one-off home cleaning designed around the actual layout and condition of the property.",
    visualBrief: "Robindale suburban family-home or townhouse streetscape",
  },
  Bromhof: {
    localAngle: "Flexible cleaning for family homes, complexes and townhouses with straightforward recurring-service options.",
    visualBrief: "Bromhof residential complex, townhouse or family-home context",
  },
  Boskruin: {
    localAngle: "Home cleaning for regular upkeep, deep cleaning and moving periods with clear access instructions.",
    visualBrief: "Boskruin townhouse, complex or suburban residential setting",
  },
  "North Riding": {
    localAngle: "Apartment, townhouse and family-home cleaning with building, complex and estate access details captured where needed.",
    visualBrief: "North Riding apartment, townhouse or estate-style residential context",
  },
  Honeydew: {
    localAngle: "Residential cleaning for homes, townhouses and complexes with flexible one-off and recurring options.",
    visualBrief: "Honeydew suburban, townhouse or complex residential context",
  },
  Olivedale: {
    localAngle: "Home cleaning with practical scheduling, access and household-detail capture for recurring or one-off service.",
    visualBrief: "Olivedale residential street, complex or family-home context",
  },
  "Randpark Ridge": {
    localAngle: "Recurring and deep cleaning for family homes, townhouses and apartments with a clear pre-visit scope.",
    visualBrief: "Randpark Ridge suburban family-home or townhouse setting",
  },
  Rosebank: {
    localAngle: "Apartment and home cleaning with particular care around building access, floor details and move-related requests where relevant.",
    visualBrief: "Rosebank residential apartment streetscape or mixed urban-residential context",
  },
  Parkhurst: {
    localAngle: "Home cleaning for busy households, guest-ready resets, recurring routines and deeper one-off cleaning.",
    visualBrief: "Parkhurst residential street or compact family-home context",
  },
  Parkwood: {
    localAngle: "Thoughtful home cleaning with room priorities and special-surface notes captured before the visit.",
    visualBrief: "Parkwood leafy residential street or family-home context",
  },
  Greenside: {
    localAngle: "Recurring and one-off home cleaning for households that want a clean reset without overcomplicating the booking.",
    visualBrief: "Greenside residential streetscape or townhouse/family-home setting",
  },
  Emmarentia: {
    localAngle: "Residential cleaning for family homes, apartments and townhouses with flexible service frequency.",
    visualBrief: "Emmarentia residential street or home context",
  },
  Melrose: {
    localAngle: "Apartment and home cleaning with clear access, room priorities and add-on selection.",
    visualBrief: "Melrose residential apartment, townhouse or home streetscape",
  },
  Saxonwold: {
    localAngle: "Careful home cleaning with attention to household instructions, fragile surfaces and room-specific priorities.",
    visualBrief: "Saxonwold residential streetscape or established family-home context",
  },
  Houghton: {
    localAngle: "Residential cleaning for apartments and larger homes, with service scope shaped around the property details provided.",
    visualBrief: "Houghton residential apartment or family-home streetscape",
  },
  Parkview: {
    localAngle: "Regular and deep home cleaning with room-by-room priorities and optional add-ons captured before confirmation.",
    visualBrief: "Parkview residential street or family-home setting",
  },
  Melville: {
    localAngle: "Apartment and home cleaning for recurring upkeep, move-related needs and occasional deeper resets.",
    visualBrief: "Melville residential street, apartment or compact home context",
  },
  Illovo: {
    localAngle: "Apartment, townhouse and home cleaning with practical floor, access and timing information captured in advance.",
    visualBrief: "Illovo residential apartment or townhouse context",
  },
  "Craighall Park": {
    localAngle: "Home cleaning for recurring routines and one-off deeper cleaning, with a clear scope tailored to the property.",
    visualBrief: "Craighall Park residential streetscape or family-home setting",
  },
  Westcliff: {
    localAngle: "Careful residential cleaning with detailed household instructions and room priorities recorded before the visit.",
    visualBrief: "Westcliff residential streetscape or home context without implying a specific property",
  },
  Roodepoort: {
    localAngle: "Residential cleaning for apartments, townhouses and family homes across recurring, deep and move-related needs.",
    visualBrief: "Roodepoort residential streetscape or mixed home/townhouse context",
  },
  "Weltevreden Park": {
    localAngle: "Regular and deep cleaning for family homes, townhouses and complexes with flexible service frequency.",
    visualBrief: "Weltevreden Park suburban family-home or townhouse context",
  },
  "Constantia Kloof": {
    localAngle: "Home and apartment cleaning with access, floor and household details captured where relevant.",
    visualBrief: "Constantia Kloof residential apartment or suburban home context",
  },
  "Little Falls": {
    localAngle: "Residential cleaning for townhouses, complexes and family homes, from recurring upkeep to moving periods.",
    visualBrief: "Little Falls townhouse, complex or suburban home setting",
  },
  Ruimsig: {
    localAngle: "Home cleaning for recurring routines, deep resets and move-in or move-out requests with clear access planning.",
    visualBrief: "Ruimsig residential estate, townhouse or family-home context",
  },
  Florida: {
    localAngle: "Practical residential cleaning for family homes, apartments and townhouses with clear service choices.",
    visualBrief: "Florida residential street, apartment or family-home context",
  },
  "Florida Park": {
    localAngle: "Home cleaning tailored to the property layout, frequency and condition described in the quote.",
    visualBrief: "Florida Park suburban family-home or townhouse streetscape",
  },
  Helderkruin: {
    localAngle: "Regular, deep and move-related cleaning for households that want the visit scoped before arrival.",
    visualBrief: "Helderkruin residential street or family-home context",
  },
  "Wilro Park": {
    localAngle: "Residential cleaning for family homes and townhouses, with recurring and one-off options.",
    visualBrief: "Wilro Park suburban residential street or townhouse setting",
  },
  "Strubens Valley": {
    localAngle: "Apartment, townhouse and home cleaning with practical building, complex and access details captured where needed.",
    visualBrief: "Strubens Valley apartment, townhouse or complex residential context",
  },
  Radiokop: {
    localAngle: "Flexible home cleaning for recurring upkeep, deeper one-off work and moving periods.",
    visualBrief: "Radiokop suburban residential or townhouse setting",
  },
  "Allen's Nek": {
    localAngle: "Home cleaning with room priorities, add-ons and access details captured before service confirmation.",
    visualBrief: "Allen's Nek residential street, townhouse or family-home context",
  },
  Roodekrans: {
    localAngle: "Residential cleaning for multi-room homes, townhouses and moving periods with a clear pre-visit scope.",
    visualBrief: "Roodekrans suburban residential setting or family-home context",
  },
  Midrand: {
    localAngle: "Flexible residential cleaning for apartments, townhouses, complexes and family homes, with access and scheduling captured up front.",
    visualBrief: "Midrand residential apartment, townhouse or complex streetscape",
  },
  Waterfall: {
    localAngle: "Apartment, townhouse and estate-style home cleaning with access, handover and household instructions captured before the visit.",
    visualBrief: "Waterfall residential apartment, townhouse or estate-style context without security-sensitive details",
  },
  Kyalami: {
    localAngle: "Residential cleaning for homes, townhouses, complexes and estates with practical access planning.",
    visualBrief: "Kyalami residential estate, townhouse or family-home context",
  },
  "Halfway Gardens": {
    localAngle: "Apartment, townhouse and home cleaning with floor, building and complex access details captured where relevant.",
    visualBrief: "Halfway Gardens apartment, townhouse or complex setting",
  },
  "Halfway House": {
    localAngle: "Practical residential cleaning for apartments and homes with simple quote, access and scheduling details.",
    visualBrief: "Halfway House residential apartment or townhouse context, avoiding commercial-only imagery",
  },
  Carlswald: {
    localAngle: "Apartment, townhouse and family-home cleaning with flexible recurring and one-off service options.",
    visualBrief: "Carlswald apartment, townhouse or suburban residential setting",
  },
  Noordwyk: {
    localAngle: "Home cleaning for recurring routines, deep cleaning and moving periods across apartments, townhouses and family homes.",
    visualBrief: "Noordwyk residential apartment, townhouse or family-home context",
  },
  "Vorna Valley": {
    localAngle: "Apartment and townhouse cleaning with practical floor, access and frequency information captured before service.",
    visualBrief: "Vorna Valley apartment, townhouse or complex setting",
  },
  "Barbeque Downs": {
    localAngle: "Residential cleaning for apartments, townhouses and complexes with clear access and service-scope planning.",
    visualBrief: "Barbeque Downs apartment, townhouse or complex residential context",
  },
  Crowthorne: {
    localAngle: "Home cleaning for family homes, townhouses and estate-style properties with access and handover details captured where needed.",
    visualBrief: "Crowthorne residential townhouse, estate-style or family-home context",
  },
  "Blue Hills": {
    localAngle: "Residential cleaning for homes, complexes and estate-style properties with a clear service scope before arrival.",
    visualBrief: "Blue Hills residential estate-style, complex or family-home setting",
  },
  "Kyalami Estate": {
    localAngle: "Estate-home cleaning with access, handover, room priorities and household instructions captured in advance.",
    visualBrief: "Kyalami Estate-style residential context without gates, codes, house numbers or security-sensitive details",
  },
  "Waterfall Estate": {
    localAngle: "Estate-style home cleaning with detailed access, handover and household requirements recorded before the visit.",
    visualBrief: "Waterfall Estate-style residential context without gates, codes, house numbers or security-sensitive details",
  },
  Summerset: {
    localAngle: "Apartment, townhouse and home cleaning with flexible recurring, deep and move-related service options.",
    visualBrief: "Summerset apartment, townhouse or complex residential context",
  },
  "Glen Austin": {
    localAngle: "Residential cleaning for family homes and larger properties, with room priorities and service scope captured in the quote.",
    visualBrief: "Glen Austin residential family-home or spacious suburban setting",
  },
};
