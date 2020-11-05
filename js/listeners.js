const cursorActions = cursor_actions();

// Listeners
canvas_obj.addEventListener(cursorActions.down, function(e) {
  if (has_balls_rolling()) {
    return; // Do not allow throwing balls while there are other balls moving around the table.
  }
  mousedown_stats.coords = {x: e.clientX, y: e.clientY};
  //console.log(e);
  mousedown_stats.down = true;
  create_random_color();
});

canvas_obj.addEventListener(cursorActions.move, function(e) {
  mousedown_stats.current = {x: e.clientX, y: e.clientY};

  // let dx = mousedown_stats.coords.x - mousedown_stats.current.x;
  // let dy = mousedown_stats.coords.y - mousedown_stats.current.y;
  //let cos = dx / Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
  //console.log(dx, dy, Math.acos(cos));

});

// throw the white ball around!
canvas_obj.addEventListener(cursorActions.up, function(e) {
  if (!mousedown_stats.down) {
    return; // do not allow to "release" if it wasn't pressed "down"
  }
  mousedown_stats.down = false;

  score_hit_ball();
  
  // if (balls[0].rolling) {
  //   console.info("can't hit while rolling");
  //   return false;
  // }
  
  let coords = {x: e.clientX, y: e.clientY},
      distance_x = coords.x - mousedown_stats.coords.x,
      distance_y = coords.y - mousedown_stats.coords.y,

      speed_x = distance_x * speed_boost,
      speed_y = distance_y * speed_boost;

      console.log(speed_x, speed_y)
  
  // balls[0].curr_speed_x = Math.abs(speed_x);
  // balls[0].curr_speed   = Math.abs(speed_y);
  // balls[0].x_direction  = speed_x < 0 ? -1 : 1;
  // balls[0].y_direction  = speed_y < 0 ? -1 : 1;
  balls[0].curr_speed_x = speed_x;
  balls[0].curr_speed   = speed_y;
  balls[0].rolling = 1;
  balls[0].ghost = false;
});


// form_inputs.help_button.addEventListener('click', function(e) {
//   form_inputs.help_box.style.display = 'inline-block';
// });
// form_inputs.help_box.addEventListener('click', function(e) {
//   this.style.display = 'none';
// });