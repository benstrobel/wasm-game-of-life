// The entry file of your WebAssembly module.

// Example: https://www.assemblyscript.org/examples/mandelbrot.html
// 2nd Exmpl: https://www.assemblyscript.org/examples/game-of-life.html

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

export function update(max_color_atoms: u16, max_x: u16, max_y: u16):void {
  // TODO Implement
}

function get_random_in_range(max_value_exclusive: u16): u16 {
  return Math.floor((Math.random() * (max_value_exclusive as f64)) - 0.000001) as u16;
}

function storeAtU16Index(index: u32, value: u16):void {
  store<u16>(index*2, value);
}

function readFromU16Index(index: u16): u16 {
  return load<u16>(index*2);
}