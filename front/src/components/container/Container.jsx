import { useCallback, useEffect, useState } from "react";
import Form from "../form/Form.jsx";
import Table from "../table/Table.jsx";
import Index from "../index/Index.jsx";
import './style.css';
import Search from "../search/Search.jsx";

export default function Container({ curPath }) 
{
    const [row, setRow] = useState({});
    const [query, setQuery] = useState('');
    const [collectionName, setCollectionName] = useState(false);

    const handle = (value) => {
        if(value.data)
            setRow(value.data[0]);
    }

    const handleSearch = (value) => {
        if(value != '')
            setQuery(value);
    }

    const setCollection = useCallback(async () => {
        if(curPath !== 'index' && curPath !== '/')
            setCollectionName(curPath);
    });

    useEffect(
        () => {setCollection()}, [setCollection] 
    )

    return (
        <div className="container">
            {collectionName && <Search onChange={handleSearch} nameCollection={collectionName} />}
            {collectionName && <Form arValue={row} nameForm={ collectionName }></Form>}
            {collectionName && <Table onChange={handle} nameTable={ collectionName } query={query}></Table>}
            {!collectionName && <Index/>}
        </div>
    )
}