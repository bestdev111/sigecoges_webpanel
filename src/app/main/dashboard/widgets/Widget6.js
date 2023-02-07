/* eslint-disable import/no-extraneous-dependencies */
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { memo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import clsx from 'clsx';
import { DatePicker } from '@material-ui/pickers';
import FirebaseService from 'app/services/firebaseService';
import _ from '@lodash';

const useStyles = makeStyles({
  chart: {
    minHeight: '450px',
    height: '450px',
  },
});

function Widget6(props) {
  const theme = useTheme();
  const optionsData = {
    chart: {
      id: 'users',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      // title: {
      //   text: 'XOF',
      //   rotate: 0,
      //   offsetX: 1,
      //   offsetY: 10,
      // },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    fill: {
      opacity: 1,
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
    },
    legend: {
      show: false,
    },
  };
  const classes = useStyles();
  const [awaitRender, setAwaitRender] = useState(true);
  const [series, setSeries] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setAwaitRender(false);
      const year = selectedDate.getFullYear();
      FirebaseService.getAllSalary().then((salary) => {
        if (salary) {
          const temp = [];
          const yearData = _.filter(salary, (o) => {
            return o.year === year;
          });
          for (let index = 0; index < 12; index++) {
            const eachMonthData = _.filter(yearData, (o) => {
              return new Date(o.created.time).getMonth() === index;
            });
            let totalMonthPayment = 0;
            if (eachMonthData.length > 0) {
              eachMonthData.forEach((element) => {
                totalMonthPayment =
                  totalMonthPayment + Number(element.fixed) + Number(element.hourly);
              });
            }
            temp.push(totalMonthPayment);
          }
          setSeries([
            {
              name: 'Payments(XOF)',
              data: temp,
            },
          ]);
        }
      });
    }
  }, [selectedDate]);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="w-full rounded-20 shadow">
      <div className="flex items-center justify-between p-20">
        <Typography className="text-16 font-medium">Payments</Typography>
        <DatePicker
          views={['year']}
          label="Select Year"
          maxDate={new Date()}
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="flex flex-row flex-wrap">
        {series ? (
          <div className={clsx(classes.chart, 'w-full p-16')}>
            <ReactApexChart options={optionsData} series={series} type="bar" height="100%" />
          </div>
        ) : null}
      </div>
    </Paper>
  );
}

export default memo(Widget6);
