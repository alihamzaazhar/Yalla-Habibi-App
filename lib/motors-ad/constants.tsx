export const MOTOR_FUEL_TYPE = ["petrol", "diesel"] as const;
export const MOTOR_BODY_TYPE = ["sedan", "hatchback", "suv"] as const;
export const MOTOR_TRANSMISSION_TYPE = ["manual", "auto"] as const;
export const MOTOR_STEERING_SIDE = ["left", "right"] as const;
export const MOTOR_DRIVE_SYSTEM = [
  "two_wheel",
  "four_wheel",
  "all_wheel",
] as const;

export const EXTRA_FEATURES_ENUM = [
  "Climate Control",
  "Cooled Seats",
  "DVD Player",
  "Front Wheel Drive",
  "Keyless Entry",
  "Leather Seats",
  "Navigation System",
  "Parking Sensors",
  "Premium Sound System",
  "Rear View Camera",
  "4 Wheel Drive",
  "Air Conditioning",
  "Alarm/Anti-Theft System",
  "All Wheel Drive",
  "All Wheel Steering",
  "AM/Fm Radio",
  "Anti-Lock Brakes/ABS",
  "Aux Audio In",
  "Bluetooth System",
  "Body Kit",
  "Brush Guard",
  "Cassette Player",
  "CD Player",
  "Cruise Control",
  "Dual Exhaust",
  "Fog Lights",
  "Front Airbags",
  "Heat",
  "Heated Seats",
  "Keyless Start",
  "Moonroof",
  "N20 System",
  "Off-Road Kit",
  "Off-Roat Tyres",
  "Performance Tyres",
  "Power Locks",
  "Power Mirrors",
  "Power Seats",
  "Power Steering",
  "Power Sunroof",
  "Power Windows",
  "Premium Lights",
  "Premium Paint",
  "Premium Wheels/Rims",
  "Racing Seats",
  "Rear Wheel Drive",
  "Roof Rack",
  "Satellite Radio",
  "Side Airbags",
  "Spoiler",
  "Sunroof",
  "Tiptronic Gears",
  "VHS Player",
  "Winch",
] as const;
export const REGIONAL_SPEC = [
  "GCC",
  "American",
  "Canadian",
  "European",
  "Japanese",
  "Korean",
  "Chinese",
  "Other",
] as const;
export const TRIM = ["35L", "40L", "Standard", "Other"] as const;

export const COLORS = {
  Black: "#000000",
  Blue: "#0000FF",
  Brown: "#A52A2A",
  Burgundy: "#800020",
  Gold: "#FFD700",
  Grey: "#808080",
  Orange: "#FFA500",
  Green: "#008000",
  Purple: "#800080",
  Red: "#FF0000",
  Silver: "#C0C0C0",
  Beige: "#F5F5DC",
  Tan: "#D2B48C",
  Teal: "#008080",
  White: "#FFFFFF",
  Yellow: "#FFFF00",
  "Other Color": null,
};

