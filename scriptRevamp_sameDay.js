const uploadConfirm = document.getElementById("uploadConfirm"); //get the button tag for triggering the parsing
const getFile = document.getElementById("uploadFile"); //get the file
const loopChart = document.getElementById("chart-container");
let threePl_name = []; //store the threepl_name from csv
let unique_threePl_name = []; //store the non-duplicated threepl_name
let object = {};
let dataStore = [];
//let dataStore2 = [];

//parsing the data using papaparse
uploadConfirm.addEventListener("click", () => {
  Papa.parse(getFile.files[0], {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      //getting the threepl_name
      results.data.map((row) => {
        threePl_name.push(row.threepl_name);
      });
      console.log(threePl_name);
      unique_threePl_name = [...new Set(threePl_name)]; //remove duplicate
      console.log(unique_threePl_name);


      unique_threePl_name.forEach((name) => {

        // configure the object variable
        object["threePl_name"] = name;
        object["meet"] = 0;
        object["fail"] = 0;
        object["total"] = 0;
        object["fsnumber"] = []; // add key value in object
        dataStore.push(object);
        object = {};
      });
      console.log(dataStore);
      //console.log(dataStore);


      //looping through row with all the logic
      results.data.map((row) => {
        // var isSameDay = dateSameDay(
        //   new Date(row.datereceived),
        //   new Date(row.datefulfilled)
        // );
        // var timeDiff = timeDifference(
        //   new Date(row.datereceived),
        //   new Date(row.datefulfilled),
        //   isSameDay
        // );
        // var isWeekend = weekendCheck(new Date(row.datereceived));
        // var isFriday = fridayCheck(new Date(row.datereceived));
        slaMeet(row.WarehouseSLA, row.threepl_name, row.fsnumber);
        // to check output
        // console.log( "output of final product", 
        //   slaCounter(
        //     new Date(row.datereceived),
        //     new Date(row.datefulfilled),
        //     // isSameDay,
        //     // isFriday,
        //     // isWeekend,
        //     // timeDiff,
        //     isMeet,
        //     row.threepl_name,
        //     row.fsnumber
        //   )
        // );
      });
      console.log(dataStore);

      //make container for chart
      var x ="";
      dataStore.map((data, index) => {
        x = x + `<div class='card w-50'><div class='card-body'><div id='chart${index}'>` + "</div></div></div>";
        // console.log(`#chart${index}`)
        
      })
      loopChart.innerHTML = x;
      

      //make chart https://apexcharts.com/
      dataStore.map((data, index) => {
        new ApexCharts(document.querySelector(`#chart${index}`), 
        {
          chart: {
            height: 280,
            //colors: ['#F72C00', '#E91E63'],
            type: "donut",
          },
          title: {
              text: data.threePl_name,
              align: "center"
          },
          fill: {
            colors: [ "#99CC99", "#F20734"]
          },

          series: [data.meet, data.fail],

          plotOptions: {
            pie: {
              donut: {
                value: {
                  show: true,
                  fontsize: '16px',
                  color: '#99CC99'
                },
                value: {
                  show: false,
                  fontsize: '16px',
                  color: '#F20734'
                }
              },
            },
          },

          labels: ["Meet: " + data.meet, "Not Meet: " + data.fail],
          legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom',
            horizontalAlign: 'center', 
            floating: false,
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 400,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 0,
            offsetY: 0,
            labels: {
                colors: undefined,
                useSeriesColors: false
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: [ "#99CC99", "#F20734"],
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: 5,
                vertical: 0
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        }
        }).render()
      })
    },
  });
});

// LOGIC STARTS HERE

const slaMeet = (sla, threePl_name, fsnumber) => {
    if (sla.toLowerCase().includes("meet")){
        threePl_checking_meet(threePl_name, fsnumber);
        return;
    }
    else if (sla.toLowerCase().includes("fail")){
        threePl_checking_fail(threePl_name, fsnumber);
        return;
    }
}

// //to check if same day
// const dateSameDay = (first, second) => {
//   var firstDate = first.getMonth().toString() + first.getDate().toString();
//   var secondDate = second.getMonth().toString() + second.getDate().toString();

//   //the checking
//   if (firstDate === secondDate) {
//     return true;
//   }
//   return false;
// };

// //time difference
// const timeDifference = (first, second, isSameDay) => {
//   if (isSameDay == true) {
//     hour = moment(second).diff(moment(first), "hours");
//     minute = moment(second).diff(moment(first), "minutes") % 60;
//     if (minute < 10) minute = "0" + minute;
//     return hour + ":" + minute;
//   } else if (isSameDay == false) {
//     return moment(second).diff(moment(first), "days") + " days";
//   }
// };

// //weekend
// const weekendCheck = (received) => {
//   if (moment(received).day() == 6 || moment(received).day() == 7) {
//     return true;
//   }
//   //(moment(received).day() == 5 && moment(received).isAfter(moment('09:01', 'h:mma'))))
//   return false;
// };

// //friday after 9PM
// const fridayCheck = (received) => {
//   if (moment(received).day() == 5) {
//     if (moment(received, "hh:mm").isAfter(moment("09:01", "hh:mm"))) {
//       return true;
//     } else {
//       return false;
//     }
//   }
//   return false;
// };

// //meet checking
// const slaCounter = (
//   received,
//   fulfilled,
//   isSameDay,
//   isFriday,
//   isWeekend,
//   timeDiff,
//   threePl_name,
//   fsnumber
// ) => {
//   if (isSameDay == true) {
//     threePl_checking_meet(threePl_name, fsnumber);

//     return "MEET";
//   } else if (isSameDay == false) {
//     if (timeDiff == "0 days" || timeDiff == "1 days") {
//       threePl_checking_meet(threePl_name, fsnumber);
//       return "MEET JUGA";
//     } else if (isFriday == true) {
//       if (moment(fulfilled).day() == 1) {
//         threePl_checking_meet(threePl_name, fsnumber);

//         return "INI JUGA MEET";
//       }
//     } else if (isWeekend == true) {
//       if (moment(fulfilled).day() == 1) {
//         threePl_checking_meet(threePl_name, fsnumber);

//         return "INI JUGA MEET LOH";
//       }
//     } else if (isFriday == false && isWeekend == false) {
//       threePl_checking_fail(threePl_name, fsnumber);
//       return "FAIL AKHIRNYA" + fsnumber;
//     }
//   } else {
//     threePl_checking_fail(threePl_name, fsnumber);

//     return "FALSE NI GAN" + fsnumber;
//   }
// };

const threePl_checking_meet = (threePl_checkMatch, fsnumber) => {
  dataStore.map((data) => {
    //if (Object.values(data).includes(threePl_checkMatch, fsnumber)) {
    if (Object.values(data).includes(threePl_checkMatch)) {
      Object.assign(data, { meet: data.meet + 1 });
      Object.assign(data, { total: data.total + 1 });
      Object.assign(data, {fsnumber: data.fsnumber.concat(fsnumber)});
    }
  });
};

const threePl_checking_fail = (threePl_checkMatch, fsnumber) => {
  dataStore.map((data) => {
    if (Object.values(data).includes(threePl_checkMatch)) {
      Object.assign(data, { fail: data.fail + 1 });
      Object.assign(data, { total: data.total + 1 });
      Object.assign(data, {fsnumber: data.fsnumber.concat(fsnumber)});
    }
  });
};

