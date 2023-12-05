
export function startDrag(bar, target, callback) {
    var params = {
      top: 0,
      left: 0,
      currentX: 0,
      currentY: 0,
      flag: false,
      cWidth: 0,
      cHeight: 0,
      tWidth: 0,
      tHeight: 0
    };
    bar.style.cursor = 'move';
    bar.onmousedown = function (event) {
      var e = event ? event : window.event;
      params = {
        top: target.offsetTop,
        left: target.offsetLeft,
        currentX: e.clientX,
        currentY: e.clientY,
        flag: true,
        cWidth: document.body.clientWidth,
        cHeight: document.body.clientHeight,
        tWidth: target.offsetWidth,
        tHeight: target.offsetHeight
      };
      target.style.margin = 0;
      target.style.top = params.top + 'px';
      target.style.left = params.left + 'px';
   
      if (!event) {
        bar.onselectstart = function () {
          return false;
        }
      }
   
      document.onmousemove = function (event) {
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
   
        var e = event ? event : window.event;
        if (params.flag) {
          var nowX = e.clientX;
          var nowY = e.clientY;
          var disX = nowX - params.currentX;
          var disY = nowY - params.currentY;
          var zLeft = 0;
          var zTop = 0;
   
          zLeft = parseInt(params.left) + disX;

          if (zLeft <= -parseInt(params.tWidth / 2)) {
            zLeft = -parseInt(params.tWidth / 2);
          }
          if (zLeft >= params.cWidth - parseInt(params.tWidth * 0.5)) {
            zLeft = params.cWidth - parseInt(params.tWidth * 0.5);
          }
   
          zTop = parseInt(params.top) + disY;
    
          if (zTop <= 0) {
            zTop = 0;
          }
          if (zTop >= params.cHeight - parseInt(params.tHeight * 0.5)) {
            zTop = params.cHeight - parseInt(params.tHeight * 0.5);
          }

          target.style.left = zLeft + 'px';
          target.style.top = zTop + 'px';
        }
   
        if (typeof callback == "function") {
          callback(zLeft, zTop);
        }
      }
   
      document.onmouseup = function () {
        params.flag = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }