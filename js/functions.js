function resize_elements() {
  wwidth = 600//window.innerWidth;
  wheigh = 350//window.innerHeight;
  
  canvas_obj.setAttribute('width', wwidth);
  canvas_obj.setAttribute('height', wheigh);

  var offset = canvas_obj.getBoundingClientRect();
  canvas_x = offset.left;
  canvas_y = offset.top;

  holes = [
    {x: 0,        y: 0,      distance: corner_distance},
    {x: wwidth/2, y: 0,      distance: center_distance},
    {x: wwidth,   y: 0,      distance: corner_distance},
    {x: 0,        y: wheigh, distance: corner_distance},
    {x: wwidth/2, y: wheigh, distance: center_distance},
    {x: wwidth,   y: wheigh, distance: corner_distance}
  ];

  let br = 2*ball_radius + 1;

  let balls_colors = {
    black: [0, 100, 0],
    flat: [282,44,47],
    stripe: [48, 89, 50]
  };

  balls_coords = [
    {x: wwidth/6, y: wheigh/2,                 color: [0, 100, 100 ]    },// WHITE ball
    // {x: 0.75*wwidth - 2*br, y: wheigh/2,        color: [60,  100, 50]    }, // 1
    // {x: 0.75*wwidth - br, y: wheigh/2 - br/2,   color: [208, 100, 50]    }, // 2
    // {x: 0.75*wwidth - br, y: wheigh/2 + br/2,   color: [0, 100, 50]      }, // 3
    // {x: 0.75*wwidth, y: wheigh/2 - br,          color: [300, 100, 35]    }, // 4
    // {x: 0.75*wwidth + br, y: wheigh/2 - br*0.5, color: [180, 100, 50]    }, // 5
    // {x: 0.75*wwidth, y: wheigh/2 + br,          color: [164, 100, 50]    }, // 6
    // {x: 0.75*wwidth + br, y: wheigh/2 - br*1.5, color: [0, 50, 50]       }, // 7
    // {x: 0.75*wwidth, y: wheigh/2,               color: [0, 100, 0] }, // 8
    // {x: 0.75*wwidth + br, y: wheigh/2 + br*0.5, color: [60, 95, 47]    }, // 9
    // {x: 0.75*wwidth + br, y: wheigh/2 + br*1.5, color: [200, 90, 50]    }, // 10
    // {x: 0.75*wwidth + 2*br, y: wheigh/2 - br*2, color: [0, 100, 50]     }, // 11
    // {x: 0.75*wwidth + 2*br, y: wheigh/2 - br,   color: [300, 100, 35]    }, // 12
    // {x: 0.75*wwidth + 2*br, y: wheigh/2,        color: [180, 100, 50]    }, // 13
    // {x: 0.75*wwidth + 2*br, y: wheigh/2 + br,   color: [164, 100, 50]    }, // 14
    // {x: 0.75*wwidth + 2*br, y: wheigh/2 + br*2, color: [0, 50, 50]    }, // 15
    {x: 0.75*wwidth - 2*br, y: wheigh/2,        color: balls_colors.flat    }, // 1
    {x: 0.75*wwidth - br, y: wheigh/2 - br/2,   color: balls_colors.stripe    }, // 2
    {x: 0.75*wwidth - br, y: wheigh/2 + br/2,   color: balls_colors.flat      }, // 3
    {x: 0.75*wwidth, y: wheigh/2 - br,          color: balls_colors.stripe    }, // 4
    {x: 0.75*wwidth + br, y: wheigh/2 - br*0.5, color: balls_colors.flat    }, // 5
    {x: 0.75*wwidth, y: wheigh/2 + br,          color: balls_colors.stripe    }, // 6
    {x: 0.75*wwidth + br, y: wheigh/2 - br*1.5, color: balls_colors.flat       }, // 7
    {x: 0.75*wwidth, y: wheigh/2,               color: [0, 100, 0] }, // 8
    {x: 0.75*wwidth + br, y: wheigh/2 + br*0.5, color: balls_colors.stripe    }, // 9
    {x: 0.75*wwidth + br, y: wheigh/2 + br*1.5, color: balls_colors.flat    }, // 10
    {x: 0.75*wwidth + 2*br, y: wheigh/2 - br*2, color: balls_colors.stripe     }, // 11
    {x: 0.75*wwidth + 2*br, y: wheigh/2 - br,   color: balls_colors.stripe    }, // 12
    {x: 0.75*wwidth + 2*br, y: wheigh/2,        color: balls_colors.flat  }, // 13
    {x: 0.75*wwidth + 2*br, y: wheigh/2 + br,   color: balls_colors.flat    }, // 14
    {x: 0.75*wwidth + 2*br, y: wheigh/2 + br*2, color: balls_colors.stripe    }, // 15

  ];
  num_balls = balls_coords.length;
}

function create_random_color() {

  random_color = [r(Math.random() * 360), 100, 50];
  return random_color;
}


has_balls_rolling = () => {
  balls_rolling = balls.reduce((sum, ball) => sum + ball.rolling, 0);

  if (balls_rolling === 0) {
    score_balls_stopped();
  }

  return balls_rolling;
}

/**
 * Round a value
 */
function r(v) {
  return Math.floor(v-0);
}

function is_touch_device() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
}

function cursor_actions () {
  const mouseActions = {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
    isTouch: false
  };
  if (is_touch_device()) {
    mouseActions.down = 'touchstart';
    mouseActions.move = 'touchmove',
    mouseActions.up = 'touchend'
    mouseActions.isTouch = true
  }

  return mouseActions;
}

function cursorXY (e) {
  if (cursorActions.isTouch) {
    return {x: e.touches[0].clientX, y: e.touches[0].clientY};
  } else {
    return {x: e.clientX, y: e.clientY};
  }
}