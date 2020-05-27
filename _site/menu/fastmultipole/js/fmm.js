const div = d3.select(document.getElementById('d3'))
const el = div.append('div').attr('class', 'quad')

const svg = el.append('svg').attr('width', 514).attr('height', 514)
const rg = svg.append('g')
const ng = svg.append('g')

const linksData = [
  [1,0],[2,0],[3,0],[3,2],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[11,10],
  [11,3],[11,2],[11,0],[12,11],[13,11],[14,11],[15,11],[17,16],[18,16],
  [18,17],[19,16],[19,17],[19,18],[20,16],[20,17],[20,18],[20,19],[21,16],
  [21,17],[21,18],[21,19],[21,20],[22,16],[22,17],[22,18],[22,19],[22,20],
  [22,21],[23,16],[23,17],[23,18],[23,19],[23,20],[23,21],[23,22],[23,12],
  [23,11],[24,23],[24,11],[25,24],[25,23],[25,11],[26,24],[26,11],[26,16],
  [26,25],[27,11],[27,23],[27,25],[27,24],[27,26],[28,11],[28,27],[29,23],
  [29,27],[29,11],[30,23],[31,30],[31,11],[31,23],[31,27],[32,11],[33,11],
  [1,33],[2,31],[6,32],[23,5],[31,3],[32,0],[33,17],[33,16],[33,15]
];

const nodes = d3.range(34).map(i => { return {index: i}; })
const links = linksData.map(d => { return {source: d[0], target: d[1]}; })

const quadColor = '#d5aaaa',
      pointColor = 'firebrick';

const w = 514, h = 514




function createBoxes(level) {
    const boxes = []
    const boxWidth = Math.pow(2, 9 - level)
    for (let i = 0; i < Math.pow(2, level); i++) {
        for (let j = 0; j < Math.pow(2, level); j++) {
            const offset = [i * boxWidth, j * boxWidth];
            boxes.push({
                x: 1 + offset[0],
                y: 1 + offset[1],
                size: boxWidth,
                level: level
            })
        }
    }
    return boxes;
}

let maxLevel = 0

function drawBoxes() {
    let boxes = []
    for(let level=0; level<=maxLevel; level++){
        boxes = boxes.concat(createBoxes(level))
    }

    console.log("Drawing ", boxes.length, " boxes")
    const u = rg.selectAll('rect').data(boxes)
    u.enter().append('rect')
        .attr('x', q => q.x)
        .attr('y', q => q.y)
        .attr('width', q => q.size)
        .attr('height', q => q.size)
        .style('fill', 'none')
        .style('stroke', '#ddd')
        .style('stroke-width', q => 5.5 - 1*q.level)
    u.exit().remove()
}

const nbodyForce = d3.forceManyBody(),
    linkForce = d3.forceLink(),
    xyForce = d3.forceCenter().x(w / 2).y(h / 2),
    simulation = d3.forceSimulation()
        .force('link', linkForce)
        .force('charge', nbodyForce)
        .force('center', xyForce);

function onTick() {
        ns.attr('cx', d => d.x)
            .attr('cy', d => d.y);
}

function onDragStart(d) {
    d.fx = d.x;
    d.fy = d.y;
}

function onDrag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function onDragEnd(d) {
    d.fx = null;
    d.fy = null;
}

simulation
    .nodes(nodes)
    .on('tick', onTick);

simulation.force('link')
    .links(links);

function drawNodes() {
    ns = ng.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('z-index', -1)
        .attr('r', 4)
        .style('fill', '#666')
        .style('fill-opacity', 1)
        .style('cursor', 'pointer');

    ns.call(d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd));
}

drawNodes()
drawBoxes()

function setMaxLevel(newMaxLevel) {
    maxLevel = newMaxLevel
    drawBoxes()
}

let slideNode = Array.prototype.slice.call(window.parent.document.querySelectorAll('section')).filter(d => d.className.includes("present"))[0]
let button = d3.select(slideNode)
    .select('#addLevel');

button.on('change', function() {
    setMaxLevel(this.value)
})

function colorCellRed(i,j){
    
}

d3.select(slideNode).select('#markCells').on('click',function(){
    setMaxLevel(4)

    let curLevel = 2
    //choose cell based on i,j value
    colorCellRed(2,3)
})