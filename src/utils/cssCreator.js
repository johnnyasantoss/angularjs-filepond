module.exports = function () {
    let found = false;
    document.head.childNodes.forEach(node => {
        if (node instanceof HTMLStyleElement && node.id === 'filepond-style') {
            found = true;
        }
    });

    if (!found) {
        var style = document.createElement('style');
        style.id = 'filepond-style';
        style.textContent = 'file-pond .filepond--root {' +
            'width: 100%;' +
            'height: 100%;' +
            '}';

        document.head.appendChild(style);
    }
};