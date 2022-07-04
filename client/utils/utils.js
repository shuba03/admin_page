export default class Utils {

    static getURL(url) {
        const domain = new URL(window.location.href).origin;
        return `${domain}/queen-mobiles${url}`;
    }

}