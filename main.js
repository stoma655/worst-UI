;(function() {

const app     = document.querySelector('.app');
const panel   = document.querySelector('.panel');
const circle  = document.querySelector('.circle');
const text    = document.querySelector('h1');

const volume = {
    init : () => {
        volume.listiners();
    },
    counts : {
        firstLvl        : 0,
        rotateLvl       : 0,
        circleLvl       : 0,
        resultHeight    : 0,
        circleVelocity  : 0,
        Xoffset         : 0
    },
    settings : {
        fps                      : 10,
        cursor                   : false,
        drag                     : false,
        firstWidth               : 0,
        firstHeightGrab          : false,
        firstHeight              : 0,
        blockedRightSideCircle   : false,
        blockedLeftSideCircle    : false,
        dragSide                 : "left"

    },
    listiners : () => {
        app.addEventListener('mousedown', volume.detectSide);
        app.addEventListener('mousemove', volume.detectNumbers);
        app.addEventListener('mousedown', volume.dragPanel);
        app.addEventListener('mouseup', volume.dropPanel);
    },
    dragPanel : () => {
        volume.settings.drag = true;
        volume.move();
        app.style.cursor = "grabbing";
    },
    dropPanel : () => {
        volume.settings.drag = false;
        volume.move();
        volume.settings.firstHeightGrab = false;
        volume.returnPanel();
        app.style.cursor = "grab";
    },
    returnPanel : () => {
        panel.style.transition = ".5s";
        panel.style.transform = "rotate(0deg)";
        setTimeout(() => {
            panel.style.transition = "0s";
        } ,500);
    },
    detectSide : (e) => {
        let appHalf = app.offsetWidth / 2;
        if (volume.settings.firstWidth > appHalf) {
            volume.settings.dragSide = "right";
        };
        if (volume.settings.firstWidth < appHalf) {
            volume.settings.dragSide = "left";
        };
    },
    detectNumbers : (e) => {
        // записываем ширину полотна от которой зависит наклон панели и переменная rotateLvl которая и дает ротейт панели
        volume.settings.firstWidth = e.offsetX;
        let appHalf = app.offsetWidth / 2;
        if (volume.settings.firstWidth > appHalf) {
            volume.counts.rotateLvl = e.offsetY;
        };
        if (volume.settings.firstWidth < appHalf) {
            volume.counts.rotateLvl = -e.offsetY;
        };
        volume.counts.Xoffset = e.offsetX;
    },
    move : (e) => {
        // запись высоты курсора в первый кадр
        if (volume.settings.firstHeightGrab == false) {
            volume.settings.firstHeight = volume.counts.rotateLvl;
            volume.settings.firstHeightGrab = true;
        };
        
        // вызываем движение кружка
        volume.moveCircle();
        // даем свйоства объектам
        let a = setInterval(() => {
            // проверяем в какой половине курсор, если перескакивает на противоположную ставим панель на место
            if (volume.settings.dragSide == "right" && volume.counts.Xoffset < app.offsetWidth / 2 + 10) {
                clearInterval(a);
                volume.returnPanel();
            };
            if (volume.settings.dragSide == "left" && volume.counts.Xoffset > app.offsetWidth / 2 - 10) {
                clearInterval(a);
                volume.returnPanel();
            };
            if (volume.settings.drag == true) {
                volume.counts.resultHeight = (volume.counts.rotateLvl / 2 - volume.settings.firstHeight / 2) / 1.5;
                panel.style.transform = "rotate("+ volume.counts.resultHeight +"deg)";
                volume.renderText();
            };
            if (volume.settings.drag == false) {
                clearInterval(a);
            };
        } , volume.settings.fps);
    },
    moveCircle : () => {
        let b = setInterval(() => {
            volume.counts.circleVelocity = volume.counts.resultHeight / 60;

            if (volume.counts.circleLvl > 99) {
                volume.settings.blockedRightSideCircle = true;
            };
            if (volume.counts.circleLvl < 0) {
                volume.settings.blockedLeftSideCircle = true;
            };
            if (volume.counts.resultHeight < 0){
                volume.settings.blockedRightSideCircle = false;
            };
            if (volume.counts.resultHeight > 0) {
                volume.settings.blockedLeftSideCircle = false;
            };
            if (volume.settings.blockedLeftSideCircle == false && volume.settings.blockedRightSideCircle == false) {
                volume.counts.circleLvl += volume.counts.circleVelocity;
            };

            circle.style.left = ""+ volume.counts.circleLvl +"%";
            
            if (volume.settings.drag == false) {
                clearInterval(b);
            };
        } , 0);
    },
    renderText : () => {
        text.innerText = "Volume: "+ Math.floor(volume.counts.circleLvl) +"";
    }
};
volume.init();

}());