import './styles.scss';

var devName = "";
var serverOn = true;

var showPanel2 = function () {
    devName = document.getElementsByTagName('input')[0].value;
    if (devName == "") return;
    document.getElementById('next1').classList.add('hidden');
    document.getElementById('part2').classList.remove('hidden');
    document.getElementsByTagName('input')[0].setAttribute('disabled', 'true')
    document.getElementById('developer').classList.remove('invisible');
    document.getElementById('owner').innerText = "property of " + devName;
}

var showPanel3 = function (i) {
    document.getElementById('next2').classList.add('hidden');
    document.getElementById('part3').classList.remove('hidden');
    document.getElementById('server').classList.remove('invisible');
}

var showPanel4 = function (i) {
    document.getElementById('next3').classList.add('hidden');
    document.getElementById('part4').classList.remove('hidden');
}

var toggleServer = function () {
    if (serverOn) {
        document.getElementById('content').classList.add('hidden');
        document.getElementById('offlineContent').classList.remove('hidden');
        document.getElementById('title').classList.add('offline');
        document.getElementById('serverPower').classList.add('offline');
    }
    else {
        document.getElementById('offlineContent').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
        document.getElementById('title').classList.remove('offline');
        document.getElementById('serverPower').classList.remove('offline');
    }
    serverOn = !serverOn;
}

document.getElementById('next1').addEventListener("click", () => showPanel2(), false);
document.getElementById('next2').addEventListener("click", () => showPanel3(), false);
document.getElementById('next3').addEventListener("click", () => showPanel4(), false);
document.getElementById('serverPower').addEventListener("click", () => toggleServer(), false);