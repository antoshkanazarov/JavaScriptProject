import { MongoClient, ObjectId } from 'mongodb';
import Schema from '../schema/index.js';
import Controll from './Controll.js';

export default class MDB
{
    static #PORT = '27017';
    static #LOCATION = 'mongodb://localhost';
    static #LOGIN;
    static #PSSWD;
    static #DBNAME = 'BooksShop';

    constructor(collectionName = '') {
        console.log('start DB connect');
        const url = [MDB.#LOCATION, MDB.#PORT].join(':') + '/';
        this.client = new MongoClient(url);
        this.client.connect();
        this.db = this.client.db(MDB.#DBNAME);

        if(collectionName != '') {
            this.collection = this.db.collection(collectionName);
            this.schema = Schema[collectionName];
            this.controll = new Controll(collectionName);
        }
        
        console.log('DB connect success');
    }

    changeCollection(collectionName) {
        this.collection = this.db.collection(collectionName);
    }

    async getCountElements(collectionName) {
        try {
            const db = this.client.db(MDB.#DBNAME);
            const count = await this.collection.countDocuments();
            return count;
        }
        catch(e) {
            console.log(e);
        }
       
    }

    getCount(key) {
        let values = MDB.getValue(key);
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
        let result = this.collection;
        this.mongoClient.close();
        return (result);
    }

    /**
     * 
     * @param {string} nameCollection 
     * @param {Object} params 
     * @returns 
     */
    async createCollection(nameCollection, params = {}) {
        let collection = await this.db.createCollection(nameCollection, params);
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
    async getValue(options = {}) {
        if(!this.collection)
            return {};
        
        let _this = this;
        let unPreparedData;
        //дефолтный фильтр
        let filter = options.filter ? options.filter : {};

        //поисковый запрос
        if(options.search && options.search.length > 1) {
            let arLine = options.search.split(' ').join('|')
            let query = new RegExp(arLine);

            let xor = [];

            for(let index in this.schema) {
                let item = this.schema[index];

                if(item.searchable) {
                    let el = {};
                    el[index] = { $regex: query, $options: 'i' };
                    xor.push(el);
                }
            }

            filter = { 
                $or: [...xor]
            }
        }

        //min & max
        //this.collection.find().sort({ KEY : -1 }).limit(1).toArray();
        //Сортировка
        if(options.sort) {
            if(options.sort.max) {
                options.sort.key = -1;
                options.sort.name = options.sort.max;
                options.sort.limit = 1;
            }

            if(options.sort.min) {
                options.sort.key = 1;
                options.sort.name = options.sort.min;
                options.sort.limit = 1;
            }

            if(options.sort.field && options.sort.order) {
                options.sort.key = (options.sort.order === 'ASC') ? 1 : -1;
                options.sort.name = options.sort.field;
                options.sort.limit = 100;
            }
        }

        //custom filter
        if(options.filter.filter === 'Y') {
            filter = {};

            for(let i in options.filter) {
                let el = options.filter[i];
                let from, to;

                if(i === 'filter')
                    continue;

                switch(_this.schema[i].type) {
                    case 'Number':
                        from = parseInt(el.FROM);
                        to = parseInt(el.TO);
                    break;

                    case 'Date':
                        from = new Date(el.FROM);
                        to = new Date(el.TO);
                    break;
                }
                
                filter[i] = { $gte: from , $lte: to }
            }
        }

        if(options.sort && options.sort.key) {
            let sort = {};
            sort[options.sort.name] = options.sort.key;
            unPreparedData = await this.collection.find().sort(sort).limit(options.sort.limit).toArray();
        }
        else {
            unPreparedData = await this.collection.find(filter).toArray();
        }


        let data = Controll.prepareData(unPreparedData, this.schema);
        let simId = {};
        let sim = {};

        data.forEach(item => {
            for(let i in item) {
                let keyElement = item[i];

                if(keyElement.ref) {
                    if(!simId[keyElement.collectionName])
                        simId[keyElement.collectionName] = [];

                    simId[keyElement.collectionName].push(new ObjectId(keyElement._id));
                }
            }
        });

        if(Object.keys(simId).length > 0) {
            for(let collection in simId) {
                let mdb = new MDB(collection);
                let ids = simId[collection];
                sim[collection] = [];

                sim[collection] = await mdb.collection.find({
                    _id: {
                        $in: ids
                    }
                }).toArray();
            }
        }

        let result = await {
            schema: this.schema,
            data: data,
            sim : sim
        }

        return result;
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
    async setValue(props = {}) {
        let id = 0;
        let controllData = this.controll.preparePost(props);
        
        if(controllData._id) { // UPDATE
            let result = await this.collection.updateOne(
                { _id: controllData._id },
                { $set: controllData }
            );
            id = result;
        }
        else { // ADD
            id = await this.collection.insertOne(controllData);
        }

        return id;
    }

    async removeValue(_id) {
        await this.collection.deleteOne({_id : new ObjectId(_id)})
    }

    async getCollectionStats() {
        let result = [];
        let sources = await this.db.listCollections().toArray();

        for(const source of sources) {
            const mdb = new MDB(source.name);
            const data = await mdb.getCollectonInfo();
            result.push(data);
        }

        return result;
    }

    async getCollectonInfo() {
        let _this = this;

        return new Promise(async resolve => {
            resolve({
                TITLE: _this.collection.namespace,
                INDEXES: (await _this.collection.indexes()).length,
                DOCUMENTS: await _this.collection.countDocuments()
            });
        });
    }
}