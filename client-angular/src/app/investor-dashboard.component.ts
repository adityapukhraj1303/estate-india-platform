import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-investor-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Investor Analytics Dashboard</h1>
        <p>Real-time property market insights for Estate-India</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="label">Total Properties</span>
          <span class="value">{{ stats()?.totalProperties || 0 }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Average Price</span>
          <span class="value">₹{{ (stats()?.avgPrice | number) || '0' }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Active Leads</span>
          <span class="value">{{ stats()?.activeLeads || 0 }}</span>
        </div>
      </div>

      <section class="property-list">
        <h2>Premium Recommendations</h2>
        <div class="grid">
          <div *ngFor="let prop of properties()" class="prop-card glass">
            <div class="image-placeholder"></div>
            <h3>{{ prop.title }}</h3>
            <p class="location">{{ prop.location }}</p>
            <div class="footer">
              <span class="price">₹{{ prop.price | number }}</span>
              <button class="btn-primary">View Details</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem; background: #0a0a0b; color: white; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .dashboard-header { margin-bottom: 3rem; }
    .dashboard-header h1 { font-size: 2.5rem; background: linear-gradient(90deg, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; }
    .stat-card { background: #16161a; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a; }
    .stat-card .label { color: #94a3b8; font-size: 0.875rem; display: block; margin-bottom: 0.5rem; }
    .stat-card .value { font-size: 1.5rem; font-weight: 700; color: #f8fafc; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
    .prop-card { border-radius: 16px; padding: 1.5rem; transition: transform 0.3s ease; }
    .prop-card:hover { transform: translateY(-5px); }
    .image-placeholder { height: 180px; background: #1f1f23; border-radius: 12px; margin-bottom: 1rem; }
    .location { color: #94a3b8; margin-bottom: 1.5rem; }
    .footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-weight: 700; color: #10b981; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover { background: #2563eb; }
  `]
})
export class InvestorDashboardComponent implements OnInit {
  private analytics = inject(AnalyticsService);
  
  properties = signal<any[]>([]);
  stats = signal<any>(null);

  ngOnInit() {
    this.analytics.getProperties().subscribe(data => this.properties.set(data));
    this.analytics.getStats().subscribe(data => this.stats.set(data));
  }
}
