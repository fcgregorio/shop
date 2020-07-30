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
          if ($('#search > .dropdown-menu').hasClass("show")){
            $('#search > .dropdown-toggle').dropdown('toggle');
          }
        } else {
          if (!$('#search > .dropdown-menu').hasClass("show")){
            $('#search > .dropdown-toggle').dropdown('toggle');
          }
        }
      }
    }
  });

  $(document).ready(function(){
    $("#search").on("shown.bs.dropdown", function(event){
      if (app.searchResults.length === 0) {
        $("#search > .dropdown-toggle").dropdown('toggle');
      }
    });
  });
}