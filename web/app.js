/**
 * BrandFlow Marketing Plan Dashboard
 * Dynamically renders all sections from JSON data with interactive charts.
 */

// ── Embedded sample data (fallback when not served via API) ──
const SAMPLE_DATA = null; // Will try API first

const NAV_SECTIONS = [
  { id: 'overview',    icon: '📊', label: 'Overview' },
  { id: 'summary',     icon: '🏢', label: 'Business Summary' },
  { id: 'swot',        icon: '🎯', label: 'SWOT Analysis' },
  { id: 'initiatives', icon: '🚀', label: 'Initiatives' },
  { id: 'market',      icon: '👥', label: 'Target Market' },
  { id: 'competitors', icon: '⚔️', label: 'Competitors' },
  { id: 'strategy',    icon: '📋', label: 'Market Strategy' },
  { id: 'budget',      icon: '💰', label: 'Budget' },
  { id: 'channels',    icon: '📡', label: 'Channels' },
  { id: 'technology',  icon: '🔧', label: 'Technology' },
];

const CHART_COLORS = [
  'rgba(102, 126, 234, 0.85)',
  'rgba(118, 75, 162, 0.85)',
  'rgba(0, 210, 255, 0.85)',
  'rgba(240, 147, 251, 0.85)',
  'rgba(67, 233, 123, 0.85)',
  'rgba(233, 69, 96, 0.85)',
];
const CHART_BORDERS = [
  '#667eea', '#764ba2', '#00d2ff', '#f093fb', '#43e97b', '#e94560',
];

let appData = null;

// ── Data Loading ──
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      appData = await res.json();
      return;
    }
  } catch (_) { /* API not available, use inline fetch */ }

  try {
    const res = await fetch('../data/sample_marketing_plan.json');
    if (res.ok) { appData = await res.json(); return; }
  } catch (_) {}

  try {
    const res = await fetch('data/sample_marketing_plan.json');
    if (res.ok) { appData = await res.json(); return; }
  } catch (_) {}

  // Hardcoded minimal fallback
  appData = getFallbackData();
}

function getFallbackData() {
  return {
    company: { name: "Sample Company", hq_location: "N/A", mission: "N/A" },
    plan_year: "2026", objective: "No data loaded.",
    authors: [], marketing_leaders: [],
    swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    initiatives: [], target_market: { industries: [], buyer_personas: [], competitors: [] },
    market_strategy: { product: "", price: "", promotion: "", people: "", process: "", services: [] },
    budget: { expenses: [], total: 0, currency: "USD" },
    marketing_channels: [], marketing_technology: []
  };
}

