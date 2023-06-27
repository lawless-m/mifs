import { 
    nbsp, brs,
    div, h2, p, ul, li, link, br, text,
    table, colwidths, tbody, thead, th, tr, td, create,
    inputfloat,
    removeChildren, byClass, byId, byData, getData,
    dialog, form, label, button, input, fieldset, chk, legend, img
} from '/JavaScriptModules/Elements.js';

import { plainPost } from '/JavaScriptModules/Requests.js';

import { fetchJson } from '/JavaScriptModules/JSON.js';

function cpy() {
   const imag = byId('imagine');
   const txt = imag.innerText;
   const args = txt.split('\n').filter(t => t != '');
   let imagine = "";
   imagine += args.filter(t => { return t.startsWith('https://') }).join(' ');
   const iw = imagine == "" ? '' : ' --iw 1';
   imagine += " " + args.filter(t => { return !t.startsWith('https://') }).map(s => `${s}::1`).join(' ') + iw + " --chaos 0";
   navigator.clipboard.writeText(imagine);
   return false;
}

function clr() {
   const imag = byId('imagine');
   removeChildren(imag);
}

function cpy_and_close(evt) {
    cpy(evt);
    byId('imgdialog').open = false;
}

function img_dialog(evt) {
    let src = evt.target.getAttribute('data-w');
    let by = byData('data-c', evt.target.parentNode)[0].getAttribute('data-c');
	let d = byId('imgdialog');
    if(d == undefined) {
        d = dialog({id:'imgdialog', class:'dialog'});   
        d.style.position = 'absolute';
        d.style.width = '1200px';
        d.style.height = '1200px'
        d.style.left = '10px';
        byId('main').append(d);
    } else {
        removeChildren(d);
    }
    d.append(form({method:'dialog'}, [
        button({value:'cancel'}, 'Cancel'), 
        '   -   ', 
        link({href:'#', onclick:cpy_and_close, 'data-c':by}, by), 
        br(), 
        img(src, 'style', 1024, 1024), 
        br(), 
        button({value:'cancel'}, 'Cancel'), 
        '   -   ', 
        link({href:'#', onclick:cpy_and_close, 'data-c':by}, by), 
    ]));

    // Set the position of the dialog
    
    d.style.top = (window.scrollY + 100) + 'px';

    // Show the dialog
    d.open = true

//    d.open = true;
    return false;
}

function tag_imgs() {
	byData('data-w').forEach( node => {
		node.onclick = img_dialog;
	});
    byData('data-c').forEach( node => {
		node.onclick = cpy;
	});
}

function describe(evt) {
    const desc = byId('imagine');
    const style = evt.target.getAttribute('data-s');
    const lable = evt.target.getAttribute('data-l');
    if(lable == '') {
        desc.innerText = style + '\n' + desc.innerText;
    } else {
        desc.innerText += style + '\n';
    }
	
    return false;
}

function fill_images(data, dir) {
    const dv = byId(dir);
    data.map(i => {
        let lable;
        let style;
        let im = {src:`${dir}/${i}.webp.jpg`, i:`${dir}/${i}.webp`}
        if(dir == 'mifs') {
            style = `https://steponnopets.net/mj/mifs/${i}.webp`;
            lable = i;
        } else {
            style = i.replace(/_/g, " ").replace(/^ +/, "");
            lable = style.replace(/^by /, "")
                .replace(/^a painting by /, "")
                .replace(/^in the style of /, "");
        }
        im.l = lable;
        im.s = style;
        return im;
    })
    .sort((a, b) => a.l.localeCompare(b.l))
    .map(i=>{
        const im = img(i.src, i.s);
        im.onclick = describe;	
        im.setAttribute('data-i', i.i);
        if(i.s.startsWith('https:')) {
            im.setAttribute('data-l', '');
        } else {
            im.setAttribute('data-l', i.l);
        }
        im.setAttribute('data-s', i.s);
        return im;
    })
    .forEach( im => {
        let idiv = div({class:'img'}, im);
        let lable = im.getAttribute('data-l');
        if(lable != '') {
            idiv.append(div({class:'overlay'}, lable));
        }
        dv.append(idiv);
    });
}

function resize_imgpanes() {
    const dw = (window.innerWidth - 350) + 'px';
    ['mifs', 'styles'].forEach(dv => {
        byId(dv).style.width = dw;
        byId(dv).style.height = (window.innerHeight - 50) + 'px';
    });

}

function expand(range) {
    var start = range.startOffset;
    var end = range.endOffset;
    var text = range.startContainer.textContent;
    while (start > 0 && text[start - 1].match(/\S/)) {
      start--;
    }
    while (end < text.length && text[end].match(/\S/)) {
      end++;
    }
    range.setStart(range.startContainer, start);
    range.setEnd(range.startContainer, end);
}

function pop_tag(evt) {
    evt.preventDefault();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    expand(range);
    selection.removeAllRanges();
    selection.addRange(range);
    return window.getSelection().toString();
}

function pop_hashtag(evt) {
    const tag = pop_tag(evt);
    window.open(`https://www.instagram.com/explore/tags/${tag.replace('#', '')}/`);
}

function pop_imagine(evt) {
    const tag = pop_tag(evt);
    if(tag.startsWith('https://')) {
	window.open(tag);
    } else {
	window.open(`https://steponnopets.net/mj/styles/${tag.replace(' ', '_')}.webp`);
    }

}

function fetch_imgs() {
    ['mifs', 'styles'].forEach(dir => {
        fetchJson(`ls.cgi?dir=${dir}`, data => { fill_images(data, dir) });
    });
    resize_imgpanes();
}

function load_hashtags() {
    const tags = byId('tags');
    fetch('tags.json')
    .then(response => response.json())
    .then(data => { 
        data.forEach(line => {
            tags.innerText += line + "\n";
        })
        
    })
    .catch(error => {});
}

function sve() {
    const tags = byId('tags');
    plainPost('./saveTags.cgi', tags.innerText, ()=>{});
}

function add_buttons() {
    let but = byId('ibuttons');
    but.append(button({onclick:cpy}, 'Copy'));
    but.append(button({onclick:clr}, 'Clear'));
    but = byId('tbuttons');
    but.append(button({onclick:sve}, 'Save'));
    
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function tablinks() {
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].onclick = (event) => { openTab(event, tablinks[i].getAttribute('data-tgt')); };
    }
}
  

function setup() {
    fetch_imgs();
    load_hashtags();
    tablinks();
    byId('tags').addEventListener("contextmenu", pop_hashtag);
    byId('imagine').addEventListener("contextmenu", pop_imagine);

    add_buttons();
}

window.addEventListener('load', setup);
window.addEventListener('resize', resize_imgpanes);
