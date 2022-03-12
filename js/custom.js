let currentPage = 1;
let maxRows = 10;
let isSearch = false;
let dataRender = [...dataSet];
let dataSearch = [];
let lenListSearch = 0;
let sortCurrent = {};
const ListTitle = ['Name', "Position", "Office", "Extn.", "Start Date", "Salary"];

const $ = (el) => {
  return document.querySelectorAll(el);
}
const setCSSPagination = (idx) => {
  $(".pagination__page").forEach((element, index) => {
    element.setAttribute("class", "pagination__page");
    if (idx == index) {
      element.setAttribute("class", "pagination__page page__current");
    }
  })
  if (idx == $(".pagination__page").length - 1) {

    $(".pagination__next")[0].setAttribute("class", "btn pagination__next btn-disable")
  } else {
    $(".pagination__next")[0].setAttribute("class", "btn pagination__next")
  }
  if (idx == 0) {

    $(".pagination__prev")[0].setAttribute("class", "btn pagination__prev btn-disable")
  } else {
    $(".pagination__prev")[0].setAttribute("class", "btn pagination__prev")
  }

}
const handleChangePage = (nextPage, maxRow) => {
  const DataDisplay = dataRender.slice(parseInt((nextPage - 1) * maxRow), parseInt(nextPage * maxRow));
  setCSSPagination(nextPage - 1);
  currentPage = nextPage;
  renderDataTable(DataDisplay);
  renderInfoData(dataRender, currentPage, maxRow);
}

const renderDataTable = (data) => {
  let htmlTable = "";
  data.forEach(element => {
    var str = "<tr>";
    element.forEach((field) => {
      var tr = `<td>${field}</td>`
      str += tr;
    })
    str += "</tr>"
    htmlTable += str;
  });
  $('#table-body')[0].innerHTML = htmlTable;

}

const renderPagination = (data, maxRow, current) => {
  let htmlPagination = "";
  for (idx = 0; idx < Math.ceil(data.length / maxRow); idx++) {

    var str = `<li class= "pagination__page">${idx+1}</li>`
    if (current == idx + 1) {
      str = `<li class = "pagination__page page__current">${idx+1}</li>`
    }
    htmlPagination += str;
  }
  $(".pagination__list")[0].innerHTML = htmlPagination;
  selectPage();
  setCSSPagination(0);
}

const renderInfoData = (data, currentPage, maxRow) => {
  let htmlInfoData = `<p>Showing ${(currentPage-1)*maxRow + 1}
                      to ${ Math.min(currentPage*maxRow, data.length)} 
                      of ${data.length} entries</p>`;
  if (isSearch) {
    htmlInfoData = `<p>Showing ${Math.min((currentPage-1)*maxRow + 1,lenListSearch)} to
                     ${ Math.min(currentPage*maxRow, lenListSearch)} of ${lenListSearch} entries 
                     (filtered from ${dataSet.length} total entries)</p>`;
  }
  $(".table__info")[0].innerHTML = htmlInfoData;
}

const renderAll = (dataRender, dataTotal, maxRow, currentPage) => {
  renderDataTable(dataRender);
  renderPagination(dataTotal, maxRow, currentPage);
  renderInfoData(dataTotal, currentPage, maxRow);
}

const goNextPage = () => {
  const maxPage = Math.ceil(dataRender.length / maxRows);
  if (currentPage <= maxPage - 1) {
    handleChangePage(currentPage + 1, maxRows);
  }
}

const goPreviousPage = () => {

  if (currentPage >= 2) {
    handleChangePage(currentPage - 1, maxRows);
  }


}

const handleSearch = (values, maxRows) => {

  values = values.toUpperCase().trim();
  isSearch = values.length !== 0;
  let newData;
  if (isSearch) {
    // currentPage =1;
    newData = dataSet.filter((row) =>
      row[0].toUpperCase().includes(values) |
      row[1].toUpperCase().includes(values) |
      row[2].toUpperCase().includes(values) |
      row[3].toUpperCase().includes(values) |
      row[4].toUpperCase().includes(values) |
      row[5].toUpperCase().includes(values));
    lenListSearch = newData.length;
    $('.cancel-search')[0].style.display = "block";
  } else {
    newData = [...dataSet];
    $('.cancel-search')[0].style.display = "none";
  }
  dataRender = newData;
  DataDisplay = newData.slice(0, maxRows);
  renderAll(DataDisplay, newData, maxRows, 1);

}

