import { useCallback, useEffect, useState } from "react";
import config from "../../params/config";
import { CChart } from "@coreui/react-chartjs";
import NewsList from "../news/NewsList.jsx";

export default function Index() {
    const [table, setTable] = useState({
        body: [],
    });
    const [pie, setPie] = useState({
        labels: [],
        numbers: [],
        indexes: [],
        count: 1,
    });
    const [loading, setLoading] = useState(false);

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const response = await fetch(config.api + "get/collection/list/");
        const answer = await response.json();

        let labels = [];
        let numbers = [];
        let indexes = [];

        answer.forEach((item) => {
            labels.push(item.TITLE.split(".")[1]);
            numbers.push(item.DOCUMENTS);
            indexes.push(item.INDEXES);
        });

        setPie({
            labels: labels,
            numbers: numbers,
            indexes: indexes,
            count: labels.length,
        });

        setTable({
            body: answer,
        });

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTable();
    }, [fetchTable]);

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getColors(count) {
        if (count > 0) {
            let arColors = [];
            let arColorCode = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
            ];
            //HEX: RGB, RGBA. 00 00 00 00

            for (let j = 0; j < count; j++) {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                    color += arColorCode[getRandomInt(16)];
                }

                arColors.push(color);
            }
        } else return false;
    }

    return (
        <>
            <table className="simple-table">
                <thead>
                    <tr>
                        <th>Коллекция</th>
                        <th>Индексы</th>
                        <th>Кол-во документов</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading &&
                        table.body.map((row) => (
                            <tr key={row._id} id={row._id}>
                                {Object.values(row).map((col, index) => (
                                    <td key={index}>{col}</td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>

            <div>
                <h3>Документы:</h3>
                <CChart
                    type="doughnut"
                    data={{
                        labels: pie.labels,
                        datasets: [
                            {
                                backgroundColor: getColors(pie.count),
                                data: pie.numbers,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                labels: {
                                    //color: getStyle('--cui-body-color'),
                                },
                            },
                        },
                    }}
                />
            </div>

            <div>
                <h3>Индексы:</h3>
                <CChart
                    type="doughnut"
                    data={{
                        labels: pie.labels,
                        datasets: [
                            {
                                backgroundColor: getColors(pie.count),
                                data: pie.indexes,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                labels: {
                                    //color: getStyle('--cui-body-color'),
                                },
                            },
                        },
                    }}
                />
            </div>

            <NewsList></NewsList>
        </>
    );
}
