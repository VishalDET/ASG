/**
 * Calculates age from a date of birth string (YYYY-MM-DD).
 * @param dob Date of birth string
 * @returns Age in years
 */
export const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

/**
 * Converts a local date string (YYYY-MM-DD) to a timezone-safe ISO string.
 * Using new Date(dateStr).toISOString() shifts the date back by hours in IST (UTC+5:30),
 * causing Jan 16 to appear as Jan 15. This function preserves the local date.
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns ISO string with correct local date
 */
export const localDateToISO = (dateStr: string): string => {
    if (!dateStr) return '';
    // Parse the date parts to avoid timezone conversion
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day, 12, 0, 0); // noon to safely avoid DST/UTC shifts
    return d.toISOString();
};

/**
 * Formats a date string (ISO or YYYY-MM-DD) to YYYY-MM-DD for use in <input type="date">.
 * Uses local date parts to avoid UTC timezone shift issues.
 * @param dateStr Date string (ISO or YYYY-MM-DD)
 * @returns Date string in YYYY-MM-DD format, or empty string on failure
 */
export const formatDateForInput = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        // Use local date parts to avoid UTC shift
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return '';
    }
};
