import { DBRef, ObjectId } from "mongodb";
import schema from "../schema/index.js";

export default class Controll {

    constructor(collectionName = '') {
        this.pathSchema = collectionName;
        this.schema = schema[collectionName];
    }

    showError(arr) {

    }

    preparePost(query = {}) {
        let data = {};

        if(query._id) {
            data._id = new ObjectId(query._id);
        }

        if(Object.keys(query).length > 0 && Object.keys(this.schema).length > 0) {
            for(let i in this.schema) {
                if(i === '_id') continue;

                let checkElement = query[i];
                let checkSchema = this.schema[i];
                
                if(checkElement != '') {
                   switch(checkSchema.type) {
                    case "Number":
                        data[i] = parseFloat(checkElement);
                    break;

                    case "String":
                        case 'Phone':
                            case 'Email':
                        data[i] = String(checkElement);
                    break;

                    case 'Date':
                        let d = checkElement.split('.');
                        data[i] = new Date(d[2], d[1]-1, d[0]);
                        //data[i] = checkElement;
                    break;

                    case 'DBRef':
                        data[i] = new DBRef(checkSchema.collection, new ObjectId(checkElement));
                    break;
                   }
                }
                else {
                    data[i] = checkSchema.default;
                }
            }
        }

        return data;
    }

    static prepareData(data = [], schema = {}) {
        let result = [];

        if(data instanceof Array && Object.keys(schema).length > 0) {
            data.forEach(item => {
                let newRow = {};

                for(let fieldName in schema) {
                    let fieldSchema = schema[fieldName];
                    let newData = (item[fieldName]) ? item[fieldName] : fieldSchema.default;

                    if(fieldSchema.type === 'DBRef') {
                        let dbref = item[fieldName];
                        newRow[fieldName] = {
                            ref: true,
                            collectionName: dbref.collection,
                            _id: String(dbref.oid)
                        }
                     }
                    else {
                        newRow[fieldName] = newData;
                    }
                    
                }

                result.push(newRow);
            });
        }

        return result;
    }
}