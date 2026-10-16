(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('primary-nav');

  // Sticky header style
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000) setMenu(false); });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Enquiry form (frontend prototype only: nothing is sent)
  var form = document.getElementById('enquiry-form');
  var success = document.getElementById('form-success');
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : "Please enter the parent or guardian's name."; },
    phone: function (v) {
      var digits = v.replace(/[\s\-()]/g, '');
      return /^\+?\d{7,15}$/.test(digits) ? '' : 'Please enter a valid phone number.';
    },
    email: function (v) {
      return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address or leave it blank.';
    },
    level: function (v) { return v ? '' : "Please select your child's intended level."; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please write a short message (at least 10 characters).'; }
  };
  function check(field) {
    var el = form.elements[field];
    var msg = rules[field](el.value);
    document.getElementById(field + '-err').textContent = msg;
    el.classList.toggle('invalid', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  Object.keys(rules).forEach(function (f) {
    form.elements[f].addEventListener('blur', function () { check(f); });
    form.elements[f].addEventListener('input', function () { if (form.elements[f].classList.contains('invalid')) check(f); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.hidden = true;
    var firstBad = null;
    Object.keys(rules).forEach(function (f) { if (!check(f) && !firstBad) firstBad = form.elements[f]; });
    if (firstBad) { firstBad.focus(); return; }
    form.reset();
    success.hidden = false;
    success.focus();
  });
})();
