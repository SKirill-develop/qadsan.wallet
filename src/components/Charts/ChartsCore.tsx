import ReactECharts from 'echarts-for-react';

export const ChartsCore = ({data, values}: any) => {
  return (
    <ReactECharts
        option={{
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data,
          },
          yAxis: {
            type: 'value',
          },
          dataZoom: [],
          series: [
            {
              data: values,
              type: 'line',
              areaStyle: {},
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        opts={{ renderer: 'canvas' }}
        theme={"theme_name"}
      />
  );
};
