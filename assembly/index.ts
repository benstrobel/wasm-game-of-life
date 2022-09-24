// Inspiration:
  // https://youtu.be/0Kx4Y9TVMGg (Brainxyz - How to simulate artificial life)
  // https://youtu.be/cbB3QEwWMlA (Fireship - WASM)
// WASM Assemblyscript 1. Example: https://www.assemblyscript.org/examples/mandelbrot.html
// WASM Assemblyscript 2. Example: https://www.assemblyscript.org/examples/game-of-life.html

const base_color: u16 = 0;

export function random_create(color: u16, max_color_atoms: u16, u16_values_per_atom: u16, max_x: u16, max_y: u16):void {
  for(let a: u16 = 0; a < max_color_atoms; a ++) {
    storeAtI16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 0, get_random_in_range(max_x)) // set x to random value
    storeAtI16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 1, get_random_in_range(max_y)) // set y to random value
    storeAtI16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 2, 0) // set v_x to 0
    storeAtI16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 3, 0) // set v_y to 0
    storeAtU16Index(color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 4, color+1) // set color to given value + offset from default value

    // storeAtU16Index(3*max_color_atoms*u16_values_per_atom + color*(max_color_atoms*u16_values_per_atom) + a * u16_values_per_atom + 4, color+1) // also set colors for future frame atom
  }
}

function rule(colorIndex: u16, max_color_atoms: u16, max_x: u16, max_y: u16):void {
  let pointer = 0;
  let value = 0;

  // 5 Values for each Atom (array size of memory is size(u16) * max_color_atoms * 5 * color_count)

  store<u16>(pointer, value);
  // TODO Implement
}

export function update(object_array_offset_old: u16, object_array_offset_new: u16,max_color_atoms: u16, u16_values_per_atom: u16, max_x: u16, max_y: u16):void {
  const velocity_modifier: f32 = 0.5;
  const distance_gravity_cutoff: f32 = 300;

  for(let i = 0; i < 3*max_color_atoms; i++) {
    let fx: f32 = 0;
    let fy: f32 = 0;

    const a_old_x = readFromI16Index(object_array_offset_old + i * u16_values_per_atom + 0);
    const a_old_y = readFromI16Index(object_array_offset_old + i * u16_values_per_atom + 1);
    const a_old_v_x = readFromI16Index(object_array_offset_old + i * u16_values_per_atom + 2);
    const a_old_v_y = readFromI16Index(object_array_offset_old + i * u16_values_per_atom + 3);
    const a_color = readFromU16Index(object_array_offset_old + i * u16_values_per_atom + 4);
    for(let j = 0; j < 3*max_color_atoms; j++) {
      const b_old_x = readFromI16Index(object_array_offset_old + j * u16_values_per_atom + 0);
      const b_old_y = readFromI16Index(object_array_offset_old + j * u16_values_per_atom + 1);
      // const b_old_v_x = readFromI16Index(object_array_offset_old + j * u16_values_per_atom + 2);
      // const b_old_v_y = readFromI16Index(object_array_offset_old + j * u16_values_per_atom + 3);
      const b_color = readFromU16Index(object_array_offset_old + j * u16_values_per_atom + 4);
      const dx = a_old_x - b_old_x;
      const dy = a_old_y - b_old_y;
      const d: f32 = Math.sqrt(dx*dx + dy*dy) as f32;
      if(d > 0 && d < distance_gravity_cutoff) {
        const F = modifier_mapper(a_color, b_color) * 1.0/d;
        fx += (F*dx);
        fy += (F*dy);
      }


    }

    let a_new_v_x: i16 = Math.round((a_old_v_x + fx) * velocity_modifier) as i16;
    let a_new_v_y: i16 = Math.round((a_old_v_y + fy) * velocity_modifier) as i16;

    const new_x = a_old_x + a_old_v_x;
    const new_y = a_old_y + a_old_v_y;

    if(new_x <= 0 || new_x >= (max_x as i16)) {a_new_v_x *= -1;}
    if(new_y <= 0 || new_y >= (max_y as i16)) {a_new_v_y *= -1;}

    storeAtI16Index(object_array_offset_new + i * u16_values_per_atom + 0, a_old_x + a_new_v_x); // a_new_x
    storeAtI16Index(object_array_offset_new + i * u16_values_per_atom + 1, a_old_y + a_new_v_y); // a_new_y
    storeAtI16Index(object_array_offset_new + i * u16_values_per_atom + 2, a_new_v_x); // a_new_v_x
    storeAtI16Index(object_array_offset_new + i * u16_values_per_atom + 3, a_new_v_y); // a_new_v_y
  }
}

function modifier_mapper(color_0: u16, color_1: u16): f32 {
  const red_to_red: f32 = 0.3;
  const red_to_green: f32 = -0.1;
  const red_to_white: f32 = -0.34;

  const green_to_green: f32 = 0.0;
  const green_to_red: f32 = 0.0;
  const green_to_white: f32 = 0.0;

  const white_to_white: f32 = 0.0;
  const white_to_red: f32 = 0.0;
  const white_to_green: f32 = 0.0;

  switch(true) {
    case ((color_0 == 0) && (color_1 == 0)):
      return red_to_red;
    case ((color_0 == 0) && (color_1 == 1)):
      return red_to_green;
    case ((color_0 == 0) && (color_1 == 2)):
      return red_to_white;
    case ((color_0 == 1) && (color_1 == 0)):
      return green_to_red;
    case ((color_0 == 1) && (color_1 == 1)):
      return green_to_green;
    case ((color_0 == 1) && (color_1 == 2)):
      return green_to_white;
    case ((color_0 == 2) && (color_1 == 0)):
      return white_to_red;
    case ((color_0 == 2) && (color_1 == 1)):
      return white_to_green;
    case ((color_0 == 2) && (color_1 == 2)):
      return white_to_white;
    default:
      return 0.0;
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

function storeAtI16Index(index: u32, value: i16):void {
  store<i16>(index*2, value);
}

function readFromI16Index(index: u32): i16 {
  return load<i16>(index*2);
}