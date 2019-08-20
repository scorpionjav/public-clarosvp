"use strict";

function determinarUrl() {
  var valor = $('#select-producto').val();
  var contenedor = $('#body-producto');
  contenedor.find('div[id^="producto"]').addClass('d-none');

  switch (valor) {
    case "postpago":
      contenedor.find('#productoPostpagoSubview').removeClass('d-none');
      break;

    case "prepago":
      contenedor.find('#productoPrepagoSubview').removeClass('d-none');
      break;

    case "cuentaExacta":
      contenedor.find('#productoCuentaExactaSubview').removeClass('d-none');
      break;

    case "hogarBafi":
      contenedor.find('#productoHogarBAFISubview').removeClass('d-none');
      break;

    case "hogarDTH":
      contenedor.find('#productoHogarDTHSubview').removeClass('d-none');
      break;

    case "hogarHFC":
      contenedor.find('#productoHogarHFCSubview').removeClass('d-none');
      break;
  }
}

function buscarSubview(seleccionado) {
  bloquearPantalla();
  determinarUrl();
  desbloquearPantalla();
}

var selector = $("#select-producto");
selector.ready(function () {
  var temp = JSON.parse(sessionStorage.getItem('actual'));

  if (temp === null) {
    temp = {
      contId: selector.find("option:first-of-type").attr("data-cont"),
      serviceId: selector.find("option:first-of-type").attr("data-service"),
      tipo: selector.val()
    };
    sessionStorage.setItem('actual', JSON.stringify(temp));
  }

  $(this).find('option[data-service="' + temp.serviceId + '"').prop('selected', true);
  buscarSubview(temp);
});
selector.on('change', function () {
  var nuevo = {
    contId: selector.find(":selected").attr("data-cont"),
    serviceId: selector.find(":selected").attr("data-service"),
    tipo: selector.val()
  };
  sessionStorage.setItem('actual', JSON.stringify(nuevo));
  buscarSubview(nuevo);
});
"use strict";

function bloquearPantalla() {
  $.blockUI({
    message: '<img width="50px" src="sv2/imgs/claro-loader.gif" alt="Cargando"/>',
    overlayCSS: {
      backgroundColor: '#000000',
      baseZ: 10000
    },
    css: {
      border: 'none',
      backgroundColor: 'transparent'
    }
  });
}

function desbloquearPantalla() {
  $.unblockUI();
}

function clickMenu() {
  $('#menu-mobile img').toggleClass('abierto');

  if ($('#menu-mobile img').hasClass('abierto')) {
    $('#menu-mobile img').attr('src', 'sv2/imgs/header/menu-mobile-x.png');
  } else {
    $('#menu-mobile img').attr('src', 'sv2/imgs/header/menu-mobile.png');
  }

  $('#header-menu').toggle();
  window.scrollTo(0, 0);
  document.body.style.overflow = document.body.style.overflow === "" ? "hidden" : "";
}

if ($(window).width() < 992) {
  $('#header-menu li').click(function () {
    clickMenu();
  });
}

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

$(".link-tabla").click(function (e) {
  e.preventDefault();
  bloquearPantalla();
  var dest = $(this).attr('href');
  $("#contenedor-tabla").appendTo(dest);
  desbloquearPantalla();
});
var modal = $('.modal'),
    modalDetalles = $('.modal.detalles');
$('.tabla-historial .link').click(function (e) {
  e.preventDefault();
  var fila = $(this).closest('.tabla-historial table tr');
  modalDetalles.find('.nombre').text(fila.find('td:nth-child(1)').text());
  modalDetalles.find('.cargo').text(fila.find('td:nth-child(6)').text());
  modalDetalles.fadeIn();
});
modal.find(".cancelar").click(function (e) {
  e.preventDefault();
  modal.fadeOut();
});
$('#h-sc-internet .circulo-color').attr('stroke-dasharray', (100 - 30) * 100 / 100 + ',100');

function determinarUnidad(bytes) {
  if (bytes == 0) return "0 BYTE";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 10) / 10 + " " + ["BYTES", "KB", "MB", "GB", "TB"][i];
}

