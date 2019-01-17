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
    balls_coords = [];

let wwidth, // screen width
    wheigh, // screen height. [no typo]
    canvas_x, // offset_x of canvas
    canvas_y, // offset_y
    random_color; // Random color assigned for the next ball.

// mousedown event to create balls:
let mousedown_stats = {
  coords: {x: 0, y: 0},
  current: {x: 0, y: 0},
  time: 0,
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

// Settings form
// const form_inputs = {
//   visible:     document.getElementById('keep_visible'),
//   help_button: document.getElementById('help_button'),
//   help_box:    document.getElementById('help'),
// };

$ = (element) => {
  return document.querySelectorAll(element);
}

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
    flat: [60, 100, 40],
    stripe: [208,80,30]
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
    {x: 0.75*wwidth - br, y: wheigh/2 - br/2,   color: balls_colors.flat    }, // 2
    {x: 0.75*wwidth - br, y: wheigh/2 + br/2,   color: balls_colors.flat      }, // 3
    {x: 0.75*wwidth, y: wheigh/2 - br,          color: balls_colors.flat    }, // 4
    {x: 0.75*wwidth + br, y: wheigh/2 - br*0.5, color: balls_colors.flat    }, // 5
    {x: 0.75*wwidth, y: wheigh/2 + br,          color: balls_colors.flat    }, // 6
    {x: 0.75*wwidth + br, y: wheigh/2 - br*1.5, color: balls_colors.flat       }, // 7
    {x: 0.75*wwidth, y: wheigh/2,               color: [0, 100, 0] }, // 8
    {x: 0.75*wwidth + br, y: wheigh/2 + br*0.5, color: balls_colors.stripe    }, // 9
    {x: 0.75*wwidth + br, y: wheigh/2 + br*1.5, color: balls_colors.stripe    }, // 10
    {x: 0.75*wwidth + 2*br, y: wheigh/2 - br*2, color: balls_colors.stripe     }, // 11
    {x: 0.75*wwidth + 2*br, y: wheigh/2 - br,   color: balls_colors.stripe    }, // 12
    {x: 0.75*wwidth + 2*br, y: wheigh/2,        color: balls_colors.stripe    }, // 13
    {x: 0.75*wwidth + 2*br, y: wheigh/2 + br,   color: balls_colors.stripe    }, // 14
    {x: 0.75*wwidth + 2*br, y: wheigh/2 + br*2, color: balls_colors.stripe    }, // 15

  ];
  num_balls = balls_coords.length;
}

function create_random_color() {

  random_color = [r(Math.random() * 360), 100, 50];
  return random_color;
}

class Ball {

  constructor(color, v_0, vx_0, y_0, x_0, ball_number) {
    "use strict";

    color = color || create_random_color();

    this.color = color;
    this.radius = ball_radius; // radius of ball, in px;
    this.y = this.y_0 = y_0 || r(wheigh * Math.random() * 0.8 + wheigh * 0.2); // distance of bottom of ball to surface
    this.y_direction = (v_0 != 0 ? (v_0 > 0 ? 1 : -1) : (Math.random() > 0.5 ? 1 : -1));
    this.curr_speed = this.v_0 = (vx_0 + v_0) ? Math.abs(Number(v_0)) : Number(balls_initial_speed) * Math.random() * 15;

    this.x = this.x_0= x_0 || r((wwidth - 100) * Math.random());
    this.x_direction = (vx_0 != 0 ? (vx_0 > 0 ? 1 : -1) : (Math.random() > 0.5 ? 1 : -1));
    this.curr_speed_x = this.vx_0 = (vx_0 + v_0) ? Math.abs(Number(vx_0)) : Number(balls_initial_speed) * Math.random() * 15;

    this.created = + new Date();
    this.rolling = 1;

    this.number = ball_number || false;

    this.curr_speed_x *= this.x_direction;
    this.curr_speed   *= this.y_direction;
  }

