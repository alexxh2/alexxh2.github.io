/* script.js: Narrative Visualization Interactive Slideshow */

// Global parameters
let currentSlide = 1;
let data;

// SVG setup
const margin = { top: 40, right: 20, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create container
const svg = d3
  .select('#viz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Tooltip
d const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

// Load data
d3.csv('education_inequality_data.csv', d3.autoType).then(raw => {
  data = raw;
  init();
});

function init() {
  // Set up buttons
  d3.select('#prevBtn').on('click', () => {
    if (currentSlide > 1) currentSlide--;
    updateSlide();
  });
  d3.select('#nextBtn').on('click', () => {
    if (currentSlide < 3) currentSlide++;
    updateSlide();
  });

  updateSlide();
}

function updateSlide() {
  svg.selectAll('*').remove();
  switch (currentSlide) {
    case 1:
      drawFundingScene();
      break;
    case 2:
      drawRatioScene();
      break;
    case 3:
      drawIncomeScene();
      break;
  }
}

// Common scatterplot scaffolding
def function drawScatter(xKey, yKey, xLabel, yLabel) {
  // Scales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d[xKey]))
    .nice()
    .range([0, width]);
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d[yKey]))
    .nice()
    .range([height, 0]);

  // Axes
d svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));
  svg.append('g').call(d3.axisLeft(y));

  // Labels
d svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text(xLabel);
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 15)
    .attr('text-anchor', 'middle')
    .text(yLabel);

  // Points
d svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => x(d[xKey]))
    .attr('cy', d => y(d[yKey]))
    .attr('r', 4)
    .attr('fill', '#ff7f0e')
    .attr('opacity', 0.7)
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(`<strong>${d.school_name}</strong><br/>${xLabel}: ${d[xKey]}<br/>${yLabel}: ${d[yKey]}`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

  return { x, y };
}

// Scene 1: Funding vs. Test Score
def function drawFundingScene() {
  const { x, y } = drawScatter(
    'funding_per_student_usd',
    'avg_test_score_percent',
    'Funding per Student (USD)',
    'Average Test Score (%)'
  );

  // Annotation\ nConst ann1 = d3
    .annotation()
    .type(d3.annotationLabel)
    .annotations([
      {
        note: {
          label: 'No clear trend: correlation ≈ 0',
          title: 'Funding vs. Score'
        },
        x: x(15000),
        y: y(85),
        dx: 40,
        dy: -30
      }
    ]);
  svg.append('g').call(ann1);
}

// Scene 2: Ratio vs. Test Score
def function drawRatioScene() {
  const { x, y } = drawScatter(
    'student_teacher_ratio',
    'avg_test_score_percent',
    'Student–Teacher Ratio',
    'Average Test Score (%)'
  );

  // Annotation\ nConst ann2 = d3
    .annotation()
    .type(d3.annotationLabel)
    .annotations([
      {
        note: {
          label: 'Some low-ratio schools score high',
          title: 'Ratio vs. Score'
        },
        x: x(12),
        y: y(95),
        dx: -60,
        dy: -40
      }
    ]);
  svg.append('g').call(ann2);
}

// Scene 3: % Low-Income vs. Test Score
def function drawIncomeScene() {
  const { x, y } = drawScatter(
    'percent_low_income',
    'avg_test_score_percent',
    'Percent Low-Income (%)',
    'Average Test Score (%)'
  );

  // Annotation\ nConst ann3 = d3
    .annotation()
    .type(d3.annotationLabel)
    .annotations([
      {
        note: {
          label: 'No strong inverse relationship',
          title: 'Income vs. Score'
        },
        x: x(60),
        y: y(75),
        dx: 50,
        dy: 30
      }
    ]);
  svg.append('g').call(ann3);
}
