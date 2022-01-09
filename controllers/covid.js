const db = require('./db');
const helper = require('../helper');

async function getCovidData(dateFrom, dateTo, region) {
  let odgovor = [];
  if (region == "Slovenija" || region == null || region == '') {
    odgovor.push(await covidRead(dateFrom, dateTo, "CASES", "cases_confirmed"));
    odgovor.push(await covidRead(dateFrom, dateTo, "CASES", "cases_active"));
    odgovor.push(await deathOnDateRead(dateFrom, dateTo));
    odgovor.push(await covidRead(dateFrom, dateTo, "STATE", "state_in_hospital"));
    odgovor.push(await covidRead(dateFrom, dateTo, "STATE", "state_icu"));
    odgovor.push(await covidRead(dateFrom, dateTo, "STATE", "state_critical"));
    odgovor.push(await covidRead(dateFrom, dateTo, "TESTS", "tests_performed"));
    odgovor.push(await covidRead(dateFrom, dateTo, "VACCINATIONS", "vaccination"));
    odgovor.push(await covidRead(dateFrom, dateTo, "VACCINATIONS", "vaccination_2nd"));
    odgovor.push(await covidRead(dateFrom, dateTo, "VACCINATIONS", "vaccination_3rd"));
  } else {
    odgovor.push(await regionOnDateRead(dateFrom, dateTo, "region_"+region+"_cases_confirmed_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_cases_active"));
    odgovor.push(await regionOnDateRead(dateFrom, dateTo, "region_"+region+"_deceased_todate"));
    odgovor.push(await regionOnDateRead(dateFrom, dateTo, "region_"+region+"_vaccinated1st_todate"));
    odgovor.push(await regionOnDateRead(dateFrom, dateTo, "region_"+region+"_vaccinated2nd_todate"));
    odgovor.push(await regionOnDateRead(dateFrom, dateTo, "region_"+region+"_vaccinated3rd_todate"));
  }

  return odgovor;
}

async function getCovidToDateData(dateFrom, dateTo, region) {
  let odgovor = [];
  if (region == "Slovenija" || region == null || region == '') {
    odgovor.push(await covidRead(dateFrom, dateTo, "CASES", "cases_confirmed_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "DEATHS", "deceased_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "STATE", "state_in_hospital_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "TESTS", "tests_performed_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "VACCINATIONS", "vaccination_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "VACCINATIONS", "vaccination_2nd_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "VACCINATIONS", "vaccination_3rd_todate"));
  } else {
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_cases_confirmed_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_cases_active"));
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_deceased_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_vaccinated1st_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_vaccinated2nd_todate"));
    odgovor.push(await covidRead(dateFrom, dateTo, "REGION", "region_"+region+"_vaccinated3rd_todate"));
  }
  return odgovor;
}

async function getGovRes(dateFrom, dateTo) {
  let odgovor = [];
  
  odgovor.push(await covidRead(dateFrom, dateTo, "POLICY", "governmentresponseindex"));
  odgovor.push(await covidRead(dateFrom, dateTo, "POLICY", "stringencyindex"));
  odgovor.push(await covidRead(dateFrom, dateTo, "POLICY", "containmenthealthindex"));
  odgovor.push(await covidRead(dateFrom, dateTo, "POLICY", "economicsupportindex"));

  return odgovor;
}

async function deathOnDateRead(dateFrom,dateTo) {
  let query = 'SELECT d1.date::varchar as name, \
                      d2.deceased_todate - d1.deceased_todate as value \
                 FROM DEATHS d1, DEATHS d2 \
                WHERE d1.DATE = d2.DATE-1 \
                      {{dateFrom}} \
                      {{dateTo}} \
                ORDER BY d1.DATE ASC';

  let parameters = [];
  let parameterCount = 1;

  if (dateFrom == 'null') {
      query = query.replace("{{dateFrom}}", "");
  } else {
      parameters.push(dateFrom);
      query = query.replace("{{dateFrom}}", "AND d1.date >= $" + parameterCount);
      parameterCount++;
  }

  if (dateTo == 'null') {
      query = query.replace("{{dateTo}}" , "");
  } else {
      parameters.push(dateTo);
      query = query.replace("{{dateTo}}" , "AND d1.date < $" + parameterCount);
      parameterCount++;
  }

  const rows = await db.query(
      query, 
      parameters
  );

  const series = helper.emptyOrRows(rows);
  return {"name" : "Umrli",
          series}
}