  // draw the ball.
  draw() {
    let cx = this.x,
        cy = this.y,
        br = this.radius * 0.2,
        grd = ctx.createRadialGradient(cx - br, cy - br, 0, cx, cy, this.radius);
    
    grd.addColorStop(1, 'hsl(' + this.color[0] + ',' + this.color[1] + '%,' + this.color[2] + '%)');
    grd.addColorStop(0, "#eee");

    let c = new Circle(cx, cy, this.radius, grd);

    if (this.number && !this.rolling) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "#000000";
      ctx.fillText(this.number, cx - 5, cy + 3); 
    }

    c.fill(ctx);

    
    ctx.restore();
  }

  isNearHole(x, y, distance) {
    
    // If it's going too fast, you can't score.
    if (this.curr_speed + this.curr_speed_x > max_speed_hole) {
      return false;
    }

    // Check if the ball is near one of the six holes.
    for (let i = 0; i < 6; ++i) {
      if (y === holes[i].y && Math.abs(this.x - holes[i].x) < holes[i].distance) {
        return true;
      }
      if (x === holes[i].x && Math.abs(this.y - holes[i].y) < holes[i].distance) {
        return true;
      }
    }
    return false;
  }

  isNearBall(current_ball_i) {
    if (current_ball_i === 0 && balls[0].ghost === 1) return [];
    
    let collisions = [];
    for (let j = current_ball_i + 1; j < num_balls; ++j) {
      if (Math.abs(balls[j].x - this.x) < 2 * ball_radius
       && Math.abs(balls[j].y - this.y) < 2 * ball_radius) {
        // they are pretty close. So we do pythagoras:
        if (
          Math.pow(balls[j].x - this.x, 2)
          + Math.pow(balls[j].y - this.y, 2)
          < 4 * ball_radius * ball_radius
        ) {
          // there's a collision:
          //collisions.push(j);
          collisions = [j];
          score_hit_color_ball(j);
        }
      }
    }
    return collisions;
  }

  collisions(collisions) {
    for (let i = 0; i < collisions.length; ++i) {
      let collision = collisions[i],
          bc = balls[collision];

      let dx = this.x - bc.x,
          dy = this.y - bc.y,

          angle = Math.atan2(dy, dx),
          cos = Math.cos(angle),
          sin = Math.sin(angle);
          //cos = dx / (2 * ball_radius),
          //sin = dy / (2 * ball_radius);

      let new_speed1_x =  cos * this.curr_speed_x + sin * this.curr_speed,
          new_speed1_y = -sin * this.curr_speed_x + cos * this.curr_speed,
          new_speed2_x =  cos * bc.curr_speed_x   + sin * bc.curr_speed,
          new_speed2_y = -sin * bc.curr_speed_x   + cos * bc.curr_speed;


      this.curr_speed_x = cos * new_speed2_x - sin * new_speed1_y;
      this.curr_speed   = sin * new_speed2_x + cos * new_speed1_y;
      balls[collision].curr_speed_x = cos * new_speed1_x - sin * new_speed2_y;
      balls[collision].curr_speed   = sin * new_speed1_x + cos * new_speed2_y;

      let buff_x_dir = balls[collision].x_direction,
          buff_y_dir = balls[collision].y_direction;

      balls[collision].x_direction  = this.x_direction;
      balls[collision].y_direction  = this.y_direction;

      // this.curr_speed_x = this.curr_speed_x + buff_x * cos2 + buff_y * sin2;
      // this.curr_speed   = this.curr_speed   + buff_y * cos2 + buff_x * cos2;
      this.x_direction  = buff_x_dir;
      this.y_direction  = buff_y_dir;

      let separator = 1;
      this.x += (this.x > balls[collision].x) ? separator : -separator;
      this.y += (this.y > balls[collision].y) ? separator : -separator;

      balls[collision].rolling = this.rolling = 1;
    }
  }
}

class Circle {
  constructor(x, y, r, color) {
    "use strict";
    this.x = (x === null) ? 0 : x;
    this.y = (y === null) ? 0 : y;
    this.r = (r === null) ? ball_radius : r;
    this.fillStyle = (color === null) ? '#000000' : color;
    
  }

