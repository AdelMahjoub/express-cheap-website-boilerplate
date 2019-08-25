const express = require('express');

const router = express.Router();

const PAGES_TITLES = {
  HOME: 'home',
  ABOUT: 'about',
  SERVICES: 'services',
  CONTACT: 'contact'
}

const PAGES_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
}

const PAGES_VIEWS = {
  HOME: 'index',
  ABOUT: 'about',
  SERVICES: 'services',
  CONTACT: 'contact',
  ERROR: 'error'
}

router
  .use((req, res, next) => {
    res.locals.__pathname__ = req.path;
    res.locals.__pages__ = PAGES_TITLES;
    res.locals.__routes__ = PAGES_ROUTES;
    return next();
  })
  .get(Object.values(PAGES_ROUTES), (req, res, next) => {
    let page = Object.keys(PAGES_ROUTES).filter(page => PAGES_ROUTES[page] === req.path)[0];
    res.locals.__title__ = PAGES_TITLES[page];
    return res.render(PAGES_VIEWS[page]);
  })

  .get('*', (req, res) => {
    return res.render(PAGES_VIEWS.ERROR);
  })

module.exports = router;