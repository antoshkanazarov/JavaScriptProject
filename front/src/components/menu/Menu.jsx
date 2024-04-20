import { useEffect, useState, useCallback } from 'react';
import './style.css';
import config from '../../params/config';

export default function Menu({curPath}) {
    const [menu, setMenu] = useState([]);

    const fetchMenu = useCallback(async () => {
        const response = await fetch(config.api + 'get/Menu/');
        const answer = await response.json();
        setMenu(answer.data);
    }, []);

    useEffect(
        () => {fetchMenu()}, [fetchMenu]
    );

    return (
        <menu>   
            {
                menu && menu.map(menuElement => (
                    <li className={curPath == menuElement.LINK ? 'selected': null} key={menuElement._id}><a href={menuElement.LINK}>{menuElement.NAME}</a></li>
                ))
            }
        </menu>
    )
}