import { Component, computed, Input, SimpleChanges, WritableSignal,OnInit, inject } from '@angular/core';
import { SimSnapshot } from '@tt-app/models';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';

@Component({
    selector: 'tt-sim-snapshots',
    imports: [
        NgxEchartsDirective,
    ],
    templateUrl: './sim-snapshots.html',
    styleUrl: './sim-snapshots.scss',
})
export class SimSnapshots {
    @Input() snapshots!: WritableSignal<SimSnapshot[]>;

    @Input() simName: string = '';

    //readonly themeService = inject(ThemeService);
    options!: EChartsCoreOption;
    constructor() {}

    //chartOptions: EChartsOption = {};
    chartOptions = computed(() => {
        const chartData = this.snapshots().map(s => [
            new Date(s.ts * 1000), // Convert Unix seconds to Date object
            s.agent_count,
        ]);

        console.log('chartData', chartData[0]);

        return {
            title: {
                text: `Agent Traffic Over Time (${this.simName})`,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    console.log('Params: ', params);
                    const data = params[0].value;
                    return `${data[0].toLocaleTimeString()}<br/>Agents: ${data[1]}`;
                },
            },
            xAxis: {
                type: 'time', // Sets up the time-series axis logic
                //boundaryGap: 0,
            },
            yAxis: {
                type: 'value',
                name: 'Agent Count',
                minInterval: 1, // No half-agents!
            },
            dataZoom: [
                { type: 'inside', start: 0, end: 100 }, // Allows mouse-wheel zoom
                { type: 'slider', start: 0, end: 100 },  // Adds the bottom slider
            ],
            series: [
                {
                    name: 'Agents',
                    type: 'line',
                    smooth: true,
                    symbol: 'none', // Cleaner look for many points
                    areaStyle: {
                        opacity: 0.2, // Subtle "Area" fill below the line
                    },
                    data: chartData,
                },
            ],
        };
    });

    ngOnInit(): void {
        const xAxisData = [];
        const data1 = [];
        const data2 = [];

        for (let i = 0; i < 100; i++) {
            xAxisData.push('category' + i);
            data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        }

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left',
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            yAxis: {},
            series: [
                {
                    name: 'bar',
                    type: 'bar',
                    data: data1,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'bar2',
                    type: 'bar',
                    data: data2,
                    animationDelay: (idx: number) => idx * 10 + 100,
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: idx => idx * 5,
        };
    }
}
