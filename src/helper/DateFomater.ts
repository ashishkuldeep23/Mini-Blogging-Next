export function formatDateToDDMMYYYY(date?: Date): string {
  // const day = String(date.getDate()).padStart(2, '0');
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  // let newDate = new Date(date)

  // return date ? date.toLocaleDateString("en-GB") : ""

  const newDate = new Date(date || "");

  return date
    ? newDate.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
}
