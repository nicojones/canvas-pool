let curr_player = 1,
    score_1 = 0,
    score_2 = 0,
    player_with_stripes = 0,
    player_with_stripes_will_be = 0,
    curr_player_remaining_shots = 1,
    seconds = 0,
    minutes = 0,
    penalty = 0,
    touched_balls = 0;

let minutes_box = document.getElementById('minutes'),
    seconds_box = document.getElementById('seconds'),
    score___box = document.getElementById('score'),
    score_1_box = document.getElementById('score_1'),
    score_2_box = document.getElementById('score_2');





setInterval(function() {
  seconds += 1;
  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
    minutes_box.innerHTML = (minutes < 10 ? '0' : '') + minutes;
  }
  seconds_box.innerHTML = (seconds < 10 ? '0' : '') + seconds
}, 1000);

increment_score = (player) => {
  if (player === 1) {
    ++score_1;
    score_1_box.innerHTML = score_1;
  } else {
    ++score_2;
    score_2_box.innerHTML = score_2;
  }

  console.log("scores: " + score_1 + " / " + score_2)

}

score_balls_stopped = () => {
  console.log("player " + curr_player + " has #" + curr_player_remaining_shots + " remaining shots");
  // we set the user that will use the striped balls.
  if (player_with_stripes_will_be !== 0 && player_with_stripes === 0) {
    player_with_stripes = player_with_stripes_will_be;
    player_with_stripes_will_be = 0;

    if (player_with_stripes === 1) {
      score_1_box.className += ' ball_type stripes';
      score_2_box.className += ' ball_type flats';
    } else {
      score_1_box.className += ' ball_type flats';
      score_2_box.className += ' ball_type stripes';
    }
  }

  // if the user has no remaining shots, we switch players.
  if (curr_player_remaining_shots <= 0 || penalty || !touched_balls) {
    curr_player = (curr_player % 2 + 1);
    console.log(penalty, touched_balls);
    curr_player_remaining_shots = 1 + (penalty || !touched_balls ? 1 : 0);
    penalty = 0;
    touched_balls = 0;
    console.info("player #" + curr_player + " turn. " + curr_player_remaining_shots + " shots.");

    if (!balls_rolling)
    score___box.className = "player_" + curr_player;
  }
}

score_hit_ball = () => {
  console.log("player " + curr_player + " hits the ball");
  // every time we hit the white ball, we reduce by one the number of shots.
  --curr_player_remaining_shots;
  touched_balls = 0;
}

score_hit_color_ball = (ball_number) => {
  touched_balls = touched_balls || ball_number;
}

score_score_ball = (i) => {
  console.log("player " + curr_player + " scores ball #" + i);
  if (i === 0) {
    // white ball!
    curr_player_remaining_shots = -100;
    penalty = 1;
  }
  else if (i === 8) {
    // ball number 8
    alert ("player " + curr_player + " has lost the game");
  }
  else if (i < 8) {
    console.log("scored a flat ball");
    // odd number

    // if it's the first ball scored, we set the type of ball to the user
    if (player_with_stripes_will_be === 0 && player_with_stripes === 0) {
      console.log("new player with flats:" + curr_player);
      // the other player will have stripes
      player_with_stripes_will_be = (curr_player % 2 + 1);
      curr_player_remaining_shots = 1;
      increment_score(curr_player);
    }

    // if the other user owns the striped balls, and this user scores a flat ball.
    else if (player_with_stripes_will_be === (curr_player % 2 + 1) && player_with_stripes === 0) {
      console.log("forever player with flats:" + curr_player);
      // this ball belongs to this user. Gets a point for scoring
      curr_player_remaining_shots = 1;
      increment_score(curr_player);
    }

    // it's not the first hit. we know each player's color. We penalise for wrong balls.
    if (player_with_stripes === curr_player) {
      curr_player_remaining_shots = 0;
      penalty = 1;
      increment_score(curr_player % 2 + 1)
    } else if (player_with_stripes === (curr_player % 2 + 1)) {
      curr_player_remaining_shots = 1;
      increment_score(curr_player);
    }
  }
  else if (i > 8) {
    // even number 
    console.log("scored a striped ball");

    // if it's the first ball scored, we set the type of ball to the user
    if (player_with_stripes_will_be === 0 && player_with_stripes === 0) {
      console.log("new player with stripes:" + curr_player);
      // this player will have stripes
      player_with_stripes_will_be = curr_player;
      curr_player_remaining_shots = 1;
      increment_score(curr_player);
    }

    else if (player_with_stripes_will_be === curr_player && player_with_stripes === 0) {
      console.log("forever player with stripes:" + curr_player);
      // this ball belongs to this user. Gets a point for scoring
      curr_player_remaining_shots = 1;
      increment_score(curr_player);
    }

    // it's not the first hit. we know each player's color. We penalise for wrong balls.
    if (player_with_stripes === (curr_player % 2 + 1)) {
      curr_player_remaining_shots = 0;
      increment_score(curr_player % 2 + 1);
      penalty = 1;
    } else if (player_with_stripes === curr_player) {
      curr_player_remaining_shots = 1;
      increment_score(curr_player);
    }


  }

}