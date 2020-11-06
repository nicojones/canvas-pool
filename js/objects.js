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
        br = this.radius * 0.2;
        // console.log(cx - br, cy - br, 0, cx, cy, this.radius)
    const grd = ctx.createRadialGradient(cx - br, cy - br, 0, cx, cy, this.radius);
    
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