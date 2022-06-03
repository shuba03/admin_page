import axios from "axios";

const APIs = {
    USER_INFO: "/api/user/info",
    VERIFY_LOGIN: "/api/user/verify",
    LOGOUT: "/api/user/logout"
}

function getURL(apiURL) {
    const domain = new URL(window.location.href).origin;
    return `${domain}/queen-mobiles-admin${apiURL}`;
}

export default class APIProxy {

    static async getUserInfo(){
        const { data } = await axios.get(getURL(APIs.USER_INFO));

        return data;
    }


    static async login(email, password) {
        const form = new FormData();
        form.append("username", email);
        form.append("password", password);

        await axios.post(getURL(APIs.VERIFY_LOGIN), form,  {headers : {"content-type": "multipart/form-data"}});
    }

    static async logout() {

        await axios.post(getURL(APIs.LOGOUT), {});
    }

}