// ── Navigation ──
function buildNav() {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = NAV_SECTIONS.map(s =>
    `<a class="nav-item" href="#${s.id}" data-section="${s.id}">
      <span class="icon">${s.icon}</span><span>${s.label}</span>
    </a>`
  ).join('');

  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      nav.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Highlight first
  const first = nav.querySelector('.nav-item');
  if (first) first.classList.add('active');

  // Intersection observer for auto-highlight
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        nav.querySelectorAll('.nav-item').forEach(n => {
          n.classList.toggle('active', n.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  NAV_SECTIONS.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
}

// ── Render Helpers ──
function $(tag, cls, html) {
  return `<${tag} class="${cls || ''}">${html || ''}</${tag}>`;
}

function cardWrap(id, iconClass, icon, title, content) {
  return `<section class="card section" id="${id}">
    <div class="card-header">
      <div class="card-title"><span class="icon ${iconClass}">${icon}</span>${title}</div>
    </div>
    ${content}
  </section>`;
}

// ── Section Builders ──
function renderOverview(d) {
  const totalBudget = d.budget.total;
  const numInitiatives = d.initiatives.length;
  const numChannels = d.marketing_channels.length;
  const numCompetitors = d.target_market.competitors.length;

  const stats = `
    <div class="grid-4">
      <div class="stat-card">
        <div class="stat-value">$${(totalBudget / 1000).toFixed(0)}K</div>
        <div class="stat-label">Total Budget</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${numInitiatives}</div>
        <div class="stat-label">Initiatives</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${numChannels}</div>
        <div class="stat-label">Channels</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${numCompetitors}</div>
        <div class="stat-label">Competitors</div>
      </div>
    </div>`;

  return `<section class="section" id="overview">
    <div class="page-header">
      <div>
        <h2>${d.company.name} — Marketing Plan</h2>
        <p>${d.objective}</p>
      </div>
      <div class="header-badges">
        <span class="badge live">FY ${d.plan_year}</span>
        <span class="badge">${d.authors.map(a => a.name).join(' & ')}</span>
      </div>
    </div>
    ${stats}
  </section>`;
}

function renderSummary(d) {
  const leaders = d.marketing_leaders.map(l => `
    <div class="leader-card">
      <div class="leader-avatar">${l.name.charAt(0)}</div>
      <div>
        <h4>${l.name}</h4>
        <div class="title-role">${l.title}</div>
        <p>${l.bio}</p>
      </div>
    </div>`).join('');

  const content = `
    <p style="color:var(--text-secondary);font-size:14px;margin-bottom:8px;">
      <strong>${d.company.name}</strong> is headquartered in ${d.company.hq_location}.
    </p>
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px;line-height:1.6;">
      <strong>Mission:</strong> ${d.company.mission}
    </p>
    <h3 style="font-size:15px;margin-bottom:14px;">Marketing Leaders</h3>
    ${leaders}`;

  return cardWrap('summary', 'blue', '🏢', 'Business Summary', content);
}

function renderSwot(d) {
  const s = d.swot;
  const cell = (cls, title, icon, items) => `
    <div class="swot-cell ${cls}">
      <h4>${icon} ${title}</h4>
      <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`;

  const content = `<div class="swot-grid">
    ${cell('strengths', 'Strengths', '💪', s.strengths)}
    ${cell('weaknesses', 'Weaknesses', '⚠️', s.weaknesses)}
    ${cell('opportunities', 'Opportunities', '🌟', s.opportunities)}
    ${cell('threats', 'Threats', '🔥', s.threats)}
  </div>`;

  return cardWrap('swot', 'green', '🎯', 'SWOT Analysis', content);
}

function renderInitiatives(d) {
  const cards = d.initiatives.map((ini, i) => `
    <div class="initiative-card">
      <h4>Initiative ${i + 1}: ${ini.name}</h4>
      <p>${ini.description}</p>
      <div class="meta">
        <span>🎯 ${ini.goal}</span>
      </div>
      <div class="meta">
        <span>📈 ${ini.metrics}</span>
      </div>
    </div>`).join('');

  return cardWrap('initiatives', 'purple', '🚀', 'Business Initiatives',
    `<div class="grid-3">${cards}</div>`);
}

function renderMarket(d) {
  const tm = d.target_market;

  const industries = tm.industries.map(ind => `
    <div class="stat-card" style="text-align:left;padding:18px;">
      <h4 style="font-size:14px;font-weight:600;margin-bottom:8px;">${ind.name}</h4>
      <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;">${ind.description}</p>
    </div>`).join('');

  const personas = tm.buyer_personas.map(bp => `
    <div class="persona-card">
      <div class="persona-avatar">${bp.name.charAt(0)}</div>
      <h4>${bp.name}</h4>
      <p>${bp.description}</p>
    </div>`).join('');

  const content = `
    <h3 style="font-size:15px;margin-bottom:14px;">Target Industries</h3>
    <div class="grid-2" style="margin-bottom:24px;">${industries}</div>
    <h3 style="font-size:15px;margin-bottom:14px;">Buyer Personas</h3>
    <div class="grid-2">${personas}</div>`;

  return cardWrap('market', 'teal', '👥', 'Target Market', content);
}

function renderCompetitors(d) {
  const comps = d.target_market.competitors;
  const rows = comps.map(c => `
    <tr>
      <td style="font-weight:600;color:var(--text-primary);">${c.name}</td>
      <td>${c.compete}</td>
      <td>${c.win}</td>
    </tr>`).join('');

  const content = `
    <table class="data-table">
      <thead><tr>
        <th>Competitor</th><th>How They Compete</th><th>How We Win</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  return cardWrap('competitors', 'red', '⚔️', 'Competitive Analysis', content);
}

function renderStrategy(d) {
  const ms = d.market_strategy;
  const items = [
    { key: 'product', label: 'Product', icon: '📦' },
    { key: 'price', label: 'Price', icon: '💲' },
    { key: 'promotion', label: 'Promotion', icon: '📣' },
    { key: 'people', label: 'People', icon: '👤' },
    { key: 'process', label: 'Process', icon: '⚙️' },
  ];

  const services = (ms.services || []).map(s =>
    `<span class="badge" style="margin:3px;">${s}</span>`).join('');

  const content = items.map(it => `
    <details class="strategy-item" ${it.key === 'product' ? 'open' : ''}>
      <summary>${it.icon} ${it.label}</summary>
      <div class="strategy-content">${ms[it.key]}</div>
    </details>`).join('') +
    (services ? `<div style="margin-top:16px;"><strong style="font-size:13px;">Services:</strong><br><div style="margin-top:8px;">${services}</div></div>` : '');

  return cardWrap('strategy', 'orange', '📋', 'Market Strategy', content);
}

function renderBudget(d) {
  const b = d.budget;
  const rows = b.expenses.map(e => `
    <tr>
      <td>${e.name}</td>
      <td class="amount-cell">$${e.amount.toLocaleString()}</td>
    </tr>`).join('');

  const content = `
    <div class="grid-2">
      <div>
        <table class="data-table">
          <thead><tr><th>Expense</th><th>Amount</th></tr></thead>
          <tbody>
            ${rows}
            <tr class="total-row"><td>TOTAL</td><td>$${b.total.toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="chart-container">
        <canvas id="budgetChart"></canvas>
      </div>
    </div>`;

  return cardWrap('budget', 'teal', '💰', 'Budget', content);
}

function renderChannels(d) {
  const chs = d.marketing_channels;
  const rows = chs.map(ch => `
    <tr>
      <td style="font-weight:600;color:var(--text-primary);">${ch.name}</td>
      <td>${ch.purpose}</td>
      <td>${ch.metrics}</td>
      <td class="amount-cell">${ch.target_value.toLocaleString()}</td>
    </tr>`).join('');

  const content = `
    <table class="data-table" style="margin-bottom:24px;">
      <thead><tr><th>Channel</th><th>Purpose</th><th>Metrics</th><th>Target</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="chart-container">
      <canvas id="channelChart"></canvas>
    </div>`;

  return cardWrap('channels', 'pink', '📡', 'Marketing Channels', content);
}

function renderTechnology(d) {
  const cards = d.marketing_technology.map(t => `
    <div class="tech-card">
      <div class="tech-icon">🔧</div>
      <div>
        <h4>${t.name}</h4>
        <div class="category">${t.category}</div>
        <p>${t.description}</p>
      </div>
    </div>`).join('');

  return cardWrap('technology', 'blue', '🔧', 'Marketing Technology',
    `<div class="grid-2">${cards}</div>`);
}

// ── Charts ──
function initCharts(d) {
  // Budget Pie
  const budgetCtx = document.getElementById('budgetChart');
  if (budgetCtx) {
    new Chart(budgetCtx, {
      type: 'doughnut',
      data: {
        labels: d.budget.expenses.map(e => e.name),
        datasets: [{
          data: d.budget.expenses.map(e => e.amount),
          backgroundColor: CHART_COLORS,
          borderColor: 'rgba(10, 14, 26, 0.8)',
          borderWidth: 3,
          hoverOffset: 12,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true }
          },
          title: {
            display: true,
            text: 'Budget Allocation',
            color: '#f1f5f9',
            font: { family: 'Inter', size: 14, weight: '600' },
            padding: { bottom: 16 }
          }
        },
        cutout: '55%',
        animation: { animateRotate: true, duration: 1200 }
      }
    });
  }

  // Channel Bar
  const channelCtx = document.getElementById('channelChart');
  if (channelCtx) {
    new Chart(channelCtx, {
      type: 'bar',
      data: {
        labels: d.marketing_channels.map(c => c.name),
        datasets: [{
          label: 'Target Value',
          data: d.marketing_channels.map(c => c.target_value),
          backgroundColor: CHART_COLORS,
          borderColor: CHART_BORDERS,
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Channel Target Values',
            color: '#f1f5f9',
            font: { family: 'Inter', size: 14, weight: '600' },
            padding: { bottom: 16 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
          }
        },
        animation: { duration: 1000, easing: 'easeOutQuart' }
      }
    });
  }
}

// ── PDF Generation ──
function generatePdf() {
  // Try API first
  fetch('/api/generate-pdf')
    .then(res => {
      if (!res.ok) throw new Error('API unavailable');
      return res.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Marketing_Plan_Report.pdf';
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      alert('PDF generation requires the Report Agent server.\n\nRun: python report_agent.py serve');
    });
}

// ── Main Render ──
function render(d) {
  const main = document.getElementById('mainContent');
  main.innerHTML = [
    renderOverview(d),
    renderSummary(d),
    renderSwot(d),
    renderInitiatives(d),
    renderMarket(d),
    renderCompetitors(d),
    renderStrategy(d),
    renderBudget(d),
    renderChannels(d),
    renderTechnology(d),
  ].join('');

  buildNav();
  // Defer chart init so canvas elements are in DOM
  requestAnimationFrame(() => initCharts(d));
}

// ── Boot ──
(async function boot() {
  await loadData();
  if (appData) {
    render(appData);
  } else {
    document.getElementById('mainContent').innerHTML =
      '<p style="padding:40px;color:var(--text-muted);">Failed to load data.</p>';
  }
})();
