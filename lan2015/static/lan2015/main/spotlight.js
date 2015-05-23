/**
 * Created by sven on 3/30/15.
 */

function spotlight(canvas, coord, color) {
  var context = canvas.getContext('2d');
  //context.clearRect(0,0,canvas.width, canvas.height);

  // Create gradient
  context.fillRect(0,0,canvas.width,canvas.height);
  var grd = context.createRadialGradient(
    coord.x, coord.y,  60,
    200, -20,  20);
  grd.addColorStop(1,'rgba('+color.red+','+color.green+','+color.blue+',0.5)');
  grd.addColorStop(0.75,'rgba('+color.red+','+color.green+','+color.blue+',0)');

  var grd2 = context.createRadialGradient(
    coord.x, coord.y,  55,
    coord.x, coord.y,  53);
  grd2.addColorStop(0,'rgba('+color.red+','+color.green+','+color.blue+','+'0)');
  grd2.addColorStop(1,'rgba('+color.red+','+color.green+','+color.blue+','+'.7)');

  // draw picture
  context.fillStyle=grd;
  context.fillRect(0,0,790,590);

  context.fillStyle=grd2;
}
