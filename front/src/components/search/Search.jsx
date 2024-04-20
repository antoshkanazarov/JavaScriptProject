import { useState, useEffect } from "react";
import config from '../../params/config.js';
import './style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from  "react-datepicker";
import { ru } from 'date-fns/locale/ru';
registerLocale('ru-RU', ru)

export default function Search({ onChange, nameCollection }) {

    const [schema, setSchema] = useState(null);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    useEffect(
        () => {

            async function fetchSchema() {
                const response = await fetch(config.api + 'get/schema/' + nameCollection + '/');
                const answer = await response.json();

                for(let key in answer) {
                    let el = answer[key];

                    if(el.type === 'DBRef') {
                        let mdb = await fetch(config.api + 'get/' + el.collection + '/');
                        let ar = await mdb.json();
                        answer[key].arList = ar.data;
                    }

                    if(el.filter && el.type === 'Number') {
                        let minRequest = await fetch(config.api+ 'get/' + nameCollection + "/?min=" + key); //key === BUDGET
                        let minValue = await minRequest.json();
                        let maxRequest = await fetch(config.api+ 'get/' + nameCollection + "/?max=" + key); //key === BUDGET
                        let maxValue = await maxRequest.json();

                        answer[key].limits = {
                            min: minValue.data[0][key],
                            max: maxValue.data[0][key]
                        }
                    }
                }

                console.log(answer);

                setSchema(answer);
            }
            fetchSchema();
            
        }, [nameCollection]
    );

    function inputValue(event) {
        onChange(event.target.value);
    }

    function toggleForm() {
        let modal = document.querySelector('div.modal');
        let overlay = document.querySelector('div.overlay');
        modal.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    function onChangeDates(dates) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    function changeValue(event) {
        let field = event.target;
        let parent = field.closest('label');
        let key = field.id.split('_');
        let step = schema[key[0]].step;

        if(key[1] === 'MIN') {
            //let obSim = parent.querySelector('#' + key[0] + '_MAX');
            // if(obSim.value <= field.value) {
            //     let maxValue = parseInt(field.value) + parseInt(obSim.step);
            //     if(maxValue > parseInt(field.max)) {
            //         maxValue = parseInt(field.max);
            //     }
            //     setMax(maxValue);
            // }

            if(field.value >= field.max) {
                setMin(parseInt(field.value) - step);
            }
            else {
                setMin(field.value);
            }  
        }

        if(key[1] === 'MAX') {
            //let obSim = parent.querySelector('#' + key[0] + '_MIN');
            // if(obSim.value >= field.value) {
            //     let minValue = parseInt(field.value) - parseInt(obSim.step);
            //     if(minValue > parseInt(field.min)) {
            //         minValue = parseInt(field.min);
            //     }
            //     setMin(minValue);
            // }

            if(field.value >= field.max) {
                let value = parseInt(field.value) + step;
                setMax(value);
            }
            else {
               setMax(field.value);
            }  
        }
    }

    function renderFilter(data = {}) {
        let formElements = [];
        for(let i in data) {
            let newRow = data[i];

            newRow.code = i;

            if(newRow.filter) {
                switch(newRow.type) {
                    case 'Number':
                        newRow.fieldType = 'number';
                        newRow.field = 'range';
                    break;

                    case 'Date':
                        newRow.field = 'datepicker';
                    break;
                }
                
                formElements.push(newRow);
            }
        }

        return (
            <>
                {
                    formElements.map((item, index) => (
                        <>
                        {
                            item.field === 'range' &&
                            <div className='label' key={index}>
                                <span>{item.loc}</span>
                                <div className="rangeGroup">
                                    от: <input 
                                        type={item.field}
                                        step={item.step ? item.step : null}
                                        min={item.limits.min}
                                        max={item.limits.max}
                                        defaultValue={min}
                                        value={min}
                                        list={item.code + '_MIN'}
                                        id={item.code + '_MIN'}
                                        name={item.code + '[FROM]'}
                                        onChange={changeValue}
                                    />
                                    <datalist id={item.code + '_MIN'}>
                                        <option value={item.limits.min} label={item.limits.min}></option>
                                        <option className="curValue" defaultValue={min} label={min}></option>
                                        <option value={item.limits.max} label={item.limits.max}></option>
                                    </datalist>
                                </div>

                                <div className="rangeGroup">
                                    до: <input 
                                        type={item.field}
                                        step={item.step ? item.step : null}
                                        min={item.limits.min}
                                        max={item.limits.max}
                                        defaultValue={max}
                                        value={max}
                                        list={item.code + '_MAX'}
                                        id={item.code + '_MAX'}
                                        name={item.code + '[TO]'}
                                        onChange={changeValue}
                                    />
                                    <datalist id={item.code + '_MAX'}>
                                        <option value={item.limits.min} label={item.limits.min}></option>
                                        <option className="curValue" defaultValue={max} label={max}></option>
                                        <option value={item.limits.max} label={item.limits.max}></option>
                                    </datalist>
                                </div>
                            </div>
                        }

                        {
                            item.field === 'datepicker' &&
                            <div className="label" key={index}>
                                <span>{item.loc}</span>
                                <DatePicker
                                    selected={startDate}
                                    onChange={onChangeDates}
                                    startDate={startDate}
                                    endDate={endDate}
                                    locale='ru-RU'
                                    dateFormat='dd.MM.yyyy'
                                    selectsRange
                                    inline
                                    />

                                <input type='hidden' name={item.code + '[FROM]'} defaultValue={new Date(startDate)} />
                                <input type='hidden' name={item.code + '[TO]'} defaultValue={new Date(endDate)} />
                            </div>
                        }
                        </>
                    ))
                }
            </>
        )
    }

    function clearFilter(event) {
        event.preventDefault();
        let curPage = window.location;
        document.location.href = curPage.origin + curPage.pathname;
    }

    return (
        <>
            <div className='searchPanel'>
                <label>
                    <input onChange={inputValue} placeholder='Введите поисковый запрос' />
                </label>

                <button onClick={toggleForm}></button>
            </div>

            <div className='modal'>
                <div className='modal-head'>Фильтр <button onClick={toggleForm}></button></div>
                <form action="" method="GET">
                    {renderFilter(schema)}

                    <input type='hidden' name='filter' value='Y'/>
                    <div className='buttons'>
                        <button>Фильтровать</button>
                        <button onClick={clearFilter}>Сбросить</button>
                    </div>
                    
                </form>
            </div>

            <div className='overlay' onClick={toggleForm}></div>
        </>
    )
}