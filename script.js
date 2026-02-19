const lifestyleQuestions = [
  'Do you eat on the sofa?',
  'Do you have a cat?',
  'Do you have a dog?',
  'Do children use this room daily?',
  'Do you work from this room?',
  'Do you host more than 4 guests often?',
  'Does a vacuum robot need to pass under the bed/sofa?',
  'Do you require blackout control?',
  'Are spills likely weekly?',
  'Do you need hidden storage?'
];

const checklist = document.getElementById('lifestyleChecklist');
lifestyleQuestions.forEach((q, i) => {
  const wrapper = document.createElement('label');
  wrapper.innerHTML = `<input type="checkbox" data-q="${i}"> ${q}`;
  checklist.appendChild(wrapper);
});

function getLifestyleData() {
  return [...document.querySelectorAll('#lifestyleChecklist input')].map(c => c.checked);
}

function updateLifestyleScore() {
  const yesCount = getLifestyleData().filter(Boolean).length;
  document.getElementById('lifestyleScore').textContent = `Friction score: ${yesCount}/10. ${yesCount >= 6 ? 'High-friction room: prioritize durability + clearance.' : 'Moderate/low friction: broader material options.'}`;
  updateMaterialTable();
}

checklist.addEventListener('change', updateLifestyleScore);

function updateLightAudit() {
  const val = document.getElementById('lightOrientation').value;
  const msg = val === 'north'
    ? 'North-facing detected: compensate with warmer paint undertones and higher-lumen layered lighting.'
    : 'South-facing detected: neutral-to-cool paint balancing prevents yellow overcast drift.';
  document.getElementById('lightResult').textContent = msg;
}

document.getElementById('lightOrientation').addEventListener('change', updateLightAudit);

function updateFlowMap() {
  const w = +document.getElementById('entryPath').value;
  const hv = +document.getElementById('highVelocity').value;
  const dz = +document.getElementById('deadZones').value;
  const risk = w < 30 || hv > 3 ? 'HIGH' : 'CONTROLLED';
  document.getElementById('flowResult').textContent = `Flow risk: ${risk}. Dead zones: ${dz}. Maintain minimum 30" circulation lanes.`;
}
['entryPath', 'highVelocity', 'deadZones'].forEach(id => document.getElementById(id).addEventListener('input', updateFlowMap));

