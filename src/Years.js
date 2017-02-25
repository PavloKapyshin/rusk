export default function getYearsString(startYear, endYear, separator) {
    if (startYear === endYear) {
        return startYear.toString();
    }
    return [startYear, endYear].join(separator);
}
