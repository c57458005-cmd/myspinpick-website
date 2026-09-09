
    var canvas = document.getElementById('wheel');
    var ctx = canvas.getContext('2d');
    var colors = ['#db2777','#7c3aed','#2563eb','#059669','#d97706','#dc2626','#0891b2','#65a30d'];
    var RESULT_PREFIX = "Answer: ";
    var RESULT_INIT = "Spin to answer yes or no";
    var options = [];
    var currentAngle = 0;
    var spinning = false;
    var historyCount = 0;

    function addHistory(name, colorIdx) {
      historyCount++;
      var chip = document.createElement('div');
      chip.className = 'chip';
      chip.style.background = colors[colorIdx % colors.length];
      chip.title = name;
      chip.textContent = historyCount + '. ' + name;
      document.getElementById('history').appendChild(chip);
    }

    function getOptions() {
      var raw = document.getElementById('options').value;
      return raw.split(/[\n,]/).map(function(s){ return s.trim(); }).filter(Boolean);
    }

    function drawWheel(angle) {
      var n = options.length;
      var cw = canvas.width, ch = canvas.height;
      var cx = cw / 2, cy = ch / 2, r = Math.min(cx, cy) - 12;
      ctx.clearRect(0, 0, cw, ch);
      if (n === 0) {
        ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#64748b'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Add options to spin', cx, cy);
        return;
      }
      var slice = (Math.PI * 2) / n;
      for (var i = 0; i < n; i++) {
        var start = angle + i * slice;
        var end = start + slice;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, end);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        var label = options[i];
        if (label.length > 14) label = label.slice(0, 13) + '…';
        ctx.fillText(label, r - 14, 5);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.moveTo(cx + r + 4, cy);
      ctx.lineTo(cx + r - 18, cy - 12);
      ctx.lineTo(cx + r - 18, cy + 12);
      ctx.closePath();
      ctx.fillStyle = '#1a202c';
      ctx.fill();
    }

    function pickWinner() {
      var n = options.length;
      var slice = (Math.PI * 2) / n;
      var a = ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      var idx = Math.floor(((Math.PI * 2 - a) % (Math.PI * 2)) / slice) % n;
      return idx;
    }

    function animate(total, duration) {
      if (!spinning) return;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        var angle = currentAngle + total * eased;
        drawWheel(angle);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          currentAngle = (currentAngle + total) % (Math.PI * 2);
          var idx = pickWinner();
          document.getElementById('result').textContent = RESULT_PREFIX + options[idx];
          addHistory(options[idx], idx);
          document.getElementById('meta').textContent = options.length + ' options on the wheel.';
          spinning = false;
          setBtnsDisabled(false);
          track('spin', { options: options.length, winner: options[idx] });
        }
      }
      requestAnimationFrame(step);
    }

    function buildAndSpin() {
      options = getOptions();
      if (options.length === 0) { document.getElementById('meta').textContent = 'Please add at least one option.'; return; }
      if (spinning) return;
      spinning = true;
      setBtnsDisabled(true);
      document.getElementById('result').textContent = 'Spinning…';
      drawWheel(currentAngle);
      var spins = 5 + Math.floor(Math.random() * 3);
      var total = spins * Math.PI * 2 + Math.random() * Math.PI * 2;
      animate(total, 3000);
    }

    function removeWinner() {
      var idx = pickWinner();
      if (options.length > 0) {
        var removed = options.splice(idx, 1);
        document.getElementById('options').value = options.join('\n');
        document.getElementById('result').textContent = 'Removed: ' + removed[0];
        drawWheel(currentAngle);
        document.getElementById('meta').textContent = options.length + ' options left.';
      }
    }

    function setBtnsDisabled(d) { var b = document.querySelectorAll('.btns button'); for (var i = 0; i < b.length; i++) { b[i].disabled = d; } }

    function resetAll() {
      document.getElementById('options').value = 'Yes,No,Maybe,Try later';
      options = getOptions();
      currentAngle = 0;
      spinning = false;
      setBtnsDisabled(false);
      document.getElementById('result').textContent = RESULT_INIT;
      document.getElementById('meta').textContent = options.length + ' options on the wheel.';
      document.getElementById('history').innerHTML = '';
      historyCount = 0;
      drawWheel(0);
    }

    document.getElementById('options').addEventListener('input', function() {
      options = getOptions();
      drawWheel(currentAngle);
    });

    options = getOptions();
    if (options.length) { document.getElementById('meta').textContent = options.length + ' options on the wheel.'; }
    drawWheel(0);
  