async function regionOnDateRead(dateFrom,dateTo, col) {
  let query = 'SELECT r1.date::varchar as name, \
                      COALESCE(nullif(r2.{{col}},\'NaN\'),0) - COALESCE(nullif(r1.{{col1}},\'NaN\'),0) as value\
                 FROM REGION r1, REGION r2 \
                WHERE r1.DATE = r2.DATE-1 \
                      {{dateFrom}} \
                      {{dateTo}} \
                ORDER BY r1.DATE ASC'
;

  let parameters = [];
  let parameterCount = 1;

  query = query.replace("{{col}}", col);
  query = query.replace("{{col1}}", col);
  if (dateFrom == 'null') {
      query = query.replace("{{dateFrom}}", "");
  } else {
      parameters.push(dateFrom);
      query = query.replace("{{dateFrom}}", "AND r1.date >= $" + parameterCount);
      parameterCount++;
  }

  if (dateTo == 'null') {
      query = query.replace("{{dateTo}}" , "");
  } else {
      parameters.push(dateTo);
      query = query.replace("{{dateTo}}" , "AND r1.date < $" + parameterCount);
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

async function covidRead(dateFrom, dateTo, table, col) {
  let query = 'SELECT date::varchar as name, \
                      {{col}} as value \
                 FROM {{table}} \
                      {{dateFrom}} \
                      {{dateTo}} \
                ORDER BY DATE ASC';

  let parameters = [];
  let parameterCount = 1;

  let whereOrAnd = "WHERE";

  query = query.replace("{{col}}", col);
  query = query.replace("{{table}}", table);
  if (dateFrom == 'null') {
      query = query.replace("{{dateFrom}}", "");
  } else {
      parameters.push(dateFrom);
      query = query.replace("{{dateFrom}}", "WHERE date >= $" + parameterCount);
      parameterCount++;
  }

  if (dateTo == 'null') {
      query = query.replace("{{dateTo}}" , "");
  } else {
      parameters.push(dateTo);
      if (parameterCount > 1) {
        whereOrAnd = "AND";
      }
      query = query.replace("{{dateTo}}" , whereOrAnd + " date < $" + parameterCount);
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

async function covidRead(dateFrom, dateTo, table, col) {
  let query = 'SELECT date::varchar as name, \
                      {{col}} as value \
                 FROM {{table}} \
                      {{dateFrom}} \
                      {{dateTo}} \
                ORDER BY DATE ASC';

  let parameters = [];
  let parameterCount = 1;

  let whereOrAnd = "WHERE";

  query = query.replace("{{col}}", col);
  query = query.replace("{{table}}", table);
  if (dateFrom == 'null') {
      query = query.replace("{{dateFrom}}", "");
  } else {
      parameters.push(dateFrom);
      query = query.replace("{{dateFrom}}", "WHERE date >= $" + parameterCount);
      parameterCount++;
  }

  if (dateTo == 'null') {
      query = query.replace("{{dateTo}}" , "");
  } else {
      parameters.push(dateTo);
      if (parameterCount > 1) {
        whereOrAnd = "AND";
      }
      query = query.replace("{{dateTo}}" , whereOrAnd + " date < $" + parameterCount);
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


function colToName(col) {
  if (col == "cases_confirmed" || col == "cases_confirmed_todate" || col.endsWith("_cases_confirmed_todate")) {
    return "Potrjeni primeri";
  } else if (col == "cases_active" || col.endsWith("_cases_active")) {
    return "Aktivni primeri";
  } else if (col == "deceased_todate" || col.endsWith("_deceased_todate")) {
    return "Umrli";
  } else if (col == "state_in_hospital" || col == "state_in_hospital_todate") {
    return "V bolnišnici";
  } else if (col == "state_icu") {
    return "Na intenzivi";
  } else if (col == "state_critical") {
    return "Na respiratorju";
  } else if (col == "tests_performed" || col == "tests_performed_todate") {
    return "Opravljeni testi";
  } else if (col == "vaccination" || col == "vaccination_todate" || col.endsWith("_vaccinated1st_todate")) {
    return "Cepljeni - prvi odmerek";
  } else if (col == "vaccination_2nd" || col == "vaccination_2nd_todate" || col.endsWith("_vaccinated2nd_todate")) {
    return "Cepljeni - drugi odmerek";
  } else if (col == "vaccination_3rd" || col == "vaccination_3rd_todate" || col.endsWith("_vaccinated3rd_todate")) {
    return "Cepljeni - tretji odmerek";
  } else if (col == "governmentresponseindex") {
    return "Vsi ukrepi";
  } else if (col == "stringencyindex") { 
    return "Omejitve gibanja ter obveščanje";
  } else if (col == "containmenthealthindex") { 
    return "Omejitve gibanja ter zdravstveni ukrepi";
  } else if (col == "economicsupportindex") {
    return "Ekonomski ukrepi";
  }
}

module.exports = {
  getCovidData,
  getCovidToDateData,
  getGovRes
}