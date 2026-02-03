export type EngineVariant = 'CEO' | 'NEO';

export interface AircraftLimits {
  mtow: number; // Maximum Takeoff Weight (kg)
  mlw: number;  // Maximum Landing Weight (kg)
}

export interface AircraftConfig {
  name: string;
  variant: EngineVariant;
  limits: AircraftLimits;
}

export interface CalculatorState {
  taxi: string;
  sector4: string;
  sector3: string;
  sector2: string;
  sector1: string;
  zfw: string;
  tripPlusTaxi: string; // The "Sector 1 trip + taxi" input
}

// Limits defined in Kilograms
export const AIRCRAFT_DATA: Record<EngineVariant, Record<'A320' | 'A321', AircraftLimits>> = {
  CEO: {
    A320: { mtow: 77000, mlw: 66000 },
    A321: { mtow: 93500, mlw: 77800 },
  },
  NEO: {
    A320: { mtow: 79000, mlw: 67400 },
    A321: { mtow: 97000, mlw: 79200 },
  },
};