const body = document.querySelector("body");
const fileSelector = document.getElementById('file_selection');
const sendButton = document.getElementsByClassName('send')[0];
const searchButton = document.getElementsByClassName('search_button')[0];
const plusButton = document.getElementById('arrow_right');
const minusButton = document.getElementById('arrow_left');

const onClickMinus = (e) => {
    const nowLabel = document.getElementsByClassName('counter')[0];

    if(now - 1 === 0 || now === 0) {
        return;

    } else {
        now = now - 1;
        nowLabel.innerHTML = now;
        getDbById(now);

    }
}

const onSearch = (e) => {
    const searchInput = document.getElementById('clientInput');
    const clientName = searchInput.value;

    getDbByClientName(clientName);

}

const onClickPlus = (e) => {
    const nowLabel = document.getElementsByClassName('counter')[0];

    if(now === counter) {
        return;

    } else {
        now = now + 1;
        nowLabel.innerHTML = now;
        getDbById(now);

    }
}

const onFileSelected = (e) => {
    if(e.target.files.length === 1 && e.target.files[0].type === 'application/pdf') {
        const fileSize = document.getElementById('file_size');
        const fileName = document.getElementById('selected_file');

        fileName.innerHTML = 'File selected: ' + e.target.files[0].name;
        fileSize.innerHTML = 'File size: ' + getReadableFileSizeString(e.target.files[0].size);

        file = e.target.files[0];
    }
}

ondragenter = (e) => {
    e.stopPropagation();
    e.preventDefault();

}

ondragover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
}

ondrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if(e.dataTransfer.files.length === 1 && e.dataTransfer.files[0].type === 'application/pdf') {
        const fileSize = document.getElementById('file_size');
        const fileName = document.getElementById('selected_file');

        fileName.innerHTML = 'File selected: ' + e.dataTransfer.files[0].name;
        fileSize.innerHTML = 'File size: ' + getReadableFileSizeString(e.dataTransfer.files[0].size);

        file = e.dataTransfer.files[0];
    }
}

searchButton.addEventListener('click', onSearch, false);
plusButton.addEventListener('click', onClickPlus, false);
minusButton.addEventListener('click', onClickMinus, false);
sendButton.addEventListener('click', send, false);
fileSelector.addEventListener('change', onFileSelected, false);
body.addEventListener('drop', ondrop, false);
body.addEventListener('dragover', ondragover, false);
body.addEventListener('dragenter', ondragenter, false);