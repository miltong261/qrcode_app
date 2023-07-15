$(document).ready(function() {
  var qrCodeContainer = "";
  var scanner = "";
  var scannerIsActive = false;

  $("input[name='option']").click(function () {
    let option = $(this).val();
    
    if (option === "generate") {
      $(".generateContainer").removeClass("hidden");
      $(".readContainer").addClass("hidden");
    } else if (option === "read") {
      $(".generateContainer").addClass("hidden");
      $(".readContainer").removeClass("hidden");
    }

    cleanForm();
    cleanReader();
  });

  $("#generateQR").submit(function(e) {
    e.preventDefault();

    var name = $("#name").val();
    
    cleanForm();

    new QRCode(document.getElementById("qrCode"), {
      text: name,
      width: 128,
      height: 128
    });

    qrCodeContainer = document.getElementById("qrCode");

    $("#generatedResult").text(name);
    $("#downloadBtn").show();
    $("#printBtn").show();
  });

  $("#readQR").click(function(e) {
    e.preventDefault();
    $("#qrCapture").removeClass("hidden");
    
    if (!scannerIsActive) {
      scanner = new Instascan.Scanner({ video: document.getElementById("qrCapture") });

      scanner.addListener("scan", function(content) {
        $("#generatedRead").text(content);
        
        scanner.stop();
        scannerIsActive = false;

        $("#qrCapture").addClass("hidden");
        $("#qrCapture").get(0).pause();
        $("#qrCapture").get(0).srcObject = null;
      });

      scanner.addListener("error", function(error) {
        console.error(error);

        scanner.stop();
        scannerIsActive = false;

        $("#capturar_qr").addClass("hidden");
        $("#capturar_qr").get(0).pause();
        $("#capturar_qr").get(0).srcObject = null;
      });
    
      Instascan.Camera.getCameras().then(function(cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
          scannerIsActive = true;
        } else {
          console.error("No se encontró ninguna cámara.");
        }
      }).catch(function(error) {
        console.error(error);
      });
    }
  });

  $("#printBtn").click(function(e) {
    html2canvas(qrCodeContainer).then(function(canvas) {
      let imprimit_pantalla = window.open("", "_blank");

      imprimit_pantalla.document.open();
      imprimit_pantalla.document.write("<html><head><title>Código QR</title></head><body>");
      imprimit_pantalla.document.write("<img src='" + canvas.toDataURL() + "'>");
      imprimit_pantalla.document.write("</body></html>");
      imprimit_pantalla.document.close();

      imprimit_pantalla.onload = function() {
        imprimit_pantalla.print();
        imprimit_pantalla.close();
      };
    });
  });

  $("#downloadBtn").click(function(e) {
    e.preventDefault();

    html2canvas(qrCodeContainer).then(function(canvas) {
      let link = document.createElement('a');
      link.href = canvas.toDataURL();
      let link_nombre = $("#name").val();
      let fecha = new Date();
      let link_fecha = fecha.getFullYear() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getDate();
      let link_hora = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds();
      link.download = `${link_nombre}_${link_fecha}_${link_hora}.png`;
      
      link.click();
    });
  });

  function cleanForm() {
    $("#name").val("");
    $("#qrCode").html("")
    $("#generatedResult").text("");
    $("#downloadBtn").hide();
    $("#printBtn").hide();
  }

  function cleanReader() {
    $("#generatedRead").text("");

    if (scannerIsActive) {
      scanner.stop();
      scanner = "";
      scannerIsActive = false;
    }

    $("#qrCapture").addClass("hidden");
    $("#qrCapture").get(0).pause();
    $("#qrCapture").get(0).srcObject = null;
  }
});