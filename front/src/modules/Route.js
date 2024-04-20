export default class Route
{
    constructor() {
        this.url = window.location.pathname.replace('/', '');
    }

    getUrl() {
        return this.url;
    }
}