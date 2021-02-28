function aggiungiTraccia() {
    let gruppoTraccia = document.getElementsByClassName("traccia-gruppo")[0];
    let gruppoTracciaClone = gruppoTraccia.cloneNode(true);
    gruppoTracciaClone.getElementsByClassName("nome-traccia")[0].value="";
    gruppoTracciaClone.getElementsByClassName("file-traccia")[0].value="";
    gruppoTraccia.parentNode.appendChild(gruppoTracciaClone);
}


function cancellaTraccia(el) {
    let tracce = document.getElementsByClassName("traccia-gruppo");
    if (tracce.length > 1) {
        el.parentElement.parentElement.remove();        
    } else {
        alert("Una traccia deve essere presente!")
    }
}
async function generaCoromix() {

    const {
        nomeCanzone,
        nomeCartella
    } = getNomeCanzoneCartella();

    var zip = new JSZip();
    zip.folder("assets/media/" + nomeCartella);

    let {
        jsTemplate,
        htmlTemplate,
        cssTemplate,
        bootstrapTemplate
    } = await getTemplate();

    zip.folder("css/").file('style.css', cssTemplate);
    zip.folder("css/").file('bootstrap.min.css', bootstrapTemplate);

    htmlTemplate = htmlTemplate.replaceAll('{{titoloCanzone}}', nomeCanzone);


    let fileVideo = document.getElementsByClassName("file-video")[0].files[0];

    if (!fileVideo) {
        alert("File video non inserito")
        return null;
    }

    zip.folder("assets/media/" + nomeCartella).file('direttore.m4v', fileVideo);

    let gruppiTraccia = document.getElementsByClassName("traccia-gruppo");
    let pathMedia = ["assets/media/" + nomeCartella + '/direttore.m4v'];

    const nodoTraccia = htmlTemplate.split('<!-- Traccia-->')[1].split('<!-- Fine Traccia-->')[0];
    for (gruppoTraccia of gruppiTraccia) {
        const {
            nomeTraccia,
            fileAudio
        } = getTraccia();
        zip.folder("assets/media/" + nomeCartella).file(nomeTraccia + '.mp3', fileAudio);
        pathMedia.push("assets/media/" + nomeCartella + '/' + nomeTraccia + '.mp3')
        let traccia = nodoTraccia;
        traccia = traccia.replaceAll('{{trackName}}', nomeTraccia);
        htmlTemplate = htmlTemplate.replace('<!-- Fine Traccia-->', '<!-- Fine Traccia-->' + traccia);
    }

    htmlTemplate = htmlTemplate.replaceAll(nodoTraccia, '');

    jsTemplate = jsTemplate.replaceAll('["{{mediaLocations}}"]', JSON.stringify(pathMedia));
    zip.folder("js/").file('scripts.js', jsTemplate);
    zip.file('index.html', htmlTemplate);


    zip.generateAsync({
            type: "blob"
        })
        .then(function (content) {
            saveAs(content, nomeCanzone + ".zip");
        });
}

function getNomeCanzoneCartella() {
    let nomeCanzone = document.querySelector("#nome-canzone").value.trim();
    if (nomeCanzone.length == 0) {
        alert("Nome canzone non inserito");
        throw new Error("Nome canzone non inserito");
    }
    var re = /^(con|prn|aux|nul|((com|lpt)[0-9]))$|([<>:"\/\\|?*])|(\.|\s)$/ig;
    if (!!re.test(nomeCanzone)) {
        alert("Nome canzone con caratteri invalidi")
        throw new Error("Nome canzone con caratteri invalidi");
    }
    const nomeCartella = nomeCanzone.replace(/[^0-9a-z]/gi, '').toLowerCase();

    return {
        nomeCanzone,
        nomeCartella
    }
}

function getTraccia() {
    let nomeTraccia = gruppoTraccia.querySelector('.nome-traccia').value.trim();
    if (nomeTraccia.length == 0) {
        alert("Traccia senza titolo")
        throw new Error("Traccia senza titolo");
    }
    var re = /^(con|prn|aux|nul|((com|lpt)[0-9]))$|([<>:"\/\\|?*])|(\.|\s)$/ig;
    if (!!re.test(nomeTraccia)) {
        alert("Traccia con caratteri invalidi")
        throw new Error("Traccia con caratteri invalidi");
    }
    nomeTraccia = nomeTraccia.replace(/[^0-9a-z]/gi, '').toLowerCase();
    let fileAudio = gruppoTraccia.getElementsByClassName("file-traccia")[0].files[0];

    if (!fileAudio) {
        alert("File audio non inserito")
        throw new Error("File audio non inserito");
    }

    return {
        nomeTraccia,
        fileAudio
    };
}

async function getTemplate() {

    const promises = await Promise.all([fetch('../template/js/scripts.js'), fetch('../template/index.html'), fetch('../template/css/style.css'), fetch('../template/css/bootstrap.min.css')]);

    const jsTemplate = await promises[0].text();
    const htmlTemplate = await promises[1].text();
    const cssTemplate = await promises[2].text();
    const bootstrapTemplate = await promises[3].text();

    return {
        jsTemplate,
        htmlTemplate,
        cssTemplate,
        bootstrapTemplate
    }
}