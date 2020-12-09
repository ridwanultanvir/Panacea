import React, { Component } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
} from 'recharts';


function createData(time_past, systolic_pressure, diastolic_pressure) {
    return { time_past: time_past, systolic_pressure: systolic_pressure, diastolic_pressure: diastolic_pressure }
}

let data = [];

export default function BloodPressureGraph(props) {
    const theme = useTheme();

    let monitor_data = props.monitor_data;
    data = []
    if (monitor_data != null) {
        let length = monitor_data.length;
        if (length > 50) {
            for (let i = length - 1; i >= length - 50; i--) {
                data.push(createData(monitor_data[i].hours_past * 60 + monitor_data[i].minutes_past,
                    monitor_data[i].sys_bp, monitor_data[i].dias_bp));
            }
        }
        else {
            for (let i = length - 1; i >= 0; i--) {
                data.push(createData(monitor_data[i].hours_past * 60 + monitor_data[i].minutes_past,
                    monitor_data[i].sys_bp, monitor_data[i].dias_bp));
            }
        }
    }

    return (
        <LineChart
            width={1150}
            height={300}
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time_past">
            </XAxis>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="systolic_pressure" stroke="#db2e2e" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="diastolic_pressure" stroke="#352ac9" />
        </LineChart>
    );

}
