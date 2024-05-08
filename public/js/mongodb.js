const MongoClient = require('mongodb').MongoClient;

class MongoDB
{
    static #PORT = '27017';
    static #LOCATION = 'mongodb://localhost';
    static #LOGIN;
    static #PSSWD;
    static #DBNAME = 'We';

    constructor() {}

    Init() {
        console.log('start DB connect');
        const url = [MongoDB.#LOCATION, MongoDB.#PORT].join(':') + '/';
        this.client = new MongoClient(url);
        this.db = this.client.db(MongoDB.#DBNAME);
        console.log('DB connect success');
    }

    async getCountElements(collectionName) {
        try {
            this.client.connect();
            const db = this.client.db(MongoDB.#DBNAME);
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            return count;
        }
        catch(e) {
            console.log(e);
        }
       
    }

    getCollection(collectionName) {
        try {
            this.client.connect();
            const db = this.client.db(MongoDB.#DBNAME);
            return db.collection(collectionName);
        }
        catch(e) {
            console.log(e);
        }
    }

    getCount(key) {
        let values = MongoDB.getValue(key);
        if(values instanceof Array)
            return values.length;

        return 0;
    }

    /**
     * 
     * @param {string} collectionName 
     * @returns 
     */
    issetCollection(collectionName) {
        this.Init();
        let result = this.db[collectionName];
        this.mongoClient.close();
        return (result);
    }

    /**
     * 
     * @param {string} nameCollection 
     * @param {Object} params 
     * @returns 
     */
    createCollection(nameCollection, params = {}) {
        this.Init();
        let collection = this.db.createCollection(nameCollection, params);
        this.mongoClient.close();
        return collection;
    }


    /**
     * 
     * @param {string} collectionName 
     * @param {object} filter 
     * @param {array} select 
     * @param {number} limit 
     * @param {number} pageCount 
     */
    async getValue(collectionName, filter = {}, select = [], limit = false, pageCount = false) {
        let ob = null;
        this.Init();

        if(collectionName == "") {
            this.mongoClient.close();
            return false;
        }

        let collection = this.db.collection(collectionName);
        let request = [filter];

        if(select.length > 0) {
            let arSelect = {};
            for (let key of select) {
                arSelect[key] = 1;
            }
            request.push(arSelect);
        }

        ob = await collection.find(...request).toArray();//.limit(limit);
        return ob;
    }

    static isJson(value) {
        try {
            JSON.parse(value);
        }
        catch(error) {
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {string} collectionName 
     * @param {object} props 
     * @returns 
     */
    async setValue(collectionName, props = {}) {
        let id = 0;
        this.Init();

        if(Object.keys(props).length == 0 || collectionName == "") {
            this.client.close();
            return false;
        }
        
        id = await this.db.collection(collectionName).insertOne(props);
        return id;
    }

    removeValue(key) {
        //this.Init();
        if(confirm('Удалить?')) 
            window.localStorage.removeItem(key);

            //this.mongoClient.close();
    }
}

module.exports = MongoDB;