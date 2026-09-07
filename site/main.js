(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- active nav (which page are we on) ---------- */
  var file = location.pathname.split("/").pop() || "index.html";
  var page = file.replace(".html", "");
  if (page === "" || page === "index") page = "home";
  if (page.indexOf("project-") === 0) page = "projects";
  document.querySelectorAll(".hud__nav a, .mobile-nav a, .spine a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("/").pop();
    var target = href.replace(".html", "");
    if (target === page) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var mnav = document.getElementById("mobileNav");
  if (toggle && mnav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mnav.hidden = open;
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- hero boot sequence (home only) ---------- */
  var boots = Array.prototype.slice.call(document.querySelectorAll("[data-boot]"))
    .sort(function (a, b) { return a.dataset.boot - b.dataset.boot; });
  var name = document.querySelector(".hero__name.glitch");
  function glitch() {
    if (reduce || !name) return;
    name.classList.add("is-glitching");
    setTimeout(function () { name.classList.remove("is-glitching"); }, 520);
  }
  if (boots.length) {
    if (reduce) {
      boots.forEach(function (el) { el.classList.add("in"); });
    } else {
      boots.forEach(function (el, i) {
        setTimeout(function () { el.classList.add("in"); if (el === name) glitch(); }, 120 + i * 130);
      });
      setInterval(function () { if (Math.random() < 0.5 && !document.hidden) glitch(); }, 7000);
    }
  }
  if (name) name.addEventListener("mouseenter", glitch);

  /* ---------- project image logs ---------- */
  document.querySelectorAll(".btn--log").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      btn.textContent = open
        ? btn.textContent.replace("Hide log", "Image log")
        : btn.textContent.replace("Image log", "Hide log");
    });
  });

  /* ---------- looping videos: play only while on screen ---------- */
  var loopVids = document.querySelectorAll("video[data-loop]");
  if (loopVids.length) {
    loopVids.forEach(function (v) { v.muted = true; });
    if ("IntersectionObserver" in window) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) {
            if (v.preload !== "auto") v.preload = "auto";
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      }, { threshold: 0.35 });
      loopVids.forEach(function (v) { vo.observe(v); });
    } else {
      loopVids.forEach(function (v) {
        v.setAttribute("autoplay", "");
        if (v.play) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    }
  }

  /* ---------- honest placeholder links ---------- */
  document.querySelectorAll("a[data-placeholder]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var old = a.textContent;
      a.textContent = "Add link in HTML";
      setTimeout(function () { a.textContent = old; }, 1400);
    });
  });

  /* ---------- reveal phone number on click ---------- */
  document.querySelectorAll("button[data-phone]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var num = btn.getAttribute("data-phone");
      var a = document.createElement("a");
      a.className = btn.className;
      a.href = "tel:" + num.replace(/[^\d+]/g, "");
      a.textContent = num;
      btn.replaceWith(a);
    });
  });

  /* ---------- flip the frame corner (chamfer + hazard bracket) per element ---------- */
  document.querySelectorAll(
    ".case__figs figure, .case__vid, .case__gallery figure, .case__shot, .frame"
  ).forEach(function (el) {
    if (Math.random() < 0.5) el.setAttribute("data-fm", "1");
  });

  /* ---------- drifting-artifact canvas ---------- */
  initFx();
  function initFx() {
    var c = document.getElementById("fx");
    if (!c || !c.getContext) return;
    var ctx = c.getContext("2d");
    var w = 0, h = 0, raf = 0, last = 0, streakTimer = 0, nextStreak = 900;
    var chars = "アイウエオカキクサソタナハミ0123456789ABCDEF+×÷=<>[]{}/\\⊹▚◺◹".split("");
    var glyphs = [], streaks = [], frags = [];

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    /* all rates are per-SECOND — framerate independent */
    function mkGlyph(fromRight) {
      return {
        x: fromRight ? w + rnd(0, 120) : rnd(0, w),
        y: rnd(0, h),
        vx: -rnd(8, 34),
        vy: rnd(-4, 4),
        ch: chars[(Math.random() * chars.length) | 0],
        size: rnd(11, 21),
        a: rnd(0.05, 0.15),
        col: Math.random() < 0.16 ? "#f5e003" : (Math.random() < 0.22 ? "#2fe6e6" : "#a7ac9f"),
        life: rnd(6, 15), age: 0
      };
    }
    function mkStreak() {
      return { x: -rnd(80, 360), y: Math.round(rnd(0, h)) + 0.5, len: rnd(80, 260), v: rnd(280, 620), age: 0, col: Math.random() < 0.5 ? "#2fe6e6" : "#f5e003" };
    }
    function mkFrag(fromEdge) {
      var s = rnd(26, 74);
      return {
        x: fromEdge ? rnd(-80, w + 80) : rnd(0, w),
        y: fromEdge ? rnd(-80, h + 80) : rnd(0, h),
        vx: rnd(-14, 14), vy: rnd(-14, 14),
        s: s, rot: rnd(0, 6.28), vr: rnd(-0.25, 0.25),
        a: rnd(0.03, 0.08),
        col: Math.random() < 0.5 ? "#f5e003" : "#2fe6e6",
        life: rnd(10, 22), age: 0
      };
    }
    resize();
    var count = Math.round(Math.min(22, Math.max(10, (w * h) / 58000)));
    for (var i = 0; i < count; i++) glyphs.push(mkGlyph(false));
    for (var fi = 0; fi < 3; fi++) frags.push(mkFrag(false));

    function frame(ts) {
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts;
      ctx.clearRect(0, 0, w, h);
      ctx.textBaseline = "middle";

      /* drifting chamfered fragments */
      for (var p = 0; p < frags.length; p++) {
        var fr = frags[p];
        fr.x += fr.vx * dt; fr.y += fr.vy * dt; fr.rot += fr.vr * dt; fr.age += dt;
        if (fr.age > fr.life) { frags[p] = mkFrag(true); continue; }
        var ff = Math.min(1, fr.age / 1.5) * Math.min(1, (fr.life - fr.age) / 2.5);
        ctx.save();
        ctx.translate(fr.x, fr.y);
        ctx.rotate(fr.rot);
        ctx.globalAlpha = fr.a * ff;
        ctx.strokeStyle = fr.col;
        ctx.lineWidth = 1;
        var q = fr.s, ch = q * 0.28;
        ctx.beginPath();
        ctx.moveTo(-q / 2 + ch, -q / 2);
        ctx.lineTo(q / 2, -q / 2);
        ctx.lineTo(q / 2, q / 2 - ch);
        ctx.lineTo(q / 2 - ch, q / 2);
        ctx.lineTo(-q / 2, q / 2);
        ctx.lineTo(-q / 2, -q / 2 + ch);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      for (var i = 0; i < glyphs.length; i++) {
        var g = glyphs[i];
        g.x += g.vx * dt; g.y += g.vy * dt; g.age += dt;
        if (g.x < -50 || g.age > g.life) { glyphs[i] = mkGlyph(true); continue; }
        var fade = Math.min(1, g.age / 0.5) * Math.min(1, (g.life - g.age) / 1.1);
        ctx.globalAlpha = g.a * fade;
        ctx.fillStyle = g.col;
        ctx.font = g.size + 'px "Share Tech Mono", monospace';
        ctx.fillText(g.ch, g.x, g.y);
      }

      streakTimer += dt * 1000;
      if (streakTimer > nextStreak) { streaks.push(mkStreak()); streakTimer = 0; nextStreak = rnd(1400, 4800); }
      for (var j = streaks.length - 1; j >= 0; j--) {
        var s = streaks[j];
        s.x += s.v * dt; s.age += dt;
        var alpha = Math.min(0.5, s.age / 0.18) * Math.max(0, 1 - s.x / (w + s.len));
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = s.col; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.len, s.y); ctx.stroke();
        if (s.x - s.len > w) streaks.splice(j, 1);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      ctx.textBaseline = "middle";
      for (var k = 0; k < glyphs.length; k++) {
        var g = glyphs[k];
        ctx.globalAlpha = g.a * 0.8;
        ctx.fillStyle = g.col;
        ctx.font = g.size + 'px "Share Tech Mono", monospace';
        ctx.fillText(g.ch, g.x, g.y);
      }
      for (var p = 0; p < frags.length; p++) {
        var fr = frags[p];
        ctx.save();
        ctx.translate(fr.x, fr.y);
        ctx.rotate(fr.rot);
        ctx.globalAlpha = fr.a;
        ctx.strokeStyle = fr.col;
        ctx.lineWidth = 1;
        ctx.strokeRect(-fr.s / 2, -fr.s / 2, fr.s, fr.s);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    window.addEventListener("resize", function () { resize(); if (reduce) drawStatic(); });

    if (reduce) { drawStatic(); return; }

    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { last = 0; raf = requestAnimationFrame(frame); }
    });
  }
})();
