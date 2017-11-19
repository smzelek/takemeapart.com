import './styles.scss';

var showNext = function(i) {
    document.getElementById('next' + i).classList.add('hidden');
    document.getElementById('part' + (i + 1)).classList.remove('hidden');
}

document.getElementById('next1').addEventListener ("click", () => showNext(1), false);
document.getElementById('next2').addEventListener ("click", () => showNext(2), false);
document.getElementById('next3').addEventListener ("click", () => showNext(3), false);