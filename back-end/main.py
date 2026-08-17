import psycopg2 

conn = psycopg2.connect(
    dbname="mydb",
    user="myuser",
    password="mypass",
    host="mylocal"
)

    