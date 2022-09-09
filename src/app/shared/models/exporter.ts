import { content } from "html2canvas/dist/types/css/property-descriptors/content";

export class Exporter {
  public getCsVPaymentHistory(array: any[], headerList: any[]) {
    console.log("arr", array);
    let str = "";
    let row = "S.No,";
    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + "";
      for (let index in headerList) {
        let head = headerList[index];
      
        let content: string = array[i][head]
          ? array[i][head].replace(/(?:\r\n|\r|\n)/g, "-").replace(/,/g, '-')
          : null;
        switch (head) {
          case "status":
            content = "paid";
            break;

          case "tax_item":
            if (!content || content == "Others") {
              let other_item = JSON.parse(array[i]["rules"]).description;
              content = other_item
                ? other_item.replace(/(?:\r\n|\r|\n)/g, "-")
                : "";

              content = content.replace(/,/g, '-')
            }

            break;

            case "payer_name":
              if(!content || content.trim().length < 1){

                let name = array[i]["name"];
                content = name  && name.length >0? name.replace(/,/g, '-') : ""
              }
            break;

          case "payment_date":
            content = new Date(parseInt(content) * 1000).toString();

            break;

          case "created_at":
            content = new Date(parseInt(content) * 1000).toString();
            break;
        }

        line += "," + content; //array[i][head];
      }
      str += line + "\r\n";
    }

    console.log("result", str);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "piras_exporter.csv");
    dlAnchorElem.click();
  }

  public getCsVCompaniesList(array: any[], headerList: any[]) {
    console.log("arr", array);
    let str = "";
    let row = "S.No,";
    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + "";
      for (let index in headerList) {
        let head = headerList[index];

        let content: string = array[i][head]
          ? array[i][head].replace(/(?:\r\n|\r|\n)/g, "-").replace(",", "--")
          : null;

        switch (head) {
          case "created_at":
            content = content.split(".")[0];
            break;
        }

        line += "," + content; //array[i][head];
      }
      str += line + "\r\n";
    }

    console.log("result", str);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "piras_exporter.csv");
    dlAnchorElem.click();
  }

  public getCsvEmployeeTemplate(array: any[]) {
    let headerList = [
      "TIN",
      "Name",
      "Phone",
      "Developement Levy",
      "Basic Salary",
      "Housing",
      "Transport",
      "Others",
      "Pension",
      "NHF",
      "NHIS",
      "Life Premium",
      "Voluntary Contribution",
      "Percentage if yes",
      "is_cons",
      "consolidated amount",
    ];
    console.log("arr", array);
    let str = "";
    let row = "";
    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let content = array[i].tin + ",";
      content += array[i].name
        ? array[i].name
        : array[i].first_name + " " + array[i].surname;
      content += "," + array[i].phone;
      for (let i = 0; i < 13; i++) {
        content += ",";
      }

      str += content + "\r\n";
    }

    console.log("result", str);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "piras_exporter.csv");
    dlAnchorElem.click();
  }

  public getCsVUsersList(array: any[], headerList: any[]) {
    console.log("arr", array);
    let str = "";
    let row = "S.No,";
    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + "";
      for (let index in headerList) {
        let head = headerList[index];

        let content: string = array[i][head]
          ? array[i][head].replace(/(?:\r\n|\r|\n)/g, "-").replace(",", "--")
          : null;
        switch (head) {
          case "name":
            if (!content || content.trim().length < 2) {
              content = array[i].first_name + array[i].surname;
            }

            break;

          case "payment_date":
            content = new Date(parseInt(content) * 1000).toString();

            break;
        }

        line += "," + content; //array[i][head];
      }
      str += line + "\r\n";
    }

    console.log("result", str);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "piras_exporter.csv");
    dlAnchorElem.click();
  }
}
