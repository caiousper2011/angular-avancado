import { Entry } from './../../entries/shared/models/entry.model';
import { EntryService } from './../../entries/shared/services/entry.service';
import { CategoryService } from './../../categories/shared/category.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Category } from '../../categories/shared/category.model';
import { currenFormatter } from 'currency-formatter';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  categories: Category[] = [];
  entries: Entry[] = [];
  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;
  expenseChartData: any;
  revenueChartData: any;
  chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .subscribe((categories) => (this.categories = categories));
  }

  generateReports(): void {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;
    if (!month || !year) {
      alert('Você precisa selecionar o mês e o ano para gerar os relatórios');
    } else {
      this.entryService
        .getByMonthAndYear(month, year)
        .subscribe((entries) => this.setValues(entries));
    }
  }

  private setValues(entries: Entry[]): void {
    this.entries = entries;
    this.caculateBalance();
    this.setChartData();
  }

  private caculateBalance(): void {
    let expenseTotal = 0;
    let revenueTotal = 0;
    this.entries.forEach((entry) => {
      let currencyFormat = Number(
        entry.amount.replace('.', '').split(',').join('.')
      );
      if (entry.type == 'revenue') {
        revenueTotal += currencyFormat;
      } else {
        expenseTotal += currencyFormat;
      }
    });

    this.expenseTotal = new Intl.NumberFormat('de-DE').format(expenseTotal);
    this.revenueTotal = new Intl.NumberFormat('de-DE').format(revenueTotal);
    this.balance = new Intl.NumberFormat('de-DE').format(
      revenueTotal - expenseTotal
    );
  }

  private setChartData(): void {
    this.revenueChartData = this.getChartData(
      'revenue',
      'Gráfico de Receitas',
      '#99CCC65'
    );

    this.expenseChartData = this.getChartData(
      'expense',
      'Gráfico de Despesas',
      '#E03131'
    );
  }

  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];
    this.categories.forEach((category) => {
      const filteredEntries = this.entries.filter(
        (entry) => entry.categoryId == category.id && entry.type == entryType
      );

      const totalAmount = filteredEntries.reduce(
        (total, entry) =>
          (total += Number(entry.amount.replace('.', '').split(',').join('.'))),
        0
      );

      chartData.push({
        categoryName: category.name,
        totalAmount,
      });
    });

    return {
      labels: chartData.map((item) => item.categoryName),
      datasets: [
        {
          label: title,
          backgroundColor: color,
          data: chartData.map((item) => item.totalAmount),
        },
      ],
    };
  }
}
