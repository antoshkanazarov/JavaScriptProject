const cards = {
    _id: {},
    TITLE: { //goverment number
        type: 'String',
            require: true,
            default: 'None',
            loc: "Гос. номер",
            sort: true,
            editable: true
    },
    MODEL: {
        type: 'DBRef',
        require: true,
        default: 'None',
        loc: "Модель",
        sort: true,
        editable: true,
        collection: 'models'
    },
    OWNER: {
        type: 'DBRef',
        require: true,
        default: 'None',
        loc: "Владелец",
        sort: true,
        editable: true,
        collection: 'owners'
    }, 
       
    };

    export default cards;