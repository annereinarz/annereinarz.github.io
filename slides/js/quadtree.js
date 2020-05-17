
const linksData = [
  [1,0],[2,0],[3,0],[3,2],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[11,10],
  [11,3],[11,2],[11,0],[12,11],[13,11],[14,11],[15,11],[17,16],[18,16],
  [18,17],[19,16],[19,17],[19,18],[20,16],[20,17],[20,18],[20,19],[21,16],
  [21,17],[21,18],[21,19],[21,20],[22,16],[22,17],[22,18],[22,19],[22,20],
  [22,21],[23,16],[23,17],[23,18],[23,19],[23,20],[23,21],[23,22],[23,12],
  [23,11],[24,23],[24,11],[25,24],[25,23],[25,11],[26,24],[26,11],[26,16],
  [26,25],[27,11],[27,23],[27,25],[27,24],[27,26],[28,11],[28,27],[29,23],
  [29,27],[29,11],[30,23],[31,30],[31,11],[31,23],[31,27],[32,11],[33,11],
  [33,27],[34,11],[34,29],[35,11],[35,34],[35,29],[36,34],[36,35],[36,11],
  [36,29],[37,34],[37,35],[37,36],[37,11],[37,29],[38,34],[38,35],[38,36],
  [38,37],[38,11],[38,29],[39,25],[40,25],[41,24],[41,25],[42,41],[42,25],
  [42,24],[43,11],[43,26],[43,27],[44,28],[44,11],[45,28],[47,46],[48,47],
  [48,25],[48,27],[48,11],[49,26],[49,11],[50,49],[50,24],[51,49],[51,26],
  [51,11],[52,51],[52,39],[53,51],[54,51],[54,49],[54,26],[55,51],[55,49],
  [55,39],[55,54],[55,26],[55,11],[55,16],[55,25],[55,41],[55,48],[56,49],
  [56,55],[57,55],[57,41],[57,48],[58,55],[58,48],[58,27],[58,57],[58,11],
  [59,58],[59,55],[59,48],[59,57],[60,48],[60,58],[60,59],[61,48],[61,58],
  [61,60],[61,59],[61,57],[61,55],[62,55],[62,58],[62,59],[62,48],[62,57],
  [62,41],[62,61],[62,60],[63,59],[63,48],[63,62],[63,57],[63,58],[63,61],
  [63,60],[63,55],[64,55],[64,62],[64,48],[64,63],[64,58],[64,61],[64,60],
  [64,59],[64,57],[64,11],[65,63],[65,64],[65,48],[65,62],[65,58],[65,61],
  [65,60],[65,59],[65,57],[65,55],[66,64],[66,58],[66,59],[66,62],[66,65],
  [66,48],[66,63],[66,61],[66,60],[67,57],[68,25],[68,11],[68,24],[68,27],
  [68,48],[68,41],[69,25],[69,68],[69,11],[69,24],[69,27],[69,48],[69,41],
  [70,25],[70,69],[70,68],[70,11],[70,24],[70,27],[70,41],[70,58],[71,27],
  [71,69],[71,68],[71,70],[71,11],[71,48],[71,41],[71,25],[72,26],[72,27],
  [72,11],[73,48],[74,48],[74,73],[75,69],[75,68],[75,25],[75,48],[75,41],
  [75,70],[75,71],[76,64],[76,65],[76,66],[76,63],[76,62],[76,48],[76,58]
];

