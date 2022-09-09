import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Injectable({
  providedIn: "root",
})
export class PrintpdfService {
  constructor() {}

  exportAsPDF(div_id, doc_name = "tax") {
    let data = document.getElementById(div_id);
    const ele = Array.from(document.getElementsByTagName("td"));
    ele.forEach((e) => (e.style.fontSize = ".6rem"));
    window.scrollTo(0, 0);
    html2canvas(data, { scale: 2 }).then((canvas) => {
      var imgData = canvas.toDataURL("image/png");
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;
      doc.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST"
      );
      doc.save(doc_name + ".pdf"); // Generated PDF
    });
  }

  printPdf(div_id) {
    let data = document.getElementById(div_id);
    const ele = Array.from(document.getElementsByTagName("td"));
    ele.forEach((e) => (e.style.fontSize = ".6rem"));
    window.scrollTo(0, 0);
    html2canvas(data, { scale: 2 }).then((canvas) => {
      var imgData = canvas.toDataURL("image/png");
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;
      doc.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST"
      );
      window.open(doc.output("bloburl"), "_blank");
    });
  }

  printNoticeAssMent(div_id) {
    let data = document.getElementById(div_id);
    const ele = Array.from(document.getElementsByTagName("td"));
    ele.forEach((e) => (e.style.fontSize = ".6rem"));
    window.scrollTo(0, 0);
    html2canvas(data, { scale: 2 }).then((canvas) => {
      var imgData = canvas.toDataURL("image/png;base64");
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;
      doc.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST"
      );
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      window.open(doc.output("bloburl"), "_blank");
    });
  }

  async downloadAssessment(div_id, doc_name = "tax") {
    let data = document.getElementById(div_id);
    const ele = Array.from(document.getElementsByTagName("td"));
    ele.forEach((e) => (e.style.fontSize = ".6rem"));
    ele.forEach((e) => (e.style.fontSize = "1rem"));
    window.scrollTo(0, 0);
    html2canvas(data, { scale: 2 }).then((canvas) => {
      console.log({ canvas });
      var imgData = canvas.toDataURL("image/png");
      var pageHeight = 295;
      var imgWidth = 210;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;

      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
        heightLeft -= pageHeight;
      }
      doc.save("file.pdf");
    });
  }
}
