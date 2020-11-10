function getReadableFileSizeString(fileSizeInBytes) {
    let i = -1;
    const byteUnits = [' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'];
    if(fileSizeInBytes > 1024) {
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(2) + byteUnits[i];
    }
    else {
        return fileSizeInBytes + ' Bytes';
    }
};


function firstSetCounter() {
    const labelCounter = document.getElementsByClassName('counter')[0];
    
    if(counter === 0) {
        labelCounter.innerHTML = now;
    } else {
        now = 1;
        labelCounter.innerHTML = now;
        getDbById(1);
    }
}

async function firstGetCounter() {
    try {
        counter = await connection('/getCounter');
        if(counter.data === 'try again') {
            counter = await connection('/getCounter');
            counter = counter.data.counter;
            firstSetCounter();
            return;

        }
        counter = counter.data.counter;
        firstSetCounter();

    } catch(err) {
        alert('Error, trying again');
        getCounter();
    }
}

async function getCounter() {
    try {
        counter = await connection('/getCounter');
        if(counter.data === 'try again') {
            counter = await connection('/getCounter');
            counter = counter.data.counter;
            return;

        }
        counter = counter.data.counter;

    } catch(err) {
        alert('Error, trying again');
        getCounter();
    }
}

function getDbByClientName(clientName) {
    if(timer !== 0) {
        clearTimeout(timer);
    }

    timer = setTimeout(async () => {
        try {
            const body = {
                requestType: 'clientName',
                id: 0,
                clientName
            };
            const response = await connection.post('/get', body);

            if(response.data === ""){
                alert("Client was not found");
                return;
            }

            if(response.data === 'try again') {       
                const resp = await connection.post('/get', body);
                getFile(resp);
                timer = 0;
                return;
            }
            getFile(response);


        } catch(err) {
            alert('Error, trying again');
            timer = 0;
            getDbByClientName(clientName);
        }

        timer = 0;
    }, 500);
}

function getDbById(id) {
    if(timer !== 0) {
        clearTimeout(timer);
    }

    timer = setTimeout(async () => {
        try {
            const body = {
                requestType: 'id',
                id,
                clientName: ''
            };
            const response = await connection.post('/get', body);

            if(response.data === 'try again') {       
                const resp = await connection.post('/get', body);
                getFile(resp);
                timer = 0;
                return;
            }
            getFile(response);


        } catch(err) {
            alert('Error, trying again');
            timer = 0;
            getDbById(id);
        }

        timer = 0;
    }, 500);
}

function getFile(response) {
    if(timer !== 0) {
        clearTimeout(timer);
    }

    timer = setTimeout(() => {
        document.getElementsByClassName('counter')[0].innerHTML = response.data.clientId;

        const pdf = document.getElementsByClassName('pdf_embed')[0];
        const clone = pdf.cloneNode(true);
        clone.setAttribute('src', `${baseURL}docs/${response.data.arquive}`);
        pdf.parentNode.replaceChild(clone, pdf);

        document.getElementById('pdf_download').setAttribute('href', `${baseURL}docs/${response.data.arquive}`);

        timer = 0;
    }, 500);
}

async function getAuthToken() {
    try {   
        const token = await connection.get('/getToken');
        return token.data.token;

    } catch(err) {
        return 'err';

    }
    
}

function send() {
    const reader = new FileReader(),
          clientName = document.getElementById('client_name').value;

    if(file !== null && clientName) {
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const fileSize = file.size;
            const fileType = file.name.split('.')[file.name.split('.').length-1];
            const binary = reader.result;
            const sendToUrl = { fileSize, fileType, binary, clientName };

            const response = await createRequest(sendToUrl);

            if(response === 'try again') {
                const resp = await createRequest(sendToUrl);
                getCounter();
                getFile(resp);
                return;

            }
            getCounter();
            getFile(response);

        }

    } else {
        alert('Enter all requirements');
    }

}

async function createRequest(body) {
    try {
        const client = await connection.post('/create', body);

        if(client.data === 'try again') {
            return client.data;
        }
        return client;

    } catch(err) {
        console.log(err);
        alert('Error, try again');
        return;

    }

}
