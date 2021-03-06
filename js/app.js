let symbols = [
	'diamond',
	'diamond',
	'paper-plane-o',
	'paper-plane-o',
	'anchor',
	'anchor',
	'bolt',
	'bolt',
	'cube',
	'cube',
	'leaf',
	'leaf',
	'bicycle',
	'bicycle',
	'bomb',
	'bomb',
],
	opened = [],
	match = 0,
	Clicks = 0,
	$Playground = $('.Playground'),
	$scorePanel = $('#score-panel'),
	$moveNum = $('.Clicks'),
	$ratingStars = $('.fa-angellist'),
	$PlayAgain = $('.PlayAgain'),
	delay = 400,
	currentseconds,
	second = 0,
	$seconds = $('.timer'),
	totalbox = symbols.length / 2,
	rank3stars = 10,
	rank2stars = 15,
	rank1stars = 20;

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Initial Game
function initGame() {
	opened = [];
	var boxes = shuffle(symbols);
	$Playground.empty();
	match = 0;
	Clicks = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-thumbs-down').addClass('fa-angellist');
	for (var i = 0; i < boxes.length; i++) {
		$Playground.append(
			$('<li class="box"><i class="fa fa-' + boxes[i] + '"></i></li>')
		);
	}
	addboxListener();

	resetseconds(currentseconds);
	second = 0;
	$seconds.text(`${second}`);

	timeClick = 0;
}

// Set Rating and final Score
function setRating(moves) {
	var rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-angellist').addClass('fa-thumbs-down');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-angellist').addClass('fa-thumbs-down');
		rating = 1;
	}
	return { score: rating };
}

// End Game
function endGame(Clicks, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text:
			'With ' +
				Clicks +
				' Clicks and ' +
				score +
				' Stars in ' +
				second +
				' Seconds.\n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!',
	}).then(function(isConfirm) {
		if (isConfirm) {
			initGame();
		}
	});
}

// PlayAgain Game
$PlayAgain.bind('click', function() {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Wow, I can not believe you are giving up!',
		text: "Are you sure you don't want to keep playing?",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Yes, Im giving up.',
	}).then(function(isConfirm) {
		if (isConfirm) {
			initGame();
		}
	});
});

var addboxListener = function() {
	// box flip
	$Playground.find('.box').bind('click', function() {
		timeClick = timeClick + 1;

		if (timeClick == 1) {
			initTime();
		}
		var $this = $(this);
		if ($this.hasClass('show') || $this.hasClass('match')) {
			return true;
		}

		var box = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(box);

		// Compare with opened box
		if (opened.length > 1) {
			if (box === opened[0]) {
				$Playground
					.find('.open')
					.addClass('match animated infinite rubberBand');
				setTimeout(function() {
					$Playground
						.find('.match')
						.removeClass('open show animated infinite rubberBand');
				}, delay);
				match++;
			} else {
				$Playground.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function() {
					$Playground.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function() {
					$Playground
						.find('.open')
						.removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			opened = [];
			Clicks++;
			setRating(Clicks);
			$moveNum.html(Clicks);
		}

		// End Game if match all boxes
		if (totalbox === match) {
			setRating(Clicks);
			var score = setRating(Clicks).score;
			setTimeout(function() {
				endGame(Clicks, score);
			}, 500);
		}
	});
};

function initTime() {
	currentseconds = setInterval(function() {
		$seconds.text(`${second}`);
		second = second + 1;
	}, 1000);
}

function resetseconds(seconds) {
	if (seconds) {
		clearInterval(seconds);
	}
}

initGame();
