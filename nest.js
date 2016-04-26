
//Nest Class
Nest = function(selector, from, to, label, onValueChanged) {

	//OPTIONS
	var defaultOptions={from:from||0, to:to||180,label:label||"",onValueChanged:onValueChanged||null};
	//var customOptions=options||{};

    //DOM ELEMENTS
	var dragger,output;

	//VARIABLES
	var ratio, numLines;
	var dragStartX, dragStartY;
	var currentTheta=0;
	var currentValue=0;

	function initialize(){


		//_.extend(defaultOptions,customOptions);

		currentValue=defaultOptions.from;

		var label=document.querySelector(selector+" div.output small");
		label.innerHTML=defaultOptions.label;

		output=document.querySelector(selector+" div.output strong");
		output.innerHTML=currentValue.toString();

		numLines=document.querySelectorAll(selector+" svg#ring-lines line").length;
		ratio=Math.round(360/numLines);
		dragger=document.querySelector(selector+" svg#marker polygon");

		dragger.addEventListener('mousedown', startDragging);
		dragger.addEventListener('touchstart', startDragging);
	}

	function startDragging(e){
		window.addEventListener('mousemove', performDragging);
		window.addEventListener('mouseup', stopDragging);
		document.body.addEventListener('touchmove', performDragging);
		document.body.addEventListener('touchend', stopDragging);
		e.preventDefault();
	}

	function stopDragging(e){
		window.removeEventListener('mousemove', performDragging);
		window.removeEventListener('mouseup', stopDragging);
		document.body.removeEventListener('touchmove', performDragging);
		document.body.removeEventListener('touchend', stopDragging);
		e.preventDefault();
	}

	function highlightLine(index){
		var lineSelector=selector+" svg#ring-lines line:nth-child("+(180-index).toString()+")";
		TweenMax.to(lineSelector, .3, {css:{stroke:'rgba(255, 255, 255, 1)'}});
	    TweenMax.to(lineSelector, .8, {delay:.3, css:{stroke:'rgba(255, 255, 255, .5)'}});
	}


	function performDragging(e){
		var x=(e.clientX||e.touches[0].pageX)-(ring.offsetLeft+ring.offsetWidth/2);
		var y=(e.clientY||e.touches[0].pageY)-(ring.offsetTop+ring.offsetHeight/2);

		var theta=Math.atan2(y,x)*(180/Math.PI); //[-180,180]
		theta=(theta+360+90)%360;
		TweenMax.set(selector+" svg#marker",{rotationZ:theta});


		var roundedTheta=Math.round(theta);
		if(roundedTheta!=currentTheta){
			var diff=(roundedTheta-currentTheta)*(Math.PI/180);
			var shortestRotation=Math.atan2(Math.sin(diff),Math.cos(diff));
			var shortestRotationInDegrees=shortestRotation*(180/Math.PI);
			var direction=shortestRotationInDegrees>0?"CW":"CCW";
			var from=Math.round(currentTheta/ratio);
			var to=Math.round(roundedTheta/ratio);

			switch(direction){
				case "CW":
					 if(to>from){				 	  
				          for (var i=from; i<to; i++) {
				            highlightLine(i);
				          };
				     }
				     else if(to<from){
				          for (var i=from; i<numLines; i++) {
				            highlightLine(i);
				          };
				          for (var i=0; i<to; i++) {
				            highlightLine(i);
				          };
	        		 }
				break;

				case "CCW":
				 	if(to<from){
			          for (var i=from; i>=to;i--) {
			            highlightLine(i);
			          };
			        }
			        else if(to>from){
			         for (var i=from; i>=0; i--) {
				        highlightLine(i);
				      };
				      for (var i=numLines; i>=to; i--) {
				        highlightLine(i);
				      };
			        }
				break;
			}

			
			currentTheta=roundedTheta;

			var newValue=Math.round((defaultOptions.to-defaultOptions.from)*(currentTheta/360) + defaultOptions.from);
			if(newValue!=currentValue){
				currentValue=newValue;
				output.innerHTML=currentValue.toString();

				if (defaultOptions.onValueChanged)
                    defaultOptions.onValueChanged.call(this, currentValue)
			}

			


		}
		e.preventDefault();
	}

	initialize();
}





    