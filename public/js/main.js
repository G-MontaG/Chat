(function(app) {
  'use strict';
  app.AppComponent =
    ng.core.Component({
        selector: 'my-app',
        template: '<h1>My First Angular 2 App</h1>'
      })
      .Class({
        constructor: function() {}
      });
})(window.app || (window.app = {}));

(function(app) {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    ng.platform.browser.bootstrap(app.AppComponent);
  });
})(window.app || (window.app = {}));