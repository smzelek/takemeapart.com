import './styles.scss';
import html2canvas from 'html2canvas';

var showedPart5 = false;
var hasEnabledCursors = false;
var serverOn = true;
var cursorMode = 'mouse';
var editableTags = [
    'h1',
    'h2',
    'p',
    'input',
    'img',
    'li',
    'button',
];
var atomicCssClasses = [
    'font-simple',
    'font-fun',
    'font-formal',
    'italic',
    'underline',
    'color-white',
    'color-red',
    'color-orange',
    'color-yellow',
    'color-green',
    'color-blue',
    'color-black',
    'color-pink',
    'color-purple',
    'background-none',
    'background-red',
    'background-orange',
    'background-yellow',
    'background-green',
    'background-blue',
    'background-black',
    'background-pink',
    'background-purple',
    'darken-on-hover',
];
var jsRegistry = {
    'js-bounce': {
        event: 'click',
        name: 'bounce',
        fn: (e) => {
            Array.from(e.target.classList)
                .filter(cls => cls.startsWith('animate-'))
                .forEach(cls => e.target.classList.remove(cls));

            setTimeout(() => {
                e.target.classList.add('animate-bounce');
            });
        },
    },
    'js-spin': {
        event: 'click',
        name: 'spin',
        fn: (e) => {
            Array.from(e.target.classList)
                .filter(cls => cls.startsWith('animate-'))
                .forEach(cls => e.target.classList.remove(cls));

            setTimeout(() => {
                e.target.classList.add('animate-spin');
            });
        },
    },
    'js-shake': {
        event: 'click',
        name: 'shake',
        fn: (e) => {
            Array.from(e.target.classList)
                .filter(cls => cls.startsWith('animate-'))
                .forEach(cls => e.target.classList.remove(cls));

            setTimeout(() => {
                e.target.classList.add('animate-shake');
            });
        },
    },
}
var cssBits = {};
var jsBits = {};
var numCodeBitsSmashed = 0;
var numCodeBitsApplied = 0;
var dropX = 0;
var dropY = 0;
var mouseInsideContent = false;
var dragBitKind = '';
var dragImage;

var tryToUnlockPart5 = () => {
    if (numCodeBitsSmashed >= 5 && numCodeBitsApplied >= 3) {
        showPart5();
    }
};

var showPart2 = () => {
    var inputEl = document.getElementById('name-input');
    // @ts-expect-error
    if (inputEl && inputEl.value == '') {
        return;
    }
    showDevName();
    document.getElementById('next1').classList.add('invisible');
    Array.from(document.getElementsByClassName('part2')).forEach(el => el.classList.remove('invisible'))
    document.getElementById('developer').classList.remove('invisible');
    document.getElementById('developer').classList.add('crash-landing-right');
};

var showPart5 = () => {
    if (showedPart5) {
        return;
    }
    showedPart5 = true;
    Array.from(document.getElementsByClassName('part5')).forEach(el => el.classList.remove('invisible'));
};

var keypressNameInput = (e) => {
    if (e.key === 'Enter') {
        showPart2();
    }
};

var clickNext1 = () => showPart2();

var clickNext2 = () => {
    document.getElementById('next2').classList.add('invisible');
    Array.from(document.getElementsByClassName('part3')).forEach(el => el.classList.remove('invisible'))
    document.getElementById('server').classList.remove('invisible');
    document.getElementById('server').classList.add('crash-landing-left');
}

var clickNext3 = () => {
    document.getElementById('next3').classList.add('invisible');
    Array.from(document.getElementsByClassName('part4')).forEach(el => el.classList.remove('invisible'))
};

var clickNext4 = () => {
    document.getElementById('next4').classList.add('invisible');
    enableCursorChangers();
};

var clickNext5 = () => {
    document.getElementById('footer').innerHTML = '';

    var newFooter = document.createElement('h1');
    newFooter.classList.add('color-red');
    newFooter.classList.add('font-fun');
    newFooter.innerText = '... Now Put Me Together!';
    makeElementEditable(newFooter);
    document.getElementById('footer').appendChild(newFooter);

    document.getElementById('css-bits').innerHTML = '';
    cssBits = {};
    atomicCssClasses.forEach(createCssBit);

    document.getElementById('js-bits').innerHTML = '';
    jsBits = {};
    Object.entries(jsRegistry).forEach(([jsId, jsFn]) => createJsBit(jsId, jsFn));
};

