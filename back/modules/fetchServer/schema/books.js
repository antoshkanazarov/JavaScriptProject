const books = {
    _id: {},
        AUTHOR: {
            type: 'String',
            require: false,
            default: 'None',
            loc: "Автор книги",
            sort: true,
            editable: true,
            searchable: true,
        },
        TITLE: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Название книги",
            sort: true,
            editable: true,
            searchable: true,
            //list: []
        },
        PRICE: {
            type: 'Number',
            require: true,
            default: 0,
            loc: "Цена",
            sort: true,
            editable: true,
            step: 100,
            filter: true,
        },
        COUNTRY: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Страна автора",
            sort: true,
            editable: true,
            searchable: true,
        }
    };

    export default books;
