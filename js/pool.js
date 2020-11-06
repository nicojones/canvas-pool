
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
      balls[i].ghost = true;
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
      - mousedown_stats.coords.x + mousedown_stats.current.x + balls[0].x,
      - mousedown_stats.coords.y + mousedown_stats.current.y + balls[0].y
      );
    ctx.lineWidth = 5;

    ctx.strokeStyle = 'hsla(' + random_color[0] + ',100%,50%,100%)';
    ctx.stroke(); 

    let cue = new Cue(
      {x: mousedown_stats.coords.x - canvas_x,  y: mousedown_stats.coords.y - canvas_y},
      {x: mousedown_stats.current.x - canvas_x, y: mousedown_stats.current.y - canvas_y},
      0
    );
    cue.fill(ctx);
  }

  // mouse coordinates
  //var ax = r(mousedown_stats.current.x - canvas_x), ay = r(mousedown_stats.current.y - canvas_y)
  //ctx.font = "12px Arial";
  //ctx.fillStyle="#aaa"
  //ctx.fillText(`(${ax}, ${ay})`, ax, ay);
  ///////////////////////

   window.requestAnimationFrame(animate);
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







// Miscellaneous
// if ?simple=1 is set, we hide the footer.
if (window.location.search.match(/simple=1/)) {
  document.getElementById('footer').style.display = 'none';
  document.getElementById('score').style.display = 'none';
}