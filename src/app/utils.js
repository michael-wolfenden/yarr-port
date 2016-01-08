function formatDate(date) {
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

function dataAttrAsClass(attribute, el) {
    const dataAttrs = Array.from(el.classList)
        .filter(c => c.indexOf('data-') >= 0)
        .map(attr => {
            const [, key, val] = attr.split('-');
            const res = {};
            res[key] = val;
            return res;
        })[0];

    return dataAttrs[attribute];
}

export { formatDate, dataAttrAsClass };
