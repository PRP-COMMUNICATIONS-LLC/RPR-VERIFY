// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, signal, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';

interface KpiCard {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  description: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface BarChartData {
  category: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slaChart') slaChart!: ElementRef;
  @ViewChild('donutChart') donutChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;

  selectedDateRange = 'last7days';
  selectedCaseType = 'all';
  selectedAnalyst = 'all';

  kpiCards = signal<KpiCard[]>([
    { title: 'Total Cases', value: 1245, unit: '', trend: 'up', trendValue: 5.2, description: 'vs. last month' },
    { title: 'Open Disputes', value: 87, unit: '', trend: 'down', trendValue: 2.1, description: 'vs. last week' },
    { title: 'SLA Adherence', value: '98.5', unit: '%', trend: 'up', trendValue: 0.8, description: 'vs. last quarter' },
    { title: 'High Risk Alerts', value: 12, unit: '', trend: 'up', trendValue: 15.0, description: 'in the last 24h' },
  ]);

  slaData = signal<ChartDataPoint[]>([]);
  
  donutData = signal<DonutData[]>([
    { label: 'Resolved', value: 60, color: '#00D9FF' },
    { label: 'Pending', value: 25, color: '#F97316' },
    { label: 'Escalated', value: 15, color: '#EF4444' }
  ]);

  barChartData = signal<BarChartData[]>([
    { category: 'Type A', value: 45 },
    { category: 'Type B', value: 30 },
    { category: 'Type C', value: 20 },
    { category: 'Type D', value: 10 },
  ]);

  private dataInterval: any;

  ngOnInit() {
    this.generateMockSLAData();
    this.dataInterval = setInterval(() => {
      this.generateMockSLAData();
    }, 5000);
  }

  ngAfterViewInit() {
    this.drawSlaChart();
    this.drawDonutChart();
    this.drawBarChart();
  }

  ngOnDestroy() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }

  generateMockSLAData() {
    const newData: ChartDataPoint[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      newData.push({
        date: d.toISOString().split('T')[0],
        value: 90 + Math.random() * 10
      });
    }
    this.slaData.set(newData);
    if (this.slaChart) {
      this.drawSlaChart();
    }
  }

  drawSlaChart() {
    const data = this.slaData();
    if (!this.slaChart || data.length === 0) return;

    const element = this.slaChart.nativeElement;
    d3.select(element).select('svg').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = element.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.value)! - 1, d3.max(data, d => d.value)! + 1])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d, i) => i % 2 === 0 ? d as string : ''))
      .attr('color', '#6b7280');

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('color', '#6b7280');

    const line = d3.line<ChartDataPoint>()
      .x(d => x(d.date)! + x.bandwidth() / 2)
      .y(d => y(d.value));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#00D9FF')
      .attr('stroke-width', 2)
      .attr('d', line);
  }

  drawDonutChart() {
    const data = this.donutData();
    if (!this.donutChart || data.length === 0) return;

    const element = this.donutChart.nativeElement;
    d3.select(element).select('svg').remove();

    const width = element.clientWidth;
    const height = element.clientHeight;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<DonutData>().value(d => d.value);
    
    const arc = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const outerArc = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#2B2F33')
      .style('stroke-width', '2px');

    arcs.append('text')
      .attr('transform', d => `translate(${outerArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .style('font-size', '12px')
      .text(d => `${d.data.label} (${d.data.value}%)`);
  }

  drawBarChart() {
    const data = this.barChartData();
    if (!this.barChart || data.length === 0) return;

    const element = this.barChart.nativeElement;
    d3.select(element).select('svg').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = element.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)! + 10])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr('color', '#6b7280');

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('color', '#6b7280');

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#00D9FF');
  }
}
