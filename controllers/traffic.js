const db = require('./db');
const helper = require('../helper');

/*
* AIR TRAFFIC
*/

async function airRead(dateFrom, dateTo) {
  let query = ''
  let parameters = []
  if (dateFrom == 'null' && dateTo == 'null') {
    query = 'SELECT date::varchar as name, count(*) as value \
               FROM flights \
              GROUP BY date \
              ORDER BY date ASC';
  } else if (dateFrom == 'null' && dateTo != 'null') {
    query = 'SELECT date::varchar as name, count(*) as value \
               FROM flights \
              WHERE date < $1';
    parameters = [dateTo];
  } else if (dateFrom != 'null' && dateTo == 'null') {
    query = 'SELECT date::varchar as name, count(*) as value \
               FROM flights \
              WHERE date >= $1 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateFrom];          
  } else {
    query = 'SELECT date::varchar as name, count(*) as value \
               FROM flights \
              WHERE date >= $1 \
                AND date < $2 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateFrom, dateTo];
  }
  

  let rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);

  return [{"name" : "Zračni promet",
          series}] 
}

async function airRead2(dateFrom, dateTo) {
  let query = ''
  let parameters = []
  if (dateFrom == 'null' && dateTo == 'null') {
    query = 'SELECT COVID19.date::varchar as name, (SELECT COUNT(*) \
                                                      FROM FLIGHTS \
                                                     WHERE FLIGHTS.DATE = COVID19.DATE \
                                                     GROUP BY DATE \
                                                     ORDER BY DATE ASC) as value \
               FROM COVID19 \
               WHERE COVID19.DATE >= \'2020-01-01\' \
                 AND COVID19.DATE < \'2021-12-22\'';
  } else if (dateFrom == 'null' && dateTo != 'null') {
    query = 'SELECT COVID19.date::varchar as name, (SELECT COUNT(*) \
                                                      FROM FLIGHTS \
                                                     WHERE FLIGHTS.DATE = COVID19.DATE \
                                                     GROUP BY DATE \
                                                     ORDER BY DATE ASC) as value \
               FROM COVID19 \
              WHERE date < $1 \
                AND DATE >= \'2020-01-01\'';
    parameters = [dateTo];
  } else if (dateFrom != 'null' && dateTo == 'null') {
    query = 'SELECT COVID19.date::varchar as name, (SELECT COUNT(*) \
                                                      FROM FLIGHTS \
                                                     WHERE FLIGHTS.DATE = COVID19.DATE \
                                                     GROUP BY DATE \
                                                     ORDER BY DATE ASC) as value \
               FROM COVID19 \
              WHERE date >= $1 \
                AND DATE >= \'2020-01-01\'\
                AND COVID19.DATE < \'2021-12-22\'';
    parameters = [dateFrom];          
  } else {
    query = 'SELECT COVID19.date::varchar as name, (SELECT COUNT(*) \
                                                      FROM FLIGHTS \
                                                     WHERE FLIGHTS.DATE = COVID19.DATE \
                                                     GROUP BY DATE \
                                                     ORDER BY DATE ASC) as value \
               FROM COVID19 \
              WHERE date >= $1 \
                AND date < $2 \
                AND DATE >= \'2020-01-01\'\
                AND COVID19.DATE < \'2021-12-22\'';
    parameters = [dateFrom, dateTo];
  }
  

  let rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  console.log(series)
  return [{"name" : "Zračni promet",
          series}] 
}

/*
* SEA TRAFFIC
*/

async function seaRead(dateFrom, dateTo) {
  let query = ''
  let parameters = []
  if (dateFrom == 'null' && dateTo == 'null') {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE DATE < \'2021-11-06\' \
              GROUP BY date \
              ORDER BY date ASC';
  } else if (dateFrom == 'null' && dateTo != 'null') {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE DATE < \'2021-11-06\' \
                AND date < $1 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateTo];
  } else if (dateFrom != 'null' && dateTo == 'null') {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE DATE < \'2021-11-06\' \
                AND date >= $1 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateFrom];          
  } else {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE DATE < \'2021-11-06\' \
                AND date >= $1 \
                AND date < $2 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateFrom, dateTo];
  }

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);

  return [{"name" : "Pomorski promet",
  series}] 
}

async function seaRead2(dateFrom, dateTo) {
  let query = ''
  let parameters = []
  if (dateFrom == 'null' && dateTo == 'null') {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE date >= \'2020-01-01\' \
              GROUP BY date \
              ORDER BY date ASC';
  } else if (dateFrom == 'null' && dateTo != 'null') {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE date >= \'2020-01-01\' \
                AND date < $1';
    parameters = [dateTo];
  } else if (dateFrom != 'null' && dateTo == 'null') {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE date >= \'2020-01-01\' \
                AND date >= $1 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateFrom];          
  } else {
    query = 'SELECT date::varchar as name, count as value \
               FROM ships \
              WHERE date >= \'2020-01-01\' \
                AND date >= $1 \
                AND date < $2 \
              GROUP BY date \
              ORDER BY date ASC';
    parameters = [dateFrom, dateTo];
  }

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);

  return [{"name" : "Pomorski promet",
  series}] 
}

