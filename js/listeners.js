const cursorActions = cursor_actions();

// Listeners
canvas_obj.addEventListener(cursorActions.down, function(e) {
  if (has_balls_rolling()) {
    return; // Do not allow throwing balls while there are other balls moving around the table.
  }
  mousedown_stats.coords = mousedown_stats.current = cursorXY(e);
  mousedown_stats.down = true;
  create_random_color();
});

canvas_obj.addEventListener(cursorActions.move, function(e) {
  mousedown_stats.current = cursorXY(e);
});

// throw the white ball around!
canvas_obj.addEventListener(cursorActions.up, function(e) {
  if (!mousedown_stats.down) {
    return; // do not allow to "release" if it wasn't pressed "down"
  }
  mousedown_stats.down = false;

  score_hit_ball();
  
  let distance_x = mousedown_stats.current.x - mousedown_stats.coords.x,
      distance_y = mousedown_stats.current.y - mousedown_stats.coords.y,

      speed_x = distance_x * speed_boost,
      speed_y = distance_y * speed_boost;

  balls[0].curr_speed_x = speed_x;
  balls[0].curr_speed   = speed_y;
  balls[0].rolling = 1;
  balls[0].ghost = false;
});