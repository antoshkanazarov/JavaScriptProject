const owners = {
    _id: {},
        TITLE: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "ФИО",
            sort: true,
            editable: true,
            //list: []
        },
        PHONE: {
            type: 'Phone',
            require: true,
            default: 'None',
            loc: "Телефон",
            sort: true,
            editable: true
        },
        EMAIL: {
            type: 'Email',
            require: false,
            default: 'None',
            loc: "E-mail",
            sort: true,
            editable: true
        },
    };

    export default owners;