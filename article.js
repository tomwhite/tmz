const light = "#A2F2F1";
const dark = "steelblue";

function draw_z_curve(suffix, i) {
  const w = i % 2 == 0 ? 2 ** (i / 2) : 2 ** ((i + 1) / 2);
  const h = i % 2 == 0 ? 2 ** (i / 2) : 2 ** ((i - 1) / 2);
  const n = 2 * i;
  const z = 2 ** i - 1;

  const scale = 25;
  const svg = d3
    .select(`#container-${suffix}`)
    .append("svg")
    .attr("width", scale * w)
    .attr("height", scale * h);
  svg
    .append("g")
    .attr("transform", `translate(${scale / 2},${scale / 2})`)
    .append("path")
    .attr("id", "tmz-z-curve")
    .attr("d", z_curve_path(z, scale))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.5)
    .attr("stroke-linejoin", "round")
    .attr("pointer-events", "none");
}

function draw_tmz(suffix, i, maxI = i, showValues=false, showZCurve=false) {
  const w = maxI % 2 == 0 ? 2 ** (maxI / 2) : 2 ** ((maxI + 1) / 2);
  const h = maxI % 2 == 0 ? 2 ** (maxI / 2) : 2 ** ((maxI - 1) / 2);
  const z = 2 ** i - 1;

  const data = thue_morse_coords_z_values(i);

  const scale = 25;
  const svg = d3
    .select(`#container-${suffix}`)
    .append("svg")
    .attr("viewBox", `-1 -1 ${scale * w + 2} ${scale * h + 2}`)
    .attr("width", scale * w)
    .attr("height", scale * h)
    .append("g")
    .attr("id", `root-${suffix}`);
  svg
    .append("g")
    .attr("fill-opacity", 0.3)
    .selectAll()
    .data(data)
    .join("rect")
    .attr("fill", (d) => (d.value == 0 ? light : dark))
    .attr("x", (d) => scale * d.x)
    .attr("width", scale)
    .attr("y", (d) => scale * d.y)
    .attr("height", scale);
  if (showValues) {
    svg
      .append("g")
      .attr("font-size", 24)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .selectAll()
      .data(data)
      .join("text")
      .attr("x", (d) => scale * (d.x + 0.5))
      .attr("y", (d) => scale * (d.y + 0.5))
      .text((d) => d.value);
  }
  if (showZCurve) {
    svg
      .append("g")
      .attr("transform", `translate(${scale / 2},${scale / 2})`)
      .append("path")
      .attr("id", "tmz-z-curve")
      .attr("d", z_curve_path(z, scale))
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("pointer-events", "none");
  }
}

function expand(suffix, k) {
  const scale = 25;

  // the size of the block being expanded
  let sizex, sizey;
  if (k % 2 == 0) {
    sizex = 2 ** (k / 2);
    sizey = sizex;
  } else {
    sizex = 2 ** (1 + (k - (k % 2)) / 2);
    sizey = 2 ** ((k - (k % 2)) / 2);
  }
  const sx = scale * sizex;
  const sy = scale * sizey;

  // 0  -> 01
  // 00 -> 00
  //       11
  // where 1 is an inverted copy of 0

  const root = document.getElementById(`root-${suffix}`);

  // make two copies of root with no id
  const block0 = root.cloneNode(true);
  block0.removeAttribute("id");
  const block1 = block0.cloneNode(true);

  // remove children from root
  d3.select(`#root-${suffix}`).selectChildren().remove();

  // insert the two copies under root
  const g = d3.select(`#root-${suffix}`).append("g");
  g.append("g").attr("id", `tmz-${k}-0-${suffix}`).node().appendChild(block0);
  g.append("g").attr("id", `tmz-${k}-1-${suffix}`).node().appendChild(block1);

  if (k % 2 == 0) {
    d3.selectAll(`#tmz-${k}-1-${suffix}`).style(
      "transform",
      `translate(${sx}px,0px)`,
    );
  } else {
    d3.selectAll(`#tmz-${k}-1-${suffix}`).style(
      "transform",
      `translate(0px,${sy}px)`,
    );
  }
}

function invertRecursive(node) {
  // invert the colours of all rect elements recursively
  if (node.nodeName == "rect") {
    if (node.getAttribute("fill") == dark) {
      node.setAttribute("fill", light);
    } else if (node.getAttribute("fill") == light) {
      node.setAttribute("fill", dark);
    }
  }
  // invert the values of all text elements recursively (0->1, 1->0)
  if (node.nodeName == "text") {
    if (node.textContent == "0") {
      node.textContent = "1";
    } else if (node.textContent == "1") {
      node.textContent = "0";
    }
  }
  const children = node.children;
  for (let child of children) {
    invertRecursive(child);
  }
}

function invert(suffix, k) {
  invertRecursive(document.getElementById(`tmz-${k}-1-${suffix}`));
}

// TODO: rename
function highlight_(suffix, k) {
  const scale = 25;
  const highlight = "red";

  // the size of the block being expanded
  let sizex, sizey;
  if (k % 2 == 0) {
    sizex = 2 ** (k / 2);
    sizey = sizex;
  } else {
    sizex = 2 ** (1 + (k - (k % 2)) / 2);
    sizey = 2 ** ((k - (k % 2)) / 2);
  }
  const sx = scale * sizex;
  const sy = scale * sizey;
  for (let i = 1; i < 2; i++) {
    d3.selectAll(`#tmz-${k}-${i}-${suffix}`)
      .append("rect")
      .attr("width", sx)
      .attr("height", sy)
      .attr("fill", "none")
      .attr("stroke", highlight)
      .attr("stroke-width", 2);
    // .transition(t)
    // .style("stroke-opacity", 0);
  }
}
