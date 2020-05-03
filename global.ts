/**
 * Global contants
 */
const SKILLED_MIGRANT_REQUIRED_MIN_AGE = 20;
const SKILLED_MIGRANT_REQUIRED_MAX_AGE = 55;

interface Requirements {
  minimumAge: Number;
  maximumAge: Number;
}

const SkilledMigrantRequirements: Requirements = {
  minimumAge: SKILLED_MIGRANT_REQUIRED_MIN_AGE,
  maximumAge: SKILLED_MIGRANT_REQUIRED_MAX_AGE,
};

export default SkilledMigrantRequirements;
