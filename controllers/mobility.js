const db = require('./db');
const helper = require('../helper');

/*
* APPLE MOBILITY
*/
async function getAppleData(dateFrom, dateTo, transport_type) {
  let odgovor = [];

  odgovor.push(await appleInnerRead(dateFrom, dateTo, 'walking'));
  odgovor.push(await appleInnerRead(dateFrom, dateTo, 'driving'));
  
  return odgovor;
}

async function appleInnerRead(dateFrom, dateTo, transport_type) {
  let query = 'SELECT date::varchar as name, \
                      value \
                  FROM MOBILITY_APPLE \
                WHERE TRANSPORT_TYPE = $1\
                      {{dateFrom}} \
                      {{dateTo}} \
                ORDER BY DATE ASC';
  
  let parameters = []
  let parameterCount = 2;

  query = query.replace("{{type}}", transport_type);
  parameters.push(transport_type);

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

  const rows = await db.query(
    query, 
    parameters
  );
  const series = helper.emptyOrRows(rows);

  let name = "";
  if (transport_type == "walking") {
      name = "Hoja";
  } else {
      name = "Vožnja";
  }

  return {"name" : name,
          series}
}

/*
* GOOGLE MOBILITY
*/
async function getRegionData() {
  let query = 'SELECT DISTINCT SUB_REGION1 \
                  FROM MOBILITY_GOOGLE \
                WHERE SUB_REGION1 != \'NaN\' \
                ORDER BY SUB_REGION1'
  let parameters = []

  let rows = await db.query(
    query, 
    parameters
  );
  const result = helper.emptyOrRows(rows);
  return result;
}

async function googleReadUniversal(dateFrom, dateTo, region, col) {
  let query = 'SELECT date::varchar as name, \
                      {{col}} as value \
                  FROM MOBILITY_GOOGLE \
                      {{region}} \
                      {{dateFrom}} \
                      {{dateTo}} \
                ORDER BY DATE ASC';

  let parameters = [];
  let parameterCount = 1;

  region = fixRegionName(region);

  query = query.replace("{{col}}", col);
  if (region == 'Slovenija' || region == '') {
      query = query.replace("{{region}}", "WHERE COUNTRY_REGION = \'Slovenia\' \
                                              AND SUB_REGION1 = \'NaN\' \
                                              AND SUB_REGION2 = \'NaN\'");
  }
  else {
      parameters.push(region);
      query = query.replace("{{region}}", "WHERE SUB_REGION1 = $" + parameterCount + '\
                                              AND SUB_REGION2 = \'NaN\'');
      parameterCount++;
  }
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

  const rows = await db.query(
      query, 
      parameters
  );
  const series = helper.emptyOrRows(rows);

  return {"name" : colToName(col),
          series}
}

async function getGoogleData(dateFrom, dateTo, region, groupType) {
  let odgovor = [];

  const regionArray = region.split(",");
  
  if (regionArray.length < 2) {
      odgovor.push(await googleReadUniversal(dateFrom, dateTo, region, 'retail_and_recreation'));
      odgovor.push(await googleReadUniversal(dateFrom, dateTo, region, 'grocery_and_pharmacy'));
      odgovor.push(await googleReadUniversal(dateFrom, dateTo, region, 'parks'));
      odgovor.push(await googleReadUniversal(dateFrom, dateTo, region, 'transit_stations'));
      odgovor.push(await googleReadUniversal(dateFrom, dateTo, region, 'workplaces'));
      odgovor.push(await googleReadUniversal(dateFrom, dateTo, region, 'residential'));
  } else {
      for (el in regionArray) {
          odgovor.push(await googleReadUniversal(dateFrom, dateTo, regionArray[el], nameToCol(groupType)));
      }
  }

  return odgovor;
}

function colToName(col) {
  if (col == "retail_and_recreation") {
    return "Maloprodaja in rekreacija";
  } else if (col == "grocery_and_pharmacy") {
    return "Trgovine z živili in lekarne";
  } else if (col == "parks") {
    return "Parki in javni kraji";
  } else if (col == "transit_stations") {
    return "Tranzitna mesta (počivališča, postaje)";
  } else if (col == "workplaces") {
    return "Delovna mesta";
  } else if (col == "residential") {
    return "Stanovanjski objekti";
  }
}

function nameToCol(groupType) {
  if (groupType == "0") {
    return "retail_and_recreation";
  } else if (groupType == "1") {
    return "grocery_and_pharmacy";
  } else if (groupType == "2") {
    return "parks";
  } else if (groupType == "3") {
    return "transit_stations";
  } else if (groupType == "4") {
    return "workplaces";
  } else if (groupType == "5") {
    return "residential";
  }
}

function fixRegionName(region) {
  if (region == "Maribor") {
      return "Administrative unit Maribor";
  } else if (region == "Hrastnik") {
      return "Municipality of Hrastnik";
  } else {
      return region;
  }
}


module.exports = {
    getAppleData,
    getGoogleData,
    getRegionData
}