/*
* ROAD TRAFFIC
*/

async function roadMotorcycleRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(motorcycle) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Motorji",
          series} 
}

async function roadCarRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(car) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Osebna vozila",
          series} 
}

async function roadBusRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(bus) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }
  
  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Avtobusi",
          series} 
}

async function roadLightTruckRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(light_truck) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  
  
  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  return {"name" : "Lah. tov. promet < 3,5t",
          series} 
}

async function roadMidTruckRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(mid_truck) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Sre. tež. promet 3,5-7t",
          series} 
}

async function roadHeavyTruckRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(heavy_truck) as value \
                FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Tež. tov. promet > 7t",
          series} 
}

async function roadTrailerTruckRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(truck_w_trailer) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Tovorni promet s prikolico",
          series} 
}

async function roadTruckTppRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(truck_tpp) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Vlačilci",
          series}
}

async function roadSumRead(dateFrom, dateTo, stm, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM(sum) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []

  let parameterCount = 1;
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);
  
  return {"name" : "Skupaj",
          series}
}


async function stmRead() {
  let query = 'SELECT id, \
                      name \
                 FROM COUNT_SPOT \
                ORDER BY name'
  let parameters = []

  const rows = await db.query(
    query, 
    parameters
  );
  const result = helper.emptyOrRows(rows);
  
  return result;
}

async function roadReadUniversal(dateFrom, dateTo, stm, col, page) {
  let query = 'SELECT date::varchar as name, \
                      SUM({{col}}) as value \
                 FROM TRAFFIC_COUNT, \
                      COUNT_SPOT\
                WHERE TRAFFIC_COUNT.id = COUNT_SPOT.id \
                      {{dateFrom}} \
                      {{dateTo}} \
                      {{page}} \
                      {{stm}} \
                GROUP BY DATE \
                ORDER BY DATE ASC';
  let parameters = []
  let parameterCount = 1;

  query = query.replace("{{col}}", col);
  if (dateFrom == 'null') {
    query = query.replace("{{dateFrom}}", "");
  } else {
    parameters.push(dateFrom);
    query = query.replace("{{dateFrom}}", "AND date >= $" + parameterCount);
    parameterCount++;
  }

  if (dateTo == 'null') {
    query = query.replace("{{dateTo}}" , "");
  } else {
    parameters.push(dateTo);
    query = query.replace("{{dateTo}}" , "AND date < $" + parameterCount);
    parameterCount++;
  }

  if (page == 'null') {
    query = query.replace("{{page}}" , "");
  } else {
    query = query.replace("{{page}}" , "AND date <= '2020-12-31'");
  }

  if (stm == '') {
    query = query.replace("{{stm}}", "");
  } else{
    parameters.push(stm);
    if (typeof stm === 'string' && (isNaN(stm) || isNaN(parseFloat(stm)))){
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.region");
    } else {
      query = query.replace("{{stm}}", "AND $" + parameterCount + " = COUNT_SPOT.id");
    }
  }  

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);

  return {"name" : stm,
          series}
}

async function roadRead(dateFrom, dateTo, stm, vehicleType, page) {
  let odgovor = [];
  const stmArray = stm.split(",");

  if (stmArray.length < 2) {
    odgovor.push(await roadMotorcycleRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadCarRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadBusRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadLightTruckRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadMidTruckRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadHeavyTruckRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadTrailerTruckRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadTruckTppRead(dateFrom, dateTo, stm, page));
    odgovor.push(await roadSumRead(dateFrom, dateTo, stm, page));
  } else {
    for (el in stmArray) {
      odgovor.push(await roadReadUniversal(dateFrom, dateTo, stmArray[el], vehicleTypeToCol(vehicleType), page));
    }
  }
  return odgovor;
}

function vehicleTypeToCol(vehicleType) {
  if (vehicleType == "0") {
    return "motorcycle";
  } else if (vehicleType == "1") {
    return "car";
  } else if (vehicleType == "2") {
    return "bus";
  } else if (vehicleType == "3") {
    return "light_truck";
  } else if (vehicleType == "4") {
    return "mid_truck";
  } else if (vehicleType == "5") {
    return "heavy_truck";
  } else if (vehicleType == "6") {
    return "truck_w_trailer";
  } else if (vehicleType == "7") {
    return "truck_tpp";
  } else if (vehicleType == "8") {
    return "sum";
  }
}

module.exports = {
    airRead,
    airRead2,
    seaRead,
    seaRead2,
    roadRead,
    stmRead
}