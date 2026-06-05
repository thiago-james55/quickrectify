import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { RequestHandlerService } from '../../services/request-handler.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css', '../../../global.css'],
    imports: [NavbarComponent, FooterComponent, PageTitleComponent]
})
export class HomeComponent {


    @ViewChild('weeklyChart')
    weeklyChart!: ElementRef<HTMLCanvasElement>;

    @ViewChild('monthlyChart')
    monthlyChart!: ElementRef<HTMLCanvasElement>;

    @ViewChild('yearlyChart')
    yearlyChart!: ElementRef<HTMLCanvasElement>;

    @ViewChild('topClientsMonthlyChart')
    topClientsMonthlyChart!: ElementRef<HTMLCanvasElement>;

    @ViewChild('topClientsYearlyChart')
    topClientsYearlyChart!: ElementRef<HTMLCanvasElement>;

    constructor(private _requestHandlerService: RequestHandlerService,) {

    }

    async ngOnInit() {
        await this.loadCharts();
    }

    private async loadCharts(): Promise<void> {

        const response = await this._requestHandlerService.getCharts();

        this.createChart(
            this.weeklyChart.nativeElement,
            'Peças Semanal',
            response.weekly
        );

        this.createChart(
            this.monthlyChart.nativeElement,
            'Peças Mensal',
            response.monthly
        );

        this.createChart(
            this.yearlyChart.nativeElement,
            'Peças Anual',
            response.yearly
        );

        this.createChart(
            this.topClientsMonthlyChart.nativeElement,
            'Top Clientes Mês',
            response.topClientsMonthly
        );

        this.createChart(
            this.topClientsYearlyChart.nativeElement,
            'Top Clientes Ano',
            response.topClientsYearly
        );
    }

private createChart(
    canvas: HTMLCanvasElement,
    title: string,
    data: any[],
) {

    const labels = data.map(x => x.label);
    const values = data.map(x => x.value);

    const colors = data.map((_, index) =>
        this.generateColor(index, data.length)
    );

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

    generateColor(index: number, total: number): string {
        const hue = (index * 360) / total;
        return `hsl(${hue}, 70%, 60%)`;
    }



}
