import { useCallback, useState, useEffect } from "react";
import './style.css';
import config from "../../params/config";

export default function Table({nameTable, onChange, query = ''})
{
    const [table, setTable] = useState({
        header: [],
        body: [],
        sim: []
    });
    const [loading, setLoading] = useState(false); 

    const fetchTable = useCallback(async () => {
        setLoading(true);
        if(nameTable) {
            let getRequest = window.location.search;
            let urlRequest = config.api + 'get/' + nameTable + '/';
    
            if(query !== '') {
                urlRequest += '?q=' + query;
            }
    
            if(getRequest !== '' && query === '') {
                urlRequest += getRequest;
            }
    
            await getFetch(urlRequest);
        }
        
        setLoading(false);
    }, [nameTable, query]);

    useEffect(
        () => {
            fetchTable()
        }, [fetchTable]
    );

    async function getFetch(url) {
        const response = await fetch(url);
        const dataTable = await response.json();
        const data = {
            header: dataTable.schema,
            body: dataTable.data,
            sim: dataTable.sim
        }

        let title = [];
        let budget = [];

        data.body.forEach(item => {
            title.push(item.TITLE);

            if(item.BUDGET)
                budget.push(item.BUDGET);
        });

        setTable(data);
    }

    function getHeader(schema = {}) {
        let header = [];
        for(let i in schema) {
            let obHeader = schema[i];

            obHeader.code = i;

            if(i === '_id') {
                header.push({loc: 'ID'});
            }
            else {
                header.push(schema[i]);
            }

           // header.push((i === '_id') ? 'ID' : schema[i]);
        }

        header.push({});

        return (
            <tr>
                {
                    header.map((item, index) => (
                        <th key={index}
                            onClick={setSort}
                            data-code={item.code}
                            className={item.sort ? 'sortable' : null}>
                            {item.loc}
                        </th>
                    ))
                }
            </tr>
        )
    }

    async function setSort(event) {
        let th = event.target;
        let order = th.classList.contains('DESC') ? 'DESC' : 'ASC';
        let code = event.target.dataset.code;
        let url = config.api + 'get/' + nameTable + '/?sort=' + code + '&order=' + order;

        th.classList.add(order);

        await getFetch(url);

        if(order === 'ASC') {
            th.classList.add('DESC');
            th.classList.remove('ASC');
        }
        else {
            th.classList.remove('DESC');
            th.classList.add('ASC');
        }
    }

    function getContent(col, index, sim, schema) {
        let value = '';

        if(col.ref) {
            let val = sim[col.collectionName].filter(item => item._id === col._id)[0];

            if(val && val.TITLE)
                value = val.TITLE;
        }
        else {
            value = col;

            let getIndex = 0;
            let curSchema = 0;
            for(let i in schema) {
                if(getIndex === index) {
                    curSchema = schema[i];
                }
                getIndex++;
            }

            if(curSchema.type === 'Email') {
                let mailTo = 'mailto:' + col;
                value = <a href={mailTo}>{col}</a>
            }
            
            if(curSchema.type === 'Phone') {
                let callTo = 'tel:' + col;
                value = <a href={callTo}>{col}</a>
            }
            
            if(curSchema.type === 'Date') {
                let date = new Date(col);
                value = Intl.DateTimeFormat('ru').format(date);
            }
        }

        return (
            <td key={index}>
                {value && value}
            </td>
        )
    }

    async function edit(e) {
        const url = config.api + 'get/' + nameTable + '/?id=' + e.target.value;
        const response = await fetch(url);
        const answer = await response.json();
        onChange(answer);
    }

    async function dropElement(e) {
        const url = config.api + nameTable + '/' + e.target.value + '/';
        const confirmWindow = window.confirm('Уверены?');
        if(confirmWindow) {
            const response = await fetch(url);
            const answer = response.status;

            if(answer === 200) {
                fetchTable();
            }
        }
    }

    return(
        <>
        <table className={nameTable + " simple-table"}>
            <thead>
                {!loading && getHeader(table.header)}
            </thead>
            <tbody>
                {
                    !loading && table.body.map(row => (
                        <tr key={row._id} id={row._id}>
                            {
                            Object.values(row).map((col, index) => (
                               getContent(col, index, table.sim, table.header)
                            ))
                            }

                            <td>
                                <button className='edit' onClick={edit} value={row._id}></button>
                                <button className='drop' onClick={dropElement} value={row._id}></button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </>
    )
}