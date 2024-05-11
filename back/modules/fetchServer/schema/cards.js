const cards = {
    _id: {},
    TITLE: { //goverment number
        type: 'String',
            require: true,
            default: 'None',
            loc: "Название книги",
            sort: true,
            editable: true
    },
    OWNER: {
        type: 'DBRef',
        require: true,
        default: 'None',
        loc: "Читатели",
        sort: true,
        editable: true,
        collection: 'owners'
    }, 
       
    };

    export default cards;