  fill(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.fillStyle;
      ctx.fill();
      ctx.closePath();
  }
}

class Cue {
  constructor(offset, angle) { 
    this.color = '#f39c12';
    this.length = 300;
    this.width1 = 10;
    this.width2 = 30;
    this.origin = origin;
    this.offset = offset;
    this.angle  = angle;
  }

  fill(ctx) {
    return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.offset.x, this.offset.y);
    ctx.lineTo(this.offset.x - this.length, this.offset.y);
    ctx.lineTo(this.offset.x - this.length, this.offset.y - this.width2);
    ctx.lineTo(this.offset.x, this.offset.y - this.width1);
    ctx.closePath();
    ctx.fill();
  }

}


animate = () => {

  ctx.restore();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, wwidth, wheigh); // clear canvas

  for (let i = 0; i < num_balls; ++i) {
    const b = balls[i];
        // scored or not
    let hole = false,
        // if Y bounced and X bounces, it's a corner shot.
        y_bound = null;

    if (balls[i].rolling) {

      // Y direction
      balls[i].y += b.curr_speed;

      // if bounces VERTICALLY with the BOTTOM
      if (balls[i].y + b.radius > wheigh) {
        balls[i].y = wheigh - b.radius;
        // balls[i].y_direction = -1;
        balls[i].curr_speed *= bounce_loss * -1;

        y_bound = wheigh;
        hole = balls[i].isNearHole(null, y_bound, 10)
      }

      // if bounces VERTICALLY with TOP
      if (b.y - b.radius < 0) {
        balls[i].y = 2*b.radius - b.y;
        // balls[i].y_direction = 1;
        balls[i].curr_speed *= bounce_loss * -1;

        y_bound = 0;
        hole = balls[i].isNearHole(null, y_bound, 10)
      }

      // X direction

      balls[i].x += b.curr_speed_x;
      
      // if bounces HORIZONTALLY with RIGHT
      if (b.x + b.radius > wwidth) {
        // balls[i].x_direction = -1;
        balls[i].curr_speed_x *= bounce_loss * -1;

        hole = balls[i].isNearHole(wwidth, y_bound, 15)
      }

      // if bounces HORIZONTALLY with LEFT
      if (b.x - b.radius < 0) {
        // balls[i].x_direction = 1;
        balls[i].curr_speed_x *= bounce_loss * -1;
        
        hole = balls[i].isNearHole(0, y_bound, 15)
      }

      // adjust speed because of rolling drag
      balls[i].curr_speed_x *= drag;
      balls[i].curr_speed   *= drag;

      // if speed is too small, stop the ball altogether.
      if (Math.abs(b.curr_speed_x) + Math.abs(b.curr_speed) < 0.1) {
        balls[i].rolling = 0;

        has_balls_rolling();
      } else {
        balls[i].rolling = 1;
      }
    }

    // collisions:
    var collisions = balls[i].isNearBall(i)
    if (collisions.length) {
      //console.log("collision!", i, collisions);
      // calculate collision with
      balls[i].collisions(collisions);
    }

    //console.log(balls[i].curr_speed, balls[i].curr_speed_x, balls[i].rolling)

    // if didn't score the ball, draw it
    if (!hole) {
      // DRAW
      balls[i].draw();
    }

    // ELSE: we scored. If the ball is the WHITE ball, we reposition it.
    else if (i === 0) {

      score_score_ball(0);

      // white ball has been scored...
      balls[i].v_0 = balls[i].vx_0 = balls[i].curr_speed = balls[i].curr_speed_x = 0;
      balls[i].x = balls_coords[0].x;
      balls[i].y = balls_coords[0].y;
      balls[i].ghost = 1;
      balls[i].draw();
    }
    else
    {

      score_score_ball(b.number);

      // Delete the ball foreeeever
      balls.splice(i, 1);

      // reset counters, to be sure we're doing it ok. There's probably a more beautiful way.
      --i;
      --num_balls;
    }
  }

  // mouse line
  if (mousedown_stats.down) {
    ctx.beginPath();
    ctx.moveTo(balls[0].x, balls[0].y);
    ctx.lineTo(
      mousedown_stats.coords.x - mousedown_stats.current.x + balls[0].x,
      mousedown_stats.coords.y - mousedown_stats.current.y + balls[0].y
      );
    ctx.lineWidth = 5;

    let fadeout = Math.pow(0.9, (((+ new Date()) - mousedown_stats.time)/100));
    ctx.strokeStyle = 'hsla(' + random_color[0] + ',100%,50%,' + fadeout + ')';
    ctx.stroke(); 

    /*let cue = new Cue(
      {x: mousedown_stats.coords.x - canvas_x,  y: mousedown_stats.coords.y - canvas_y},
      {x: mousedown_stats.current.x - canvas_x, y: mousedown_stats.current.y - canvas_y},
      0
    );
    cue.fill(ctx);*/
  }

  // mouse coordinates
  //var ax = r(mousedown_stats.current.x - canvas_x), ay = r(mousedown_stats.current.y - canvas_y)
  //ctx.font = "12px Arial";
  //ctx.fillStyle="#aaa"
  //ctx.fillText(`(${ax}, ${ay})`, ax, ay);
  ///////////////////////

   window.requestAnimationFrame(animate);
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

