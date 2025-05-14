useEffect(() => {
  axios.get("https://TU_BACKEND_RENDER.onrender.com/predict")
    .then((response) => {
      setPrediction(response.data.next_month_prediction);
      setChartData({
        labels: response.data.months,
        datasets: [
          {
            label: 'Cantidad vendida',
            data: response.data.values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    })
    .catch((error) => console.error("Error al obtener la predicción:", error));
}, []);
