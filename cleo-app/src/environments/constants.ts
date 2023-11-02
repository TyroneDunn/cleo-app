import {environment} from "./environment";

export const API_URL = environment.apiUrl;
const API_AUTH_URL = API_URL + 'auth/';
export const API_PROTECTED_URL = API_AUTH_URL + 'protected/';
export const API_LOGIN_URL = API_AUTH_URL + 'login/';
export const API_LOGOUT_URL = API_AUTH_URL + 'logout/';
export const API_REGISTER_URL = API_AUTH_URL + 'register/';
export const API_JOURNALS_URL = API_URL + 'journals/'
export const API_ENTRIES_URL = API_URL + 'entries/';
export const APP_HOME = '';
export const APP_SIGN_IN = 'sign-in/';
export const APP_JOURNALS = 'journals/';
