/* eslint-disable import/no-extraneous-dependencies */
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import _ from '@lodash';
import { memo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import clsx from 'clsx';
import { DatePicker } from '@material-ui/pickers';

const useStyles = makeStyles({
  chart: {
    minHeight: '450px',
    height: '450px',
  },
});

function Widget5(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [awaitRender, setAwaitRender] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const widget = _.merge({}, props.widget);
  const [chart, setChart] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());
  const currentRange = Object.keys(widget.ranges)[tabValue];

  _.setWith(widget, 'mainChart.options.colors', [
    theme.palette.primary.main,
    theme.palette.secondary.main,
  ]);

  useEffect(() => {
    setAwaitRender(false);
    const chartData = {
      options: {
        chart: {
          id: 'apexchart-example',
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
      },
      series: [
        {
          name: 'series-1',
          data: [12, 6, 35, 23, 49, 60, 70, 91, 125, 90, 45, 62],
        },
      ],
    };
    setChart(chartData);
  }, []);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="w-full rounded-20 shadow">
      <div className="flex items-center justify-between p-20">
        <Typography className="text-16 font-medium">Registered Users</Typography>
        <DatePicker
        views={["year"]}
        label="Year only"
        maxDate={new Date()}
        value={selectedDate}
        onChange={handleDateChange}
      />
      </div>
      <div className="flex flex-row flex-wrap">
        {chart ? (
          <div className={clsx(classes.chart, 'w-full p-16')}>
            <ReactApexChart
              options={chart.options}
              series={chart.series}
              type="bar"
              height="100%"
            />
          </div>
        ) : null}
        <div className={clsx(classes.chart, 'w-full p-16')}>
          <ReactApexChart
            options={widget.mainChart.options}
            series={widget.mainChart[currentRange].series}
            type="bar"
            height="100%"
          />
        </div>
      </div>
    </Paper>
  );
}

export default memo(Widget5);