var resetState = () => {
    useMouseCursor();
    document.getElementById('next1').classList.remove('invisible');
    document.getElementById('next2').classList.remove('invisible');
    document.getElementById('next3').classList.remove('invisible');
    document.getElementById('next4').classList.remove('invisible');

    Array.from(document.getElementsByClassName('part2')).forEach(el => el.classList.add('invisible'))
    Array.from(document.getElementsByClassName('part3')).forEach(el => el.classList.add('invisible'))
    Array.from(document.getElementsByClassName('part4')).forEach(el => el.classList.add('invisible'))
    Array.from(document.getElementsByClassName('part5')).forEach(el => el.classList.add('invisible'))

    document.getElementById('name-input').removeAttribute('readonly');
    // @ts-expect-error
    document.getElementById('name-input').value = '';
};

var showDevName = () => {
    var inputEl = document.getElementById('name-input');
    if (!inputEl) {
        return;
    }
    inputEl.setAttribute('readonly', 'true')
    // @ts-expect-error
    document.getElementById('owner').innerText = 'property of ' + inputEl.value;
};

var freezePageSize = () => {
    var { width } = document.getElementById('page').getBoundingClientRect();
    document.getElementById('page').style.width = `${width}px`;
    document.getElementById('page').style.flexShrink = '0';
};

var enableCursorChangers = () => {
    if (hasEnabledCursors) {
        return;
    }
    freezePageSize();
    hasEnabledCursors = true;
    document.getElementById('cursor-changers').classList.remove('invisible');
    document.getElementById('cursor-changers').classList.add('crash-landing');
    document.getElementById('page').classList.remove('cursor-mouse');
    document.getElementById('page').classList.add('cursor-wrench');
    useWrenchCursor();
};

var getEditableEls = () => {
    return editableTags.reduce((acc, tag) => {
        return [...acc, ...Array.from(document.getElementById('content').getElementsByTagName(tag)).filter(el => !el.classList.contains('js-exempt'))];
    }, []);
};

var codeBitDropCallback = null;

var makeElementEditable = (el) => {
    if (el.classList.contains('no-smash')) {
        return;
    }

    el.addEventListener('click', (e) => {
        if (cursorMode !== 'wrench') {
            return;
        }
        e.stopImmediatePropagation();
        smashLastCodeBit(el);
    });

    el.addEventListener('dragenter', (e) => {
        e.preventDefault();
    });

    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    el.addEventListener('drop', (e) => {
        e.preventDefault();
        if (codeBitDropCallback) {
            codeBitDropCallback(e.target);
        }
    });
};

var removeCssBit = (el, atom) => {
    createCssBit(atom);
    el.classList.remove(atom);
};

var createCssBit = (atom) => {
    var key = `css-${atom}`;

    if (Object.keys(cssBits).includes(key)) {
        document.getElementById(key).scrollIntoView(false);
        Array.from(document.getElementById(key).classList)
            .filter(cls => cls.startsWith('animate-'))
            .forEach(cls => document.getElementById(key).classList.remove(cls));

        setTimeout(() => {
            document.getElementById(key).classList.add('animate-same-bit');
        }, 50);

        return;
    }

    cssBits[key] = atom;

    var newBit = document.createElement('div');
    newBit.classList.add('bit');
    newBit.classList.add('css');
    newBit.innerText = `.${atom}`;
    newBit.id = key;    

    // @ts-expect-error
    newBit.setAttribute('draggable', true);
    newBit.addEventListener('dragstart', (e) => {
        newBit.style.opacity = '0.5';
        dragBitKind = 'css';
        codeBitDropCallback = (dropEl) => {
            var cssId = newBit.id;
            var atom = cssBits[cssId];
            var category = atom.split('-')[0];
            Array.from(dropEl.classList)
                .filter(cls => cls.startsWith(category))
                .forEach(cls => {
                    dropEl.classList.remove(cls);
                });
            dropEl.classList.add(atom);
            numCodeBitsApplied++;
            tryToUnlockPart5();
        };
    });
    newBit.addEventListener('dragend', (e) => {
        // @ts-expect-error
        e.target.style.opacity = '1';
        codeBitDropCallback = null;
    });

    document.getElementById('css-bits').appendChild(newBit);
    document.getElementById('css-bits').scrollTop = document.getElementById('css-bits').scrollHeight;
    
    setTimeout(() => {
        newBit.classList.add('animate-new-bit');
    }, 50);
};

var removeJsBit = (el, jsId) => {
    var jsFn = jsRegistry[jsId];
    createJsBit(jsId, jsFn);
    el.removeEventListener(jsFn.event, jsFn.fn)
    el.classList.remove(jsId);
};

var removeHtmlBit = (el) => {
    if (el.id) {
        return;
    }

    createHtmlBit(el);
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
}

