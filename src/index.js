import './styles.scss';

var devName = "";
var serverOn = true;

var reloadSite = function() {
    document.getElementById('part2').classList.add('hidden');
    document.getElementById('part3').classList.add('hidden');
    document.getElementById('part4').classList.add('hidden');
    document.getElementById('nameInput').removeAttribute('disabled');
    document.getElementById('next1').classList.remove('hidden');
    document.getElementById('next2').classList.remove('hidden');
    document.getElementById('next3').classList.remove('hidden');
}

var showDevName = function() {
    document.getElementById('nameInput').setAttribute('disabled', 'true')
    document.getElementById('owner').innerText = "property of " + devName;
}

var showPanel2 = function () {
    devName = document.getElementsByTagName('input')[0].value;
    if (devName == "") return;
    showDevName();
    document.getElementById('next1').classList.add('hidden');
    document.getElementById('part2').classList.remove('hidden');
    document.getElementById('developer').classList.remove('invisible');
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
        document.getElementById('serverPower').classList.add('offline');
    }
    else {
        document.getElementById('offlineContent').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
        document.getElementById('serverPower').classList.remove('offline');
    }
    serverOn = !serverOn;
}

document.getElementById('reload').addEventListener("click", () => reloadSite(), false);
document.getElementById('next1').addEventListener("click", () => showPanel2(), false);
document.getElementById('next2').addEventListener("click", () => showPanel3(), false);
document.getElementById('next3').addEventListener("click", () => showPanel4(), false);
document.getElementById('serverPower').addEventListener("click", () => toggleServer(), false);
document.getElementById('nameInput').add
document.querySelector('#nameInput').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { 
        showPanel2();
    }
});