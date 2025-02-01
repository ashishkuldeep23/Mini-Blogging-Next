




export function formatDateToDDMMYYYY(date?: Date): string {
    // const day = String(date.getDate()).padStart(2, '0');
    // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    // let newDate = new Date(date)

    // return date ? date.toLocaleDateString("en-GB") : ""
    return date ? date.toLocaleString("en-GB") : ""

}