var getHtmlInnerText = (el) => {
    var tagName = el.tagName.toLowerCase();
    var openTag = `<${tagName}>`;
    var closeTag = `</${tagName}>`;
    var innerText = (() => {
        if (tagName === 'img') {
            return el.src.split('/').slice(-1);
        }
        var words = el.innerText.trim().split(' ');
        var s = words[0];
        var i = 1;
        while (i < words.length && (`${openTag}${s} ${words[i]}${closeTag}`).length <= 25) {
            s = `${s} ${words[i]}`;
            i++;
        }
        return s;
    })();

    return `${openTag}${innerText}${closeTag}`;
}


var createHtmlBit = (el) => {
    var newBit = document.createElement('div');
    newBit.classList.add('bit');
    newBit.classList.add('html');

    var id = `${Date.now()}`;
    newBit.id = id;
    newBit.innerText = getHtmlInnerText(el);

    var freedEl = cloneElement(el);
    freedEl.id = id;

    freedEl.style.pointerEvents = 'none';
    freedEl.style.position = "fixed"; 
    freedEl.style.top = "0px"; 
    freedEl.style.left = "100%";
    document.getElementById('content').appendChild(freedEl);

    var dragBit = document.createElement("img");
    dragBit.style.position = "fixed"; 
    dragBit.style.top = "0px"; 
    dragBit.style.left = "100%";
    document.getElementById('content').appendChild(dragBit);

    html2canvas(freedEl, {
        backgroundColor: null,
    }).then((canvas) => {
        dragBit.src = canvas.toDataURL();
    });

    // @ts-expect-error
    newBit.setAttribute('draggable', true);
    newBit.addEventListener('dragstart', (e) => {
        dragBitKind = 'html';
        newBit.style.opacity = '0.5';
        var hideDragImage = document.createElement("img");
        hideDragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(hideDragImage, 0, 0);
        dragImage = dragBit;
    });
    newBit.addEventListener('dragend', (e) => {
        newBit.style.opacity = '1';
        if (!mouseInsideContent) {
            dragBit.style.top = "0px"; 
            dragBit.style.left = "100%";
            return;
        }
        newBit.remove();
        dragImage.remove();

        freedEl.style.top = `${dropY}px`;
        freedEl.style.left = `${dropX}px`;
        freedEl.style.pointerEvents = 'auto';
        freedEl.id = '';

        makeElementEditable(freedEl);
        numCodeBitsApplied++;
        tryToUnlockPart5();
    });

    document.getElementById('html-bits').appendChild(newBit);
    document.getElementById('html-bits').scrollTop = document.getElementById('html-bits').scrollHeight;
    
    setTimeout(() => {
        newBit.classList.add('animate-new-bit');
    }, 50);
};

var cloneElement = (el) => {
    var dims = el.getBoundingClientRect();
    var x = dims.x;
    var y = dims.y;
    var width = dims.width;

    const freedEl = document.createElement(el.tagName);

    freedEl.innerHTML = el.innerHTML;
    freedEl.value = el.value;
    freedEl.src = el.src;
    Array.from(el.classList).forEach(cls => freedEl.classList.add(cls));
    
    if (['p', 'li', 'img'].includes(freedEl.tagName.toLowerCase())) {
        freedEl.style.width = `${width}px`;
    } else {
        freedEl.style.minWidth = `${width}px`;
    }

    freedEl.style.left = `${x}px`;
    freedEl.style.top = `${y}px`;
    freedEl.style.position = 'fixed';
    freedEl.style.margin = `0px`;

    return freedEl;
};

var removeEventJsBits = (el, event) => {
    Object.keys(jsRegistry)
        .filter(jsId => jsRegistry[jsId].event === event)
        .filter(id => el.classList.contains(id))
        .forEach((jsId) => {
            var jsFn = jsRegistry[jsId];
            el.removeEventListener(jsFn.event, jsFn.fn)
            el.classList.remove(jsId);
        });
}

var createJsBit = (jsId, jsFn) => {
    if (Object.keys(jsBits).includes(jsId)) {
        document.getElementById(jsId).scrollIntoView(false);
        Array.from(document.getElementById(jsId).classList)
            .filter(cls => cls.startsWith('animate-'))
            .forEach(cls => document.getElementById(jsId).classList.remove(cls));

        setTimeout(() => {
            document.getElementById(jsId).classList.add('animate-same-bit');
        }, 50);

        return;
    }

    jsBits[jsId] = true;

    var newBit = document.createElement('div');
    newBit.classList.add('bit');
    newBit.classList.add('js');
    newBit.innerText = `${jsFn.event}:${jsFn.name}`;
    newBit.id = jsId;

    // @ts-expect-error
    newBit.setAttribute('draggable', true);
    newBit.addEventListener('dragstart', (e) => {
        dragBitKind = 'js';
        newBit.style.opacity = '0.5';
        codeBitDropCallback = (dropEl) => {
            var jsId = newBit.id;
            var jsFn = jsRegistry[jsId];
            removeEventJsBits(dropEl, jsFn.event);
            dropEl.addEventListener(jsFn.event, jsFn.fn);
            dropEl.classList.add(jsId);
            numCodeBitsApplied++;
            tryToUnlockPart5();
        };
    });
    newBit.addEventListener('dragend', (e) => {
        // @ts-expect-error
        e.target.style.opacity = '1';
        codeBitDropCallback = null;
    });

    document.getElementById('js-bits').appendChild(newBit);
    document.getElementById('js-bits').scrollTop = document.getElementById('js-bits').scrollHeight;
    
    setTimeout(() => {
        newBit.classList.add('animate-new-bit');
    }, 50);
};

