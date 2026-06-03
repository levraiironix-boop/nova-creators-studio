const socket = io();
const quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'header': [1, 2, false] }]] }
});

quill.on('text-change', (delta, oldDelta, source) => {
    if (source === 'user') socket.emit('edit-script', quill.getContents());
});

socket.on('update-script', (contents) => {
    quill.setContents(contents);
});

socket.on('init-data', (data) => {
    if (data.script) quill.setContents(data.script);
});