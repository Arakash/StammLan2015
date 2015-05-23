/**
 * Created by sven on 4/9/15.
 */

var loop;
var audioState="startPage";

var context;
var gain;

sounds = {
  intro : {
    src : '/static/lan2015/main/intro.ogg',
    volume : 1,
    loop: false
  },
  loop : {
    src : '/static/lan2015/main/loop.ogg',
    volume : 1,
    loop: true
  },
  end : {
    src : '/static/lan2015/main/end.ogg',
    volume : 1,
    loop: false
  }
};

var startOffset = 0;

$(function(){
    initWebAudio();
    loadSounds(sounds, function(){
        gain = context.createGain();
        gain.connect(context.destination);
        initSoundSource(sounds.intro);
        initSoundSource(sounds.loop);
        initSoundSource(sounds.end);

        playSoundObj(sounds.intro);
        startOffset = context.currentTime;
        sounds.loop.source.start(startOffset + sounds.intro.buffer.duration);
        console.log("will start at:" + Number(startOffset + sounds.intro.buffer.duration));
        console.log("current Time: " + context.currentTime + " intro duration:" + sounds.intro.buffer.duration
        + " Offset: " + startOffset);

        //experiment: init sound system on Site load
        initIndex(context, sounds.end.source);

        if(localStorage && localStorage.getItem("muted") == "true"){
            console.log("starting page with muted audio!!");
            stopAudio();
            $("#rememberBox").get(0).checked = true;
        }

        $("#enterButton").fadeIn(1000);
    });

/*
  loop = new SeamlessLoop();
  //loop.addUri("intro.ogg",)
  loop.addUri("/static/lan2015/main/intro.ogg", 4641, "sound0");
  loop.addUri("/static/lan2015/main/loop.ogg",8727, "sound1");

  loop.callback(function(){
    loop.start("sound0");
    loop.update("sound1",true);
    loop.volume(0.7);

    });*/

  /**
   * ENTER Click - Transition, soundloop events
   */
  $("#enterButton").click(function(){
    audioState="mainPage";
    console.log("entering Main Page!");
    sounds.loop.source.onended = function(){
        console.log("playing End sound!");
    }

    var m = Math.ceil((context.currentTime-startOffset-sounds.intro.buffer.duration) /sounds.loop.buffer.duration);
    //since stop() want the (context) realtime, we have to include everything prior.
    // That means, the time offset until we started playing, the duration of the first song
    // and how often the current one has been played already
    var stopTime = startOffset+sounds.intro.buffer.duration+m*sounds.loop.buffer.duration;
    console.log("curentTime:" + context.currentTime + "m: " + m + " duration: " + sounds.loop.buffer.duration + " alles: " +(sounds.intro.buffer.duration+ m*sounds.loop.buffer.duration));
    sounds.loop.source.stop(stopTime);
    sounds.end.source.start(stopTime);


    $(".startPage").css("top", "-100vh");
    $(".mainPage").css("top", "0");
    $(".boxlet").css("top","38vh");
  });

  /**
   * LOGIC FOR THE PLAY/PAUSE BUTTON AT THE TOP OF THE PAGE
   */
  $("#muteButton").click(function(){
      stopAudio();
  });

  $("#playButton").click(function(){
      resumeAudio();
  });

  $("#neon").click(function(){
      var red = Number(Math.random()*255).toFixed(0);
      var green = Number(Math.random()*255).toFixed(0);
      var blue = Number(Math.random()*255).toFixed(0);
      $("#neon").css("color", "rgba("+red+","+green+","+blue+","+"1)");
  });

  $("#musicDisclaimer").click(function(){
      spotlightsEnabled = !spotlightsEnabled;
      console.log("spotlightsEnabled: " + spotlightsEnabled);
      $(".spotlightOnOff").toggle();
  });

  $("#rememberBox").on("click",function(){
      if( localStorage){
          console.log("remembering to mute page");
          localStorage.setItem("muted", $(this).get(0).checked );
      }
  });

  $("#registerButton").click(function(){
      $(".mediaPage").css("left", "0");
      $(".ytBox").show();
  });

  $("#closeMedia").click(function(){
      $(".mediaPage").css("left","-130vw");
  });

  $("#subscribeButton").click(function(){
      $("#subscribeForm").toggle("slide-down");
  });

  /**
  * SEND COMMENT TO SERVER BY AJAX
  **/
  $("#commentSendButton").click(function(){

      var commentText = $("#commentInput").val();
      var commentName = $("#nameInput").val();
      var commentColor = $("#colorInput").val();

      console.log(commentText + commentName + commentColor);

      if(!commentText || !commentName || !commentColor){
          return false;
      }
    $.ajax({
        url: "sendComment/",
        type: "POST",
        data: {commentText: commentText, commentName: commentName, commentColor: commentColor},
        success: function(result){
            console.log("success!");
            commentText = result['commentText'];
            commentName = result['commentName'];
            commentColor= result['commentColor'];
            commentDate = result['commentDate'];

            console.log(commentText + commentName + commentColor + commentDate);
            addComment(".commentShow", commentName, commentText, commentDate, commentColor);
            $(".commentShow").get(0).scrollTop = $(".commentShow").get(0).scrollHeight;
            return true;
        }
    });
  });


  $("#subscriberFormSubmitButton").click(function(){
      var subName     = $("#nameInput2").val();
      var subArrival  = $("#arrivalInput").val();
      var subDeparture= $("#departureInput").val();
      var subSwitch   = $("#switchInput").val();
      console.log("sending new Subscriber!");
      sendSubscriber(subName, subArrival, subDeparture, subSwitch);
  });

  $("#arrivalInput").datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "dd.mm.yy",
      minDate: new Date(2015, 6, 11),
      maxDate: new Date(2015, 6, 13)
  });
  $("#departureInput").datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "dd.mm.yy",
      minDate: new Date(2015, 6, 12),
      maxDate: new Date(2015, 6, 15)
  });
});