// Give a size to the canvas
window.onresize = resize_elements;
resize_elements();

// White ball
// balls.push(new Ball(true, 0.01, 0.01, white_coords.y, white_coords.x, 100));

// all the other balls. At the moment, randomly placed
for (let i = 0, bc; i < num_balls; ++i) {
  bc = balls_coords[i]; 
  balls.push(new Ball(bc.color, 0, 0, bc.y, bc.x, i));
}

window.requestAnimationFrame(animate);















// Listeners
canvas_obj.addEventListener('mousedown', function(e) {
  mousedown_stats.coords = {x: e.clientX, y: e.clientY};
  //console.log(e);
  mousedown_stats.time = + new Date();
  mousedown_stats.down = true;
  create_random_color();
});

canvas_obj.addEventListener('mousemove', function(e) {
  mousedown_stats.current = {x: e.clientX, y: e.clientY};

  let dx = mousedown_stats.coords.x - mousedown_stats.current.x;
  let dy = mousedown_stats.coords.y - mousedown_stats.current.y;
  //let cos = dx / Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
  //console.log(dx, dy, Math.acos(cos));

});

// throw the white ball around!
canvas_obj.addEventListener('mouseup', function(e) {
  mousedown_stats.down = false;

  // can't hit while balls are running
  if (has_balls_rolling()) {
    return false;
  }

  score_hit_ball();
  
  // if (balls[0].rolling) {
  //   console.info("can't hit while rolling");
  //   return false;
  // }
  
  let coords = {x: e.clientX, y: e.clientY},
      mds = mousedown_stats,
      duration = (+ new Date()) - mousedown_stats.time, // difference in milliseconds
      distance_x = coords.x - mds.coords.x,
      distance_y = coords.y - mds.coords.y,

      speed_x = -100 * distance_x / duration,
      speed_y = -100 * distance_y / duration;

  
  // balls[0].curr_speed_x = Math.abs(speed_x);
  // balls[0].curr_speed   = Math.abs(speed_y);
  // balls[0].x_direction  = speed_x < 0 ? -1 : 1;
  // balls[0].y_direction  = speed_y < 0 ? -1 : 1;
  balls[0].curr_speed_x = Math.min(speed_x, 20);
  balls[0].curr_speed   = Math.min(speed_y, 20);
  balls[0].rolling = 1;
  balls[0].ghost = 0;
});


// form_inputs.help_button.addEventListener('click', function(e) {
//   form_inputs.help_box.style.display = 'inline-block';
// });
// form_inputs.help_box.addEventListener('click', function(e) {
//   this.style.display = 'none';
// });