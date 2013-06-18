/**
 * ExpressCalc Copyright 2006 William R. Swanson
 * ExpressCalc Copyright 2013 Jacob Bruce
 */

/** Common constants **/
var sqrt2 = Math.SQRT2;
var sqrt1_2 = Math.SQRT1_2;
var ln2 = Math.LN2;
var ln10 = Math.LN10;
var log2e = Math.LOG2E;
var log10e = Math.LOG10E;
var e = Math.E;
var pi = Math.PI;
var phi = 1.618033988749894848204586834;
var psi = 3.3598856662431775531720113029189;
var c = 299792458;
var g = 9.80665;
var G = 6.67384e-11;
var h = 6.62606957e-34;
var hb = 1.054571726e-34;
var ec = 1.602176565e-19;
var me = 9.10938291e-31;
var mn = 1.67492735e-27;
var mp = 1.672621777e-27;
var u = 1.660538921e-27;
var ub = 9.27400968e-24;
var y = 0.5772156649015328606065120900824;
var p = 1.324717957244746025960908854;
var a = 2.502907875095892822283902873218;
var q = 4.669201609102990671853203821578;
var zf3 = 1.202056903159594285399738161511;
var zf4 = 1.082323233711138191516003696541;
var tau = 2 * pi;
var cubit = pi - (phi*phi);

/** Math object functions **/
var abs = Math.abs;
var acos = Math.acos;
var asin = Math.asin;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var sin = Math.sin;
var tan = Math.tan;
var exp = Math.exp;
var log = Math.log;
var pow = Math.pow;
var sqrt = Math.sqrt;
var round = Math.round;
var random = Math.random;
var floor = Math.floor;
var ceil = Math.ceil;
var min = Math.min;
var max = Math.max;

var sqr = function sqr_func(num) {
	return num * num;
}

var zeta = function zeta_func(s_val) {
	var nstemp = 0;
	var result = 0;
	
	switch (s_val) {
	case 3:
		return zf3;
	case 4:
		return zf4;
	default:
		break;
	}

	for (var index = 1; ; index++) {
		nstemp = pow(index, s_val);
		result += 1 / nstemp;
		if (nstemp.toString().length > 16) {
			result = result.toString();
			result = result.substr(0, 13);
			break;
		}
	}
	
	return result;
}

/**
 * Updates the value of the input box.
 */
function setInput(text) {
    var input = document.getElementById('input');
    if (input.className == 'prompt') {
        input.value = text;
        input.className = '';
    } else {
        input.value += text;
    }
}

/**
 * Prevents the input prompt from appearing.
 */
var inhibit = false;
function setInhibit() {
    inhibit = true;
}

/**
 * Writes a question/answer pair to the results pane.
 */
function writeResult(question, answer) {
	//Create the question portion:
	var qst = document.createElement("p");
	qst.className = "question";
	qst.appendChild(document.createTextNode(question));
	qst.onmousedown = setInhibit;
	qst.onclick = function (err) {
	    return setInput('(' + question + ')');
	};

	//Create the answer portion:
	var ans = document.createElement("p");
	ans.className = "answer";
	ans.appendChild(document.createTextNode(answer));
	ans.onmousedown = setInhibit;
	ans.onclick = function (err) {
	    return setInput(answer);
	};

	//Combine the two:
	var result = document.createElement("div");
	result.appendChild(qst);
	result.appendChild(ans);

	//Insert the whole thing into the document:
	var results = document.getElementById("results");
	if (results.firstChild) {
		results.insertBefore(result, results.firstChild);
	} else {
		results.appendChild(result);
	}

	//Cull if we have too many:
	if (4 < results.childNodes.length)
		results.removeChild(results.lastChild);
}

/**
 * Evaluates a mathematical expression.
 */
function getAnswer(question) {	
	// support word operators
	question = question.
	replace(/mod/gi, '%').
	replace(/minus/gi, '-').
	replace(/plus/gi, '+').
	replace(/div/gi, '/').
	replace(/times/gi, '*');
	
	// support word numbers
	question = question.
	replace(/zero/gi, '0').
	replace(/one/gi, '1').
	replace(/two/gi, '2').
	replace(/three/gi, '3').
	replace(/four/gi, '4').
	replace(/five/gi, '5').
	replace(/six/gi, '6').
	replace(/seven/gi, '7').
	replace(/eight/gi, '8').
	replace(/nine/gi, '9').
	replace(/ten/gi, '10');
	
	// support unicode/uncommon operators
	question = question.
	replace(/[\xB7\xD7\u2022\u22C5]/g, '*').
	replace(/[\xF7\u2215\u2044]/g, '/').
	replace(/\u2212/g, '-').
	replace(/\u2260/g, '!=').
	replace(/\u2264/g, '<=').
	replace(/\u2265/g, '>=').
	replace(/\u221E/g, 'Infinity');
	
	// support unicode constants
	question = question.
	replace(/[\u03c0\u03a0]/g, 'pi').
	replace(/[\u03c6\u03a6\u03d5]/g, 'phi').
	replace(/[\u03a8\u03c8]/g, 'psi').
	replace(/[\u03a8\u03c4]/g, 'tau').
	replace(/\u03c1/g, 'p').
	replace(/\u03b1/g, 'a').
	replace(/\u03b4/g, 'q').
	replace(/\u03b3/g, 'y').
	replace(/\u0127/g, 'hb').
	replace(/\u03bc/g, 'ub').
	replace(/\u03b6/g, 'zeta');
	
    try {
		// evaluate expression
        var answer = eval(question)

		// trim answer to fit in box
        if (answer.toString().length > 16) {
			if ((answer > 999999999999999) ||
				(answer < 0.00000000000001 && answer > 0) ||
					(answer < -999999999999999)) {
					
				answer = answer.toExponential();
				var exp_end = '';
				exp_end = answer.substring(answer.indexOf('e'));
				while (answer.length > 16) {
					answer = answer.substring(0, answer.indexOf('e')-1) + exp_end;
				}
			} else {
				answer = answer.toString();
				answer = answer.substr(0, 16);
			}
            return answer;
		} else {
			return answer.toString();
		}
    } catch (err) {
        return 'error';
    }
}

/**
 * Hides the prompt and makes the input appear "hot."
 */
function onFocus() {
	var input = document.getElementById('input');
	if (input.className == 'prompt')
	    input.value = '';
    input.className = 'hot';
    inhibit = false;
}

/**
 * Displays the prompt if the input is empty, and removes "hot" visuals.
 */
function onBlur() {
    var input = document.getElementById('input');
    if (input.value || inhibit) {
	    input.className = '';
	} else {
	    input.className = 'prompt';
        input.value = 'Enter an expression';
	}
    inhibit = false;
}

/**
 * Processes form submission.
 */
function onSubmit() {
    var input = document.getElementById('input');
    if (input.value)
	    writeResult(input.value, getAnswer(input.value));
    input.value = '';
	return false;
}

/**
 * Do the initial setup.
 */
function setup() {
    document.getElementById('form').onsubmit = onSubmit;
    document.getElementById('input').onfocus = onFocus;
    document.getElementById('input').onblur = onBlur;
    var input = document.getElementById('input');
    input.value = '';
    onBlur();
}

window.onload = setup;
