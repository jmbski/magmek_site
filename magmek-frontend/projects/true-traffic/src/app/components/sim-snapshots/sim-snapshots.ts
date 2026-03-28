import { Component, Input, SimpleChanges, WritableSignal } from '@angular/core';
import { SimSnapshot } from '@tt-app/models';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'tt-sim-snapshots',
    imports: [],
    templateUrl: './sim-snapshots.html',
    styleUrl: './sim-snapshots.scss',
})
export class SimSnapshots {
    @Input() snapshots!: WritableSignal<SimSnapshot[]>;

    chartOptions: EChartsOption = {};

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['snapshots'] && this.snapshots.length > 0) {
            this.updateChart();
        }
    }

    private updateChart() {
    // Map your snapshots to the [Date, Value] format ECharts loves
        const chartData = this.snapshots().map(s => [
            new Date(s.ts * 1000), // Convert Unix seconds to Date object
            s.agent_count,
        ]);

        this.chartOptions = {
            title: {
                text: 'Agent Traffic Over Time',
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
    }

}
