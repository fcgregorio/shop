---
---
window.onload = function() {
  var app = new Vue({
    el: '#app',
    data: {
      products: null,
      searchInput: '',
      searchIndex: null,
      searchResults: []
    },
    created: function () {

      $.getJSON('{{ site.url}}{{ site.baseurl }}/json/products.json', function(products) {
        app.products = products;
        app.searchIndex = lunr(function() {
          this.field('name');
          this.field('brand');
          this.field('sku');
          this.field('category');
          this.field('subcategory');
          this.ref('id');

          products.forEach(function (product) {
            this.add(product) 
          }, this);
        });
      });
    },
    watch: {
      searchInput: function(val) {
        if (val.trim() === "") {
          app.searchResults = []
        } else {
          app.searchResults = app.searchIndex.search(val);
        }
      },
      searchResults: function(val) {
        if (val.length === 0) {
          $('#search > .dropdown').removeClass("is-active");
        } else {
          $('#search > .dropdown').addClass("is-active");
        }
      }
    }
  });

  $(document).ready(function() {
    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
  });

  $(document).on("click", function(event){
    if(!$(event.target).closest("#search").length){
      $('#search > .dropdown').removeClass("is-active");
    } else {
      if (app.searchResults.length === 0) {
        $('#search > .dropdown').removeClass("is-active");
      } else {
        $('#search > .dropdown').addClass("is-active");
      }
    }
  });

  let tabsWithContent = (function () {
    let tabs = document.querySelectorAll('.tabs li');
    let tabsContent = document.querySelectorAll('.tab-content');

    let deactvateAllTabs = function () {
      tabs.forEach(function (tab) {
        tab.classList.remove('is-active');
      });
    };

    let hideTabsContent = function () {
      tabsContent.forEach(function (tabContent) {
        tabContent.classList.remove('is-active');
      });
    };

    let activateTabsContent = function (tab) {
      tabsContent[getIndex(tab)].classList.add('is-active');
    };

    let getIndex = function (el) {
      return [...el.parentElement.children].indexOf(el);
    };

    tabs.forEach(function(tab){
      tab.addEventListener('click', function () {
        deactvateAllTabs();
        hideTabsContent();
        tab.classList.add('is-active');
        activateTabsContent(tab);
      });
    })

    if (tabs[0]) tabs[0].click();
  })();

  let imageSwitch = (function(){
    let mainDisplay = $('#mainDisplay');
    let thumbnails = $('#thumbnails a');

    thumbnails.click(function() {
      mainDisplay.attr('src', $(this).find('img').attr('src'));
    });

    if (thumbnails[0]) thumbnails[0].click();
  })();

  let hoverBox = (function(){
    let items = $('.hoverbox');

    items.on({
      mouseenter: function() {
        $(this).add('box');
      }, mouseleave: function() {
        $(this).remove('box');
      }
    });
  })();
}