$(function() {
  Stripe.setPublishableKey('pk_live_9kQl97voh5ASw7GQ6c1cWqi2');

  function isAmountSelected() {
    // return ($('#payment-form #amounts li.selected').size() > 0);
    return (parseFloat($('#donationAmount').val()) > 0);
  }

  function isNameSet() {
    return ($('input#cardName').val() != "");
  }

  function isCardLikelyValid() {
    var flag = true;

    var number = $('#cardNumber').val().replace(/ /g, "");
    var regNumber = /^[0-9]{15,16}$/
    if (!regNumber.test(number) || number == "") {
      flag = false;
    }

    var cvc = $('#cardCvc').val();
    var regCvc = /^[0-9]{3,4}$/
    if (!regCvc.test(cvc) || cvc == "") {
      flag = false;
    }

    var exp = $('#cardExpiration').val();
    var regExp = /^[0-9]{1,2}\/[0-9]{2}$/
    if (!regExp.test(exp) || exp == "") {
      flag = false;
    }

    return flag;
  }

  function updateFormVisibility() {
    if (isAmountSelected()) {
      $('fieldset#name').show();
    } else {
      $('fieldset#name').hide();
    }

    if (isAmountSelected() && isNameSet()) {
      $('fieldset#card').show();
    } else {
      $('fieldset#card').hide();
    }

    if (isAmountSelected() && isNameSet() && isCardLikelyValid()) {
      $("#submitButton").css('display', 'block');
    } else {
      $("#submitButton").hide();
    }
  }

  function stripeResponseHandler(status, response) {
    if (response.error) {
      alert("There was a problem with your donation: " + response.error);
      $('#submitButton').attr("disabled", false);
      $('#submitButton').val('Donate!');
    } else {
      var form = $("#payment-form");
      var token = response['id'];
      form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
      form.get(0).submit();
    }
  }

  // Handle submit to Stripe
  $('#payment-form').submit(function() {
    $('#submitButton').attr("disabled", "disabled");
    $('#submitButton').val('Processing...');

    var exp = $('#cardExpiration').val();

    var name = $('#cardName').val();

    var expMonth = exp.split('/')[0];
    var expYear = exp.split('/')[1];

    var card = {
      number: $('#cardNumber').val().replace(/ /g, ""),
      cvc: $('#cardCvc').val(),
      exp_month: expMonth,
      exp_year: expYear,
      name: name
    }

    Stripe.createToken(card, stripeResponseHandler);

    return false;
  });

  // Handle name field
  $('input').keyup(function() {
    updateFormVisibility();
  });

  // Handle amount selector
  $('#payment-form #amounts li').click(function() {
    $('#payment-form #amounts li.selected').removeClass('selected');
    $(this).addClass('selected');

    if ($(this).html() != "Other") {
      $('#donationAmount').val($(this).html());
    }

    updateFormVisibility();
  });

  $('#payment-form #amounts li').last().click(function() {
    if ($(this).html() == "" || $(this).html() == "Other") {
      $(this).html('00');
      $('#donationAmount').val($(this).html());
      updateFormVisibility();
    };
  });

  $('#payment-form #amounts li').last().keyup(function() {
    $('#donationAmount').val($(this).html());
    updateFormVisibility();
  });

  $('#payment-form #amounts li').last().blur(function() {
    if ($(this).html() == "" || $(this).html() == "00") {
      $(this).html('Other');
      $(this).removeClass('selected');
      $(this).removeClass('numeric');
    } else {
      $(this).addClass('numeric');
    }
  });
});
