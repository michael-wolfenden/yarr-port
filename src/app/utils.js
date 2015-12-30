export function formatDate(date) {
    let dateAsDate = date;

    if (!dateAsDate) return '';

    if (typeof dateAsDate === 'string') {
        dateAsDate = new Date(dateAsDate);
    }

    const monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December',
    ];

    const day = dateAsDate.getDate();
    const monthIndex = dateAsDate.getMonth();
    const year = dateAsDate.getFullYear();

    return `${day}, ${monthNames[monthIndex]}, ${year}`;
}
