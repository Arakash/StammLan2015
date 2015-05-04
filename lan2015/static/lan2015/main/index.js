/**
 * Created by sven on 4/9/15.
 */

var loop;
var audioState="startPage";
$(function(){

  loop = new SeamlessLoop();
  //loop.addUri("intro.ogg",)
  loop.addUri("/static/lan2015/main/intro.ogg", 4641, "sound0");
  loop.addUri("/static/lan2015/main/loop.ogg",8727, "sound1");

  loop.callback(function(){
    loop.start("sound0");
    loop.update("sound1",true);
    loop.volume(0.7);

    if(localStorage && localStorage.getItem("muted") == "true"){
        console.log("starting page with muted audio!!");
        stopAudio();
        $("#rememberBox").get(0).checked = true;
    }

  });
  /**
   * ENTER Click - Transition, soundloop events
   */
  $("#enterButton").click(function(){
    audioState="mainPage";

    loop.audios["sound1"].loop=false;
    loop.audios["sound0"]._1.addEventListener("ended", function(){
      $("#audioElement").get(0).play();
      loop.stop();
    });
    loop.audios["sound1"]._1.addEventListener("ended", function(){
       $("#audioElement").get(0).play();
      loop.stop();
    });

    loop.audios["sound1"]._2 && loop.audios["sound1"]._2.addEventListener("ended", function(){
       $("#audioElement").get(0).play();
      loop.stop();
    });

//    loop.update("sound2",true);

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
    if(audioState=="mainPage"){
      $("#audioElement").get(0).play();
    }
    else{
      loop.start("sound1");
    }
    $(".audioControl").toggle();
  });

  $("#rememberBox").on("click",function(){
      if( localStorage){
          console.log("remembering to mute page");
          localStorage.setItem("muted", $(this).get(0).checked );
      }
  });

  $("#registerButton").click(function(){
      $(".mediaPage").css("left", "0");
  });

  $("#closeMedia").click(function(){
      $(".mediaPage").css("left","-100vw");
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
            addComment(".commentShow", commentName, commentText, commentDate);
            $(".commentShow").get(0).scrollTop = $(".commentShow").get(0).scrollHeight;
            return true;
        }
    });
  });
});

function startLoop(){
  loop.update("sound1",true);
}

function stopAudio(){
    if(audioState=="mainPage"){
      $("#audioElement").get(0).pause();
    }
    else{
      console.log("stopping loop!");
      loop.audios["sound0"]._1.pause();
      loop.audios["sound1"]._1.pause();
      loop.stop();
    }
    $(".audioControl").toggle();
}
