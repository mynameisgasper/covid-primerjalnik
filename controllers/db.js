const { Pool, Client } = require('pg')
const connectionString = 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
const connectionStringProd = 'postgres://rttnexchhysare:bf9311b533b0fee7847e968e2fb2fd3f71cec6f7b1878360b5a9ebf0365d1bde@ec2-99-81-177-233.eu-west-1.compute.amazonaws.com:5432/d8el6h52oi8mfc';
//(database = "postgres", user='postgres', password='postgres', host='127.0.0.1', port= '5432')

let isProduction = (process.env.NODE_ENV === 'production');
const pool = isProduction ? new Pool({connectionStringProd}) : new Pool({connectionString})


if (isProduction) {
  console.log("Prod")
  console.log(pool)
} else {
  console.log("Dev")
  console.log(pool)
}

async function query(query, params) {
    const {rows, fields} = await pool.query(query, params);

    return rows;
}

module.exports = {
  query
}