var smashLastCodeBit = (el) => {
    var lastCodeBit = Array.from(el.classList)
        .find(cls => Object.keys(jsRegistry).includes(cls) || atomicCssClasses.includes(cls));

    if (lastCodeBit && lastCodeBit.startsWith('js-')) {
        removeJsBit(el, lastCodeBit);
        numCodeBitsSmashed++;
        tryToUnlockPart5();
        return;
    }

    if (lastCodeBit) {
        removeCssBit(el, lastCodeBit);
        numCodeBitsSmashed++;
        tryToUnlockPart5();
        return;
    }

    removeHtmlBit(el);
    numCodeBitsSmashed++;
    tryToUnlockPart5();
};

var useMouseCursor = () => {
    if (cursorMode == 'mouse') {
        return;
    }
    cursorMode = 'mouse';
    document.getElementById('mouse').classList.remove('inactive');
    document.getElementById('wrench').classList.add('inactive');
    document.getElementById('page').classList.remove('cursor-wrench');
    document.getElementById('page').classList.add('cursor-mouse');
};

var useWrenchCursor = () => {
    if (cursorMode == 'wrench') {
        return;
    }
    cursorMode = 'wrench';
    document.getElementById('wrench').classList.remove('inactive');
    document.getElementById('mouse').classList.add('inactive');
    document.getElementById('page').classList.remove('cursor-mouse');
    document.getElementById('page').classList.add('cursor-wrench');
};


var toggleServer = () => {
    if (serverOn) {
        document.getElementById('content').classList.add('hidden');
        document.getElementById('offline-content').classList.remove('hidden');
        document.getElementById('server-power').classList.add('offline');
    }
    else {
        document.getElementById('offline-content').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
        document.getElementById('server-power').classList.remove('offline');
    }
    serverOn = !serverOn;
};

var main = () => {
    document.getElementById('server-power').addEventListener('click', () => toggleServer());
    document.getElementById('wrench').addEventListener('click', () => useWrenchCursor());
    document.getElementById('mouse').addEventListener('click', () => useMouseCursor());
    // var debounceResize;
    // window.addEventListener('resize', () => {
    //     clearTimeout(debounceResize);
    //     debounceResize = setTimeout(() => location.reload(), 300);
    // });
    document.getElementById('reload').addEventListener('click', () => resetState());
    getEditableEls().forEach(el => {
        makeElementEditable(el);
    });
    document.getElementById('next1').addEventListener('click', clickNext1);
    document.getElementById('next2').addEventListener('click', clickNext2);
    document.getElementById('next3').addEventListener('click', clickNext3);
    document.getElementById('next4').addEventListener('click', clickNext4);
    document.getElementById('next5').addEventListener('click', clickNext5);
    document.getElementById('js-initial-fn').addEventListener(jsRegistry['js-bounce'].event, jsRegistry['js-bounce'].fn)
    document.getElementById('name-input').addEventListener('keypress', keypressNameInput);
    document.addEventListener('dragover', (e) => {
        if (dragBitKind !== 'html') {
            return;
        }
        var { x: originX, y: originY } = document.getElementById('content').getBoundingClientRect(); 
        var { width, height } = dragImage.getBoundingClientRect(); 
        dropX = e.clientX - originX - width/2;
        dropY = e.clientY - originY - height/2;
        dragImage.style.top = `${dropY}px`;
        dragImage.style.left = `${dropX}px`;
    });
    document.getElementById('content').addEventListener('dragover', (e) => {
        e.preventDefault();
        mouseInsideContent = true;
        e.dataTransfer.dropEffect = 'move';
    });
    document.getElementById('content').addEventListener('dragleave', () => {
        mouseInsideContent = false;
    });
    resetState();
};

main();

// TODO:
// * support HTML bits
//
// Nice to haves:
// * add nice animations to things like the "put me together!" title sliding in, etc.
// * add sound effects.
