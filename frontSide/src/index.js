const baseURL = 'http://172.16.3.30:45033/';
const connection = axios.create({ baseURL });
let counter = 0;
let now = 0;
let token = null;
let file = null;
let timer = 0;

connection.interceptors.request.use((config) => {
    config.headers.x_token = token;

    return config;
});

connection.interceptors.response.use(async (response) => {
    if(response.data.error_code) {
        token = await getAuthToken();
        response.data = 'try again';
    }

    return response;
});

firstGetCounter();