function funcionesGenerales() {
  $(".home-equipo .tabla-detalles td.du").each(function () {
    $(this).text(determinarUnidad($(this).text()).toLowerCase());
  });
  $(".home-consumo .circulo-color").addClass("animacion-consumo");
  $(".home-consumo .card").each(function () {
    if ($(this).hasClass("error-consumo")) {
      $(this).find(".svgtexto-3").empty().append("Informaci&oacute;n");
      $(this).find(".svgtexto-4").text("no disponible");
    } else if (!$(this).hasClass("libres")) {
      var t = $(this).find(".svgtexto-1").text(),
          c = $(this).find(".svgtexto-4").text();
      $(this).find(".circulo-color").attr("stroke-dasharray", (t - c) * 100 / t + ",100");

      if ($(this).hasClass("calcular-bytes")) {
        $(this).find(".svg-circular").attr("title", "DISPONIBLE " + determinarUnidad(t - c));
        var t2 = determinarUnidad(t).split(" ")[0],
            u2 = determinarUnidad(t).split(" ")[1],
            c2 = determinarUnidad(c);
        $(this).find(".svgtexto-1").text(t2);
        $(this).find(".svgtexto-2").text(u2);
        $(this).find(".svgtexto-4").text(c2);
      } else {
        var u = $(this).find(".svgtexto-2").text().toUpperCase();
        $(this).find(".svgtexto-4").text(c + " " + u);
        $(this).find(".svg-circular").attr("title", "DISPONIBLE " + (t - c) + " " + u);
      }
    }
  });
  $("[data-toggle='tooltip']").tooltip();
  $(".home-consumo .tab-pane .card-deck").slick({
    mobileFirst: true,
    dots: true,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [{
      breakpoint: 993,
      settings: "unslick"
    }]
  });
  $(".home-consumo .svg-circular text").each(function () {
    var transform = $(this).css('transform');

    if (transform != "none") {
      $(this).attr('transform', transform);
    }
  });
  $(".home-consumo .bolsas").slick({
    arrows: true,
    dots: true,
    fade: true,
    cssEase: 'linear'
  });
}

$(".home-consumo .s-contenedor .nav-link").click(function (e) {
  e.preventDefault();
  var idTab = $(this).attr("href");
  $(".home-consumo .circulo-color").removeClass("animacion-consumo");
  $(idTab).find(".circulo-color").addClass("animacion-consumo");
});
$(document).ready(function () {
  funcionesGenerales();
});
var diccionario = {
  tarjeta_paises: {
    lista_paises: "Argentina, Brasil, Colombia, Ecuador, Rep. Dominicana, Honduras, Puerto Rico, Costa Rica, Guatemala, Panamá, Paraguay, Uruguay, El Salvador, Nicaragua, Perú, México, Estados Unidos, Alemania, España, Francia, Italia y Reino Unido."
  },
  tarjeta_ldi: {
    activado: "Recuerde desactivar <br> tus Servicios de LDI <br> <span>si no los vas a utilizar</span>",
    desactivado: "Recuerde activar <br> tus Servicios de LDI <br> <span>antes de comenzar a utilizarlos</span>"
  },
  tarjeta_roaming: {
    activado: "Recuerde desactivar <br> tus Servicios de Roaming <br> <span>si no los vas a utilizar</span>",
    desactivado: "Recuerde activar <br> tus Servicios de Roaming <br> <span>antes de comenzar a utilizarlos</span>"
  },
  modal_pregunta_ldi: {
    activado: "Al activar tu servicio de Larga Distancia Internacional, podrás realizar llamadas a través de cualquier carrier. Si tienes una bolsa de minutos LDI incluidos en tu plan o compraste una bolsa adicional de minutos LDI y quieres usarla, debes tener presente que estas aplican exclusivamente para llamadas a través de carrier 171.",
    desactivado: "Recuerda que si desactivas el servicio LDI, perderás el saldo de las bolsas adicionales de LDI vigentes. Si desactivas el servicio LDI, no podrás realizar llamadas de larga distancia internacional. Recuerda que podrás activarlo nuevamente por este mismo medio. También solicita activar/desactivar tu servicio LDI llamando 800 171 171."
  },
  modal_pregunta_roaming: {
    activado: "Al activar el servicio de Roaming, podrás usar minutos, SMS y navegar desde cualquier país. Una vez consumidos los minutos, SMS y/o MB incluidos en las respectivas bolsas, comenzará a tarificarse el adicional a granel definido para esos países. Cualquier tráfico de Roaming realizado en un país distinto a los mencionados anteriormente, será cobrado a tarifas normales de granel en países sin convenio.",
    desactivado: "Recuerda que si desactivas el servicio Roaming, perderás el saldo de las bolsas adicionales de Roaming. Si desactivas el servicio de Roaming, no podrás utilizar tu servicio en el extranjero. Recuerda que podrás desactivarlo nuevamente por este mismo medio. También desde Chile marca el *7626 y solicita activar/desactivar el servicio Roaming. Desde el extranjero marca +56 2 28203331 y solicita activar/desactivar el servicio roaming."
  },
  modal_exito_ldi: {
    activado: "Recuerda que podrás desactivarlo nuevamente por este mismo medio. También solicita activar/desactivar tu servicio LDI llamando al 800 171 171.",
    desactivado: "Para hacer uso de las bolsas de LDI incluidas en tu plan deberás activar nuevamente el servicio. Recuerda que podrás activarlo nuevamente por este mismo medio. También solicita activar/desactivar tu servicio LDI llamando 800 171 171."
  },
  modal_exito_roaming: {
    activado: "Recuerda que podrás desactivarlo nuevamente por este mismo medio. También desde Chile marca el *7626 y solicita activar/desactivar el servicio Roaming. Desde el extranjero marca +56 2 28203331 y solicita activar/desactivar el servicio Roaming.",
    desactivado: "Para hacer uso de la bolsa de Roaming incluida en tu plan deberás activar nuevamente el servicio. Recuerda que podrás desactivarlo nuevamente por este mismo medio. También desde Chile marca el *7626 y solicita activar/desactivar el servicio Roaming. Desde el extranjero marca +56 2 28203331 y solicita activar/desactivar el servicio roaming"
  },
  modal_exito_notificacion: {
    activado: "En los próximos minutos recibirás un mail y/o SMS con la confirmación de activación",
    desactivado: "En los próximos minutos recibirás un mail y/o SMS con la confirmación de desactivación"
  }
};
$("#nav-plan .card.roaming-ldi.paises .card-text").text(diccionario.tarjeta_paises.lista_paises);
var dataPostpago = {
  "msisdn": "",
  "servicio": "",
  "accion": false
},
    cardActDes = $("#nav-act .card.roaming-ldi.act-des");