export const BIKE_FINAL_DRIVE_SYSTEM = [
  "Belt",
  "Chain",
  "Shaft",
  "Does not apply",
] as const;
export const BIKE_WHEELS = ["2 Wheels", "3 Wheels", "4 Wheels"];
export const BIKE_ENGINE_SIZES = [
  "Less than 250cc",
  "250cc - 499cc",
  "500cc - 599cc",
  "600cc - 749cc",
  "750cc - 999cc",
  "1000cc or more",
  "Does not apply",
];
export const BIKE_ENGINE_SIZES_MAP = {
  "Less than 250cc": 250,
  "250cc - 499cc": 499,
  "500cc - 599cc": 599,
  "600cc - 749cc": 749,
  "750cc - 999cc": 999,
  "1000cc or more": 1000,
  "Does not apply": undefined,
};
export const CAR_ENGINE_SIZES_MAP = {
  "0 - 499cc": 499,
  "500 - 999cc": 999,
  "1000 - 1499cc": 1499,
  "1500 - 1999cc": 1999,
  "2000 - 2499cc": 2499,
  "2500 - 2999cc": 2999,
  "3000 - 3499cc": 3499,
  "3500 - 3999cc": 3999,
  "4000 - 4499cc": 4499,
  "4500 - 4999cc": 4999,
};
export const CAR_HORSEPOWER_MAP = {
  "0 - 99 HP": 99,
  "100 - 199 HP": 199,
  "200 - 299 HP": 299,
  "300 - 399 HP": 399,
  "400 - 499 HP": 499,
  "500 - 599 HP": 599,
  "600 - 699 HP": 699,
  "700 - 799 HP": 799,
  "800 - 899 HP": 899,
  "900 - 999 HP": 999,
};
export const BIKE_USAGE_OPTIONS = [
  "Brand new",
  "Used very rarely since it was purchased",
  "Used once or twice a week since purchased",
  "Used as primary mode of transportation",
];
export const ACCESSORY_USAGE_OPTIONS = [
  "Brand new",
  "Unboxed",
  "Average usage",
  "Heavily used, since purchased",
];
export const ACCESSORY_CONDITION_OPTIONS = [
  "Perfect condition",
  "Minimal signs of use",
  "Typical wear and tear, but in good working condition",
  "Significant wear and tear, may need a bit of repair to work properly",
];
export const HEAVY_VEHICLE_HORSEPOWER_MAP = {
  "Less than 150 HP": 150,
  "150 - 199 HP": 199,
  "200 - 299 HP": 299,
  "300 - 399 HP": 399,
  "400+HP": 499,
  Unknown: undefined,
};
export const HEAVY_VEHICLE_BODY_CONDITION_OPTIONS = [
  "Perfect condition",
  "No accidents",
  "Typical wear and tear, all repaired",
  "Lots of wear and tear to the body",
];
export const HEAVY_VEHICLE_MECHANICAL_CONDITION_OPTIONS = [
  "Perfect condition",
  "Minor faults, all fixed",
  "Major faults fixed, small remain",
  "Ongoing minor & major faults",
];
export const HEAVY_VEHICLE_TRANSMISSION_TYPE = ["manual", "automatic"] as const;
export const HEAVY_VEHICLE_SEATING_MAP = {
  "2": 2,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "8+": 9,
};
export const HEAVY_VEHICLE_CYLINDER_MAP = {
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "10": 10,
  "12": 12,
  Unknown: undefined,
};
export const BOAT_USAGE_OPTIONS = [
  "Brand new",
  "Used very rarely since it was purchased",
  "Used once or twice a week since purchased",
  "Used once or twice a month since purchased",
];
export const BOAT_CONDITION_OPTIONS = [
  "Completely new",
  "No accidents, very few faults",
  "Typical wear and tear, all repaired",
  "Lots of wear and tear to the body",
];
export const BOAT_AGE_OPTIONS = [
  "Brand New",
  "0-1 Month",
  "1-6 Months",
  "6-12 Months",
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "10+ years",
];
export const BOAT_LENGTH_OPTIONS = [
  "Under 10ft",
  "10-14 ft",
  "15-19 ft",
  "20-24 ft",
  "25-29 ft",
  "30-39 ft",
  "40-49 ft",
  "50-69 ft",
  "70-100 ft",
  "100+ft",
];
export const PRIMARY_VARIANT_OPTIONS = ["seller", "medium"] as const;
export const SECONDARY_VARIANT_OPTIONS = ["60", "30", "15"] as const;
export const BADGES_VARIANT_OPTIONS = [
  "serviceHistory",
  "noAccidents",
  "firstOwner",
  "inWarranty",
] as const;

export const MOTOR_CATEGORIES_HANDLES = {
  "motorcycles-motor-ad-categories": "motorcycles-motor-ad-categories",
  "auto-accessories-parts-motor-ad-categories":
    "auto-accessories-parts-motor-ad-categories",
  "boats-motor-ad-categories": "boats-motor-ad-categories",
  "cars-motor-ad-categories": "cars-motor-ad-categories",
  "heavy-vehicles-motor-ad-categories": "heavy-vehicles-motor-ad-categories",
  "number-plates-motor-ad-categories": "number-plates-motor-ad-categories",
};
