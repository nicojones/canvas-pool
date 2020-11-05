let drag = 0.98, // drag of rolling ball
    bounce_loss = 0.89, // coefficient of restitution
    num_balls = 1, // initial number of balls
    has_roof = true, // whether the screen is bounded or not
    balls = [], // the balls in the canvas
    holes,
    ball_radius = 13,
    balls_initial_speed = false, // true or false?
    max_speed_hole = 25, // faster than this, it doesn't count as score
    corner_distance = 40,
    center_distance = 10,
    balls_rolling = false,
    speed_boost = 0.1, // increase to make the ball have more power
    balls_coords = [];

let wwidth, // screen width
    wheigh, // screen height. [no typo]
    canvas_x, // offset_x of canvas
    canvas_y, // offset_y
    random_color; // Random color assigned for the next ball.

// mousedown event to create balls:
let mousedown_stats = {
  coords: {x: 0, y: 0}, // coordinates where mousedown event happened
  current: {x: 0, y: 0}, // current coordinates of mouse (while mousedown active)
  down: false,
};

let scores = {
  white: 0,
  flat: 0,
  lines: 0,
  time: 0
};


// create Canvas Context
let canvas_obj = document.getElementById('canvas'),
    ctx = canvas_obj.getContext('2d');

//ctx.globalCompositeOperation = 'destination-over';
ctx.save();
/////////

$ = (element) => {
  return document.querySelectorAll(element);
}
