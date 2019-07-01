function handleFirstTab(e) {
  if (e.keyCode === 9) {
    document.body.classList.remove('no-focus');

    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
}

function handleMouseDownOnce() {
  document.body.classList.add('no-focus');

  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
}

window.addEventListener('keydown', handleFirstTab);

var scrollpos = window.scrollY;
var header = document.getElementById('profile');
var header_height = header.offsetHeight;
var add_class_on_scroll = function () {
  document.body.classList.add("fixed-menu")
};

var remove_class_on_scroll = function() {
  document.body.classList.remove("fixed-menu")
};

window.addEventListener('scroll', function() {
  scrollpos = window.scrollY;
  if (scrollpos >= header_height) { add_class_on_scroll() }
  else { remove_class_on_scroll() }
});
