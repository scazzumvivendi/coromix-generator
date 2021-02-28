let audios = document.getElementsByTagName('audio');
let videos = document.getElementsByTagName('video');
let video = videos[0];

function mute(element) {

    if (!element.classList.contains('mute-active')) {
        element.classList.add('mute-active');
        element.nextElementSibling.nextElementSibling.volume = 0;
    } else {
        element.classList.remove('mute-active');
        element.nextElementSibling.nextElementSibling.volume = 1;
    }
}

function solo(element) {
    let mutes = document.getElementsByClassName('mute');
    if (!element.classList.contains('solo-active')) {
        element.classList.add('solo-active');

        for (m of mutes) {
            if (element.previousElementSibling != m) {
                m.classList.add('mute-active');
                m.nextElementSibling.nextElementSibling.volume = 0;
            }
        }
    } else {
        element.classList.remove('solo-active');
        for (m of mutes) {
            m.classList.remove('mute-active');
            m.nextElementSibling.nextElementSibling.volume = 1;
        }
    }
}

function play() {
    for (a of audios) {
        a.play();
    }

    for (v of videos) {
        v.play();
    }

}

function pause() {
    for (a of audios) {
        a.pause();
    }

    for (v of videos) {
        v.pause();
    }

}

function stop() {

    for (a of audios) {
        a.pause();
        a.currentTime = 0;
    }
    for (v of videos) {
        v.pause();
        v.currentTime = 0;
    }
}

function updateEnd() {

    timeString = formatTime(video.duration);
    document.querySelector('#end-label').innerHTML = timeString;

}


function calculateCurrentTime(updateBar) {

    var video = document.querySelector('video')
    var time = video.duration * (updateBar.value / 100);
    video.currentTime = time;
    document.querySelector('#time-label').innerHTML = formatTime(video.currentTime);

    for (a of audios) {
        a.currentTime = time;
    }
}

function updateTime(video) {
    var value = (100 / video.duration) * video.currentTime;
    document.querySelector('#timer').value = value;
    document.querySelector('#time-label').innerHTML = formatTime(video.currentTime);

}


function formatTime(time) {

    dateObj = new Date(time * 1000);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');


}

function loadMedia() {

    const preload = Preload();
    preload.fetch(mediaLocations).then(([videoSrc, ...audiosSrc]) => {
        const video = document.querySelector('#' + findId(videoSrc.url))
        video.src = videoSrc.blobUrl;
        const heights = [240, 360, 480];
        const totalHeight = document.documentElement.clientHeight / 2;
        let closest = heights.sort((a, b) => Math.abs(totalHeight - a) - Math.abs(totalHeight - b))[0];
        video.height = closest;
        document.querySelector('#timer').value = 0;

        for (a of audiosSrc) {
            document.querySelector('#' + findId(a.url)).src = a.blobUrl;
        }

        document.querySelector('.container').style.display = "block";
    });

}

function findId(URL) {
    const tk1 = URL.split('/');
    const tk2 = tk1[tk1.length - 1].split('.');
    return tk2[0];
}

let mediaLocations = ["{{mediaLocations}}"];
loadMedia();