function shade(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

function generateTones() {
  const base = document.getElementById('baseColor').value;
  const warm = document.getElementById('toneDirection').value === 'warm';
  const secondary = shade(base, warm ? 18 : -18);
  const accent = shade(base, warm ? -24 : 24);

  const tones = [
    { label: '60% Base', color: base },
    { label: '30% Secondary', color: secondary },
    { label: '10% Accent', color: accent }
  ];

  const wrap = document.getElementById('toneSwatches');
  wrap.innerHTML = '';
  tones.forEach(t => {
    const el = document.createElement('div');
    el.className = 'swatch';
    el.innerHTML = `<div style="background:${t.color}"></div>${t.label}<br>${t.color}`;
    wrap.appendChild(el);
  });
}

document.getElementById('calcTones').addEventListener('click', generateTones);

function updateMaterialTable() {
  const d = getLifestyleData();
  const cat = d[1], dog = d[2], kids = d[3], spills = d[8];
  const robot = d[6];

  const rules = [
    ['Velvet', cat || dog ? 'Fail' : 'Pass', cat || dog ? 'Pet hair/snags risk' : 'No pet-triggered conflict'],
    ['Performance Linen', spills || kids ? 'Pass' : 'Pass', spills || kids ? 'Washable + stain resistance' : 'General-safe'],
    ['Bouclé', kids || spills ? 'Fail' : 'Pass', kids || spills ? 'Loop snag + stain risk' : 'Low-friction compatible'],
    ['Low-Profile Bed Frame', robot ? 'Pass' : 'Pass', robot ? 'Robot clearance required' : 'No clearance constraint'],
    ['Silk Blend', spills ? 'Fail' : 'Pass', spills ? 'Liquid sensitivity too high' : 'No weekly spill risk']
  ];

  const tbody = document.getElementById('materialTable');
  tbody.innerHTML = '';
  rules.forEach(([m, status, reason]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${m}</td><td class="${status === 'Pass' ? 'pass' : 'fail'}">${status}</td><td>${reason}</td>`;
    tbody.appendChild(tr);
  });
}

function validateStyleBoard() {
  const textures = document.getElementById('textures').value.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const shapes = document.getElementById('shapes').value.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const candidate = document.getElementById('candidateTokens').value.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);

  if (textures.length !== 5 || shapes.length !== 3) {
    document.getElementById('styleResult').textContent = 'System Error: Logic board must contain exactly 5 textures and 3 shapes.';
    return;
  }

  const allowed = new Set([...textures, ...shapes]);
  const blocked = candidate.filter(t => !allowed.has(t));
  document.getElementById('styleResult').textContent = blocked.length
    ? `System Error: ${blocked.join(', ')} not on Logic Board.`
    : 'PASS: Candidate stays inside approved texture/shape boundaries.';
}

document.getElementById('validateStyle').addEventListener('click', validateStyleBoard);

function calcBudget() {
  const total = +document.getElementById('totalBudget').value;
  const rows = [
    ['Core Furniture (40%)', 0.40],
    ['Lighting (20%)', 0.20],
    ['Textiles (15%)', 0.15],
    ['Art (10%)', 0.10],
    ['Buffer / Tax / Shipping (15%)', 0.15]
  ];
  const out = document.getElementById('budgetOutput');
  out.innerHTML = rows.map(([label, p]) => `<li>${label}: <strong>$${(total * p).toFixed(2)}</strong></li>`).join('');
}

document.getElementById('calcBudget').addEventListener('click', calcBudget);

function calcDimensions() {
  const L = +document.getElementById('roomLength').value * 12;
  const W = +document.getElementById('roomWidth').value * 12;
  const c = +document.getElementById('clearance').value;

  const longWall = Math.max(L, W);
  const maxSofa = Math.max(72, longWall - c * 2);
  const minRugL = Math.max(84, Math.min(L, W) * 0.7);
  const minRugW = Math.max(60, Math.min(L, W) * 0.5);

  document.getElementById('dimensionResult').textContent =
    `Max Sofa Length: ${Math.round(maxSofa)}". Minimum Rug Size: ${Math.round(minRugW)}" x ${Math.round(minRugL)}". ` +
    `If product dimensions exceed limits, block purchase.`;
}

document.getElementById('calcDimensions').addEventListener('click', calcDimensions);

function leadPlan() {
  const items = [
    ['Sofa', +document.getElementById('sofaWeeks').value],
    ['Rug', +document.getElementById('rugWeeks').value],
    ['Lighting', +document.getElementById('lightWeeks').value]
  ].sort((a, b) => b[1] - a[1]);

  const txt = items.map(([n, w], i) => `${i + 1}. Trigger ${n} first (${w} weeks)`).join('<br>');
  document.getElementById('leadResult').innerHTML = `${txt}<br><br>Rule: longest lead-time item must be released earliest.`;
}
document.getElementById('planLeadTime').addEventListener('click', leadPlan);

function antiRegretScore() {
  const checked = [...document.querySelectorAll('.audit')].filter(x => x.checked).length;
  document.getElementById('auditResult').textContent = checked === 4
    ? 'APPROVED: All anti-regret gates passed.'
    : `HOLD: ${4 - checked} unresolved gate(s). Do not purchase yet.`;
}
document.getElementById('auditScoreBtn').addEventListener('click', antiRegretScore);

function buildCheatSheetPNG() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111723';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#d7ecff';
  ctx.font = 'bold 54px Arial';
  ctx.fillText('Nuvic Quick Distances', 70, 100);
  ctx.font = '34px Arial';
  ['Walkway min: 30"', 'Coffee table gap: 14"-18"', 'Dining chair pull-back: 36"', 'Bed side clearance: 24" min', 'Rug under front legs: required'].forEach((line, i) => {
    ctx.fillText(`• ${line}`, 90, 220 + i * 120);
  });
  return canvas.toDataURL('image/png').split(',')[1];
}

async function downloadZip() {
  const zip = new JSZip();
  const manualPDF = `%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length 173>>stream\nBT /F1 18 Tf 72 740 Td (Nuvic Spatial Command Center - Master Manual) Tj 0 -28 Td (Why + Logic: Diagnostics -> Rules -> Math -> Sequence -> Anti-Regret.) Tj 0 -28 Td (Use Command_Center.csv for allocations, dimensions, and lead-time planning.) Tj ET\nendstream endobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000110 00000 n \n0000000256 00000 n \n0000000480 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n550\n%%EOF`;

  const commandCSV = [
    'Category,Percent,AllocatedAmount',
    'Core Furniture,40,',
    'Lighting,20,',
    'Textiles,15,',
    'Art,10,',
    'Buffer/Tax/Shipping,15,',
    '',
    'Item,LeadWeeks,TriggerOrder',
    'Sofa,,',
    'Rug,,',
    'Lighting,,'
  ].join('\n');

  zip.file('Master-Manual.pdf', manualPDF);
  zip.file('Command-Center.csv', commandCSV);
  zip.file('Cheat-Sheet-Standard-Distances.png', buildCheatSheetPNG(), { base64: true });

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Nuvic_Command_Center.zip';
  a.click();
  URL.revokeObjectURL(a.href);
}

document.getElementById('downloadZip').addEventListener('click', downloadZip);

updateLifestyleScore();
updateLightAudit();
updateFlowMap();
generateTones();
calcBudget();
calcDimensions();
leadPlan();
