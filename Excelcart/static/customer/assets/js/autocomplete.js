

async function getCampuses() {
  const res = await fetch('/api/campuses/');

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json();
}

async function autocompleteMatch(input) {
  const campuses = await getCampuses();

  if (input === '') {
    return [];
  }

  const reg = new RegExp(input, 'i');

  const filteredCampuses = campuses.filter(
    (campus) =>
      campus.name.toLowerCase().includes(input.toLowerCase()) ||
      campus.abbreviation.toLowerCase().includes(input.toLowerCase()) ||
      campus.city.toLowerCase().includes(input.toLowerCase())
  );

  return filteredCampuses;
}

async function showResults(val) {
  const res = document.getElementById('result');
  res.innerHTML = '';
  let list = '';
  const result = await autocompleteMatch(val);

  for (let i = 0; i < result.length; i++) {
    list += `<li class='option' onclick="redirectToPage('${result[i].slug}')">${result[i].name}</li>`;
  }

  res.classList.remove('d-none')
  console.log(res)
  res.innerHTML = "<ul class='list' style='max-height: 200px; overflow: auto;'>" + list + '</ul>';
}

function redirectToPage(slug) {
  const url = `/campus/${encodeURIComponent(slug)}`;
  window.location.href = url;
}



//Other functions

function toggleOrder() {
  const orderDiv = document.getElementById('order_box');
  orderDiv.classList.toggle('d-block');
}


$(document).ready(function() {
  // Function to handle the selection of a day
  $('input[name="day"]').on('change', function() {
    var selectedDay = $(this).val();
    $('#selected_day').text(selectedDay);
    
    // AJAX call to retrieve the available time slots
    $.ajax({
      url: '/order/submit-day',
      type: 'GET',
      data: { 'day': selectedDay },
      success: function(response) {
        $('#time_list').html(response);
        $('#selected_time').text('');
      },
      error: function(xhr) {
        console.log(xhr.responseText);
      }
    });
  });

  // Function to handle the selection of a time
  $(document).on('change', 'input[name="time"]', function() {
    var selectedTime = $(this).val();
    $('#selected_time').text(selectedTime);
  });
});

$(document).ready(function() {
  // Function to handle the selection of a size
  $('input[name="size"]').on('change', function() {
    var selectedSize = $(this).val();
    var productId = $('input[name="p_id"]').val();

    $.ajax({
      url: '/order/get_psize_price/',
      type: 'GET',
      data: { 
        'size': selectedSize,
        'id': productId
      },
      success: function(response) {
        $('#order_qty').html(response);
      },
      error: function(xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  });
});


$(document).on('click', ".addCart", function() {
    var _vm = $(this);
    var _index = _vm.attr('data-index');
    var _productQty = $(".p-qty-" + _index).val();
    var _productId = $(".p-id-" + _index).val();
    var _productSize = $(".p-size-" + _index).val();

    console.log(_productSize, _productId, _productQty);
    
    // Ajax
    $.ajax({
    url: '/add-to-cart/',
    data: {
        'id': _productId,
        'qty': _productQty,
        'size': _productSize,
    },
    success: function(res) {
        $(".cartlist").text(res.totalitems); // Update number of cart items
        $(".cart-total").text(res.total_amt); // Update total amount in cart
        $(".qty-total").text(res.qty_price); // Update qty total amount in cart
        
        // Update cart item list in the header
        var cartItemList = '';
        $.each(res.cart_items, function(index, item) {
            var qty_price = item.variation__price * item.quantity
            cartItemList += '<li><a href="#0">' + item.product__name + ' (' + item.variation__size +  ') x ' + item.quantity + '</a><span>&#8358; ' + qty_price + '</span></li>';
        });
        
        // Update the <ul> element with the new cart item list
        $("ul.prod_list").html(cartItemList);
        
        _vm.attr('disabled', false);
    }
  });
});


$(document).on('click', ".updateCart", function() {
    var _vm = $(this);
    var _index = _vm.attr('item-id');
    var _itemFunc = _vm.attr('item-func');
    var _productQty = $(".p-qty-" + _index).val();

    console.log(_itemFunc);
    
    // Ajax
    $.ajax({
    url: '/update-cart/',
    data: {
        'item_id': _index,
        'qty': _productQty,
        'toDo': _itemFunc,
    },
    success: function(res) {
        $(".cartlist").text(res.totalitems); // Update number of cart items
        $(".cart-total").text(res.total_amt); // Update total amount in cart
        $(".total-pay").text(res.total_pay);        
        $(".qty-total").text(res.qty_price); // Update qty total amount in cart
        
        _vm.attr('disabled', false);
    }
  });
});







/* $(document).ready(function() {
  // Event delegation for the day selection
  $(document).on('click', '.chose_day input[type="radio"]', function() {
    if ($(this).is(':checked')) {
      var day_text = $(this).val();
      console.log(day_text);
      $('#selected_day').text(day_text);

      $.ajax({
        url: '/order/submit-day',
        data: {
          'day': day_text,
        },
        success: function (data) {
          $("#time_list").html(data);
        }
      });
    }
  });

  // Event delegation for the time selection
  $(document).on('click', '.chose_time input[type="radio"]', function() {
    if ($(this).is(':checked')) {
      var time_text = $(this).val();
      $('#selected_time').text(time_text);
    }
  });
}); */