const selectPage = () => {
  $(".pagination__page").forEach((element, index) => {
    element.addEventListener("click", () => {
      handleChangePage(index + 1, maxRows);
    })
  })
}
const sortString = (str1, str2) => {
  var str1 = str1.toUpperCase(); // ignore upper and lowercase
  var str2 = str2.toUpperCase(); // ignore upper and lowercase
  if (sortCurrent[Object.keys(sortCurrent)[0]] == "asc") {
    if (str1 < str2) {
      return -1;
    }
    if (str1 > str2) {
      return 1;
    }
  } else {
    if (str1 < str2) {
      return 1;
    }
    if (str1 > str2) {
      return -1;
    }
  }

  return 0;
}
const sortNumber = (number1, number2) => {
  if (sortCurrent[Object.keys(sortCurrent)[0]] == "asc") {
    return number1 - number2;
  } else {
    return number2 - number1;
  }
}

const Sort = (data) => {
  currentPage = 1;

  const indexSort = ListTitle.findIndex((item) => item == Object.keys(sortCurrent)[0]);
  if (indexSort == 0 | indexSort == 1 | indexSort == 2 | indexSort == 4) {
    data.sort((row1, row2) => sortString(row1[indexSort], row2[indexSort]));
  } else {
    //sort salary
    if (indexSort == 5) {
      data.sort((row1, row2) =>
        sortNumber(
          (row1[indexSort].replaceAll("$", "").replaceAll(",", "")),
          (row2[indexSort].replaceAll("$", "").replaceAll(",", ""))
        )
      );
    }
    if (indexSort == 3) {
      data.sort((row1, row2) =>
        sortNumber(
          parseInt(row1[indexSort]),
          parseInt(row2[indexSort])
        )
      );
    }
  }
  let DataDisplay = data.slice(0, maxRows);
  renderAll(DataDisplay, data, maxRows, currentPage);
}

const handleSort = () => {
  const clearSort = () => {
    $(".title").forEach((element) => {
      element.querySelectorAll(".fa-sort-up")[0].style.display = "block";
      element.querySelectorAll(".fa-sort-down")[0].style.display = "block";
    })
  }

  $(".title").forEach((element, index) => {
    element.addEventListener("click", () => {
      clearSort();
      if (!Object.keys(sortCurrent).includes(ListTitle[index])) {
        sortCurrent = {};
        sortCurrent[ListTitle[index]] = "asc";

        element.querySelectorAll(".fa-sort-down")[0].style.display = "block";
        element.querySelectorAll(".fa-sort-up")[0].style.display = "none";
      } else {
        if (sortCurrent[ListTitle[index]] == "asc") {
          sortCurrent[ListTitle[index]] = "des";
          element.querySelectorAll(".fa-sort-up")[0].style.display = "block";
          element.querySelectorAll(".fa-sort-down")[0].style.display = "none";
        } else {
          sortCurrent[ListTitle[index]] = "asc";
          element.querySelectorAll(".fa-sort-down")[0].style.display = "block";
          element.querySelectorAll(".fa-sort-up")[0].style.display = "none";
        }
      }
      Sort(dataRender)
    })

  })
}
window.onload = () => {
  //render when load dom
  let DataDisplay = dataRender.slice(0, maxRows);
  renderAll(DataDisplay, dataRender, maxRows, currentPage);

  // change limit rows
  $("#limit-row")[0].addEventListener("change", (e) => {
    currentPage = 1;
    const limitRows = e.target.value;
    maxRows = Math.min(limitRows, dataRender.length);
    DataDisplay = dataRender.slice(0, maxRows);
    renderAll(DataDisplay, dataRender, maxRows, currentPage);
  })

  //go next page
  $(".pagination__next")[0].addEventListener("click", () => goNextPage());

  ///go previous page
  $(".pagination__prev")[0].addEventListener("click", () => goPreviousPage());

  ///search word
  $("#table__search")[0].addEventListener("keyup", (e) => {
    handleSearch(e.target.value, maxRows), currentPage = 1
  });
  /// sort 
  handleSort();

  ///cancel search
  $('.cancel-search')[0].addEventListener("click", () => {
    dataRender = [...dataSet];
    isSearch = false;
    $("#table__search")[0].value = "";
    $('.cancel-search')[0].style.display = "none";
    let DataDisplay = dataRender.slice(0, maxRows);
    renderAll(DataDisplay, dataRender, maxRows, currentPage);
  });
}