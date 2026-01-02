// https://gist.github.com/jaredwinick/5073432
// http://stackoverflow.com/questions/4909263/how-to-efficiently-de-interleave-bits-inverse-morton
function deinterleave(x) {
  x = x & 0x55555555;
  x = (x | (x >> 1)) & 0x33333333;
  x = (x | (x >> 2)) & 0x0f0f0f0f;
  x = (x | (x >> 4)) & 0x00ff00ff;
  x = (x | (x >> 8)) & 0x0000ffff;
  return x;
}

// http://graphics.stanford.edu/~seander/bithacks.html#InterleaveBMN
function interleave(x, y) {
  var B = [0x55555555, 0x33333333, 0x0f0f0f0f, 0x00ff00ff];
  var S = [1, 2, 4, 8];

  x = (x | (x << S[3])) & B[3];
  x = (x | (x << S[2])) & B[2];
  x = (x | (x << S[1])) & B[1];
  x = (x | (x << S[0])) & B[0];

  y = (y | (y << S[3])) & B[3];
  y = (y | (y << S[2])) & B[2];
  y = (y | (y << S[1])) & B[1];
  y = (y | (y << S[0])) & B[0];

  z = x | (y << 1);
  return z;
};

function thue_morse_seq(n) {
  // https://gist.github.com/arnaud/ae4b5e2c6bb412fb8a274862dd1ab234
  return [...Array(n)].reduce((a) => [...a, ...a.map((i) => +!i)], [0]);
}

function thue_morse_coords_z(n) {
  // map the Thue-Morse sequence onto a z-order curve
  const tm = thue_morse_seq(n);
  let data = [];
  for (let i = 0; i < tm.length; i++) {
    let z = i;
    let x = deinterleave(z);
    let y = deinterleave(z >> 1);
    if (tm[i] == 1) {
      data.push({ x: x, y: y });
    }
  }
  return data;
}

function thue_morse_coords_z_values(n) {
  // map the Thue-Morse sequence onto a z-order curve
  const tm = thue_morse_seq(n);
  let data = [];
  for (let i = 0; i < tm.length; i++) {
    let z = i;
    let x = deinterleave(z);
    let y = deinterleave(z >> 1);
    data.push({ x: x, y: y, value: tm[i] })
  }
  return data;
}

function thue_morse_coords_xor(n) {
  // xor the x and y values of the Thue-Morse sequence
  // TODO: don't need this long a seq
  const tm = thue_morse_seq(2 * n);
  let data = [];
  for (let x = 0; x < 2 * n; x++) {
    for (let y = 0; y < 2 * n; y++) {
      let v = tm[x] ^ tm[y];
      if (v == 1) {
        data.push({ x: x, y: y });
      }
    }
  }
  return data;
}

function z_curve_path(z, scale) {
  let d = "M 0 0 ";
  for (let i = 0; i <= z; i++) {
    let x = deinterleave(i);
    let y = deinterleave(i >> 1);
    d += `L ${scale * x} ${scale * y} `;
  }
  return d;
}
