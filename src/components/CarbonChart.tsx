
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CarbonFootprint {
  electricity: number;
  transport: number;
  food: number;
  total: number;
}

interface CarbonChartProps {
  data: CarbonFootprint;
}

const CarbonChart: React.FC<CarbonChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Prepare data for visualization
    const chartData = [
      { category: 'Electricity', value: data.electricity, color: '#f59e0b', icon: '⚡' },
      { category: 'Transport', value: data.transport, color: '#3b82f6', icon: '🚗' },
      { category: 'Food', value: data.food, color: '#f97316', icon: '🍽️' }
    ].filter(d => d.value > 0);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.category))
      .range([0, chartWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
      .range([chartHeight, 0]);

    // Create main group
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    // Create bars with animation
    const bars = g.selectAll('.bar')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'bar');

    // Add background bars (for animation effect)
    bars.append('rect')
      .attr('x', d => xScale(d.category)!)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', chartHeight)
      .attr('fill', '#f3f4f6')
      .attr('rx', 4);

    // Add actual bars
    bars.append('rect')
      .attr('x', d => xScale(d.category)!)
      .attr('y', chartHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr('y', d => yScale(d.value))
      .attr('height', d => chartHeight - yScale(d.value));

    // Add value labels on bars
    bars.append('text')
      .attr('x', d => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr('y', chartHeight)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(d => `${d.value} kg`)
      .transition()
      .duration(1000)
      .delay(500)
      .attr('y', d => yScale(d.value) + 20);

    // Add category labels
    g.selectAll('.category-label')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'category-label')
      .attr('x', d => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr('y', chartHeight + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-weight', '600')
      .attr('font-size', '12px')
      .text(d => `${d.icon} ${d.category}`);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d} kg`);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#6b7280')
      .attr('font-size', '12px');

    // Style axis lines
    g.select('.y-axis')
      .selectAll('line')
      .attr('stroke', '#d1d5db');

    g.select('.y-axis')
      .select('.domain')
      .attr('stroke', '#d1d5db');

    // Add hover effects
    bars.selectAll('rect:last-child')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div><strong>${d.category}</strong></div>
            <div>${d.value} kg CO₂ annually</div>
            <div>${Math.round((d.value / data.total) * 100)}% of total emissions</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);
        
        tooltip.style('opacity', 0);
      });

    // Add title
    g.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Annual CO₂ Emissions by Category');

  }, [data]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-auto"></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default CarbonChart;