function cambioMsjEstado(tarjeta) {
  if (tarjeta.attr("data-servicio") === "LDI") {
    tarjeta.find(".estado-info").html(diccionario.tarjeta_ldi.activado);

    if (tarjeta.hasClass("desactivado")) {
      tarjeta.find(".estado-info").html(diccionario.tarjeta_ldi.desactivado);
    }
  } else if (tarjeta.attr("data-servicio") === "ROAMING") {
    tarjeta.find(".estado-info").html(diccionario.tarjeta_roaming.activado);

    if (tarjeta.hasClass("desactivado")) {
      tarjeta.find(".estado-info").html(diccionario.tarjeta_roaming.desactivado);
    }
  }
}

function estadoInicialServicios() {
  var cardLDI = cardActDes.filter("div[data-servicio='LDI']"),
      cardRoaming = cardActDes.filter("div[data-servicio='ROAMING']");
  cardActDes.removeClass("activado desactivado");
  cardLDI.addClass("activado");
  cardRoaming.addClass("desactivado");
  cambioMsjEstado(cardLDI);
  cambioMsjEstado(cardRoaming);
}

var modal = $(".modal"),
    modalPregunta = $(".roaming-ldi.modal.pregunta"),
    modalExito = $(".roaming-ldi.modal.exito"),
    modalError = $(".roaming-ldi.modal.error"),
    servicioSelect;

function mostrarModalPregunta() {
  dataPostpago.servicio = servicioSelect.attr("data-servicio");
  modalPregunta.find(".m-accion").text("desactivar");
  modalExito.find(".m-accion").html("desactivaci&oacute;n");
  modalExito.find(".m-subtitulo").text(diccionario.modal_exito_notificacion.desactivado);
  dataPostpago.accion = false;

  if (servicioSelect.hasClass("desactivado")) {
    dataPostpago.accion = true;
    modalPregunta.find(".m-accion").text("activar");
    modalExito.find(".m-accion").html("activaci&oacute;n");
    modalExito.find(".m-subtitulo").text(diccionario.modal_exito_notificacion.activado);
  }

  if (servicioSelect.attr("data-servicio") === "LDI") {
    modalPregunta.find(".m-servicio").text("Larga Distancia Internacional");
    modalExito.find(".m-servicio").text("Larga Distancia Internacional");
    modalPregunta.find(".m-info").text(diccionario.modal_pregunta_ldi.desactivado);
    modalExito.find(".m-info").text(diccionario.modal_exito_ldi.desactivado);

    if (servicioSelect.hasClass("desactivado")) {
      modalPregunta.find(".m-info").text(diccionario.modal_pregunta_ldi.activado);
      modalExito.find(".m-info").text(diccionario.modal_exito_ldi.activado);
    }
  } else if (servicioSelect.attr("data-servicio") === "ROAMING") {
    modalPregunta.find(".m-servicio").text("Roaming");
    modalExito.find(".m-servicio").text("Roaming");
    modalPregunta.find(".m-info").text(diccionario.modal_pregunta_roaming.desactivado);
    modalExito.find(".m-info").text(diccionario.modal_exito_roaming.desactivado);

    if (servicioSelect.hasClass("desactivado")) {
      modalPregunta.find(".m-info").text(diccionario.modal_pregunta_roaming.activado);
      modalExito.find(".m-info").text(diccionario.modal_exito_roaming.activado);
    }
  }

  modalPregunta.fadeIn();
}

cardActDes.find(".btn-estado").click(function (e) {
  e.preventDefault();
  servicioSelect = $(this).closest(cardActDes);
  mostrarModalPregunta();
});
modal.find(".cancelar").click(function (e) {
  e.preventDefault();
  modal.fadeOut();
});
modalPregunta.find(".confirmar").click(function (e) {
  e.preventDefault();
  modalPregunta.fadeOut();
  modalExito.fadeIn();
  servicioSelect.toggleClass("activado desactivado");
  cambioMsjEstado(servicioSelect);
});
var modalDetalles = $('.modal.detalles');
$('#linkDetallePlan').click(function (e) {
  e.preventDefault();
  modalDetalles.fadeIn();
});
$(document).ready(function () {
  estadoInicialServicios();
  var dutf8 = decode_utf8(modalDetalles.find('.detalles').html());
  modalDetalles.find('.detalles').html(dutf8);
});