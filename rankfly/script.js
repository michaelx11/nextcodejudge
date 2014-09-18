$(document).ready(function(){
	var lefttime = 0;
	var righttime = 0;
	var leftdone = false;
	var leftdone = true;
	var stage = 'WAITING_ENTER';
	var timer;
	var data = new Firebase('https://kyc.firebaseio.com/nextchallenge');
	
	data.on('value', function(snapshot) {
		obj = snapshot.val();
		
		//handing error states
		if (obj.p1 == 'error'){
			lefttime += 5;
			$('.content').find('.leftname').css({
				top: '+=20px'
			});
			data.child('p1').set('running');
		}
		if (obj.p2 == 'error'){
			righttime += 5;
			$('.content').find('.rightname').css({
				top: '+=20px'
			});
			data.child('p2').set('running');
		}
		
		//handling done states
		if (stage == 'RUNNING' && lefttime > 2) {
			if (obj.p1 == 'done'){
			   	moveLeft()
			   	leftname = $('.leftentry').val();
			   	data.child('scores').child(leftname).set(formatTime(lefttime))
			}
			if (obj.p2 == 'done'){
			   	moveRight();
			   	rightname = $('.rightentry').val();
			   	data.child('scores').child(rightname).set(formatTime(righttime))
			}
		}
	});
	
	$('body').keyup(function(e){
	   	
	   	// begin timer - enter hit
	   	if (e.keyCode == 13){
	   		if (stage == 'WAITING_ENTER'){
	   			timer = setInterval(frameAnimate, 100);	
	   			$('.cover').hide();
	   			stage = 'RUNNING';
                                data.child('started').set('true');
	   		}
	   	}
	   	
	   	if (stage == 'RUNNING') {
	   	
	   		// debugging purposes
		   	if (e.keyCode == 81){
		   		leftdone = true;
		   		//moveLeft();
		   	}
		   	
		   	// debugging purposes
		   	if (e.keyCode == 87){
		   		rightdone = true;
		   		//moveRight();
		   	}
		   	
		   	// reset timer
		   	if (e.keyCode == 78){
		   		window.clearInterval(timer);
		   		$('.cover').show();
		   		$('.content').append($('.store').html());
				lefttime = 0;
				righttime = 0;
	   			data.child('p1').set('ready');
	   			data.child('p2').set('ready');
				$('.leftname .timerleft').text(formatTime(lefttime));
				$('.rightname .timerright').text(formatTime(righttime));
		   		stage = 'WAITING_ENTER';
		   	}
	   	}
	   	console.log(e.keyCode);
	});
	
	$('.leftentry').bind('input', function(e) {
		$('.content').find('.leftname').find('.leftcontextname').text($(this).val());
	});
	$('.rightentry').bind('input', function(e) {
		$('.content').find('.rightname').find('.rightcontextname').text($(this).val());
	});
	
	var frameAnimate = function(){
		var speed=0.1;
		$('.content').find('.leftname').css({
			top: '+='+speed+'px'
		});
		$('.content').find('.rightname').css({
			top: '+='+speed+'px'
		});
		
		lefttime += 0.1;
		righttime += 0.1;
		
		$('.leftname .timerleft').text(formatTime(lefttime));
		$('.rightname .timerright').text(formatTime(righttime));
	}
	
	var moveLeft = function(){
		$('.content').find('.leftname').css({
			left: '+=-210px'
		});
		$('.content').find('.leftname').attr('class', 'nameblock settle settleleft');
	}
	
	var moveRight = function(){
		$('.content').find('.rightname').css({
			left: '+=210px'
		});
		$('.content').find('.rightname').attr('class', 'nameblock settle settleright');
	}
	
	var formatTime = function(t){
		t = Math.floor(t);
		s = t%60;
		m = Math.floor(t/60);
		if (s < 10) {
			s = '0' + s;
		}
		return m + ':' + s;
	}
})
