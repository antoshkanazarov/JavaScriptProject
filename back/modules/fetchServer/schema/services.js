const services = {
    _id: {},
    TITLE: {
        type: 'String',
            require: true,
            default: 'None',
            loc: "Название услуги",
            sort: true,
            editable: true
    },
    DATE: {
        type: 'Date',
        default: '',
        loc: 'Дата обращения',
        sort: true,
        editable: true,
        filter: true
    },
    CARD: {
        type: 'DBRef',
        require: true,
        default: 'None',
        loc: "Автомобиль",
        sort: true,
        editable: true,
        collection: 'cards'
    },
    PRICE: {
        type: 'Number',
            require: true,
            default: 0,
            loc: "Цена",
            sort: true,
            editable: true,
            step: 100,
        sim: 'TOTAL'    
    },
    COUNT: {
        type: 'Number',
            require: true,
            default: 0,
            loc: "Количество (шт)",
            sort: true,
            editable: true,
            step: 1,
            sim: 'TOTAL'   
    },
    TOTAL: {
        type: 'Number',
        require: true,
        default: 0,
        loc: 'Сумма',
        sort: true,
        editable: true,
        readOnly: true,
        method: 'MULTIPLY',
        fields: [
            'COUNT', 'PRICE'
        ],
        mask: 'COUNT * PRICE',
        filter: true,
        step: 10
    }
       
    };

    export default services;