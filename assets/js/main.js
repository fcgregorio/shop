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
}