import moment from 'moment-timezone';

export function parseTimeString(timeString: string): {
  value: string;
  unit: moment.DurationInputArg2;
} {
  const parsed = timeString.match(/^(\d+)([smhdwMy])$/);

  if (!parsed) {
    throw new Error(
      `Invalid time format: ${timeString}. Expected format like '1h', '30m', '7d'`,
    );
  }

  const value = parsed[1];
  const unit = parsed[2] as moment.DurationInputArg2;

  return { value, unit };
}
