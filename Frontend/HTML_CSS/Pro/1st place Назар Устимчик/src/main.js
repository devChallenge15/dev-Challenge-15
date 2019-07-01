"use strict"; 
function qs(selector) {
  return document.querySelector(selector);
};


document.addEventListener("DOMContentLoaded", () => {
  // header size
  document.addEventListener('wheel', e => {
    let header = qs('header');
    e.deltaY < 0 ? header.classList.remove('header_s') : header.classList.add('header_s'); 
  });
  // black theme
  qs('.header__menu').addEventListener('click', setBlack);
  function setBlack() {
    qs('body').classList.toggle('theme-is-black');
  };

  // cookie
  if (localStorage.cookie === undefined) {
    qs('.popup').classList.add('open');
    qs('.popup button').addEventListener('click', () => {
      console.log('clicks');
      
      localStorage.setItem('cookie', 'true');
      qs('.popup').remove();
    })
  } else qs('.popup').remove();

  // mail
  qs('.header__mail').addEventListener('click', (e) => {
    e.target.classList.toggle('hidden');
    qs('.header__manage').classList.toggle('hidden');
  })
});  