function sendSubscriber(subName, subArrival, subDeparture, subSwitch){

    if(!subName || !subArrival || !subDeparture || !subSwitch){
        console.err("Arguments are not allowed to be null!");
        return false;
    }

    $.ajax({
        url: "sendSubscriber/",
        type: "POST",
        data: {subName: subName, subArrival: subArrival, subDeparture: subDeparture, subSwitch: subSwitch},
        success: function(result){
            console.log("success!");

            subName     = result['subName'];
            subArrival  = result['subArrival'];
            subDeparture= result['subDeparture'];
            subSwitch   = result['subSwitch'];

            addSubscriber("#subscriberTable", subName, subArrival, subDeparture, subSwitch);
            return true;
        }
    })
}

function startLoop(){
  loop.update("sound1",true);
}

function resumeAudio(){
    gain.gain.value=1;
    try{
        audioSystem.startVis();
    }
    catch(e)
    {

    }
//    context.resume();
    /*
    if(audioState=="mainPage"){
      $("#audioElement").get(0).play();
    }
    else{
      loop.start("sound1");
  }*/
    $(".audioControl").toggle();
}

function stopAudio(){
    gain.gain.value= 0;
    try{
        audioSystem.stopVis();
    }
    catch(e)
    {
        console.log("can't stop Audio System: " + e);
    }
    //context.suspend();
    /*
    if(audioState=="mainPage"){
      $("#audioElement").get(0).pause();
    }
    else{
      console.log("stopping loop!");
      loop.audios["sound0"]._1.pause();
      loop.audios["sound1"]._1.pause();
      loop.stop();
  }*/
    $(".audioControl").toggle();
}


/***
** WEB AUDIO API
****/

function initWebAudio(){
    try {
      // still needed for Safari
      window.AudioContext = window.AudioContext || window.webkitAudioContext;

      // create an AudioContext
      context = new AudioContext();
    } catch(e) {
      // API not supported
      throw new Error('Web Audio API not supported.');
    }
}

/**
 * Load a sound
 * @param {String} src Url of the sound to be loaded.
 */
/*
var sound;
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    // request.response is encoded... so decode it now
    context.decodeAudioData(request.response, function(buffer) {
      sound = buffer;
    }, function(err) {
      throw new Error(err);
    });
  }

  request.send();
}*/

/**
 * Play a sound
 * @param {Object} buffer AudioBuffer object - a loaded sound.
 */

function playSound(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

function initSoundSource(obj){
    var source = context.createBufferSource();
    source.buffer = obj.buffer;

    // loop the audio?
    source.loop = obj.loop;

    // connect the source to the gain node
    source.connect(gain);
    obj.source = source;
}

function playSoundObj(obj) {
  // play sound
  obj.source.start(0);
}


/**
* expects a Object, with a src member to play
**/
function loadSoundObj(obj, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', obj.src, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    // request.response is encoded... so decode it now
    context.decodeAudioData(request.response, function(buffer) {
      obj.buffer = buffer;
      console.log("loaded sound!");
      callback();
    }, function(err) {
      throw new Error(err);
    });
  }

  request.send();
}

/**
 *  Function to loop through and load all sounds
 * @param {Object} obj List of sounds to loop through.
 */

function loadSounds(obj, finishedLoadingCallback) {
  var len = obj.length, i;

  var numSoundsLoaded = 0;
  // iterate over sounds obj
  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      // load sound
      loadSoundObj(obj[i], function(){
          numSoundsLoaded++;
          if(numSoundsLoaded == Object.keys(obj).length){
            finishedLoadingCallback();
          }
      });
    }
  }
}

var resizeTimer = 0;
$(window).resize(function(){

    $("div").addClass("notransition");

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function() {
        $("div").removeClass("notransition");
    }, 250);

});
