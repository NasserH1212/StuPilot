import { foundationPhase, type ShellSurface } from "../domain/foundation-phase";

export interface FoundationStatus {
  readonly phase: typeof foundationPhase;
  readonly surface: ShellSurface;
  readonly authenticationEnabled: false;
  readonly academicFeaturesEnabled: false;
}

export function getFoundationStatus(surface: ShellSurface): FoundationStatus {
  return {
    phase: foundationPhase,
    surface,
    authenticationEnabled: false,
    academicFeaturesEnabled: false,
  };
}
