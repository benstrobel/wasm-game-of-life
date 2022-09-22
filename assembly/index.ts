// Inspiration:
  // https://youtu.be/0Kx4Y9TVMGg (Brainxyz - How to simulate artificial life)
  // https://youtu.be/cbB3QEwWMlA (Fireship - WASM)
// WASM Assemblyscript 1. Example: https://www.assemblyscript.org/examples/mandelbrot.html
// WASM Assemblyscript 2. Example: https://www.assemblyscript.org/examples/game-of-life.html

const base_color: u16 = 0;

export function random_create(color: u16, max_color_atoms: u16, u16_values_per_atom: u16, max_x: u16, max_y: u16):void {
  for(let a: u16 = 0; a < max_color_atoms; a ++) {
    storeAtU16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 0, get_random_in_range(max_x)) // set x to random value
    storeAtU16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 1, get_random_in_range(max_y)) // set y to random value
    storeAtU16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 2, 0) // set v_x to 0
    storeAtU16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 3, 0) // set v_y to 0
    storeAtU16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 4, color) // set color to given value
  }
}

function rule(colorIndex: u16, max_color_atoms: u16, max_x: u16, max_y: u16):void {
  let pointer = 0;
  let value = 0;

  // 5 Values for each Atom (array size of memory is size(u16) * max_color_atoms * 5 * color_count)

  store<u16>(pointer, value);
  // TODO Implement
}

export function update(max_color_atoms: u16, u16_values_per_atom: u16, max_x: u16, max_y: u16):void {
  // TODO Implement
  const image_array_offset: u16 = 3*max_color_atoms*u16_values_per_atom;
  resetImageBuffer(image_array_offset, max_x, max_y);
  render(0, max_color_atoms, u16_values_per_atom, image_array_offset, max_x);
  render(1, max_color_atoms, u16_values_per_atom, image_array_offset, max_x);
  render(2, max_color_atoms, u16_values_per_atom, image_array_offset, max_x);
}

function resetImageBuffer(image_array_offset: u16,width: u16, height: u16):void {
  for(let i: u32 = 0; i < width+height; i++) {
    storeAtU16Index(image_array_offset + i, base_color);
  }
}

function render(color_index: u16, max_color_atoms: u16, u16_values_per_atom: u16, image_array_offset: u16, width: u16): void {
  const color_offset: u32 = color_index*(max_color_atoms*u16_values_per_atom);

  for(let atom_index: u32 = 0; atom_index < max_color_atoms; atom_index++) {
    let x = readFromU16Index(color_offset+atom_index*u16_values_per_atom + 0);
    let y = readFromU16Index(color_offset+atom_index*u16_values_per_atom + 1);
    let color_value = readFromU16Index(color_offset+atom_index*u16_values_per_atom + 4);

    storeAtU16Index(image_array_offset + width*y + x, color_value);
  }
}

function get_random_in_range(max_value_exclusive: u16): u16 {
  return Math.floor((Math.random() * (max_value_exclusive as f64)) - 0.000001) as u16;
}

function storeAtU16Index(index: u32, value: u16):void {
  store<u16>(index*2, value);
}

function readFromU16Index(index: u32): u16 {
  return load<u16>(index*2);
}