var cookieName = "kenan_program";
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(',');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setupCanvas(canvas) {
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
var canvas = document.getElementById("canvas");
var canvasCar = document.getElementById("canvas_car");
setupCanvas(canvas);
setupCanvas(canvasCar);

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    gutters: ["error_gutter", "CodeMirror-linenumbers"]
});
var theme = "colorforth";
editor.setOption("theme", theme);
editor.setSize(500, canvas.height - 100);
var cookie = getCookie(cookieName);
if(cookie != null && cookie.length > 0)
    editor.setValue(atob(cookie));

var ctx1 = canvas.getContext("2d");
ctx1.fillStyle="green";
ctx1.fillRect(0, 0, canvas.width, canvas.height);


var ctx = canvasCar.getContext("2d");
ctx.fillStyle="rgba(0, 0, 200, 0.0)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var cursor = new Cursor(canvas.width / 2, canvas.height / 2, 20, 30);
cursor.setSpeed(5);

var paint = new Paint(canvas, canvasCar, cursor);
paint.reset(cursor);
var x = canvas.width / 2;
var y = canvas.height / 2;
var dir = 0;

var context = new Context(new Hal(paint, cursor));
var button = document.getElementById("run_button");

function run() {
    var commands = editor.getValue();
    var expireDays = 90;
    var d = new Date();
    d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    var cookie = cookieName + "=" + btoa(commands) + "," + expires + ",path=/,samesite=none,secure=true";
    
    editor.clearGutter("error_gutter");
    
    document.cookie = cookie;

    paint.reset(cursor);
    context.reset();
    var compiled = Compiler.compile(commands, context.getBlueprint());
    if(compiled.errors.length == 0) {
        button.disabled = true;
        
        context.run(compiled.commands, function() {
        	button.disabled = false;
    	});
    }
    else {
    	compiled.errors.forEach(err => {
    		console.log(err);
    		editor.setGutterMarker(err.line - 1, "error_gutter", makeMarker());
    	})
    }
	
	editor.focus();
}

function makeMarker() {
  var marker = document.createElement("div");
  marker.style.color = "#FF0000";
  marker.innerHTML = "X";
  return marker;
}