const linksDat = [
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
const links = linksDat.map(d => { return {source: d[0], target: d[1]}; })

const quadColor = '#d5aaaa',
      pointColor = 'firebrick';

// helper function to map from d3.mouse array to x/y object
function toPoint(xy) {
  return {x: xy[0], y: xy[1]};
}
function quadtree(dom, opt) {
  // init svg dom
  const w = opt.width,
        h = opt.height,
        el = d3.select(dom),
        svg = el.append('svg').attr('width', w).attr('height', h),
        gg = svg.append('g'),
        eg = gg.append('g'),
        qg = gg.append('g'),
        fg = gg.append('g'),
        lg = gg.append('g'),
        ng = gg.append('g'),
        cg = gg.append('g');

  // constants
  const baseRadius = opt.radius || 4,
        defaultExtent = [[1, 1], [513, 513]],
        defaultProbe = {x: w / 2 + 64, y: h / 2 + 64};

  // force simulation
  const nbodyForce = d3.forceManyBody(),
        linkForce = d3.forceLink(),
        xyForce = d3.forceCenter().x(w / 2).y(h / 2),
        simulation = d3.forceSimulation()
          .force('link', linkForce)
          .force('charge', nbodyForce)
          .force('center', xyForce);

  // state variables
  let theta2 = Math.sqrt(opt.theta) || 0,
      quad = null,
      size = 0,
      layout = true,
      active = false,
      probePoint = defaultProbe,
      probeDown = false,
      es, ns, obj;


  // -- INITIALIZATION --

  // initialize diagram
  function init() {
    es = eg.selectAll('line')
      .data(links)
      .enter().append('line')
        .style('stroke', 'none')
        .style('pointer-events', 'none');

    ns = ng.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', baseRadius)
        .style('fill', '#666')
        .style('fill-opacity', 1)
        .style('cursor', 'pointer');

    simulation
      .nodes(nodes)
      .on('tick', onTick);

    simulation.force('link')
      .links(links);

    reinit();
    size = 0;
    qg.selectAll('rect').style('opacity', 0);
    ns.style('fill-opacity', 1);

    // add probe interaction to visualization
    svg.on('mousemove', onProbeMove)
       .on('mousedown', onProbeDown);

    // add drag interaction to layout
    ns.call(d3.drag()
      .on('start', onDragStart)
      .on('drag', onDrag)
      .on('end', onDragEnd));

    return obj;
  }

  // reinitialize upon state change
  function reinit() {
    if (size != nodes.length) {
      initQuadTree(nodes);
    }
    quad.visitAfter(accumulate);
    quads().clear();
    ns.style('fill-opacity', 0.25);
  }

  // quadtree initialization
  function initQuadTree(nodes) {
    quad = d3.quadtree()
      .extent(defaultExtent)
      .x(d => d.x)
      .y(d => d.y);
    if (nodes) quad.addAll(nodes);
    size = nodes ? nodes.length : 0;
  }


  // -- EVENT LISTENERS --

  function onTick() {
    if (size > 0) {
      initQuadTree(nodes);
      quads();
    }
    es.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    ns.attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  function onDragStart(d) {
    if (!layout) return;
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function onDrag(d) {
    if (!layout) return;
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function onDragEnd(d) {
    if (!layout) return;
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  function onProbeMove() {
    if (active && probeDown) {
      probe(toPoint(d3.mouse(this)));
    }
  }

  function onProbeUp() {
    probeDown = false;
    window.removeEventListener('mouseup', onProbeUp);
  }

  function onProbeDown() {
    if (!active) return;

    probeDown = true;
    window.addEventListener('mouseup', onProbeUp);

    let t = d3.event.target;
    probe((t && t.localName == 'circle')
      ? t.__data__
      : toPoint(d3.mouse(this)));
  }


  // -- QUADTREE METHODS --

  // computer centers of mass
  function accumulate(quad, x1, y1, x2, y2) {
    let strength = 0, q, c, x, y, i;

    // For internal nodes, accumulate forces from child quadrants.
    if (quad.length) {
      let pid = [x1,y1,x2,y2].join(',');
      for (x = y = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c = q.value)) {
          strength += c, x += c * q.x, y += c * q.y;
          q.parent = quad;
          q.pid = pid;
        }
      }
      quad.x = x / strength;
      quad.y = y / strength;
      quad.x1 = x1;
      quad.y1 = y1;
      quad.w = x2 - x1;
      quad.h = y2 - y1;
    }

    // For leaf nodes, accumulate forces from coincident quadrants.
    else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do strength += 1;
      while (q = q.next);
    }

    quad.value = strength;
  }

  // return the quadtree path for a point as an array of extents
  function getPath(p) {
    let path = [];

    quad.visit(function(node, x1, y1, x2, y2) {
      // if point is not contained in node, abandon branch
      if (p.x < x1 || p.x >= x2 || p.y < y1 || p.y >= y2) {
        return true;
      }
      path.push({x1: x1, y1: y1, w: x2 - x1, h: y2 - y1});
    });

    return path;
  }


  // -- DIAGRAM UPDATE METHODS --

  // clear annotations
  function clear() {
    fg.html('');
    lg.html('');
    cg.html('');
    ns.style('fill-opacity', 1);
    return obj;
  }

  // collect and draw quadtree rectangles
  function quads() {
    let boxes = [];

    function processNode(node, extent, depth) {
      if (Array.isArray(node)) {
        processSplit(node, extent, depth);
      }
    }

    function processSplit(node, extent, depth) {
      let lo = extent[0],
          hi = extent[1],
          mp = [(lo[0] + hi[0]) >> 1, (lo[1] + hi[1]) >> 1];

      let e = [
        [lo, mp],
        [[mp[0], lo[1]], [hi[0], mp[1]]],
        [[lo[0], mp[1]], [mp[0], hi[1]]],
        [mp, hi]
      ];
      for (let i=0; i<4; ++i) {
        boxes.push(e[i]);
        e[i].depth = depth;
        if (node[i]) processNode(node[i], e[i], depth + 1);
      }
    }

    if (quad.root()) {
      // add quadtree root extents
      boxes.push(quad.extent().slice());
      // recurse to process quadtree content
      processNode(quad.root(), quad.extent(), 1);
    }

    qg.html('')
      .selectAll('rect').data(boxes)
     .enter().append('rect')
      .attr('x', q => q[0][0] + 0.5)
      .attr('y', q => q[0][1] + 0.5)
      .attr('width', q => q[1][0] - q[0][0])
      .attr('height', q => q[1][1] - q[0][1])
      .style('fill', 'none')
      .style('stroke', '#ddd')
      .style('line-width', 0.5);

    return obj;
  }

  // set the number of inserted points in the quadtree
  function treeSize(index) {
    let duration = 500;

    initQuadTree();

    if (index < 1) {
      size = 0;
      quads();
      fg.html('');
      cg.html('');
      ns.style('fill-opacity', 0.25);
      return;
    }
    size = index;

    let p = nodes[--index];

    // initialize quadtree
    quad.addAll(nodes.slice(0, index));

    // get initial tree path for point
    let path0 = getPath(p);

    // add point to quadtree
    quad.add(p).visitAfter(accumulate);

    // get updated tree path for point
    let path1 = getPath(p).slice(path0.length);

    if (path1.length) {
      fg.html('')
        .selectAll('rect.foo')
        .data(path1)
       .enter().append('rect')
        .attr('x', d => d.x1)
        .attr('y', d => d.y1)
        .attr('width', d => d.w)
        .attr('height', d => d.h)
        .style('pointer-events', 'none')
        .style('fill', 'none')
        .style('stroke', quadColor)
        .style('stroke-width', 2)
        .style('stroke-opacity', 1)
       .transition()
        .delay(0.5 * duration)
        .duration(duration)
        .style('stroke-opacity', 0)
        .remove();
    }

    quads();
    ns.style('fill-opacity', d => d.index <= index ? 1 : 0.25);

    cg.html('')
      .append('circle')
      .datum(p)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .style('pointer-events', 'none')
      .style('fill', pointColor)
      .style('fill-opacity', 1)
     .transition()
      .duration(duration)
      .ease(d3.easeBackOut.overshoot(2))
      .attr('r', d => baseRadius)
     .transition()
      .delay(duration)
      .duration(duration)
      .style('fill-opacity', 0)
      .remove();
  }

  // play animation of center or mass accumuluation
  function animateAccumulation() {
    let duration = 400,
        quads = [],
        queue = [],
        map = {};

    reinit();

    // collect non-leaf nodes
    quad.visitAfter(function(quad) {
      if (quad.length) quads.push(quad);
    });
    // group nodes by depth (using width as proxy)
    quads.forEach(function(q) {
      let id = q.w,
          l = map[id];
      if (!l) queue.push(map[id] = l = []);
      l.push(q);
    });
    // sort groups by ascending width (descending depth)
    queue.sort((a, b) => a[0].w - b[0].w);

    // advance the animation one step
    function advance(index) {
      if (index < 1) {
        cg.html('');
        return;
      }
      index -= 1;

      let qlist = queue[index];

      qlist.forEach(function(q) {
        let points = q.filter(function(_) { return _; });

        fg.append('rect')
          .datum(q)
          .attr('x', (d) => d.x1)
          .attr('y', (d) => d.y1)
          .attr('width', (d) => d.w)
          .attr('height', (d) => d.h)
          .style('pointer-events', 'none')
          .style('fill', 'none')
          .style('stroke', quadColor)
          .style('stroke-width', 2)
          .style('stroke-opacity', 1)
        .transition()
          .duration(2 * duration)
          .delay(3 * duration)
          .style('stroke-opacity', 0)
          .remove();

        cg.selectAll('circle.foo')
          .data(points)
        .enter().append('circle')
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .attr('r', (d) => baseRadius * (Math.sqrt(d.value) || 1))
          .style('pointer-events', 'none')
          .style('fill', pointColor)
        .transition()
          .delay(duration)
          .duration(duration)
          .ease(d3.easeCubicIn)
          .attr('cx', q.x)
          .attr('cy', q.y)
          .remove();

        cg.append('circle')
          .datum(q)
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .attr('r', 0)
          .style('pointer-events', 'none')
          .style('fill', pointColor)
        .transition()
          .delay(duration * 1.8)
          .duration(duration)
          .ease(d3.easeBackOut)
          .attr('r', (d) => baseRadius * (Math.sqrt(d.value) || 1))
        .transition()
          .delay(duration)
          .duration(duration)
          .style('fill', '#666')
          .style('fill-opacity', 0.25);
      });
    }

    const stepDuration = 3.8 * duration;

    setTimeout(() => {
      // schedule each animation step
      queue.forEach(function(q, i) {
        setTimeout(() => advance(i+1), i * stepDuration);
      });
      // upon animation end, reset view
      setTimeout(() => {
        cg.selectAll('circle')
          .transition()
          .duration(500)
          .style('fill-opacity', 0)
          .remove();
      }, (1 + queue.length) * stepDuration);
    }, 1000);
  }

  // toggle interactive force-directed layout
  function performLayout(state) {
    if (layout === state) return;
    layout = state;
    if (layout) {
      simulation.alpha(0.5).alphaTarget(0).restart();
    } else {
      simulation.stop();
    }
    ns.transition(500).style('fill-opacity', layout ? 1 : 0.25);
    es.transition(500).style('stroke-opacity', +layout);
  }

  // toggle interactive force estimation probe
  function performEstimation(state) {
    if (active === state) return;
    active = state;
    if (active) {
      reinit();
      probe(probePoint);
    } else {
      probePoint = defaultProbe;
      quads().clear();
    }
  }

  // perform force estimation relative to probe point
  function estimate() {
    clear();

    let p = probePoint;
    if (!p) return;

    let charges = [],
        boxes = [],
        fx = 0,
        fy = 0;

    quad.visit(function(quad, x1, y1, x2, y2) {
      if (!quad.value) return true;

      let x = quad.x - p.x,
          y = quad.y - p.y,
          w = x2 - x1,
          l = x * x + y * y;

      // Apply the Barnes-Hut approximation.
      if (quad.length && w * w / theta2 < l) {
        let c = {
          x: quad.x,
          y: quad.y,
          v: quad.value,
          s: 5e3 * quad.value / l
        };
        charges.push(c);
        boxes.push({x: x1, y: y1, w: w, h: y2 - y1});

        fx += x * quad.value / l;
        fy += y * quad.value / l;

        return true;
      }

      // Otherwise, process points directly.
      else if (quad.length || !l) return;

      do if (quad.data !== p) {
        charges.push({
          x: quad.data.x,
          y: quad.data.y,
          v: 1,
          s: 5e3 / l
        });
        fx += x / l;
        fy += y / l;
      } while (quad = quad.next);
    });

    fg.selectAll('rect').data(boxes)
      .enter().append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .style('pointer-events', 'none')
      .style('fill', 'none')
      .style('stroke', quadColor)
      .style('stroke-width', 2);

    lg.selectAll('path').data(charges)
      .enter().append('path')
      .style('pointer-events', 'none')
      .style('stroke', '#991151')
      .style('stroke-opacity', 0.3)
      .style('stroke-dasharray', [5, 5])
      .style('stroke-linecap', 'round')
      .style('stroke-width', d => Math.max(1, Math.min(5, d.s || 1)))
      .attr('d', d => 'M' + d.x + ',' + d.y + 'L' + p.x + ',' + p.y);

    cg.selectAll('circle').data(charges)
      .enter().append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => baseRadius * (Math.sqrt(d.v) || 1))
      .style('pointer-events', 'none')
      .style('fill', pointColor);

    ns.style('fill-opacity', 0.25);

    cg.append('circle')
      .attr('cx', p.x)
      .attr('cy', p.y)
      .attr('r', baseRadius)
      .style('pointer-events', 'none')
      .style('fill', 'white')
      .style('stroke-width', 1.5)
      .style('stroke-linecap', 'round')
      .style('stroke', '#800080');

    fx = p.x - fx * 90,
    fy = p.y - fy * 90;

    cg.append('path')
      .attr('d', 'M' + p.x + ',' + p.y + 'L' + fx + ',' + fy)
      .style('pointer-events', 'none')
      .style('fill', 'none')
      .style('stroke-width', 1.5)
      .style('stroke-linecap', 'round')
      .style('stroke', 'purple');

    return obj;
  }

  // set the probe point
  function probe(point) {
    probePoint = point;
    return estimate();
  }

  // set the Barnes-Hut theta parameter
  function theta(_) {
    theta2 = _ * _;
    return estimate();
  }

  // set the default node charge / mass
  function charge(_) {
    let c = +_;
    if (c === c) {
      nbodyForce.strength(c);
    }
    if (layout) {
      simulation.alpha(0.5).alphaTarget(0).restart();
    }
  }

  // define returned API object
  obj = {
    svg:        svg,
    quad:       quad,
    init:       init,
    size:       treeSize,
    clear:      clear,
    theta:      theta,
    charge:     charge,
    layout:     performLayout,
    estimate:   performEstimation,
    accumulate: animateAccumulation,
  };

  return init();
};
