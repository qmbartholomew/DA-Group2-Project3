from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('test.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/EUR', methods=['GET'])
def get_eur_usd():
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM eur_usd').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/JPY', methods=['GET'])
def get_jpy_usd():
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM jpy_usd').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/CAD', methods=['GET'])
def get_cad_usd():
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM cad_usd').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    app.run(debug=True, port=5000)