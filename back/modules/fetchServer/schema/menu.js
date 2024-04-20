const menu = {
    _id: {},
        NAME: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Название",
            sort: true,
            editable: true
        },
        LINK: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Ссылка",
            sort: true,
            editable: true
        },
    };

    export default menu;